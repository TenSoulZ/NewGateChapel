import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import SEO from '../../components/common/SEO';
import { motion } from 'framer-motion';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await register(email, password);
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.message || 'Registration failed');
        setIsSubmitting(false);
      }
    } catch (err) {
      setError('An error occurred during registration');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-register-page min-vh-100 d-flex align-items-center py-5" style={{ 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
    }}>
      <SEO title="Admin Setup" />
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
                      ⚙️
                    </div>
                    <h2 className="fw-bold h3 mb-2">Admin Setup</h2>
                    <p className="text-white opacity-50 small">Create your master admin account</p>
                  </div>

                  {error && (
                    <Alert variant="danger" className="border-0 bg-danger bg-opacity-20 text-white small py-2 mb-4">
                      {error}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-bold opacity-75">Admin Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border-white border-opacity-10 text-white placeholder-white placeholder-opacity-25 py-3 rounded-3 shadow-none"
                        placeholder="your@email.com"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-bold opacity-75">Master Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border-white border-opacity-10 text-white placeholder-white placeholder-opacity-25 py-3 rounded-3 shadow-none"
                        placeholder="••••••••"
                      />
                    </Form.Group>

                    <Form.Group className="mb-5">
                      <Form.Label className="small fw-bold opacity-75">Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                      style={{ background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)' }}
                    >
                      {isSubmitting ? 'Setting up...' : 'Complete Setup'}
                    </Button>
                  </Form>
                  
                  <p className="text-center mt-4 small text-white opacity-50">
                    This account will be stored locally on this machine.
                  </p>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
