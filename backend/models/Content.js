// models/Content.js
const mongoose = require('mongoose');

// Assignment Schema
const questionSchema = new mongoose.Schema({
  questionNumber: { type: Number, required: true },
  questionText: { type: String, required: true },
  questionType: { 
    type: String, 
    enum: ['MCQ', 'Short Answer', 'Essay', 'True/False'],
    required: true 
  },
  options: [{ type: String }], // For MCQ questions
  correctAnswer: { type: String },
  explanation: { type: String },
  points: { type: Number, default: 10 }
});

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Problem Set', 'Essay', 'Quiz', 'Project'],
    required: true 
  },
  difficulty: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true 
  },
  estimatedTime: { type: String, required: true },
  description: { type: String },
  totalPoints: { type: Number },
  questions: [questionSchema],
  createdAt: { type: Date, default: Date.now }
});

// Flashcard Schema
const flashcardSchema = new mongoose.Schema({
  front: { type: String, required: true },
  back: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Summary Schema
const summarySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  keyPoints: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

// Main Content Schema (groups everything together)
const contentSchema = new mongoose.Schema({
  teacherId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  teacherName: { type: String },
  originalFileName: { type: String, required: true },
  fileType: { type: String }, // PDF, DOCX, Image
  
  assignments: [assignmentSchema],
  flashcards: [flashcardSchema],
  summaries: [summarySchema],
  matchedTopics: [{ type: String }],
  
  // Metadata
  modelUsed: { type: String }, // Which Gemini model was used
  processingTime: { type: Number }, // Time taken to process in ms
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  
  // Stats
  views: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for better query performance
contentSchema.index({ teacherId: 1, createdAt: -1 });
contentSchema.index({ matchedTopics: 1 });
contentSchema.index({ status: 1 });

// Update the updatedAt timestamp before saving
contentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;