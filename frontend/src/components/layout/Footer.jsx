import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

import { Link } from 'react-router-dom';


const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-auto">
      <Container>
        <Row className="g-4">
          {/* About Section */}
          <Col lg={4} md={6}>
            <h5 className="text-white mb-3 fw-bold">New Gate Chapel</h5>
            <p className="text-white-50">
              A vibrant community of believers dedicated to worship, fellowship, and spiritual growth.
            </p>
              <a href="https://www.youtube.com/@pastorerasmusmakarimayi1069" target="_blank" rel="noopener noreferrer" className="text-white fs-4" aria-label="YouTube" style={{ transition: 'color 0.2s' }}>
                <FaYoutube size={24} />
              </a>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={6}>
            <h5 className="mb-3 text-white fw-bold">Navigate</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className="text-white-50 text-decoration-none">Home</Link></li>
              <li className="mb-2"><Link to="/about" className="text-white-50 text-decoration-none">About Us</Link></li>
              <li className="mb-2"><Link to="/ministries" className="text-white-50 text-decoration-none">Ministries</Link></li>
              <li className="mb-2"><Link to="/giving" className="text-white-50 text-decoration-none">Giving</Link></li>
              <li className="mb-2"><Link to="/admin/login" className="text-white-50 text-decoration-none small opacity-50">Admin Portal</Link></li>
            </ul>
          </Col>

          {/* Media & Interaction */}
          <Col lg={3} md={6}>
            <h5 className="mb-3 text-white fw-bold">Connect</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/sermons" className="text-white-50 text-decoration-none">Sermons</Link></li>
              <li className="mb-2"><Link to="/live" className="text-white-50 text-decoration-none">Live Stream</Link></li>
              <li className="mb-2"><Link to="/prayer" className="text-white-50 text-decoration-none">Prayer Request</Link></li>
              <li className="mb-2"><Link to="/events" className="text-white-50 text-decoration-none">Next Events</Link></li>
            </ul>
          </Col>



          {/* Contact Info */}
          <Col lg={3} md={6}>
            <h5 className="mb-3 text-white fw-bold">Contact Us</h5>
            <ul className="list-unstyled text-white-50">
              <li className="mb-2">
                <FaMapMarkerAlt className="me-2" />
                Stand Number 15493, Figtree Road, Buckland Terraces, Harare
              </li>
              <li className="mb-2">
                <FaPhone className="me-2" />
                +263 71 233 2632
              </li>
              <li className="mb-2">
                <FaEnvelope className="me-2" />
                info@newgatechapel.org
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="my-4 border-secondary opacity-25" />

        <Row>
          <Col className="text-center text-white-50">
            <p className="mb-0">
              &copy; {currentYear} New Gate Chapel. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

