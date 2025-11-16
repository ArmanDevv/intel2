import React, { useState } from 'react';
import {
  CloudUploadIcon,
  DocumentIcon,
  PhotographIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationIcon
} from '@heroicons/react/outline';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import axios from 'axios';

const ContentUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState(null);
  const [expandedAssignment, setExpandedAssignment] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadMetadata, setUploadMetadata] = useState({ fileName: '', fileType: '', modelUsed: '' });

  // Function to download assignment as PDF/Text
  const downloadAssignment = (assignment, format = 'txt') => {
    let content = '';
    
    // Build assignment content
    content += `${assignment.title}\n`;
    content += `${'='.repeat(assignment.title.length)}\n\n`;
    content += `Type: ${assignment.type}\n`;
    content += `Difficulty: ${assignment.difficulty}\n`;
    content += `Estimated Time: ${assignment.estimatedTime}\n`;
    content += `Total Points: ${assignment.totalPoints || assignment.questions?.length * 10 || 'N/A'}\n\n`;
    
    if (assignment.description) {
      content += `Description:\n${assignment.description}\n\n`;
    }
    
    content += `${'='.repeat(50)}\n\n`;
    
    // Add questions
    if (assignment.questions && assignment.questions.length > 0) {
      assignment.questions.forEach((q, index) => {
        content += `Question ${q.questionNumber || index + 1} (${q.points || 10} points)\n`;
        content += `${q.questionText}\n\n`;
        
        if (q.options && q.options.length > 0) {
          q.options.forEach(option => {
            content += `  ${option}\n`;
          });
          content += '\n';
        }
        
        if (q.correctAnswer) {
          content += `Correct Answer: ${q.correctAnswer}\n`;
        }
        
        if (q.explanation) {
          content += `Explanation: ${q.explanation}\n`;
        }
        
        content += `\n${'-'.repeat(50)}\n\n`;
      });
    } else {
      content += 'Questions will be generated based on the content.\n';
    }
    
    // Create and download file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${assignment.title.replace(/[^a-z0-9]/gi, '_')}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      // Upload files to backend
      const response = await axios.post('http://localhost:5000/api/content/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setUploadedFiles(prev => [...prev, ...response.data.files]);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Failed to upload files');
    }
  };

  const processFiles = async () => {
    setIsProcessing(true);
    setCurrentStep(2);
    setError(null);

    try {
      // Send files to Gemini for processing
      const response = await axios.post('http://localhost:5000/api/content/process', {
        files: uploadedFiles
      });

      if (response.data.success) {
  setGeneratedContent(response.data.content);
  setUploadMetadata(prev => ({
    ...prev,
    modelUsed: response.data.modelUsed
  }));
  setCurrentStep(3);
}

    } catch (err) {
      console.error('Processing error:', err);
      setError(err.response?.data?.error || 'Failed to process files');
      setCurrentStep(1);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

 const saveContent = async () => {
  setIsSaving(true);
  setError(null);

  try {
    // Get teacherId from localStorage
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('Please login to save content');
    }

    const user = JSON.parse(userStr);
    const teacherId = user._id || user.id || user.user?._id || user.user?.id || user.userId;
    const teacherName = user.name || user.username || 'Unknown';

    if (!teacherId) {
      throw new Error('Teacher ID not found. Please login again.');
    }

    // Prepare data to save
    const contentData = {
      teacherId,
      teacherName,
      originalFileName: uploadedFiles.map(f => f.name).join(', ') || 'Uploaded Content',
      fileType: uploadedFiles[0]?.type || 'Unknown',
      assignments: generatedContent.assignments || [],
      flashcards: generatedContent.flashcards || [],
      summaries: generatedContent.summaries || [],
      matchedTopics: generatedContent.matchedTopics || [],
      modelUsed: uploadMetadata.modelUsed || 'Gemini AI'
    };

// DEBUG: show exactly what we're about to send to the server
console.log('DEBUG: contentData being saved:', JSON.stringify(contentData, null, 2));
    // Save to backend
    const response = await axios.post('http://localhost:5000/api/content/save', contentData);

    if (response.data.success) {
      alert('Content saved successfully! This includes:\n\n' +
            `✓ ${generatedContent.assignments?.length || 0} Assignments\n` +
            `✓ ${generatedContent.flashcards?.length || 0} Flashcards\n` +
            `✓ ${generatedContent.summaries?.length || 0} Summaries\n` +
            `✓ ${generatedContent.matchedTopics?.length || 0} Topic Tags`);
      
      // Reset form
      setCurrentStep(1);
      setUploadedFiles([]);
      setGeneratedContent(null);
      setError(null);
      setExpandedAssignment(null);
    }

  } catch (err) {
    console.error('Save error:', err);
    setError(err.response?.data?.error || err.message || 'Failed to save content');
    alert('Failed to save content: ' + (err.response?.data?.error || err.message));
  } finally {
    setIsSaving(false);
  }
};


  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Content</h1>
        <p className="text-gray-600">Upload educational materials and let AI generate learning content</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="card bg-red-50 border-red-200">
          <div className="flex items-start">
            <ExclamationIcon className="h-6 w-6 text-red-600 mr-3 mt-1" />
            <div>
              <h4 className="font-semibold text-red-900 mb-1">Error</h4>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: File Upload */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {/* Upload Area */}
          <div className="card">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-300 transition-colors">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <CloudUploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Drop files here or click to upload
                </h3>
                <p className="text-gray-600 mb-4">
                  Support for PDF, DOCX, and image files (JPG, PNG)
                </p>
              </label>
            </div>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Files</h3>
              <div className="space-y-3">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center">
                      <div className="p-2 bg-white rounded-lg mr-3">
                        {file.type === 'PDF' ? (
                          <DocumentIcon className="h-5 w-5 text-red-500" />
                        ) : file.type === 'DOCX' ? (
                          <DocumentIcon className="h-5 w-5 text-blue-500" />
                        ) : (
                          <PhotographIcon className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-600">{file.type} • {file.size}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={processFiles}
                  disabled={isProcessing}
                  className="btn-primary flex items-center"
                >
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  Generate Content with AI
                </button>
              </div>
            </div>
          )}

          {/* Upload Guidelines */}
          <div className="card bg-blue-50 border-blue-200">
            <div className="flex items-start">
              <ExclamationIcon className="h-6 w-6 text-blue-600 mr-3 mt-1" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Upload Guidelines</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• PDF files should contain clear, readable text</li>
                  <li>• DOCX files will be processed for text content</li>
                  <li>• Images should contain educational diagrams or text</li>
                  <li>• Maximum file size: 10MB per file</li>
                  <li>• Content will be analyzed by Google Gemini AI</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Processing */}
      {currentStep === 2 && (
        <div className="card text-center py-12">
          <LoadingSpinner size="xl" className="mb-6" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            AI is Processing Your Content...
          </h3>
          <p className="text-gray-600 mb-4">
            Analyzing content with Gemini AI and generating assignments, flashcards, and summaries
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="p-3 bg-blue-50 rounded-xl">
              <SparklesIcon className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-blue-700">Extracting Topics</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <DocumentIcon className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-green-700">Creating Assignments</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <CheckCircleIcon className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <p className="text-sm text-purple-700">Generating Flashcards</p>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Results */}
      {currentStep === 3 && generatedContent && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
              Content Generated Successfully!
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-2xl font-bold text-blue-600">
                  {generatedContent.assignments?.length || 0}
                </p>
                <p className="text-sm text-blue-700">Assignments</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <p className="text-2xl font-bold text-green-600">
                  {generatedContent.flashcards?.length || 0}
                </p>
                <p className="text-sm text-green-700">Flashcards</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <p className="text-2xl font-bold text-purple-600">
                  {generatedContent.summaries?.length || 0}
                </p>
                <p className="text-sm text-purple-700">Summaries</p>
              </div>
            </div>
          </div>

          {/* Generated Assignments - Enhanced with expand/collapse */}
          {generatedContent.assignments && generatedContent.assignments.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Assignments</h3>
              <div className="space-y-3">
                {generatedContent.assignments.map((assignment, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div 
                      className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => setExpandedAssignment(expandedAssignment === index ? null : index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{assignment.title}</h4>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                              {assignment.type}
                            </span>
                            <span>📝 {assignment.questions?.length || assignment.questions || 0} Questions</span>
                            <span className={`px-2 py-1 rounded ${
                              assignment.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                              assignment.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {assignment.difficulty}
                            </span>
                            <span>⏱️ {assignment.estimatedTime}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className="text-gray-400 text-xl">
                            {expandedAssignment === index ? '▼' : '▶'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {expandedAssignment === index && (
                      <div className="p-4 bg-white border-t border-gray-200">
                        <div className="space-y-4">
                          {/* Assignment Header Info */}
                          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-1">Assignment Overview</h5>
                              <p className="text-sm text-gray-600">
                                {assignment.questions?.length || 0} questions • {assignment.totalPoints || assignment.questions?.length * 10 || 'N/A'} total points
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadAssignment(assignment);
                              }}
                              className="btn-primary flex items-center gap-2 text-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Download
                            </button>
                          </div>
                          
                          {assignment.description && (
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-sm text-blue-900">
                                <strong>📋 Instructions:</strong> {assignment.description}
                              </p>
                            </div>
                          )}
                          
                          {/* Display Questions */}
                          {assignment.questions && assignment.questions.length > 0 ? (
                            <div className="space-y-4">
                              <h5 className="font-semibold text-gray-900">Questions:</h5>
                              {assignment.questions.map((question, qIndex) => (
                                <div key={qIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                  <div className="flex items-start justify-between mb-3">
                                    <h6 className="font-semibold text-gray-900">
                                      Question {question.questionNumber || qIndex + 1}
                                    </h6>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                                      {question.points || 10} pts
                                    </span>
                                  </div>
                                  
                                  <p className="text-gray-800 mb-3 leading-relaxed">
                                    {question.questionText}
                                  </p>
                                  
                                  {question.questionType && (
                                    <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded mb-3">
                                      {question.questionType}
                                    </span>
                                  )}
                                  
                                  {question.options && question.options.length > 0 && (
                                    <div className="space-y-2 mb-3">
                                      {question.options.map((option, oIndex) => (
                                        <div key={oIndex} className="flex items-start gap-2">
                                          <span className="text-gray-600 font-mono text-sm">{option}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  
                                  {question.correctAnswer && (
                                    <div className="bg-green-50 border border-green-200 rounded p-3 mb-2">
                                      <p className="text-sm">
                                        <strong className="text-green-800">✓ Correct Answer:</strong>
                                        <span className="text-green-700 ml-2">{question.correctAnswer}</span>
                                      </p>
                                    </div>
                                  )}
                                  
                                  {question.explanation && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                                      <p className="text-sm">
                                        <strong className="text-yellow-800">💡 Explanation:</strong>
                                        <span className="text-yellow-700 ml-2">{question.explanation}</span>
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                              <p className="text-yellow-800">
                                ⚠️ Questions are being generated. This assignment contains {assignment.questions || 0} questions 
                                that will be available after processing.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generated Flashcards - Show All */}
          {generatedContent.flashcards && generatedContent.flashcards.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Flashcards ({generatedContent.flashcards.length} total)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedContent.flashcards.map((flashcard, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="border-b border-gray-200 pb-2 mb-2">
                      <p className="text-xs font-semibold text-gray-500 mb-1">QUESTION {index + 1}</p>
                      <p className="text-gray-900 font-medium">{flashcard.front}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">ANSWER</p>
                      <p className="text-gray-900">{flashcard.back}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summaries */}
          {generatedContent.summaries && generatedContent.summaries.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Summary</h3>
              {generatedContent.summaries.map((summary, index) => (
                <div key={index} className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{summary.title}</h4>
                  <p className="text-gray-700 mb-3">{summary.content}</p>
                  {summary.keyPoints && summary.keyPoints.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Key Points:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        {summary.keyPoints.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Matched Topics */}
          {generatedContent.matchedTopics && generatedContent.matchedTopics.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Matched Student Topics</h3>
              <div className="flex flex-wrap gap-2">
                {generatedContent.matchedTopics.map((topic, index) => (
                  <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                    {topic}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Your content will be automatically matched with students studying these topics.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                setCurrentStep(1);
                setUploadedFiles([]);
                setGeneratedContent(null);
                setError(null);
              }}
              className="btn-secondary"
            >
              Upload More Content
            </button>
            <button
  onClick={saveContent}
  disabled={isSaving}
  className="btn-primary"
>
  {isSaving ? 'Saving...' : 'Save All Content'}
</button>

          </div>
        </div>
      )}
    </div>
  );
};

export default ContentUpload;