/**
 * Sermons Page Component - Sermon library with video playback
 * 
 * Features:
 * - Hero section
 * - Featured latest sermon with embedded video
 * - Sermon archive grid with watch/download options
 * - Video modal for full-screen playback
 * - Scripture quote section
 * - Newsletter CTA section
 * 
 * Data Sources:
 * - Sermons from `/api/sermons/`
 * 
 * @component
 */

import React, { useState, useEffect } from 'react';
import { FaPlay, FaDownload, FaCalendarAlt, FaUser, FaQuoteLeft, FaTimes } from 'react-icons/fa';
import { Modal, Container, Row, Col, Card, Button } from 'react-bootstrap';
import Hero from '../components/common/Hero';
import { motion } from 'framer-motion';
import api from '../services/api.js';
import { convertToEmbedUrl } from '../utils/urlUtils';

const Sermons = () => {
  const [sermons, setSermons] = useState([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  /**
   * Fetches sermons on component mount.
   */
  useEffect(() => {
    const fetchSermons = async () => {
        try {
            const data = await api.getSermons();
            const sermonsList = data?.results || data || [];
            setSermons(sermonsList);
        } catch (error) {
            // Silent fail - empty state will be shown
        }
    };
    fetchSermons();
  }, []);

  /**
   * Opens video modal with specified sermon URL.
   * @param {string} videoUrl - YouTube or video URL to display
   */

  const handlePlayVideo = (videoUrl) => {
    setActiveVideo(videoUrl);
    setShowVideoModal(true);
  };

  const latestSermon = sermons[0] || {};

  return (
    <>
      <Hero
        subtitle="Spiritual Nourishment"
        title={
          <>
            Watch & Listen to <span className="text-warning">Sermons</span>
          </>
        }
        description="Catch up on recent messages or explore our sermon archive. Find inspiration and biblical teaching for your spiritual journey."
        backgroundGradient="linear-gradient(135deg, #002855 0%, #003D7A 50%, #0088BF 100%)"
      />

      {/* Featured Sermon Section */}
      <section className="section-padding bg-light">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={7}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="mb-2">
                  <span className="badge bg-primary px-3 py-2">Latest Message</span>
                </div>
                <h2 className="display-5 fw-bold mb-4">{latestSermon.title}</h2>
                <div className="d-flex align-items-center gap-4 mb-4 text-muted">
                  <span className="d-flex align-items-center gap-2">
                    <FaCalendarAlt className="text-primary" /> {latestSermon.date}
                  </span>
                  <span className="d-flex align-items-center gap-2">
                    <FaUser className="text-primary" /> {latestSermon.speaker}
                  </span>
                </div>
                <p className="lead mb-4">
                  "{latestSermon.description}"
                </p>
                <div className="d-flex gap-3">
                  {latestSermon.video_url ? (
                    <Button variant="primary" size="lg" className="rounded-pill px-4" onClick={() => handlePlayVideo(latestSermon.video_url)}>
                      <FaPlay className="me-2" /> Watch Now
                    </Button>
                  ) : (
                    <Button variant="primary" size="lg" className="rounded-pill px-4" disabled>
                      <FaPlay className="me-2" /> No Video
                    </Button>
                  )}
                  <Button variant="outline-primary" size="lg" className="rounded-pill px-4">
                    <FaDownload className="me-2" /> Audio Only
                  </Button>
                </div>
              </motion.div>
            </Col>
            <Col lg={5}>
              <motion.div
                className="glass-panel p-0 overflow-hidden shadow-lg position-relative"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                {latestSermon.video_url ? (
                  <div className="ratio ratio-16x9 bg-dark">
                    <iframe
                      src={convertToEmbedUrl(latestSermon.video_url)}
                      title={latestSermon.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className="border-0 w-100 h-100"
                    ></iframe>
                  </div>
                ) : (
                  <div 
                    className="bg-dark d-flex align-items-center justify-content-center"
                    style={{ minHeight: '300px', background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("/logo.jpg") center/cover' }}
                  >
                    <div className="text-white opacity-25 text-center">
                      <FaPlay size={50} className="mb-3 d-block mx-auto" />
                      <span className="small uppercase fw-bold tracking-wider">Preview Unavailable</span>
                    </div>
                  </div>
                )}
                <div className="p-4 bg-white">
                  <h5 className="fw-bold mb-0">{latestSermon.series}</h5>
                  <p className="text-muted small mb-0">{latestSermon.video_url ? 'Video Stream Available' : 'Audio Message'}</p>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Sermon Archive Section */}
      <section className="section-padding">
        <Container>
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <h2 className="display-6 fw-bold">Sermon <span className="text-gradient">Archive</span></h2>
              <p className="text-muted mb-0">Explore our library of past messages</p>
            </div>
            <div className="d-none d-md-block">
              <Button variant="outline-primary" className="rounded-pill px-4">View All Sermons</Button>
            </div>
          </div>

          <Row className="g-4">
            {sermons.map((sermon, index) => (
              <Col key={index} lg={4} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-100 border-0 glass-panel shadow-sm hover-lift overflow-hidden">
                    <div className="p-3 bg-white bg-opacity-50 border-bottom d-flex justify-content-between align-items-center">
                      <span className="badge bg-primary bg-opacity-10 text-primary border-primary border-opacity-25 border px-2 py-1">{sermon.category}</span>
                      <small className="text-muted fw-bold">{sermon.date}</small>
                    </div>
                    <Card.Body className="p-4 p-lg-5">
                      <Card.Title className="h4 fw-bold mb-4">{sermon.title}</Card.Title>
                      <Card.Text className="text-muted small mb-4 opacity-75">
                        {sermon.description}
                      </Card.Text>
                      <div className="d-flex align-items-center text-primary mb-4 p-2 bg-primary bg-opacity-5 rounded-3 d-inline-flex">
                        <FaUser size={14} className="me-2" />
                        <span className="small fw-bold">{sermon.speaker}</span>
                      </div>
                      <div className="d-flex gap-2">
                        {sermon.video_url ? (
                          <Button variant="primary" size="sm" className="rounded-pill px-4 shadow-sm" onClick={() => handlePlayVideo(sermon.video_url)}>
                            <FaPlay className="me-2" /> Watch
                          </Button>
                        ) : (
                          <Button variant="outline-primary" size="sm" className="rounded-pill px-4 shadow-sm" disabled>
                            <FaPlay className="me-2" /> Audio
                          </Button>
                        )}
                        <Button variant="outline-dark" size="sm" className="rounded-pill px-3 text-muted border-light">
                          <FaDownload />
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Quote Section */}
      <section className="py-5 bg-dark text-white">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <FaQuoteLeft className="text-primary opacity-25 mb-4" size={40} />
              <p className="h3 fw-light mb-4">
                "The word of God is living and active, sharper than any two-edged sword."
              </p>
              <footer className="blockquote-footer text-primary-light">Hebrews 4:12</footer>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Subscription CTA Section */}
      <section 
        className="section-padding" 
        style={{ 
          background: 'linear-gradient(135deg, #002855 0%, #001840 100%)',
          color: 'white'
        }}
      >
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h2 className="display-6 fw-bold mb-4">Never Miss a Message</h2>
              <p className="lead opacity-75 mb-5">
                Subscribe to our podcast or YouTube channel to receive notifications whenever a new sermon is released.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Button variant="primary" size="lg" className="rounded-pill px-5">
                  YouTube Channel
                </Button>
                <Button variant="outline-light" size="lg" className="rounded-pill px-5">
                  Podcast (Apple & Spotify)
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Video Playback Modal */}
      <Modal 
        show={showVideoModal} 
        onHide={() => setShowVideoModal(false)} 
        centered 
        size="xl"
        contentClassName="bg-transparent border-0"
      >
        <Modal.Header className="border-0 p-0 position-relative">
          <Button 
            variant="link" 
            className="text-white position-absolute end-0 top-0 mt-n5 me-2 p-2 hover-scale"
            onClick={() => setShowVideoModal(false)}
            style={{ zIndex: 1060 }}
          >
            <FaTimes size={24} />
          </Button>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div className="ratio ratio-16x9 bg-dark shadow-2xl rounded-3 overflow-hidden border border-white border-opacity-10">
            {activeVideo && (
              <iframe
                src={activeVideo}
                title="Sermon Video"
                allowFullScreen
                className="w-100 h-100"
              ></iframe>
            )}
          </div>
        </Modal.Body>
      </Modal>

      <style>{`
        .mt-n5 { margin-top: -3rem; }
        .hover-scale { transition: transform 0.2s; }
        .hover-scale:hover { transform: scale(1.1); }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7); }
      `}</style>
    </>
  );
};

export default Sermons;
