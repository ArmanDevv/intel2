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

const ContentUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    const fileData = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      type: file.type.includes('pdf') ? 'PDF' : file.type.includes('word') ? 'DOCX' : 'Image',
      status: 'uploaded'
    }));

    setUploadedFiles(prev => [...prev, ...fileData]);
  };

  // const processFiles = async () => {
  //   setIsProcessing(true);
  //   setCurrentStep(2);

  //   // Simulate AI processing
  //   setTimeout(() => {
  //     const content = {
  //       assignments: [
  //         {
  //           id: 1,
  //           title: 'Neural Network Architecture Design',
  //           type: 'Problem Set',
  //           questions: 5,
  //           difficulty: 'Intermediate',
  //           estimatedTime: '45 minutes'
  //         },
  //         {
  //           id: 2,
  //           title: 'Activation Functions Analysis',
  //           type: 'Essay',
  //           questions: 3,
  //           difficulty: 'Advanced',
  //           estimatedTime: '60 minutes'
  //         }
  //       ],
  //       flashcards: [
  //         {
  //           id: 1,
  //           front: 'What is backpropagation?',
  //           back: 'A supervised learning algorithm used to train neural networks by calculating gradients and updating weights.'
  //         },
  //         {
  //           id: 2,
  //           front: 'Define overfitting',
  //           back: 'When a model performs well on training data but poorly on unseen data due to learning noise rather than patterns.'
  //         }
  //       ],
  //       summaries: [
  //         {
  //           id: 1,
  //           title: 'Neural Networks Overview',
  //           content: 'Neural networks are computing systems inspired by biological neural networks...',
  //           keyPoints: [
  //             'Artificial neurons process and transmit information',
  //             'Learning occurs through weight adjustment',
  //             'Multiple layers enable complex pattern recognition'
  //           ]
  //         }
  //       ],
  //       matchedTopics: [
  //         'Deep Learning Fundamentals',
  //         'Neural Network Architecture',
  //         'Machine Learning Algorithms',
  //         'Artificial Intelligence Concepts'
  //       ]
  //     };

  //     setGeneratedContent(content);
  //     setCurrentStep(3);
  //     setIsProcessing(false);
  //   }, 4000);
  // };
  const processFiles = async () => {
  if (uploadedFiles.length === 0) {
    alert("Please upload a file first!");
    return;
  }

  setIsProcessing(true);
  setCurrentStep(2);

  try {
    const fileInput = document.getElementById("file-upload");
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const resp = await fetch("http://localhost:4000/api/gemini/upload", {
      method: "POST",
      body: formData,
    });

    const json = await resp.json();
    if (!json.ok) {
      throw new Error(json.error || "Backend error");
    }

    // The backend returns { ok: true, fileRef, data }
    setGeneratedContent(json.data);
    setCurrentStep(3);
  } catch (err) {
    console.error("Error sending file:", err);
    alert("There was an error processing the file. See console for details.");
    setCurrentStep(1);
  } finally {
    setIsProcessing(false);
  }
};


  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const saveContent = () => {
    // Simulate saving to database
    setCurrentStep(1);
    setUploadedFiles([]);
    setGeneratedContent(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Content</h1>
        <p className="text-gray-600">Upload educational materials and let AI generate learning content</p>
      </div>

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
                <button className="btn-primary">
                  Choose Files
                </button>
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
                  className="btn-primary flex items-center"
                >
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  Generate Content
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
                  <li>• Supported languages: English, Spanish, French</li>
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
            Analyzing content and generating assignments, flashcards, and summaries
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
                <p className="text-2xl font-bold text-blue-600">{generatedContent.assignments.length}</p>
                <p className="text-sm text-blue-700">Assignments</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <p className="text-2xl font-bold text-green-600">{generatedContent.flashcards.length}</p>
                <p className="text-sm text-green-700">Flashcards</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <p className="text-2xl font-bold text-purple-600">{generatedContent.summaries.length}</p>
                <p className="text-sm text-purple-700">Summaries</p>
              </div>
            </div>
          </div>

          {/* Generated Assignments */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Assignments</h3>
            <div className="space-y-3">
              {generatedContent.assignments.map((assignment) => (
                <div key={assignment.id} className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">{assignment.title}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <span>Type: {assignment.type}</span>
                    <span>Questions: {assignment.questions}</span>
                    <span>Difficulty: {assignment.difficulty}</span>
                    <span>Time: {assignment.estimatedTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generated Flashcards Preview */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Flashcards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedContent.flashcards.slice(0, 2).map((flashcard) => (
                <div key={flashcard.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="border-b border-gray-200 pb-2 mb-2">
                    <p className="text-sm font-medium text-gray-700">Question:</p>
                    <p className="text-gray-900">{flashcard.front}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Answer:</p>
                    <p className="text-gray-900">{flashcard.back}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Matched Topics */}
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

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                setCurrentStep(1);
                setUploadedFiles([]);
                setGeneratedContent(null);
              }}
              className="btn-secondary"
            >
              Upload More Content
            </button>
            <button
              onClick={saveContent}
              className="btn-primary"
            >
              Save All Content
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentUpload;