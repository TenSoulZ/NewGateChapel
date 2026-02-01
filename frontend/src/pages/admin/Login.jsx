/**
 * Admin Login Component - Authentication page for admin panel
 * 
 * Features:
 * - Username or email login support
 * - Password authentication
 * - Automatic redirect after successful login
 * - Error message display for failed attempts
 * - Glassmorphism dark theme design
 * - Loading state during authentication
 * - Auto-redirect to register if no admin account exists
 * 
 * Authentication Flow:
 * 1. User submits credentials
 * 2. useAuth hook handles login via API
 * 3. JWT tokens stored in localStorage
 * 4. Redirect to intended page (or dashboard)
 * 
 * @component
 */

import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import SEO from '../../components/common/SEO';
import { motion } from 'framer-motion';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, hasAdminAccount, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect path after successful login
  const from = location.state?.from?.pathname || '/admin/dashboard';

  /**
   * Redirects to register page if no admin account exists.
   */
  React.useEffect(() => {
    if (!loading && !hasAdminAccount) {
      navigate('/admin/register');
    }
  }, [hasAdminAccount, loading, navigate]);

  /**
   * Handles login form submission.
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    const result = await login(identifier, password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-login-page min-vh-100 d-flex align-items-center py-5" style={{ 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
    }}>
      <SEO title="Admin Login" />
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="glass-panel border-white border-opacity-10 text-white shadow-2xl p-4">
                <Card.Body>
                  <div className="text-center mb-5">
                    <div 
                      className="bg-gradient-logo-full rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center shadow-lg"
                      style={{ width: '80px', height: '80px', fontSize: '2rem' }}
                    >
                      🛡️
                    </div>
                    <h2 className="fw-bold h3 mb-2">Admin Portal</h2>
                    <p className="text-white opacity-50 small">Enter your credentials to manage the chapel</p>
                  </div>

                  {error && (
                    <Alert variant="danger" className="border-0 bg-danger bg-opacity-20 text-white small py-2 mb-4">
                      {error}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-bold opacity-75">Username or Email</Form.Label>
                      <Form.Control
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                        className="border-white border-opacity-10 text-white placeholder-white placeholder-opacity-25 py-3 rounded-3 shadow-none"
                        placeholder="admin or admin@newgatechapel.org"
                      />
                    </Form.Group>

                    <Form.Group className="mb-5">
                      <Form.Label className="small fw-bold opacity-75">Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border-white border-opacity-10 text-white placeholder-white placeholder-opacity-25 py-3 rounded-3 shadow-none"
                        placeholder="••••••••"
                      />
                    </Form.Group>

                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="w-100 py-3 rounded-pill fw-bold shadow-lg border-0 bg-gradient-to-r"
                      disabled={isSubmitting}
                      style={{ background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)' }}
                    >
                      {isSubmitting ? 'Verifying...' : 'Sign In'}
                    </Button>
                  </Form>
                  
                  <div className="text-center mt-5">
                    <Button 
                      variant="link" 
                      className="text-white opacity-50 text-decoration-none small"
                      onClick={() => navigate('/')}
                    >
                      ← Back to Website
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
