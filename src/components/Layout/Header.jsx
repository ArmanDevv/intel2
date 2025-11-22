import { useState, useEffect } from 'react';
import UserMenu from './UserMenu';

const Header = () => {
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1 max-w-lg">
          <div className="relative w-full">
            
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
         
          
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="h-8 w-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || 'role'}</p>
              </div>
            </button>
            
            {showUserMenu && (
              <UserMenu onClose={() => setShowUserMenu(false)} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
