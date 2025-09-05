import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FiBell, FiPlusCircle, FiMenu, FiX, FiCheck, FiAlertCircle, FiInfo } from 'react-icons/fi';
import styles from './NavigationBar.module.css'; // Make sure this import is working
import logo from '../assets/react.svg';
import { useUser, USER_ROLES } from '../context/UserContext';
import apiService from '../services/apiService';

const NavigationBar = () => {
  const { userRole, isManager, isMember } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const notificationRef = useRef(null);
  const location = useLocation();

  // Menu items based on role
  const getMenuItems = () => {
    const commonItems = [
      { to: '/', label: 'Overview' },
      { to: '/actions', label: 'Actions' },
      { to: '/status-timeline', label: 'Timeline' },
      { to: '/weekly-report', label: 'Weekly Report' }
    ];
    
    // Manager-specific items
    if (isManager) {
      return [
        ...commonItems,
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/member-ranking', label: 'Rankings' },
        { to: '/summary', label: 'Summary' }
      ];
    }
    
    return commonItems;
  };
  
  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.notifications.getAll();
        setNotifications(response.data);
        const unread = response.data.filter(notification => !notification.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Mock data for demonstration
    const mockNotifications = [
      {
        id: 1,
        title: 'New Objective Created',
        message: 'John created a new objective: Increase user engagement',
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        read: false,
        type: 'info'
      },
      {
        id: 2,
        title: 'Action Blocked',
        message: 'The "Implement user feedback form" action is now blocked',
        timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
        read: false,
        type: 'alert'
      },
      {
        id: 3,
        title: 'Weekly Report Generated',
        message: 'The weekly report for Team Alpha is now available',
        timestamp: new Date(Date.now() - 5 * 60 * 60000).toISOString(),
        read: true,
        type: 'success'
      }
    ];
    
    // Use mock data instead of API call for demo
    setNotifications(mockNotifications);
    const unread = mockNotifications.filter(notification => !notification.read).length;
    setUnreadCount(unread);
    
    // In a real app, you would use this:
    // fetchNotifications();
    
    // You might also want to set up a polling mechanism or WebSocket for real-time notifications
  }, []);
  
  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location.pathname]);
  
  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      // In a real app, you would call the API
      // await apiService.notifications.markAllAsRead();
      
      // Update local state
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true
      }));
      setNotifications(updatedNotifications);
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };
  
  // Handle clicking on a notification
  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      try {
        // In a real app, you would call the API
        // await apiService.notifications.markAsRead(notification.id);
        
        // Update local state
        const updatedNotifications = notifications.map(n => 
          n.id === notification.id ? { ...n, read: true } : n
        );
        setNotifications(updatedNotifications);
        setUnreadCount(prev => prev - 1);
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
    
    // Navigate or perform action based on notification type
    // This would depend on your application's requirements
    setShowNotifications(false);
  };
  
  // Format relative time for notifications
  const formatRelativeTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };
  
  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <FiCheck className={styles.notificationIcon} style={{ color: 'var(--status-on-track)' }} />;
      case 'alert':
        return <FiAlertCircle className={styles.notificationIcon} style={{ color: 'var(--status-blocked)' }} />;
      case 'info':
      default:
        return <FiInfo className={styles.notificationIcon} style={{ color: 'var(--primary-color)' }} />;
    }
  };
  
  return (
    <nav className={styles.navBar}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.navBrand}>
          <img src={logo} alt="Logo" className={styles.navLogo} />
          <h1 className={styles.brandTitle}>Constellation</h1>
        </Link>
        
        <button 
          className={styles.mobileMenuToggle}
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          aria-label="Toggle menu"
        >
          {showMobileMenu ? <FiX /> : <FiMenu />}
        </button>
        
        <ul className={`${styles.navLinks} ${showMobileMenu ? styles.navLinksVisible : ''}`}>
          {getMenuItems().map((item) => (
            <li key={item.to} className={styles.navItem}>
              <NavLink 
                to={item.to} 
                className={({ isActive }) => 
                  isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        
        <div className={styles.navActions}>
          <div ref={notificationRef} className={styles.navItem}>
            <button 
              className={styles.notificationBell}
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
            >
              <FiBell />
              {unreadCount > 0 && (
                <span className={styles.notificationCount}>{unreadCount}</span>
              )}
            </button>
            
            {/* Notifications dropdown */}
            <div className={`${styles.dropdownMenu} ${showNotifications ? styles.dropdownMenuVisible : ''}`}>
              <div className={styles.dropdownHeader}>
                <h3 className={styles.dropdownTitle}>Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    className={styles.markAllRead}
                    onClick={handleMarkAllAsRead}
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              
              <div className={styles.notificationList}>
                {notifications.length === 0 ? (
                  <div className={styles.emptyNotifications}>
                    {isLoading ? 'Loading...' : 'No notifications'}
                  </div>
                ) : (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={styles.notification}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      {getNotificationIcon(notification.type)}
                      {!notification.read && <div className={styles.unreadDot} />}
                      <div className={styles.notificationContent}>
                        <h4 className={styles.notificationTitle}>
                          {notification.title}
                        </h4>
                        <p className={styles.notificationMessage}>
                          {notification.message}
                        </p>
                        <span className={styles.notificationTime}>
                          {formatRelativeTime(notification.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          {/* Quick Add Button */}
          <button 
            className={styles.quickAddButton}
            onClick={() => setShowQuickAddModal(true)}
            aria-label="Quick add"
          >
            <FiPlusCircle />
          </button>
        </div>
      </div>
      
      {/* Quick Add Modal */}
      {showQuickAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowQuickAddModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Quick Add</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowQuickAddModal(false)}
                aria-label="Close"
              >
                <FiX />
              </button>
            </div>
            <div>
              {/* This would contain your action/objective creation form */}
              <p>Content for adding actions/objectives would go here.</p>
              <p>This would be connected to your action/objective creation functionality.</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
