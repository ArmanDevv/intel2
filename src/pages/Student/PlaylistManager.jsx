import React, { useState } from 'react';
import {
  CollectionIcon,
  BookmarkIcon,
  TrashIcon,
  PencilIcon,
  PlayIcon,
  DotsVerticalIcon,
  SearchIcon,
  FilterIcon
} from '@heroicons/react/outline';
import Modal from '../../components/UI/Modal';

const PlaylistManager = () => {
  const [playlists, setPlaylists] = useState([
    {
      id: 1,
      title: 'Introduction to Machine Learning',
      description: 'Complete guide to ML fundamentals and algorithms',
      videoCount: 15,
      totalDuration: '4h 32m',
      progress: 68,
      isBookmarked: true,
      createdAt: '2024-01-15',
      thumbnail: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400',
      topics: ['Machine Learning', 'AI', 'Algorithms']
    },
    {
      id: 2,
      title: 'React.js Fundamentals',
      description: 'Master React components, hooks, and state management',
      videoCount: 12,
      totalDuration: '3h 15m',
      progress: 85,
      isBookmarked: false,
      createdAt: '2024-01-10',
      thumbnail: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400',
      topics: ['React', 'JavaScript', 'Web Development']
    },
    {
      id: 3,
      title: 'Data Structures & Algorithms',
      description: 'Essential DSA concepts for technical interviews',
      videoCount: 23,
      totalDuration: '6h 45m',
      progress: 45,
      isBookmarked: true,
      createdAt: '2024-01-08',
      thumbnail: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400',
      topics: ['Data Structures', 'Algorithms', 'Programming']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');

  const filteredPlaylists = playlists.filter(playlist => {
    const matchesSearch = playlist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         playlist.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
    
    switch (selectedFilter) {
      case 'bookmarked':
        return matchesSearch && playlist.isBookmarked;
      case 'completed':
        return matchesSearch && playlist.progress === 100;
      case 'in-progress':
        return matchesSearch && playlist.progress > 0 && playlist.progress < 100;
      default:
        return matchesSearch;
    }
  });

  const handleDeletePlaylist = () => {
    setPlaylists(prev => prev.filter(p => p.id !== selectedPlaylist.id));
    setShowDeleteModal(false);
    setSelectedPlaylist(null);
  };

  const handleRenamePlaylist = () => {
    setPlaylists(prev => prev.map(p => 
      p.id === selectedPlaylist.id ? { ...p, title: newPlaylistTitle } : p
    ));
    setShowRenameModal(false);
    setSelectedPlaylist(null);
    setNewPlaylistTitle('');
  };

  const toggleBookmark = (playlistId) => {
    setPlaylists(prev => prev.map(p => 
      p.id === playlistId ? { ...p, isBookmarked: !p.isBookmarked } : p
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Playlists</h1>
          <p className="text-gray-600 mt-1">Manage your learning playlists and track progress</p>
        </div>
        <div className="text-sm text-gray-500">
          {playlists.length} playlists • {playlists.reduce((acc, p) => acc + p.videoCount, 0)} videos
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search playlists or topics..."
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
              <option value="all">All Playlists</option>
              <option value="bookmarked">Bookmarked</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
            </select>
          </div>
        </div>
      </div>

      {/* Playlists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPlaylists.map((playlist) => (
          <div key={playlist.id} className="card group hover:scale-105 transition-all duration-200">
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gray-200 rounded-xl mb-4 overflow-hidden">
              <img
                src={playlist.thumbnail}
                alt={playlist.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <button className="bg-white bg-opacity-90 rounded-full p-3 hover:bg-opacity-100 transition-all">
                  <PlayIcon className="h-6 w-6 text-gray-900" />
                </button>
              </div>
              
              {/* Actions */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleBookmark(playlist.id)}
                    className={`p-2 rounded-lg backdrop-blur-sm ${
                      playlist.isBookmarked
                        ? 'bg-yellow-500 text-white'
                        : 'bg-white bg-opacity-80 text-gray-700 hover:bg-opacity-100'
                    } transition-all`}
                  >
                    <BookmarkIcon className="h-4 w-4" />
                  </button>
                  <div className="relative">
                    <button className="p-2 rounded-lg bg-white bg-opacity-80 text-gray-700 hover:bg-opacity-100 transition-all">
                      <DotsVerticalIcon className="h-4 w-4" />
                    </button>
                    {/* Dropdown would go here */}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
                  {playlist.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">{playlist.description}</p>
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-1">
                {playlist.topics.slice(0, 3).map((topic, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                    {topic}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{playlist.videoCount} videos</span>
                <span>{playlist.totalDuration}</span>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{playlist.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${playlist.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedPlaylist(playlist);
                      setNewPlaylistTitle(playlist.title);
                      setShowRenameModal(true);
                    }}
                    className="p-2 text-gray-500 hover:text-primary-500 transition-colors"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPlaylist(playlist);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
                <button className="btn-primary text-sm py-2 px-4">
                  Continue Learning
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPlaylists.length === 0 && (
        <div className="text-center py-12">
          <CollectionIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No playlists found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search or filter criteria.' : 'Create your first playlist by parsing a syllabus.'}
          </p>
        </div>
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Playlist"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete "{selectedPlaylist?.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleDeletePlaylist}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-xl transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Rename Modal */}
      <Modal
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        title="Rename Playlist"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Playlist Title
            </label>
            <input
              type="text"
              value={newPlaylistTitle}
              onChange={(e) => setNewPlaylistTitle(e.target.value)}
              className="input-field"
              placeholder="Enter new playlist title"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowRenameModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleRenamePlaylist}
              className="btn-primary"
              disabled={!newPlaylistTitle.trim()}
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PlaylistManager;