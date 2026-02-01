/**
 * Header Component - Main navigation bar
 * 
 * Features:
 * - Fixed-top glassmorphism navbar
 * - Logo with SVG fallback to icon
 * - Organized dropdown menus:
 *   - Visit Us (About, Services, Contact)
 *   - Watch (Live Stream, Sermons)
 *   - Get Involved (Ministries, Prayer, Giving)
 * - Responsive mobile menu
 * - Icon-enhanced navigation links
 * 
 * @component
 */

import React from 'react'
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { 
  FaHome, 
  FaInfoCircle, 
  FaChurch, 
  FaPlay, 
  FaCalendarAlt, 
  FaUsers, 
  FaHeart, 
  FaPhone, 
  FaVideo, 
  FaPray,
  FaHandsHelping 
} from 'react-icons/fa'

const Header = () => {
  return (
    <Navbar expand="lg" className="navbar-glass fixed-top shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src="/newgatechapellogo.svg"
            alt="New Gate Chapel Logo"
            height="55"
            className="me-2 navbar-logo"
            onError={(e) => {
              // Fallback to icon + text if SVG fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'inline';
            }}
          />
          <span className="d-none">
            <FaChurch className="me-2 text-primary" />
          </span>
          New Gate Chapel
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              <FaHome className="me-1" />
              Home
            </Nav.Link>

            <NavDropdown 
              title={
                <span>
                  <FaChurch className="me-1" />
                  Visit Us
                </span>
              } 
              id="visit-dropdown"
            >
              <NavDropdown.Item as={Link} to="/about">
                <FaInfoCircle className="me-1" />
                About Us
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/services">
                <FaChurch className="me-1" />
                Service Times
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/contact">
                <FaPhone className="me-1" />
                Contact
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown 
              title={
                <span>
                  <FaPlay className="me-1" />
                  Watch
                </span>
              } 
              id="watch-dropdown"
            >
              <NavDropdown.Item as={Link} to="/live">
                <FaVideo className="me-1" />
                Live Stream
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/sermons">
                <FaPlay className="me-1" />
                Sermon Archive
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} to="/events">
              <FaCalendarAlt className="me-1" />
              Events
            </Nav.Link>

            <NavDropdown 
              title={
                <span>
                  <FaHandsHelping className="me-1" />
                  Get Involved
                </span>
              } 
              id="involved-dropdown"
            >
              <NavDropdown.Item as={Link} to="/ministries">
                <FaUsers className="me-1" />
                Ministries
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/prayer">
                <FaPray className="me-1" />
                Prayer Request
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/giving">
                <FaHeart className="me-1" />
                Giving
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
