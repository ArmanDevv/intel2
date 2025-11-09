import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  DocumentIcon,
  SparklesIcon,
  EyeIcon,
  DownloadIcon,
  TrashIcon,
  PencilIcon,
  ClockIcon
} from '@heroicons/react/outline';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const MyContent = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // replace hardcoded teacherId with state that reads localStorage
  const [teacherId, setTeacherId] = useState('');

  useEffect(() => {
    // read saved user from localStorage (saved as "user" in Login.jsx)
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const parsed = JSON.parse(raw);
        // try common id paths returned by your backend
        const id = parsed._id || parsed.id || parsed.user?._id || parsed.user?.id || parsed.userId;
        if (id) setTeacherId(id);
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    // fetch when teacherId is available or when filter changes
    if (!teacherId) {
      setLoading(false);
      return;
    }
    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, teacherId]);

  const fetchContent = async () => {
    setLoading(true);
    setError(null);

    if (!teacherId) {
      setLoading(false);
      return;
    }

    try {
      const params = filterStatus !== 'all' ? { status: filterStatus } : {};
      const response = await axios.get(
        `http://localhost:5000/api/content/teacher/${teacherId}`,
        { params }
      );

      if (response.data.success) {
        setContents(response.data.data);
      } else {
        setContents([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load your content');
    } finally {
      setLoading(false);
    }
  };

  const deleteContent = async (contentId) => {
    if (!window.confirm('Are you sure you want to delete this content?')) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/content/${contentId}`
      );

      if (response.data.success) {
        setContents(contents.filter(c => c._id !== contentId));
        alert('Content deleted successfully');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete content');
    }
  };

  const viewContent = (content) => {
    setSelectedContent(content);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Content</h1>
          <p className="text-gray-600 mt-1">View and manage your uploaded educational content</p>
        </div>
        
        {/* Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg ${
              filterStatus === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('published')}
            className={`px-4 py-2 rounded-lg ${
              filterStatus === 'published'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Published
          </button>
          <button
            onClick={() => setFilterStatus('draft')}
            className={`px-4 py-2 rounded-lg ${
              filterStatus === 'draft'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Drafts
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="card bg-red-50 border-red-200">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Content List */}
      {contents.length === 0 ? (
        <div className="card text-center py-12">
          <DocumentIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No content yet</h3>
          <p className="text-gray-600 mb-4">Upload your first educational material to get started</p>
          <a href="/upload" className="btn-primary inline-block">
            Upload Content
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contents.map((content) => (
            <div key={content._id} className="card hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                    {content.originalFileName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <ClockIcon className="h-4 w-4" />
                    {formatDate(content.createdAt)}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  content.status === 'published'
                    ? 'bg-green-100 text-green-700'
                    : content.status === 'draft'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {content.status}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {content.assignments?.length || 0}
                  </p>
                  <p className="text-xs text-blue-700">Assignments</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {content.flashcards?.length || 0}
                  </p>
                  <p className="text-xs text-green-700">Flashcards</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {content.summaries?.length || 0}
                  </p>
                  <p className="text-xs text-purple-700">Summaries</p>
                </div>
              </div>

              {/* Topics */}
              {content.matchedTopics && content.matchedTopics.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {content.matchedTopics.slice(0, 3).map((topic, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {topic}
                      </span>
                    ))}
                    {content.matchedTopics.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        +{content.matchedTopics.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => viewContent(content)}
                  className="flex-1 btn-secondary text-sm py-2"
                >
                  <EyeIcon className="h-4 w-4 inline mr-1" />
                  View
                </button>
                <button
                  onClick={() => deleteContent(content._id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                  title="Delete"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Metadata */}
              <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <EyeIcon className="h-4 w-4" />
                  <span>{content.views || 0} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <SparklesIcon className="h-4 w-4" />
                  <span>{content.modelUsed || 'AI'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedContent.originalFileName}
                </h2>
                <button
                  onClick={() => setSelectedContent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Assignments */}
              {selectedContent.assignments && selectedContent.assignments.length > 0 && (
  <div>
    <h3 className="text-lg font-semibold mb-3">Assignments</h3>
    <div className="space-y-4">
      {selectedContent.assignments.map((assignment, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
          <div className="flex gap-2 mt-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
              {assignment.type}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {assignment.difficulty}
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
              {assignment.totalPoints} pts
            </span>
          </div>

          {/* Questions section */}
          {assignment.questions && assignment.questions.length > 0 && (
            <details className="mt-3">
              <summary className="cursor-pointer font-semibold text-blue-600">
                View Questions
              </summary>
              <ul className="mt-2 ml-4 list-disc space-y-2">
                {assignment.questions.map((q, i) => (
                  <li key={i} className="text-sm text-gray-800">
                    <p><strong>Q{i + 1}:</strong> {q.questionText}</p>

                    {/* Options if available */}
                    {q.options && q.options.length > 0 && (
                      <ul className="ml-5 list-decimal text-gray-700">
                        {q.options.map((opt, j) => (
                          <li key={j}>{opt}</li>
                        ))}
                      </ul>
                    )}

                    <p className="mt-1"><strong>Answer:</strong> {q.correctAnswer}</p>
                    <p className="text-gray-600"><strong>Explanation:</strong> {q.explanation}</p>
                    <hr className="my-2" />
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      ))}
    </div>
  </div>
)}

              {/* Flashcards */}
              {selectedContent.flashcards && selectedContent.flashcards.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Flashcards</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedContent.flashcards.map((flashcard, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-900 mb-2">{flashcard.front}</p>
                        <p className="text-sm text-gray-600">{flashcard.back}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              {selectedContent.summaries && selectedContent.summaries.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Summary</h3>
                  {selectedContent.summaries.map((summary, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{summary.title}</h4>
                      <p className="text-gray-700 mb-3">{summary.content}</p>
                      {summary.keyPoints && summary.keyPoints.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                          {summary.keyPoints.map((point, i) => (
                            <li key={i}>{point}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyContent;