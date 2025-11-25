// 
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const Content = require('../models/Content');


const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOCX, and image files are allowed!'));
    }
  }
});


async function fileToBase64(filePath) {
  const fileData = await fs.readFile(filePath);
  return fileData.toString('base64');
}


router.post('/upload', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedFiles = req.files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.originalname,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      type: file.mimetype.includes('pdf') ? 'PDF' : 
            file.mimetype.includes('word') ? 'DOCX' : 'Image',
      path: file.path,
      mimeType: file.mimetype
    }));

    res.json({
      success: true,
      files: uploadedFiles
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});


router.post('/process', async (req, res) => {
  try {
    const { files } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files to process' });
    }

    
    const modelsToTry = [
      { name: 'gemini-2.5-flash', version: 'v1beta' },        
      { name: 'gemini-2.0-flash', version: 'v1beta' },        
      { name: 'gemini-flash-latest', version: 'v1beta' },     
      { name: 'gemini-2.5-flash-lite', version: 'v1beta' },   
      { name: 'gemini-2.0-flash-lite', version: 'v1beta' }    
    ];

    let responseData;
    let modelUsed;

    
    const fileParts = await Promise.all(
      files.map(async file => {
        const base64Data = await fileToBase64(file.path);
        return {
          inline_data: {
            mime_type: file.mimeType,
            data: base64Data
          }
        };
      })
    );

  const prompt = `You are an expert educational content creator. Analyze the uploaded educational materials and generate complete, detailed educational content.

CRITICAL: You MUST return ONLY a valid JSON object. DO NOT include markdown formatting, code blocks, or any text outside the JSON.

Generate the following structure with ACTUAL CONTENT (not placeholders):

1. **Assignments** (Generate 2-3 complete assignments):
   Each assignment MUST have:
   - title: Clear, specific title
   - type: "Quiz", "Problem Set", "Essay", or "Project"
   - difficulty: "Beginner", "Intermediate", or "Advanced"
   - estimatedTime: e.g., "30 minutes"
   - description: Brief overview
   - totalPoints: Sum of all question points
   - questions: Array of 3-6 ACTUAL QUESTION OBJECTS (NOT empty, NOT placeholder)

   Each question object MUST include ALL these fields:
   {
     "questionNumber": 1,
     "questionText": "The actual, complete question based on the content",
     "questionType": "MCQ" or "Short Answer" or "Essay" or "True/False",
     "options": ["A) First option", "B) Second option", "C) Third option", "D) Fourth option"],
     "correctAnswer": "B",
     "explanation": "Detailed explanation of the correct answer",
     "points": 10
   }

2. **Flashcards** (Generate 8-12 flashcards):
   Each flashcard: {"front": "Question", "back": "Answer"}

3. **Summary** (1 detailed summary):
   {"title": "Content Overview", "content": "2-3 paragraphs", "keyPoints": ["point1", "point2", ...]}

4. **Topics** (4-6 relevant topics as strings)

RETURN THIS EXACT JSON STRUCTURE:
{
  "assignments": [
    {
      "title": "string",
      "type": "Quiz",
      "difficulty": "Intermediate",
      "estimatedTime": "30 minutes",
      "description": "string",
      "totalPoints": 50,
      "questions": [
        {
          "questionNumber": 1,
          "questionText": "string",
          "questionType": "MCQ",
          "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
          "correctAnswer": "A",
          "explanation": "string",
          "points": 10
        }
      ]
    }
  ],
  "flashcards": [{"front": "string", "back": "string"}],
  "summaries": [{"title": "string", "content": "string", "keyPoints": ["string"]}],
  "matchedTopics": ["string"]
}

RULES:
- NO markdown code blocks (no \`\`\`json)
- NO text before or after the JSON
- questions array must contain actual question objects, not be empty
- Every assignment must have at least 3 questions
- Base all content on the uploaded material`;


    
    for (const model of modelsToTry) {
      try {
        console.log(`Trying model: ${model.name} with API version ${model.version}`);
        
        const url = `https://generativelanguage.googleapis.com/${model.version}/models/${model.name}:generateContent?key=${process.env.GEMINI_API_KEY}`;
      
        const requestBody = {
          contents: [{
            parts: [
              { text: prompt },
              ...fileParts
            ]
          }]
        };

        const response = await axios.post(url, requestBody, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.data && response.data.candidates && response.data.candidates[0]) {
          responseData = response.data;
          modelUsed = model.name;
          console.log(`✓ Successfully used model: ${modelUsed}`);
          break;
        }
      } catch (error) {
        console.log(`✗ Model ${model.name} failed: ${error.response?.status} ${error.response?.statusText || error.message}`);
        
      }
    }

    if (!responseData) {
      throw new Error('All models failed. Please check your API key and try again.');
    }

    
    let text = responseData.candidates[0].content.parts[0].text;
    console.log('Raw AI response (first 200 chars):', text.substring(0, 200));

    
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    
    let generatedContent;
    try {
      generatedContent = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Cleaned response:', text.substring(0, 500));
      
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          generatedContent = JSON.parse(jsonMatch[0]);
        } catch (e) {
          
          generatedContent = {
            assignments: [
              {
                title: "Assignment Generated from Uploaded Content",
                type: "Problem Set",
                questions: 5,
                difficulty: "Intermediate",
                estimatedTime: "30 minutes"
              }
            ],
            flashcards: [
              {
                front: "Key Concept from Content",
                back: "Review the uploaded material for detailed information."
              }
            ],
            summaries: [
              {
                title: "Content Overview",
                content: "The AI has processed your content. For best results, ensure the document contains clear, readable text.",
                keyPoints: ["Content uploaded successfully", "AI processing completed", "Review generated materials"]
              }
            ],
            matchedTopics: ["Education", "Learning Material", "Study Content"]
          };
        }
      } else {
        throw new Error('Failed to extract valid JSON from AI response');
      }
    }

    
    await Promise.all(
      files.map(file => fs.unlink(file.path).catch(err => console.error('Cleanup error:', err)))
    );

    res.json({
      success: true,
      content: generatedContent,
      modelUsed: modelUsed
    });

  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process files with AI',
      details: error.message 
    });
  }
});


