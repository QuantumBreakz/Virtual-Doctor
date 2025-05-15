import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  Home, 
  Pill, 
  Stethoscope, 
  MessageSquare, 
  Heart, 
  Wrench,
  LayoutDashboard,
  Bell,
  Search,
  Menu,
  X,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Appointment Reminder', message: 'Dr. Johnson tomorrow at 10 AM' },
    { id: 2, title: 'Medicine Reminder', message: 'Time to take your evening medication' }
  ]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user,logout } = useAuth();
  // alert(user);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
        setNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/medicine-description', icon: Pill, label: 'Medicine' },
    { path: '/diagnose', icon: Stethoscope, label: 'Diagnose' },
    { path: '/chat', icon: MessageSquare, label: 'AI Chat' },
    { path: '/emotions', icon: Heart, label: 'Emotions' },
    { path: '/tools', icon: Wrench, label: 'Tools' },
  ];

  const handleProfileClick = () => {
    setProfileDropdownOpen(false);
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    setProfileDropdownOpen(false);
    navigate('/settings');
  };

  const handleSignOut = () => {
    setProfileDropdownOpen(false);
    logout();
    
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 backdrop-blur-lg bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Stethoscope className="w-8 h-8 text-green-500" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Virtual<span className="text-green-500">Doctor</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                icon={<item.icon className="w-5 h-5" />}
                label={item.label}
                active={location.pathname === item.path}
              />
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <motion.div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <Search className="w-5 h-5" />
              </button>
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4"
                  >
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Notifications */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <AnimatePresence>
                {notificationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                  >
                    <div className="p-4 border-b dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {notification.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {/* {user ? user.fullName.split(' ').map(n => n[0]).join('') : '?'} */}
                    {user &&<p>{user[0].toUpperCase() }</p> }
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2"
                  >
                    <ProfileDropdownItem
                      icon={<User className="w-4 h-4" />}
                      label="Profile"
                      onClick={handleProfileClick}
                    />
                    <ProfileDropdownItem
                      icon={<Settings className="w-4 h-4" />}
                      label="Settings"
                      onClick={handleSettingsClick}
                    />
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                    <ProfileDropdownItem
                      icon={<LogOut className="w-4 h-4" />}
                      label="Sign Out"
                      onClick={handleSignOut}
                      className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-800"
          >
            <nav className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    location.pathname === item.path
                      ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const NavLink: React.FC<{
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}> = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
      active
        ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

const ProfileDropdownItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}> = ({ icon, label, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${className}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default Header;