/**
 * LiveStream Page Component - Live service streaming platform
 * 
 * Features:
 * - Hero section
 * - Conditional live stream player (shows when service is live)
 * - Next service information when stream is offline
 * - Email reminder modal for upcoming services
 * - Alternative platforms section (YouTube, Facebook)
 * - Recent streams archive section
 * 
 * Data Sources:
 * - Live stream status from `/api/livestream/`
 * - Service schedule from `/api/service-schedule/`
 * 
 * @component
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Modal, Form, Button as RBButton } from 'react-bootstrap';
import { FaVideo, FaCalendarAlt, FaClock, FaBell, FaYoutube, FaFacebook, FaPlay } from 'react-icons/fa';
import Hero from '../components/common/Hero';
import { motion } from 'framer-motion';
import api from '../services/api.js';
import { convertToEmbedUrl } from '../utils/urlUtils';

const LiveStream = () => {
  const [isLive, setIsLive] = useState(false);
  const [streamUrl, setStreamUrl] = useState('');
  const [nextService, setNextService] = useState({
    day: "Sunday Morning",
    time: "10:00 AM",
    title: "Sunday Worship Service",
  });
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [formData, setFormData] = useState({ email: '', phone: '', method: 'email' });
  const [submitted, setSubmitted] = useState(false);

  /**
   * Fetches live stream and schedule data on component mount.
   * Determines if stream is live and shows appropriate UI.
   */
  useEffect(() => {
    const fetchLiveStreamData = async () => {
      try {
        const [streamData, scheduleData] = await Promise.all([
            api.getLiveStream(),
            api.getSchedule()
        ]);

        // Process Live Stream
        const activeStream = (streamData.results || streamData || [])[0];
        if (activeStream) {
            const live = activeStream.status === 'live' || activeStream.is_live;
            setIsLive(live);
            setStreamUrl(convertToEmbedUrl(activeStream.embed_url || ''));
            
            if (activeStream.title) {
                setNextService({
                    title: activeStream.title,
                    day: activeStream.date || '',
                    time: activeStream.description || ''
                });
            } else {
                // Feature schedule fallback if no custom stream info
                const scheduleList = (scheduleData?.results || scheduleData || []);
                if (scheduleList.length > 0) {
                    const next = scheduleList[0];
                    setNextService({
                        day: next.day,
                        time: next.time,
                        title: next.type
                    });
                }
            }
        }
      } catch (error) {
        // Silent fail - default service info will be shown
      }
    };

    fetchLiveStreamData();
  }, []);

  /**
   * Handles reminder form submission.
   * Shows success message for 3 seconds then closes modal.
   */
  const handleReminder = (e) => {
    e.preventDefault();
    // TODO: Connect to backend API for reminder emails
    setSubmitted(true);
    setTimeout(() => {
      setShowReminderModal(false);
      setSubmitted(false);
    }, 3000);
  };

  return (
    <>
      <Hero
        subtitle="Join Us Online"
        title={
          <>
            Divine <span className="text-warning">Live Stream</span>
          </>
        }
        description="Experience our worship services and special events from anywhere in the world. Join our global family as we worship together in spirit and truth."
        backgroundGradient="linear-gradient(135deg, #E60012 0%, #C8102E 25%, #A0025C 50%, #6B1B7F 75%, #3C1053 100%)"
      />

      {/* Main Stream Section */}
      <section className="section-padding">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={10}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {isLive ? (
                  <div className="glass-panel p-4 p-lg-5 shadow-lg border-0">
                    <div className="d-flex align-items-center justify-content-center gap-3 mb-4 text-warning">
                        <span className="badge bg-danger pulse-dot-container"><span className="pulse-dot"></span> LIVE NOW</span>
                        <span className="fw-bold tracking-wider uppercase small text-dark">HAPPENING NOW</span>
                    </div>
                    
                    <h3 className="h2 fw-bold mb-4 text-dark">{nextService.title}</h3>

                    <div className="ratio ratio-16x9 shadow-lg rounded-3 overflow-hidden border border-white border-opacity-10 bg-dark">
                        <iframe
                          src={streamUrl}
                          title="Live Stream"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                          className="w-100 h-100 border-0"
                        ></iframe>
                    </div>
                    
                    <div className="mt-5 d-flex justify-content-center gap-3">
                        <RBButton variant="outline-danger" className="rounded-pill px-4" href="https://youtube.com" target="_blank">
                            <FaYoutube className="me-2" /> View on YouTube
                        </RBButton>
                        <RBButton variant="outline-primary" className="rounded-pill px-4" href="https://facebook.com" target="_blank">
                            <FaFacebook className="me-2" /> View on Facebook
                        </RBButton>
                    </div>
                  </div>
                ) : (
                  <div className="glass-panel p-0 overflow-hidden shadow-lg border-0">
                    <div 
                        className="text-center py-5 px-4 d-flex flex-column align-items-center justify-content-center text-white position-relative"
                        style={{ minHeight: '500px', background: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url("/Images/home/walkpic.jpg") center/cover' }}
                    >
                        <div className="mb-4">
                        <div className="rounded-circle bg-white bg-opacity-10 p-4 d-inline-block shadow-sm border border-white border-opacity-10">
                            <FaVideo size={50} className="text-white opacity-75" />
                        </div>
                        </div>
                        <h3 className="display-5 fw-bold mb-3">Next Live <span className="text-warning">Service</span></h3>
                        <p className="lead opacity-75 mb-5 fw-light">{nextService.title}</p>
                        
                        <Row className="g-4 mb-5 justify-content-center w-100" style={{ maxWidth: '500px' }}>
                        <Col xs={6}>
                            <div className="glass-panel py-4 bg-white bg-opacity-5 border-white border-opacity-10">
                            <FaCalendarAlt className="text-primary mb-3" size={24} />
                            <div className="small opacity-75 uppercase fw-bold mb-1 text-dark" style={{ letterSpacing: '1px' }}>SERVICE DAY</div>
                            <div className="h5 mb-0 fw-bold text-dark">{nextService.day}</div>
                            </div>
                        </Col>
                        <Col xs={6}>
                            <div className="glass-panel py-4 bg-white bg-opacity-5 border-white border-opacity-10">
                            <FaClock className="text-primary mb-3" size={24} />
                            <div className="small opacity-75 uppercase fw-bold mb-1 text-dark" style={{ letterSpacing: '1px' }}>SERVICE TIME</div>
                            <div className="h5 mb-0 fw-bold text-dark">{nextService.time}</div>
                            </div>
                        </Col>
                        </Row>
                        
                        <RBButton 
                        variant="primary" 
                        size="lg" 
                        className="rounded-pill px-5 shadow-lg fw-bold"
                        onClick={() => setShowReminderModal(true)}
                        >
                        <FaBell className="me-2" /> Notify Me
                        </RBButton>
                    </div>
                  </div>
                )}
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Alternative Platforms */}
      <section className="section-padding bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-6 fw-bold">Watch on <span className="text-gradient">Your Favorite Platform</span></h2>
              <p className="text-muted">We broadcast to multiple platforms for your convenience</p>
            </Col>
          </Row>
          <Row className="g-4 justify-content-center">
            <Col md={4}>
              <motion.div whileHover={{ y: -5 }}>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-decoration-none">
                  <div className="glass-panel p-4 text-center h-100 bg-white border-0 shadow-sm">
                    <FaYoutube size={40} className="text-danger mb-3" />
                    <h5 className="text-dark fw-bold">YouTube</h5>
                    <p className="text-muted small mb-0">Subscribe to get live notifications on your devices.</p>
                  </div>
                </a>
              </motion.div>
            </Col>
            <Col md={4}>
              <motion.div whileHover={{ y: -5 }}>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-decoration-none">
                  <div className="glass-panel p-4 text-center h-100 bg-white border-0 shadow-sm">
                    <FaFacebook size={40} className="text-primary mb-3" />
                    <h5 className="text-dark fw-bold">Facebook</h5>
                    <p className="text-muted small mb-0">Follow our page to join the conversation live.</p>
                  </div>
                </a>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Reminder Modal */}
      <Modal show={showReminderModal} onHide={() => setShowReminderModal(false)} centered>
        <div className="glass-panel p-0 border-0 overflow-hidden">
          <Modal.Header closeButton className="border-0 p-4 pb-0">
            <Modal.Title className="fw-bold">Set Reminder</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            {submitted ? (
              <Alert variant="success" className="border-0 shadow-sm">
                <FaBell className="me-2" /> Reminder set! We'll notify you.
              </Alert>
            ) : (
              <Form onSubmit={handleReminder}>
                <p className="text-muted mb-4 small">
                  We'll send you a link 15 minutes before the service starts.
                </p>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="name@example.com" 
                    required 
                    className="py-2"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </Form.Group>
                <RBButton variant="primary" type="submit" className="w-100 py-2 rounded-pill fw-bold">
                  Send My Reminder
                </RBButton>
              </Form>
            )}
          </Modal.Body>
        </div>
      </Modal>

      {/* Recent Services Short Section */}
      <section className="section-padding">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-5">
            <h2 className="display-6 fw-bold mb-0">Recent <span className="text-gradient">Streams</span></h2>
            <RBButton variant="outline-primary" className="rounded-pill" href="/sermons">View All</RBButton>
          </div>
          <Row className="g-4">
            {[1, 2, 3].map((item) => (
              <Col key={item} md={4}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -8 }}
                  className="glass-panel p-0 overflow-hidden shadow-sm border-0 h-100"
                >
                  <div className="ratio ratio-16x9 bg-dark">
                    <img src={`https://placehold.co/400x225/002855/ffffff?text=Service+Archive+${item}`} alt="Archive" />
                    <div className="position-absolute top-50 start-50 translate-middle">
                      <FaPlay size={30} className="text-white opacity-75" />
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <h6 className="fw-bold">Previous Sunday Service</h6>
                    <p className="text-muted small mb-0">Dec {item}, 2023</p>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default LiveStream;
