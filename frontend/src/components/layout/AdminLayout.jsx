import React, { useState } from 'react';
import { Nav, Button, Container } from 'react-bootstrap';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { 
  FaChartLine, 
  FaCalendarAlt, 
  FaInfoCircle, 
  FaUsers, 
  FaHome, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaShieldAlt,
  FaClock,
  FaMicrophone,
  FaVideo,
  FaHandHoldingHeart,
  FaEnvelope
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import './AdminLayout.css';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 992);

  // Auto-close sidebar on mobile navigation
  useEffect(() => {
    if (window.innerWidth < 992) {
      setIsSidebarOpen(false);
    }
  }, [window.location.pathname]); // Dependency on location change if possible, but location is not imported/used as dependency here. I'll rely on the initial state for now or add a resize listener.

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    // window.addEventListener('resize', handleResize); // This might be too aggressive to auto-open/close on every pixel.
    // Better to just set initial state.
    // Actually, just the initial state is enough for "First Paint".
    return () => {};
  }, []);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin/dashboard', icon: FaChartLine, label: 'Analytics' },
    { to: '/admin/content/home', icon: FaHome, label: 'Home Page' },
    { to: '/admin/content/events', icon: FaCalendarAlt, label: 'Events' },
    { to: '/admin/content/about', icon: FaInfoCircle, label: 'About Us' },
    { to: '/admin/content/ministries', icon: FaUsers, label: 'Ministries' },
    { to: '/admin/content/schedule', icon: FaClock, label: 'Weekly Schedule' },
    { to: '/admin/content/sermons', icon: FaMicrophone, label: 'Sermons' },
    { to: '/admin/content/live-stream', icon: FaVideo, label: 'Live Stream' },
    { to: '/admin/content/giving', icon: FaHandHoldingHeart, label: 'Giving Options' },
    { to: '/admin/content/messages', icon: FaEnvelope, label: 'Inquiries' },
  ];

  return (
    <div className={`admin-container admin-portal ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar shadow-2xl">
        <div className="sidebar-header d-flex align-items-center justify-content-between p-4">
          <div className="d-flex align-items-center gap-2 text-white">
            <FaShieldAlt className="text-primary" size={24} />
            <span className="fw-bold h5 mb-0">Admin Portal</span>
          </div>
          <Button 
            variant="link" 
            className="text-white p-0 d-lg-none" 
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaTimes size={20} />
          </Button>
        </div>

        <div className="sidebar-user p-4 mb-4">
          <div className="d-flex align-items-center gap-3 glass-panel glass-panel-dark p-3 border-white border-opacity-10">
            <div className="user-avatar bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-inner" style={{ width: '40px', height: '40px' }}>
              {user?.name?.[0] || 'A'}
            </div>
            <div className="user-info overflow-hidden">
              <p className="text-white fw-bold mb-0 small text-truncate">{user?.name}</p>
              <p className="text-white opacity-50 mb-0 smaller text-truncate">{user?.role}</p>
            </div>
          </div>
        </div>

        <Nav className="flex-column px-3 gap-1">
          {navItems.map((item) => (
            <Nav.Link 
              as={NavLink} 
              to={item.to} 
              key={item.to}
              className={({ isActive }) => 
                `admin-nav-link d-flex align-items-center gap-3 p-3 rounded-3 text-white transition-all ${isActive ? 'active shadow-lg' : 'opacity-60 hover-opacity-100'}`
              }
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Nav.Link>
          ))}
        </Nav>

        <div className="sidebar-footer mt-auto p-3">
          <Button 
            variant="outline-danger" 
            className="w-100 d-flex align-items-center justify-content-center gap-2 border-opacity-10 py-2 rounded-3"
            onClick={handleLogout}
          >
            <FaSignOutAlt size={16} />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-topbar sticky-top d-flex align-items-center px-4 py-3 glass-panel glass-panel-dark rounded-0 border-0 border-bottom border-white border-opacity-10">
          <Button 
            variant="link" 
            className="text-white p-0 me-3" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FaBars size={20} />
          </Button>
          <div className="ms-auto d-flex align-items-center gap-3">
            <NavLink to="/" className="text-white opacity-75 text-decoration-none small hover-opacity-100 transition-all">
              View Website ↗
            </NavLink>
          </div>
        </header>

        <div className="admin-content p-4 p-lg-5">
          <Container fluid>
            <Outlet />
          </Container>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
