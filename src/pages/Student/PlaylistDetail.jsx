import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeftIcon,
  PlayIcon,
  TrashIcon,
  ExternalLinkIcon
} from '@heroicons/react/outline';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const PlaylistDetail = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
          const response = await axios.get(`http://localhost:5000/api/youtube/get-playlists/${storedUserId}`);
          const foundPlaylist = response.data.playlists.find(p => p._id === playlistId);
          if (foundPlaylist) {
            setPlaylist(foundPlaylist);
          }
        }
      } catch (err) {
        console.error('Error fetching playlist:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      try {
        await axios.delete(`http://localhost:5000/api/youtube/delete-playlist/${userId}/${playlistId}`);
        navigate('/student/playlist-manager');
      } catch (err) {
        console.error('Error deleting playlist:', err);
        alert('Failed to delete playlist');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Playlist not found</h2>
        <button
          onClick={() => navigate('/student/playlist-manager')}
          className="btn-primary"
        >
          Back to Playlists
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/student/playlist-manager')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{playlist.title}</h1>
            <p className="text-gray-600 mt-1">{playlist.description || 'No description'}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleDelete}
            className="p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Playlist Info */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 mb-8 text-white">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-primary-100 text-sm font-medium">Videos</p>
            <p className="text-4xl font-bold mt-2">{playlist.videoCount || 0}</p>
          </div>
          <div>
            <p className="text-primary-100 text-sm font-medium">Created</p>
            <p className="text-lg font-bold mt-2">
              {new Date(playlist.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Topics */}
      {playlist.topics && playlist.topics.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Topics Covered</h3>
          <div className="flex flex-wrap gap-2">
            {playlist.topics.map((topic, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Videos */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Videos in this Playlist</h3>
        
        {playlist.videos && playlist.videos.length > 0 ? (
          <div className="space-y-4">
            {playlist.videos.map((video, index) => (
              <div
                key={video.id || index}
                className="card hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start gap-6">
                  {/* Thumbnail */}
                  {video.id ? (
                    <a
                      href={`https://www.youtube.com/watch?v=${video.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 group relative"
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-40 h-24 object-cover rounded-lg group-hover:opacity-75 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg bg-black bg-opacity-40">
                        <PlayIcon className="h-8 w-8 text-white" />
                      </div>
                    </a>
                  ) : (
                    <div className="w-40 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-500 text-sm">No video</span>
                    </div>
                  )}

                  {/* Video Info */}
                  <div className="flex-1 py-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                          {video.title || 'Video not found'}
                        </h4>
                        <p className="text-gray-600 text-sm mb-2">
                          {video.channel || 'Unknown channel'}
                        </p>
                        <p className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {video.topic}
                        </p>
                      </div>

                      {/* Watch Button */}
                      {video.id && (
                        <a
                          href={`https://www.youtube.com/watch?v=${video.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 btn-primary flex items-center space-x-2 text-sm px-4 py-2 whitespace-nowrap"
                        >
                          <PlayIcon className="h-4 w-4" />
                          <span>Watch</span>
                          <ExternalLinkIcon className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No videos in this playlist</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;