import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CloudUploadIcon,
  DocumentIcon,
  SparklesIcon,
  UsersIcon,
  TrendingUpIcon,
  ClockIcon
} from '@heroicons/react/outline';

const TeacherDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const [stats] = useState({
    totalResources: 28,
    generatedContent: 145,
    activeStudents: 67,
    teachingHours: 156
  });

  const recentUploads = [
    {
      id: 1,
      title: 'Introduction to Neural Networks',
      type: 'PDF',
      uploadDate: '2 hours ago',
      generatedContent: {
        assignments: 3,
        flashcards: 25,
        summaries: 2
      },
      matchedTopics: 5
    },
    {
      id: 2,
      title: 'Data Preprocessing Techniques',
      type: 'DOCX',
      uploadDate: '1 day ago',
      generatedContent: {
        assignments: 2,
        flashcards: 18,
        summaries: 1
      },
      matchedTopics: 3
    },
    {
      id: 3,
      title: 'Machine Learning Fundamentals',
      type: 'Image',
      uploadDate: '3 days ago',
      generatedContent: {
        assignments: 4,
        flashcards: 32,
        summaries: 3
      },
      matchedTopics: 8
    }
  ];

  const quickActions = [
    {
      title: 'Upload New Content',
      description: 'Upload PDF or DOCX files to generate learning materials',
      icon: CloudUploadIcon,
      link: '/upload',
      color: 'bg-purple-500'
    },
    {
      title: 'Manage Resources',
      description: 'View and edit your generated materials',
      icon: DocumentIcon,
      link: '/resources',
      color: 'bg-blue-500'
    }
  ];

  const contentTypes = [
    { name: 'Assignments', count: 45, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Flashcards', count: 78, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Summaries', count: 22, color: 'text-purple-600', bg: 'bg-purple-100' }
  ];

  if (!user) return null; // prevent rendering before user is loaded

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h1>
        <p className="text-purple-100 text-lg">Ready to create amazing learning experiences?</p>
      </div>

      {/* Stats Grid */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl">
              <DocumentIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Resources</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalResources}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-xl">
              <SparklesIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Generated Content</p>
              <p className="text-2xl font-bold text-gray-900">{stats.generatedContent}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl">
              <UsersIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeStudents}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-xl">
              <ClockIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Teaching Hours</p>
              <p className="text-2xl font-bold text-gray-900">{stats.teachingHours}</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="card hover:scale-105 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-start">
                <div className={`p-4 ${action.color} rounded-xl group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Generated Content Overview */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Generated Content Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contentTypes.map((type, index) => (
            <div key={index} className="card text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 ${type.bg} rounded-xl mb-4`}>
                <SparklesIcon className={`h-6 w-6 ${type.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{type.name}</h3>
              <p className="text-3xl font-bold text-gray-900 mb-2">{type.count}</p>
              <p className="text-sm text-gray-600">Generated this month</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Uploads */}
      {/* <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Uploads</h2>
          <Link to="/resources" className="text-primary-500 hover:text-primary-600 font-medium">
            View All
          </Link>
        </div>
        <div className="space-y-4">
          {recentUploads.map((upload) => (
            <div key={upload.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div className="p-3 bg-gray-100 rounded-xl mr-4">
                    <DocumentIcon className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{upload.title}</h3>
                    <p className="text-sm text-gray-600">{upload.type} • {upload.uploadDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">{upload.generatedContent.assignments}</p>
                    <p className="text-gray-500">Assignments</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">{upload.generatedContent.flashcards}</p>
                    <p className="text-gray-500">Flashcards</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">{upload.generatedContent.summaries}</p>
                    <p className="text-gray-500">Summaries</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-primary-600">{upload.matchedTopics}</p>
                    <p className="text-gray-500">Matched Topics</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default TeacherDashboard;
