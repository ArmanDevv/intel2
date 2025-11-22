import { useRef, useEffect } from 'react';
import { LogoutIcon } from '@heroicons/react/outline';

const UserMenu = ({ onClose }) => {
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleLogout = () => {
    localStorage.removeItem('user'); // remove logged-in user
    onClose();
    window.location.href = '/login'; // redirect to login page
  };

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-fade-in"
    >
      <button
        onClick={handleLogout}
        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center"
      >
        <LogoutIcon className="h-4 w-4 mr-3" />
        Sign Out
      </button>
    </div>
  );
};

export default UserMenu;
