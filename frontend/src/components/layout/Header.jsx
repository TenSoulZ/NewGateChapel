import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  return (
    <Navbar 
      expand="lg" 
      className={`navbar-glass sticky-top ${scrolled ? 'scrolled' : ''}`}
      variant="light"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center gap-2">
          <img 
            src="/newgatechapellogo.svg" 
            alt="New Gate Chapel Logo" 
            height="45"
            style={{ objectFit: 'contain' }}
          />
          <span className="text-gradient d-none d-lg-inline">New Gate Chapel</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="main-navbar" />
        
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-lg-center">
            <Nav.Link as={Link} to="/" className={location.pathname === '/' ? 'active' : ''}>
              Home
            </Nav.Link>
            
            <Nav.Link as={Link} to="/about" className={location.pathname === '/about' ? 'active' : ''}>
              About
            </Nav.Link>

            <NavDropdown title="Worship" id="worship-dropdown" className={['/services', '/ministries'].includes(location.pathname) ? 'active' : ''}>
              <NavDropdown.Item as={Link} to="/services">Services</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/ministries">Ministries</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Media" id="media-dropdown" className={['/sermons', '/live'].includes(location.pathname) ? 'active' : ''}>
              <NavDropdown.Item as={Link} to="/sermons">Sermons</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/live">Live Stream</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Community" id="community-dropdown" className={['/events', '/prayer', '/giving'].includes(location.pathname) ? 'active' : ''}>
              <NavDropdown.Item as={Link} to="/events">Events</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/prayer">Prayer Request</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/giving">Giving</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
              Contact
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
