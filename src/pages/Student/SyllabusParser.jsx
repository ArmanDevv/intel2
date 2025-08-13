import React, { useState } from 'react';
import {
  DocumentTextIcon,
  UploadIcon,
  SparklesIcon,
  PlayIcon,
  CheckCircleIcon
} from '@heroicons/react/outline';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const SyllabusParser = () => {
  const [syllabusText, setSyllabusText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedTopics, setExtractedTopics] = useState([]);
  const [generatedPlaylists, setGeneratedPlaylists] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  const handleSyllabusSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setCurrentStep(2);

    // Simulate topic extraction with NLP
    setTimeout(() => {
      const topics = [
        'Introduction to Machine Learning',
        'Supervised Learning Algorithms',
        'Neural Networks and Deep Learning',
        'Natural Language Processing',
        'Computer Vision Fundamentals',
        'Reinforcement Learning',
        'Data Preprocessing Techniques',
        'Model Evaluation and Validation'
      ];
      setExtractedTopics(topics);
      setCurrentStep(3);
      
      // Simulate playlist generation
      setTimeout(() => {
        const playlists = topics.map((topic, index) => ({
          id: index + 1,
          title: topic,
          videoCount: Math.floor(Math.random() * 15) + 5,
          duration: `${Math.floor(Math.random() * 5) + 1}h ${Math.floor(Math.random() * 60)}m`,
          videos: [
            {
              id: 1,
              title: `${topic} - Complete Tutorial`,
              duration: '15:23',
              views: '1.2M views',
              channel: 'TechEdu Academy'
            },
            {
              id: 2,
              title: `${topic} Explained Simply`,
              duration: '12:45',
              views: '850K views',
              channel: 'LearnCode'
            }
          ]
        }));
        setGeneratedPlaylists(playlists);
        setCurrentStep(4);
        setIsProcessing(false);
      }, 2000);
    }, 3000);
  };

  const steps = [
    { id: 1, name: 'Upload Syllabus', icon: DocumentTextIcon },
    { id: 2, name: 'Extract Topics', icon: SparklesIcon },
    { id: 3, name: 'Find Videos', icon: PlayIcon },
    { id: 4, name: 'Create Playlists', icon: CheckCircleIcon }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Syllabus Parser</h1>
        <p className="text-gray-600">Transform your syllabus into organized learning playlists</p>
      </div>

      {/* Progress Steps */}
      <div className="card">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                } transition-all duration-300`}
              >
                {currentStep > step.id ? (
                  <CheckCircleIcon className="h-6 w-6" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">{step.name}</span>
              {index < steps.length - 1 && (
                <div
                  className={`ml-4 h-1 w-16 ${
                    currentStep > step.id ? 'bg-primary-500' : 'bg-gray-200'
                  } transition-all duration-300`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Upload Syllabus */}
      {currentStep === 1 && (
        <div className="card">
          <form onSubmit={handleSyllabusSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste your course syllabus
              </label>
              <textarea
                value={syllabusText}
                onChange={(e) => setSyllabusText(e.target.value)}
                placeholder="Paste your syllabus content here... Include course topics, learning objectives, and curriculum outline."
                className="input-field h-64 resize-none"
                required
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="btn-secondary flex items-center"
                >
                  <UploadIcon className="h-5 w-5 mr-2" />
                  Upload File
                </button>
                <span className="text-sm text-gray-500">or paste text directly</span>
              </div>
              
              <button
                type="submit"
                disabled={!syllabusText.trim()}
                className="btn-primary flex items-center"
              >
                <SparklesIcon className="h-5 w-5 mr-2" />
                Extract Topics
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 2-3: Processing */}
      {(currentStep === 2 || currentStep === 3) && (
        <div className="card text-center py-12">
          <LoadingSpinner size="xl" className="mb-6" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {currentStep === 2 ? 'Extracting Topics with NLP...' : 'Finding Relevant Videos...'}
          </h3>
          <p className="text-gray-600">
            {currentStep === 2
              ? 'Our AI is analyzing your syllabus to identify key learning topics'
              : 'Searching YouTube for high-quality educational content'}
          </p>
        </div>
      )}

      {/* Step 4: Results */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🎉 Successfully Generated {generatedPlaylists.length} Playlists!
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {extractedTopics.map((topic, index) => (
                <div key={index} className="flex items-center p-3 bg-green-50 rounded-xl">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm font-medium text-gray-900">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {generatedPlaylists.slice(0, 4).map((playlist) => (
              <div key={playlist.id} className="card hover:scale-105 transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{playlist.title}</h3>
                  <div className="flex space-x-2">
                    <button className="btn-secondary text-xs py-1 px-3">Preview</button>
                    <button className="btn-primary text-xs py-1 px-3">Save</button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <PlayIcon className="h-4 w-4 mr-2" />
                    {playlist.videoCount} videos • {playlist.duration}
                  </div>
                  
                  <div className="space-y-2">
                    {playlist.videos.map((video) => (
                      <div key={video.id} className="flex items-center p-2 bg-gray-50 rounded-lg">
                        <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center mr-3">
                          <PlayIcon className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{video.title}</p>
                          <p className="text-xs text-gray-500">{video.channel} • {video.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                setCurrentStep(1);
                setSyllabusText('');
                setExtractedTopics([]);
                setGeneratedPlaylists([]);
              }}
              className="btn-secondary"
            >
              Parse Another Syllabus
            </button>
            <button className="btn-primary">Save All Playlists</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SyllabusParser;