import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  DocumentTextIcon,
  CollectionIcon,
  BookmarkIcon,
  PlayIcon,
  TrendingUpIcon,
  ClockIcon
} from '@heroicons/react/outline';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const [stats, setStats] = useState({
    totalPlaylists: 0,
    totalVideos: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const storedUserId = localStorage.getItem('userId');
        if (!storedUserId) return;

        const res = await axios.get(`http://localhost:5000/api/youtube/get-playlists/${storedUserId}`);
        const playlists = res.data.playlists || [];

        const totalPlaylists = playlists.length;
        const totalVideos = playlists.reduce((acc, p) => {
          // Prefer explicit videoCount, otherwise count videos array
          const count = typeof p.videoCount === 'number' ? p.videoCount : (p.videos ? p.videos.length : 0);
          return acc + count;
        }, 0);

        setStats({ totalPlaylists, totalVideos });
      } catch (err) {
        console.error('Error fetching playlist stats:', err);
      }
    };

    fetchStats();
  }, []);

  const recentPlaylists = [
    {
      id: 1,
      title: 'Introduction to Machine Learning',
      videoCount: 15,
      progress: 68,
      lastWatched: '2 hours ago',
      thumbnail: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      title: 'React.js Fundamentals',
      videoCount: 12,
      progress: 85,
      lastWatched: '1 day ago',
      thumbnail: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      title: 'Data Structures & Algorithms',
      videoCount: 23,
      progress: 45,
      lastWatched: '3 days ago',
      thumbnail: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const quickActions = [
    {
      title: 'Parse New Syllabus',
      description: 'Upload and extract topics from your course syllabus',
      icon: DocumentTextIcon,
      link: '/syllabus',
      color: 'bg-blue-500'
    },
    {
      title: 'Browse Playlists',
      description: 'View and manage your learning playlists',
      icon: CollectionIcon,
      link: '/playlists',
      color: 'bg-green-500'
    }
  ];

  if (!user) return null; // prevent rendering before user is loaded

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-primary-100 text-lg">Ready to continue your learning journey?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl">
              <CollectionIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Playlists</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPlaylists}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl">
              <PlayIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total videos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVideos}</p>
            </div>
          </div>
        </div>

        {/* <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <BookmarkIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bookmarks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookmarks}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-xl">
              <ClockIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Study Hours</p>
              <p className="text-2xl font-bold text-gray-900">{stats.studyHours}</p>
            </div>
          </div>
        </div> */}
      </div>

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

      {/* Recent Playlists */}
      {/* <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Playlists</h2>
          <Link to="/playlists" className="text-primary-500 hover:text-primary-600 font-medium">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPlaylists.map((playlist) => (
            <div key={playlist.id} className="card group cursor-pointer">
              <div className="aspect-video bg-gray-200 rounded-xl mb-4 overflow-hidden">
                <img
                  src={playlist.thumbnail}
                  alt={playlist.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{playlist.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{playlist.videoCount} videos</p>
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
                <p className="text-xs text-gray-500">Last watched {playlist.lastWatched}</p>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default StudentDashboard;
