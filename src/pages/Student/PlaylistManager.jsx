import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const PlaylistManager = () => {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');

  // Fetch user's playlists on component mount
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
          const response = await axios.get(`http://localhost:5000/api/youtube/get-playlists/${storedUserId}`);
          setPlaylists(response.data.playlists || []);
        }
      } catch (err) {
        console.error('Error fetching playlists:', err);
        setPlaylists([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

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

  const handleDeletePlaylist = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/youtube/delete-playlist/${userId}/${selectedPlaylist._id}`);
      setPlaylists(prev => prev.filter(p => p._id !== selectedPlaylist._id));
      setShowDeleteModal(false);
      setSelectedPlaylist(null);
    } catch (err) {
      console.error('Error deleting playlist:', err);
      alert('Failed to delete playlist');
    }
  };

  const handleRenamePlaylist = async () => {
    try {
      await axios.put(`http://localhost:5000/api/youtube/update-playlist/${userId}/${selectedPlaylist._id}`, {
        title: newPlaylistTitle
      });
      setPlaylists(prev => prev.map(p => 
        p._id === selectedPlaylist._id ? { ...p, title: newPlaylistTitle } : p
      ));
      setShowRenameModal(false);
      setSelectedPlaylist(null);
      setNewPlaylistTitle('');
    } catch (err) {
      console.error('Error updating playlist:', err);
      alert('Failed to update playlist');
    }
  };

  const toggleBookmark = async (playlistId) => {
    const playlist = playlists.find(p => p._id === playlistId);
    try {
      await axios.put(`http://localhost:5000/api/youtube/update-playlist/${userId}/${playlistId}`, {
        isBookmarked: !playlist.isBookmarked
      });
      setPlaylists(prev => prev.map(p => 
        p._id === playlistId ? { ...p, isBookmarked: !p.isBookmarked } : p
      ));
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
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
          {playlists.length} playlists • {playlists.reduce((acc, p) => acc + (p.videoCount || 0), 0)} videos
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="card text-center py-12">
          <LoadingSpinner size="xl" className="mb-4" />
          <p className="text-gray-600">Loading your playlists...</p>
        </div>
      ) : (
        <>

          {/* Playlists Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPlaylists.map((playlist) => (
              <div key={playlist._id} className="card group hover:scale-105 transition-all duration-200">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-200 rounded-xl mb-4 overflow-hidden">
                  <img
                    src={playlist.thumbnail || 'https://images.pexels.com/photos/733852/pexels-photo-733852.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={playlist.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    
                  </div>
                  
                  {/* Actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleBookmark(playlist._id)}
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
                    <p className="text-gray-600 text-sm line-clamp-2">{playlist.description || 'No description'}</p>
                  </div>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-1">
                    {playlist.topics && playlist.topics.slice(0, 3).map((topic, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{playlist.videoCount || 0} videos</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4">
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
                    <button
                      onClick={() => navigate(`/student/playlist/${playlist._id}`)}
                      className="btn-primary text-sm py-2 px-4 flex items-center space-x-2"
                    >
                      <PlayIcon className="h-4 w-4" />
                      <span>Continue Learning</span>
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
        </>
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