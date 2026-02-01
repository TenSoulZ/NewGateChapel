/**
 * Events Page Component - Displays upcoming church events
 * 
 * Features:
 * - Hero section with events intro
 * - Event cards with category badges, date/time/location info
 * - Event images with fallback handling
 * - Category-based color coding
 * - Call-to-action section for newsletter subscription
 * - Animated entry effects
 * 
 * Data Sources:
 * - Events from `/api/events/`
 * 
 * @component
 */

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import Hero from '../components/common/Hero';
import SEO from '../components/common/SEO';
import { motion } from 'framer-motion';
import api from '../services/api.js';

const Events = () => {
  const [events, setEvents] = useState([]);

  /**
   * Fetches upcoming events on component mount.
   */
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.getEvents();
        const eventsList = data?.results || data || [];
        if (eventsList.length > 0) {
          setEvents(eventsList);
        }
      } catch (error) {
        // Silent fail - empty state will be shown
      }
    };
    fetchEvents();
  }, []);

  /**
   * Returns Bootstrap variant color for event category badges.
   * @param {string} category - Event category name
   * @returns {string} Bootstrap variant (primary, success, warning, etc.)
   */

  const getCategoryColor = (category) => {
    const colors = {
      'Special Service': 'primary',
      'Outreach': 'success',
      'Youth': 'warning',
      'Workshop': 'info',
      'Family Event': 'danger'
    };
    return colors[category] || 'secondary';
  };

  return (
    <>
      <SEO 
        title="Upcoming Events" 
        description="Stay up to date with the latest events at New Gate Chapel. Join us for worship, community outreach, and special services."
      />

      <Hero
        subtitle="What's Happening"
        title={
          <>
            Upcoming <span className="text-warning">Events</span>
          </>
        }
        description="Join us for special services, community outreach, and fellowship opportunities throughout the year."
        primaryButton={{ text: 'View Calendar', href: '#calendar' }}
        backgroundGradient="linear-gradient(135deg, #00D4FF 0%, #00B8E6 33%, #0088BF 66%, #003D7A 100%)"
      />

      {/* Events List Section */}
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
                  Mark Your <span className="text-gradient">Calendar</span>
                </h2>
                <p className="lead text-dark mb-0">
                  Don't miss these exciting opportunities to connect and grow
                </p>
              </motion.div>
            </Col>
          </Row>

          <Row className="g-4">
            {events.map((event, index) => (
              <Col key={index} lg={6}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-100 border-0 glass-panel shadow-sm hover-lift overflow-hidden">
                    {event.image && (
                      <div 
                        className="event-card-image overflow-hidden" 
                        style={{ height: '200px', width: '100%' }}
                      >
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>
                    )}
                    <Card.Body className="p-4 p-lg-5">
                      <div className="d-flex justify-content-between align-items-start mb-4">
                        <Badge bg={getCategoryColor(event.category)} className="px-3 py-2 rounded-pill shadow-sm">
                          {event.category}
                        </Badge>
                      </div>
                      
                      <Card.Title className="h3 fw-bold mb-4">{event.title}</Card.Title>
                      
                      <div className="mb-4 bg-light bg-opacity-25 p-3 rounded-4">
                        <div className="d-flex align-items-center text-muted mb-2">
                          <FaCalendarAlt className="me-3 text-primary" size={20} />
                          <span className="fw-bold">{event.date}</span>
                        </div>
                        <div className="d-flex align-items-center text-muted mb-2">
                          <FaClock className="me-3 text-primary" size={20} />
                          <span>{event.time}</span>
                        </div>
                        <div className="d-flex align-items-center text-muted">
                          <FaMapMarkerAlt className="me-3 text-primary" size={20} />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      
                      <Card.Text className="text-dark mb-0 lead" style={{ fontSize: '1rem' }}>
                        {event.description}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="section-padding position-relative overflow-hidden">
        <div 
          className="position-absolute top-0 start-0 w-100 h-100" 
          style={{ 
            background: 'linear-gradient(135deg, #03045E 0%, #0077B6 100%)',
            opacity: 0.95
          }}
        />
        <Container className="position-relative" style={{ zIndex: 1 }}>
          <div className="glass-panel p-5 p-lg-5 border-white border-opacity-25 text-center text-white">
            <Row className="justify-content-center py-4">
              <Col lg={8}>
                <motion.h2 
                  className="display-4 fw-bold mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  Don't Miss Out!
                </motion.h2>
                <motion.p 
                  className="lead mb-5"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  Stay connected with New Gate Chapel. Subscribe to our newsletter or follow us on social media 
                  to receive the latest news and event updates.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <Button 
                    variant="light" 
                    size="lg" 
                    className="px-5 shadow-lg fw-bold text-primary"
                    href="/contact"
                  >
                    Subscribe to Updates
                  </Button>
                </motion.div>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

    </>
  );
};

export default Events;