router.post('/save', async (req, res) => {
  try {
    const { teacherId, teacherName, originalFileName, fileType, assignments, flashcards, summaries, matchedTopics, modelUsed } = req.body;

    if (!teacherId) {
      return res.status(400).json({ error: 'Teacher ID is required' });
    }

    console.log("DEBUG: contentData being saved:", JSON.stringify(req.body, null, 2));
    console.log("DEBUG: Saving content to MongoDB...");

    
    const newContent = new Content({
      teacherId,
      teacherName,
      originalFileName,
      fileType,
      assignments,
      flashcards,
      summaries,
      matchedTopics,
      modelUsed,
      status: 'published',
      views: 0,
      downloads: 0
    });

    
    await newContent.save();

    console.log("DEBUG: Content saved successfully with ID:", newContent._id);

    res.json({
      success: true,
      message: 'Content saved successfully',
      contentId: newContent._id,
      data: newContent
    });

  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({
      error: 'Failed to save content',
      details: error.message
    });
  }
});



router.get('/teacher/:teacherId', async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { status } = req.query;

    const query = { teacherId };
    if (status && status !== 'all') {
      query.status = status;
    }

    const contents = await Content.find(query)
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: contents
    });

  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch content',
      details: error.message 
    });
  }
});


router.delete('/:contentId', async (req, res) => {
  try {
    const { contentId } = req.params;

    const deletedContent = await Content.findByIdAndDelete(contentId);

    if (!deletedContent) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json({
      success: true,
      message: 'Content deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ 
      error: 'Failed to delete content',
      details: error.message 
    });
  }
});

module.exports = router;