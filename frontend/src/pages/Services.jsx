/**
 * Services Page Component - Weekly service schedule and what to expect
 * 
 * Features:
 * - Hero section
 * - Weekly schedule grid from service schedule data
 * - "What to Expect" section for first-time visitors
 * - Location and service duration information
 * 
 * Data Sources:
 * - Service schedule from `/api/service-schedule/`
 * 
 * @component
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { FaClock, FaMapMarkerAlt, FaBible, FaPrayingHands, FaMusic, FaChild } from 'react-icons/fa';
import Hero from '../components/common/Hero';
import SEO from '../components/common/SEO';
import { motion } from 'framer-motion';
import api from '../services/api.js';

/**
 * Icon map for service types.
 * Currently defaults to FaClock for all services.
 */
const iconMap = {
  FaBible,
  FaPrayingHands,
  FaMusic,
  FaChild
};

const Services = () => {
  const [services, setServices] = useState([]);

  /**
   * Fetches service schedule on component mount.
   * Maps backend data to frontend structure with icons.
   */
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.getSchedule();
        const servicesData = data && data.results ? data.results : (Array.isArray(data) ? data : []);
        
        // Map backend data to frontend structure with icons
        const mapped = servicesData.map(item => ({
          ...item,
          title: item.type,
          icon: FaClock,
          features: [] // Features can be added later
        }));
        
        setServices(mapped);
      } catch (error) {
        // Silent fail - empty state will be shown
      }
    };
    fetchServices();
  }, []);

  return (
    <>
      <SEO 
        title="Our Services" 
        description="Join us for weekly worship, Bible study, and prayer meetings. Find a service that fits your schedule at New Gate Chapel."
      />

      <Hero
        subtitle="Join Us"
        title={
          <>
            Our <span className="text-warning">Services</span>
          </>
        }
        description="Experience vibrant worship, biblical teaching, and authentic community at New Gate Chapel."
        primaryButton={{ text: 'Plan Your Visit', href: '/contact' }}
        backgroundGradient="linear-gradient(135deg, #E60012 0%, #C8102E 25%, #A0025C 50%, #6B1B7F 75%, #3C1053 100%)"
      />

      {/* Service Times Section */}
      <section className="section-padding">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <motion.div 
                className="glass-panel bg-white p-4 shadow-sm rounded-4 d-inline-block border-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="display-5 fw-bold mb-3">
                  Weekly <span className="text-gradient">Schedule</span>
                </h2>
                <p className="lead text-dark mb-0">
                  Find a service that fits your schedule
                </p>
              </motion.div>
            </Col>
          </Row>

          <Row className="g-4">
            {services.map((service, index) => (
              <Col key={index} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-100 border-0 glass-panel shadow-sm hover-lift">
                    <Card.Body className="p-4 p-lg-5">
                      <div className="text-primary mb-4 p-3 d-inline-block rounded-circle bg-white shadow-sm">
                        <service.icon size={40} />
                      </div>
                      <Card.Title className="h3 fw-bold mb-3">{service.title}</Card.Title>
                      <div className="d-flex align-items-center text-muted mb-4 bg-light bg-opacity-50 p-2 rounded-3 d-inline-flex">
                        <FaClock className="me-2 text-primary" />
                        <span className="fw-bold small text-uppercase">{service.time}</span>
                      </div>
                      <Card.Text className="text-muted mb-4 lead" style={{ fontSize: '1rem' }}>
                        {service.description}
                      </Card.Text>
                      <ListGroup variant="flush" className="bg-transparent">
                        {service.features.map((feature, idx) => (
                          <ListGroup.Item key={idx} className="border-0 px-0 py-2 bg-transparent text-muted">
                            <span className="text-primary me-2 fw-bold">✓</span>
                            {feature}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* What to Expect Section */}
      <section className="section-padding bg-light">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="display-5 fw-bold mb-4">
                  What to <span className="text-gradient">Expect</span>
                </h2>
                <p className="lead text-dark mb-4">
                  Your first visit to New Gate Chapel
                </p>
                <div className="mb-4">
                  <h5 className="fw-bold mb-2">Welcoming Atmosphere</h5>
                  <p className="text-dark">
                    Our greeters will welcome you warmly and help you find your way around.
                  </p>
                </div>
                <div className="mb-4">
                  <h5 className="fw-bold mb-2">Casual Dress</h5>
                  <p className="text-dark">
                    Come as you are! We value authenticity over formality.
                  </p>
                </div>
                <div className="mb-4">
                  <h5 className="fw-bold mb-2">Engaging Worship</h5>
                  <p className="text-dark">
                    Experience contemporary worship music and relevant biblical teaching.
                  </p>
                </div>
                <div>
                  <h5 className="fw-bold mb-2">Kids Ministry</h5>
                  <p className="text-dark">
                    Age-appropriate programs for children during services.
                  </p>
                </div>
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div
                className="glass-panel p-5 bg-primary text-white"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="mb-4">
                  <FaMapMarkerAlt size={40} className="text-warning mb-3" />
                  <h4 className="fw-bold mb-2">Location</h4>
                  <p className="text-white-50 mb-0">
                    Stand Number 15493, Figtree Road<br />
                    Buckland Terraces, Grace Park, Harare
                  </p>
                </div>
                <hr className="my-4 border-white opacity-25" />
                <div>
                  <FaClock size={40} className="text-warning mb-3" />
                  <h4 className="fw-bold mb-2">Service Duration</h4>
                  <p className="text-white-50 mb-0">
                    Approximately 90 minutes<br />
                    Including worship and teaching
                  </p>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Services;
