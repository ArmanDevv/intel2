import React, { useState } from 'react';
import {
  DocumentIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  SearchIcon,
  FilterIcon,
  SparklesIcon,
  DotsVerticalIcon
} from '@heroicons/react/outline';
import Modal from '../../components/UI/Modal';

const ResourceManager = () => {
  const [resources, setResources] = useState([
    {
      id: 1,
      title: 'Introduction to Neural Networks',
      type: 'PDF',
      uploadDate: '2024-01-15',
      fileSize: '2.4 MB',
      status: 'processed',
      generatedContent: {
        assignments: 3,
        flashcards: 25,
        summaries: 2
      },
      matchedTopics: ['Deep Learning', 'AI Fundamentals', 'Neural Networks'],
      tags: ['machine-learning', 'beginners']
    },
    {
      id: 2,
      title: 'Advanced Algorithm Design',
      type: 'DOCX',
      uploadDate: '2024-01-12',
      fileSize: '1.8 MB',
      status: 'processed',
      generatedContent: {
        assignments: 4,
        flashcards: 32,
        summaries: 3
      },
      matchedTopics: ['Algorithms', 'Data Structures', 'Problem Solving'],
      tags: ['algorithms', 'advanced']
    },
    {
      id: 3,
      title: 'Database Design Principles',
      type: 'Image',
      uploadDate: '2024-01-10',
      fileSize: '0.9 MB',
      status: 'processing',
      generatedContent: {
        assignments: 0,
        flashcards: 0,
        summaries: 0
      },
      matchedTopics: [],
      tags: ['database', 'design']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    switch (selectedFilter) {
      case 'pdf':
        return matchesSearch && resource.type === 'PDF';
      case 'docx':
        return matchesSearch && resource.type === 'DOCX';
      case 'image':
        return matchesSearch && resource.type === 'Image';
      case 'processed':
        return matchesSearch && resource.status === 'processed';
      case 'processing':
        return matchesSearch && resource.status === 'processing';
      default:
        return matchesSearch;
    }
  });

  const handleDeleteResource = () => {
    setResources(prev => prev.filter(r => r.id !== selectedResource.id));
    setShowDeleteModal(false);
    setSelectedResource(null);
  };

  const handleEditResource = () => {
    setResources(prev => prev.map(r => 
      r.id === selectedResource.id ? { ...r, title: editTitle } : r
    ));
    setShowEditModal(false);
    setSelectedResource(null);
    setEditTitle('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'processed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Processed</span>;
      case 'processing':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Processing</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Unknown</span>;
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'PDF':
        return <DocumentIcon className="h-5 w-5 text-red-500" />;
      case 'DOCX':
        return <DocumentIcon className="h-5 w-5 text-blue-500" />;
      case 'Image':
        return <DocumentIcon className="h-5 w-5 text-green-500" />;
      default:
        return <DocumentIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Resources</h1>
          <p className="text-gray-600 mt-1">Manage your uploaded content and generated materials</p>
        </div>
        <div className="text-sm text-gray-500">
          {resources.length} resources • {resources.reduce((acc, r) => acc + r.generatedContent.assignments + r.generatedContent.flashcards + r.generatedContent.summaries, 0)} items generated
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search resources or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center space-x-3">
            <FilterIcon className="h-5 w-5 text-gray-400" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="input-field w-auto"
            >
              <option value="all">All Resources</option>
              <option value="pdf">PDF Files</option>
              <option value="docx">DOCX Files</option>
              <option value="image">Images</option>
              <option value="processed">Processed</option>
              <option value="processing">Processing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="card group hover:scale-105 transition-all duration-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center flex-1">
                <div className="p-3 bg-gray-100 rounded-xl mr-4">
                  {getFileIcon(resource.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{resource.title}</h3>
                  <p className="text-sm text-gray-600">{resource.type} • {resource.fileSize}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {getStatusBadge(resource.status)}
                <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <DotsVerticalIcon className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Generated Content Stats */}
            {resource.status === 'processed' && (
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <p className="text-lg font-bold text-blue-600">{resource.generatedContent.assignments}</p>
                  <p className="text-xs text-blue-700">Assignments</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <p className="text-lg font-bold text-green-600">{resource.generatedContent.flashcards}</p>
                  <p className="text-xs text-green-700">Flashcards</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-xl">
                  <p className="text-lg font-bold text-purple-600">{resource.generatedContent.summaries}</p>
                  <p className="text-xs text-purple-700">Summaries</p>
                </div>
              </div>
            )}

            {/* Matched Topics */}
            {resource.matchedTopics.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Matched Topics:</p>
                <div className="flex flex-wrap gap-1">
                  {resource.matchedTopics.slice(0, 3).map((topic, index) => (
                    <span key={index} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-md">
                      {topic}
                    </span>
                  ))}
                  {resource.matchedTopics.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                      +{resource.matchedTopics.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {resource.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Uploaded {new Date(resource.uploadDate).toLocaleDateString()}
              </p>
              
              <div className="flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-blue-500 transition-colors">
                  <EyeIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedResource(resource);
                    setEditTitle(resource.title);
                    setShowEditModal(true);
                  }}
                  className="p-2 text-gray-500 hover:text-green-500 transition-colors"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedResource(resource);
                    setShowDeleteModal(true);
                  }}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <DocumentIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search or filter criteria.' : 'Upload your first educational content to get started.'}
          </p>
        </div>
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Resource"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete "{selectedResource?.title}"? This will also remove all generated content.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">
              This action cannot be undone. All assignments, flashcards, and summaries will be permanently deleted.
            </p>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteResource}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-xl transition-colors"
            >
              Delete Resource
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Resource"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resource Title
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="input-field"
              placeholder="Enter resource title"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowEditModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleEditResource}
              className="btn-primary"
              disabled={!editTitle.trim()}
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ResourceManager;