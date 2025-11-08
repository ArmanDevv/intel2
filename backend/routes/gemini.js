// backend/routes/gemini.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");

const router = express.Router();

// Multer config: store temporarily in uploads/
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    // give a unique filename
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit (adjust if needed)
  fileFilter: (req, file, cb) => {
    // accept PDFs and docx for now; adjust as needed
    const allowed = /\.(pdf|docx|doc|pptx|txt|jpg|jpeg|png)$/i;
    cb(null, allowed.test(file.originalname));
  }
});

// POST /api/gemini/upload
router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false, error: "No file provided" });

  // dynamic import of SDK so it works with CommonJS server
  let GoogleGenerativeAI;
  try {
    const mod = await import("@google/generative-ai");
    GoogleGenerativeAI = mod.GoogleGenerativeAI;
  } catch (e) {
    console.error("Failed to import @google/generative-ai:", e);
    // cleanup
    await fse.remove(req.file.path).catch(()=>{});
    return res.status(500).json({ ok: false, error: "Server: missing SDK" });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const filePath = req.file.path;
  try {
    // Upload the file stream to Gemini
    const stream = fs.createReadStream(filePath);

    const uploadResp = await genAI.uploadFile({
      file: stream,
      displayName: req.file.originalname,
    });

    const fileRef = uploadResp?.file?.uri || uploadResp?.uri || null;
    console.log("Gemini upload response:", uploadResp);

    if (!fileRef) {
      throw new Error("No file reference returned by Gemini");
    }

    // Build prompt — you can customize this
    const prompt = `
      Read the uploaded document and return valid JSON with keys:
      - assignments: array of { title, questions: [{ question, answer (optional) }], difficulty, estimatedTime }
      - flashcards: array of { front, back }
      - summaries: array of { title, content }
      Return only JSON (no explanation).
    `;

    // Call model with file reference
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const result = await model.generateContent([
      { fileData: { mimeType: req.file.mimetype || "application/pdf", fileUri: fileRef } },
      { text: prompt }
    ]);

    const text = result.response?.text?.();
    // cleanup temp file ASAP
    await fse.remove(filePath).catch(()=>{});

    // Try parse JSON
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      // If not proper JSON, wrap fallback
      parsed = {
        assignments: [{ id: 1, title: "Assignment (fallback)", description: text }],
        flashcards: [],
        summaries: [{ id: 1, title: "Summary (fallback)", content: text }],
      };
    }

    return res.json({ ok: true, fileRef, data: parsed });
  } catch (err) {
    console.error("Error in /api/gemini/upload:", err);
    // cleanup temp file
    await fse.remove(filePath).catch(()=>{});
    return res.status(500).json({ ok: false, error: err.message || "server error" });
  }
});

module.exports = router;
