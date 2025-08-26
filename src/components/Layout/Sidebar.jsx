import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  DocumentTextIcon,
  CollectionIcon,
  CloudUploadIcon,
  FolderIcon,
  BookOpenIcon,
  AcademicCapIcon
} from '@heroicons/react/outline';

const Sidebar = () => {
  const { user } = useAuth();

  const studentNavItems = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Parse Syllabus', href: '/syllabus', icon: DocumentTextIcon },
    { name: 'My Playlists', href: '/playlists', icon: CollectionIcon },
  ];

  const teacherNavItems = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Upload Content', href: '/upload', icon: CloudUploadIcon },
    { name: 'My Resources', href: '/resources', icon: FolderIcon },
  ];

  const navItems = user?.role === 'student' ? studentNavItems : teacherNavItems;

  return (
    <div className="bg-white w-64 border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          {user?.role === 'student' ? (
            <BookOpenIcon className="h-8 w-8 text-primary-500" />
          ) : (
            <AcademicCapIcon className="h-8 w-8 text-primary-500" />
          )}
          <h1 className="text-xl font-bold text-gray-900">Intelliclass</h1>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
          <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;