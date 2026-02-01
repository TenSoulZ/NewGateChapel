import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaHome, FaChurch } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            <div className="glass-panel text-center p-5">
              {/* Large 404 with gradient */}
              <div className="mb-4">
                <h1 className="text-gradient" style={{ fontSize: '8rem', fontWeight: 'bold', lineHeight: 1, marginBottom: '0' }}>
                  404
                </h1>
              </div>

              {/* Church Icon */}
              <div className="mb-4">
                <FaChurch className="text-primary" style={{ fontSize: '4rem', opacity: 0.7 }} />
              </div>

              {/* Error Message */}
              <h2 className="mb-3">Page Not Found</h2>
              <p className="lead mb-4 text-muted">
                We couldn't find the page you're looking for. It may have been moved or doesn't exist.
              </p>

              {/* Action Buttons */}
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Button 
                  as={Link} 
                  to="/" 
                  variant="primary" 
                  size="lg"
                  className="d-flex align-items-center gap-2"
                >
                  <FaHome />
                  Go to Homepage
                </Button>
                <Button 
                  as={Link} 
                  to="/contact" 
                  variant="outline-primary" 
                  size="lg"
                >
                  Contact Us
                </Button>
              </div>

              {/* Helpful Links */}
              <div className="mt-5 pt-4 border-top">
                <p className="text-muted mb-3">
                  <small>You might be looking for:</small>
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Link to="/about" className="text-decoration-none">About</Link>
                  <span className="text-muted">•</span>
                  <Link to="/services" className="text-decoration-none">Services</Link>
                  <span className="text-muted">•</span>
                  <Link to="/ministries" className="text-decoration-none">Ministries</Link>
                  <span className="text-muted">•</span>
                  <Link to="/events" className="text-decoration-none">Events</Link>
                  <span className="text-muted">•</span>
                  <Link to="/live" className="text-decoration-none">Live Stream</Link>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotFound;
