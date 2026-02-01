import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { FaPray, FaHeart, FaUserShield, FaHandsHelping, FaQuoteLeft } from 'react-icons/fa';
import Hero from '../components/common/Hero';
import SEO from '../components/common/SEO';
import { motion } from 'framer-motion';

const PrayerRequest = () => {
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    requestType: 'personal',
    isConfidential: false,
    prayerRequest: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    // Simulated submission - on cPanel this could use a similar PHP backend as contact form
    setTimeout(() => {
      setStatus({ 
        type: 'success', 
        message: 'Your prayer request has been received. Our prayer team will be standing with you in faith.' 
      });
      setIsSubmitting(false);
      setFormData({
        name: '', email: '', phone: '', requestType: 'personal',
        isConfidential: false, prayerRequest: ''
      });
    }, 2000);
  };

  const requestTypes = [
    { value: 'personal', label: 'Personal Prayer' },
    { value: 'family', label: 'Family Prayer' },
    { value: 'healing', label: 'Healing Prayer' },
    { value: 'guidance', label: 'Guidance' },
    { value: 'thanksgiving', label: 'Thanksgiving' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <>
      <SEO 
        title="Submit a Prayer Request" 
        description="We believe in the power of prayer. Submit your request and our prayer team will stand with you in faith."
      />
      <Hero
        subtitle="Standing Together"
        title={
          <>
            Submit a <span className="text-warning">Prayer Request</span>
          </>
        }
        description="We believe in the power of prayer. Our prayer team is dedicated to standing with you in faith for your needs and concerns."
        backgroundGradient="linear-gradient(135deg, #00D4FF 0%, #0088BF 50%, #003D7A 100%)"
      />

      {/* Info Cards */}
      <section className="section-padding bg-light">
        <Container>
          <Row className="g-4 mb-5">
            <Col md={4}>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Card className="glass-panel p-4 text-center h-100 border-0 shadow-sm hover-lift">
                  <Card.Body>
                    <div className="text-primary mb-4 p-3 d-inline-block rounded-circle bg-white shadow-sm">
                      <FaUserShield size={36} />
                    </div>
                    <h5 className="fw-bold mb-3">Confidential</h5>
                    <p className="text-muted small mb-0">Your requests can be kept private between you and our pastoral team.</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={4}>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                <Card className="glass-panel p-4 text-center h-100 border-0 shadow-sm hover-lift">
                  <Card.Body>
                    <div className="text-primary mb-4 p-3 d-inline-block rounded-circle bg-white shadow-sm">
                      <FaHandsHelping size={36} />
                    </div>
                    <h5 className="fw-bold mb-3">Community Support</h5>
                    <p className="text-muted small mb-0">Our dedicated prayer chain is ready to lift you up in prayer daily.</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={4}>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                <Card className="glass-panel p-4 text-center h-100 border-0 shadow-sm hover-lift">
                  <Card.Body>
                    <div className="text-primary mb-4 p-3 d-inline-block rounded-circle bg-white shadow-sm">
                      <FaHeart size={36} />
                    </div>
                    <h5 className="fw-bold mb-3">God Hears</h5>
                    <p className="text-muted small mb-0">Believe that God is listening and cares deeply about your situation.</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>

          <Row className="g-5 align-items-center">
            <Col lg={5}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="display-6 fw-bold mb-4">How Can We <span className="text-gradient">Pray For You?</span></h2>
                <p className="text-muted mb-4 lead" style={{ fontSize: '1.1rem' }}>
                  "Let us then approach God's throne of grace with confidence, so that we may receive 
                  mercy and find grace to help us in our time of need." - Hebrews 4:16
                </p>
                <div className="mb-4 glass-panel p-4 border-primary border-opacity-10">
                  <FaQuoteLeft className="text-primary opacity-25 mb-3" size={30} />
                  <p className="fst-italic text-muted mb-0">
                    We take every request seriously. No concern is too small or too large for God. 
                    Whether it's a personal struggle, a health issue, or a shout of thanksgiving, 
                    we are here to stand with you.
                  </p>
                </div>
              </motion.div>
            </Col>
            
            <Col lg={7}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-lg overflow-hidden glass-panel bg-white">
                  <Card.Body className="p-4 p-lg-5">
                    {status.message && (
                      <Alert variant={status.type} className="mb-4 shadow-sm border-0">
                        <FaPray className="me-2" /> {status.message}
                      </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="prayerName">
                            <Form.Label className="small fw-bold">Name</Form.Label>
                            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required autoComplete="name" disabled={isSubmitting} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="prayerEmail">
                            <Form.Label className="small fw-bold">Email</Form.Label>
                            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="email" disabled={isSubmitting} />
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <Form.Group className="mb-3" controlId="prayerType">
                            <Form.Label className="small fw-bold">Type of Request</Form.Label>
                            <Form.Select name="requestType" value={formData.requestType} onChange={handleChange} required disabled={isSubmitting}>
                              {requestTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <Form.Group className="mb-3" controlId="prayerRequestContent">
                            <Form.Label className="small fw-bold">Your Prayer Request</Form.Label>
                            <Form.Control as="textarea" rows={4} name="prayerRequest" value={formData.prayerRequest} onChange={handleChange} required placeholder="Tell us how we can pray..." autoComplete="off" disabled={isSubmitting} />
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <Form.Group className="mb-4" controlId="prayerConfidential">
                            <Form.Check type="checkbox" id="prayerConfidentialCheck" name="isConfidential" checked={formData.isConfidential} onChange={handleChange} label={<small className="text-muted">Keep this request confidential (pastoral team only)</small>} disabled={isSubmitting} />
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <Button variant="primary" type="submit" size="lg" className="w-100 rounded-pill py-3 fw-bold shadow" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default PrayerRequest;
