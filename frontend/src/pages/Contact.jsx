/**
 * Contact Page Component - Contact form and church location information
 * 
 * Features:
 * - Contact form with validation and API submission
 * - Church location info (address, phone, email)
 * - Embedded Google Maps iframe
 * - Visit planning information
 * - Social media links
 * - Animated entry effects
 * 
 * Data Sources:
 * - Church contact info from `/api/church-info/`
 * - Form submissions to `/api/contact-messages/`
 * 
 * @component
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaTwitter, FaFacebook } from 'react-icons/fa';
import Hero from '../components/common/Hero';
import SEO from '../components/common/SEO';
import { motion } from 'framer-motion';
import api from '../services/api';

const Contact = () => {
  // State for church information with default fallback values
  const [churchInfo, setChurchInfo] = useState({
    address: 'Stand Number 15493, Figtree Road, Buckland Terraces, Harare',
    phone: '+263 71 233 2632',
    email: 'info@newgatechapel.org',
    facebook_url: 'https://www.facebook.com/profile.php?id=61557353668205',
    twitter_url: 'https://x.com/newgatechapel1?s=11'
  });

  /**
   * Fetches church contact information on component mount.
   * Falls back to default values if API call fails.
   */
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const infoData = await api.getChurchInfo();
        const info = (infoData?.results || infoData || [])[0];
        if (info) {
          setChurchInfo(info);
        }
      } catch (error) {
        // Silent fail - default contact info will be used
      }
    };
    fetchInfo();
  }, []);

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handles form input changes.
   * Updates form data state as user types.
   */
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  /**
   * Handles contact form submission.
   * 
   * On success:
   * - Displays success message
   * - Clears form fields
   * 
   * On error:
   * - Displays user-friendly error message
   * - Preserves form data for retry
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      await api.submitContactForm(formData);
      setStatus({ 
        type: 'success', 
        message: 'Your message has been sent successfully. We will get back to you soon!' 
      });
      // Clear form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      // Extract meaningful error message from API response
      const errorMessage = error.response?.data?.detail || 
                         error.response?.data?.message || 
                         'Could not connect to the server. Please try again later.';
      setStatus({ type: 'danger', message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };


  /**
   * Contact information cards displayed at top of page.
   * Data pulled from churchInfo state.
   */
  const contactInfo = [
    {
      icon: <FaMapMarkerAlt size={30} />,
      title: 'Address',
      content: churchInfo.address
    },
    {
      icon: <FaPhone size={30} />,
      title: 'Phone',
      content: churchInfo.phone
    },
    {
      icon: <FaEnvelope size={30} />,
      title: 'Email',
      content: churchInfo.email
    }
  ];

  return (
    <>
      <SEO 
        title="Contact Us" 
        description="Get in touch with New Gate Chapel. Reach out with any questions, prayer requests, or to plan your visit."
      />
      <Hero
        subtitle="Get in Touch"
        title={
          <>
            Contact <span className="text-warning">Us</span>
          </>
        }
        description="We'd love to hear from you! Reach out with any questions or to plan your visit."
        backgroundGradient="linear-gradient(135deg, #E60012 0%, #A0025C 50%, #6B1B7F 100%)"
      />

      {/* Contact Info Section */}
      <section className="section-padding bg-light">
        <Container>
          <Row className="g-4">
            {contactInfo.map((info, index) => (
              <Col key={index} md={6} lg={3}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-100 border-0 glass-panel text-center p-4 hover-lift">
                    <Card.Body>
                      <div className="text-primary mb-4 p-3 d-inline-block rounded-circle bg-white shadow-sm">
                        {info.icon}
                      </div>
                      <Card.Title className="h5 fw-bold mb-3">{info.title}</Card.Title>
                      <Card.Text className="text-muted small">
                        {info.content}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Contact Form Section */}
      <section className="section-padding">
        <Container>
          <Row className="g-5">
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="display-6 fw-bold mb-4">
                  Send Us a <span className="text-gradient">Message</span>
                </h2>
                <p className="lead text-muted mb-4">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>

                {status.message && (
                  <Alert variant={status.type} className="mb-4">
                    {status.message}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Your name"
                          disabled={isSubmitting}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Email *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="your.email@example.com"
                          disabled={isSubmitting}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+263 71 233 2632"
                          disabled={isSubmitting}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>Subject *</Form.Label>
                        <Form.Control
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          placeholder="What is this regarding?"
                          disabled={isSubmitting}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>Message *</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          placeholder="Your message..."
                          disabled={isSubmitting}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Button 
                        variant="primary" 
                        type="submit" 
                        size="lg" 
                        className="w-100 rounded-pill"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </Col>
                  </Row>
                </Form>

              </motion.div>
            </Col>

            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="glass-panel p-4 mb-4">
                  <h4 className="fw-bold mb-3">Visit Us</h4>
                  <p className="text-muted mb-3">
                    We'd love to welcome you in person! Our church is located near Pomona, 
                    in the Buckland Terrace area.
                  </p>
                  <div className="ratio ratio-16x9 rounded overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d3801.2212260371257!2d31.07854900631711!3d-17.687006447479273!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sFigtree%20Road%2C%20Buckland%20Terraces%2C%20Grace%20Park%2C%20Harare!5e0!3m2!1sen!2sus!4v1768924049656!5m2!1sen!2sus"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Church Location Map"
                    ></iframe>
                  </div>
                </div>

                <div className="glass-panel p-4">
                  <h4 className="fw-bold mb-3">Plan Your Visit</h4>
                  <p className="text-muted mb-3">
                    First time visiting? Here's what you need to know:
                  </p>
                  <ul className="text-muted">
                    <li className="mb-2">Arrive 15 minutes early to find parking and get settled</li>
                    <li className="mb-2">Dress casually - come as you are!</li>
                    <li className="mb-2">Kids programs available for all ages</li>
                    <li className="mb-2">Free coffee and refreshments in the lobby</li>
                    <li className="mb-2">Services last approximately 90 minutes</li>
                  </ul>
                </div>

                <div className="glass-panel p-4 mt-4">
                  <h4 className="fw-bold mb-3">Follow Us</h4>
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-center gap-3">
                      {churchInfo.facebook_url && (
                        <a href={churchInfo.facebook_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                          <FaFacebook />
                        </a>
                      )}
                      {churchInfo.twitter_url && (
                        <a href={churchInfo.twitter_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                          <FaTwitter />
                        </a>
                      )}
                      <span className="text-muted fw-bold">New Gate Chapel</span>
                    </div>
                    <hr className="my-1 border-white border-opacity-10" />
                    <div className="d-flex flex-column gap-2">
                      <p className="small text-muted mb-1">Affiliated Links:</p>
                      <a href="https://x.com/pemakarimayi?s=11" target="_blank" rel="noopener noreferrer" className="text-decoration-none d-flex align-items-center gap-2 text-primary hover-opacity-100">
                        <FaTwitter /> Pastor Erasmus Makarimayi
                      </a>
                      <a href="https://x.com/creation_daily?s=11" target="_blank" rel="noopener noreferrer" className="text-decoration-none d-flex align-items-center gap-2 text-primary hover-opacity-100">
                        <FaTwitter /> Creation Daily
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Contact;
