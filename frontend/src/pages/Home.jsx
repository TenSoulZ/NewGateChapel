/**
 * Home Page Component - Main landing page with live stream, features, and events
 * 
 * Features:
 * - Hero section with church welcome message
 * - Conditional live stream banner when service is active
 * - Church features/values section
 * - Upcoming events display (3 most recent)
 * - Call-to-action section
 * - All sections have animated entry effects
 * 
 * Data Sources:
 * - Live stream status from `/api/livestream/`
 * - Church info (hero text) from `/api/church-info/`
 * - Features from `/api/home-features/`
 * - Events from `/api/events/`
 * 
 * @component
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { 
  FaCalendarAlt, FaBible, FaPrayingHands, FaUsers, FaHeart,
  FaHandsHelping, FaSeedling, FaPray, FaLightbulb, FaShieldAlt,
  FaStar, FaCross, FaHands, FaGlobe, FaChurch, FaInfinity
} from 'react-icons/fa';
import Hero from '../components/common/Hero';
import { motion } from 'framer-motion';
import homeHeroBg from '../assets/images/home-hero-bg.jpg';
import api from '../services/api.js';
import { convertToEmbedUrl } from '../utils/urlUtils';
import SEO from '../components/common/SEO';
import { SkeletonHero } from '../components/common/Skeleton';

/**
 * Maps icon names from API to React Icon components.
 * Allows dynamic icon selection from backend for features.
 */
const iconMap = {
  FaBible, FaPrayingHands, FaUsers, FaHeart,
  FaHandsHelping, FaSeedling, FaPray, FaLightbulb, FaShieldAlt,
  FaStar, FaCross, FaHands, FaGlobe, FaChurch, FaInfinity
};

const Home = () => {
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [liveStreamStatus, setLiveStreamStatus] = useState({ isLive: false, embedUrl: '', title: '' });
  const [churchInfo, setChurchInfo] = useState({
    hero_subtitle: 'Welcome Home',
    hero_title: 'Welcome to New Gate Chapel',
    hero_description: "A place of worship, community, and spiritual growth. Join us as we journey together in faith and discover God's purpose for our lives."
  });
  const [features, setFeatures] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  /**
   * Fetches all homepage data on component mount.
   * 
   * Data fetched:
   * - Live stream status to show/hide live banner
   * - Church info for hero section customization
   * - Features for "Why Choose" section
   * - Upcoming events (shows 3 most recent)
   * 
   * Falls back to default content if API calls fail.
   */
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [liveData, infoData, featuresData, eventsData] = await Promise.all([
          api.getLiveStream(),
          api.getChurchInfo(),
          api.getHomeFeatures(),
          api.getEvents()
        ]);

        // Process live stream data
        if (liveData && (liveData.results || liveData).length > 0) {
            const activeStream = (liveData.results || liveData)[0];
            if (activeStream.status === 'live') {
                setLiveStreamStatus({
                    isLive: true,
                    embedUrl: convertToEmbedUrl(activeStream.embed_url),
                    title: activeStream.title
                });
            }
        }

        // Process church info for hero section
        const info = (infoData?.results || infoData || [])[0];
        if (info) {
            setChurchInfo(info);
        }

        // Process features with dynamic icons
        const featuresList = featuresData?.results || featuresData || [];
        if (featuresList.length > 0) {
            setFeatures(featuresList.map(f => ({
                ...f,
                icon: iconMap[f.icon_name] || FaUsers
            })));
        } else {
            // Fallback to default features if none in database
            setFeatures([
                { icon: FaBible, title: 'Biblical Teaching', description: 'Grounded in Scripture, our teachings inspire spiritual growth and understanding.' },
                { icon: FaPrayingHands, title: 'Prayer & Worship', description: 'Experience powerful worship and prayer that transforms lives.' },
                { icon: FaUsers, title: 'Community', description: 'Join a loving community where everyone belongs and grows together.' },
                { icon: FaHeart, title: 'Outreach', description: 'Making a difference in our community through love and service.' }
            ]);
        }

        // Process upcoming events (show first 3)
        const eventsList = (eventsData?.results || eventsData || []).slice(0, 3);
        if (eventsList.length > 0) {
            setUpcomingEvents(eventsList);
        } else {
            // Fallback to placeholder events
            setUpcomingEvents([
                { title: 'Sunday Service', date: 'Every Sunday, 9:00 AM', description: 'Join us for inspiring worship and powerful teaching.' },
                { title: 'Bible Study', date: 'Wednesdays, 6:00 PM', description: "Dive deeper into God's Word with our community." },
                { title: 'Youth Night', date: 'Fridays, 7:00 PM', description: 'Fun, fellowship, and faith-building for our youth.' }
            ]);
        }
      } catch (error) {
        // Silent fail - page will display with default content
        // Production app should implement user-friendly error UI
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHomeData();
  }, []);

  if (isLoading) {
    return <SkeletonHero />;
  }

  return (
    <>
      <SEO 
        title="Home" 
        description={churchInfo.hero_description || "Welcome to New Gate Chapel"} 
        canonical={window.location.href}
      />
      {/* Hero Section */}
      <Hero
        subtitle={churchInfo.hero_subtitle}
        title={
          <>
            {churchInfo.hero_title}
          </>
        }
        description={churchInfo.hero_description}
        primaryButton={{ text: 'Join Us', href: '/contact' }}
        secondaryButton={{ text: 'Watch Live', href: '/live' }}
        backgroundImage={homeHeroBg}
        backgroundGradient="linear-gradient(135deg, rgba(0, 212, 255, 0.4) 0%, rgba(0, 184, 230, 0.4) 20%, rgba(0, 136, 191, 0.4) 50%, rgba(0, 61, 122, 0.4) 80%, rgba(0, 40, 85, 0.4) 100%)"
      />
    
      {/* Live Stream Banner - Conditionally Rendered */}
      {liveStreamStatus.isLive && (
        <section className="bg-dark py-4 border-bottom border-warning border-opacity-25">
          <Container>
            <Row className="align-items-center">
              <Col lg={8} className="mx-auto text-center">
                 <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                 >
                    <div className="d-flex align-items-center justify-content-center gap-3 mb-3 text-warning">
                        <span className="badge bg-danger pulse-dot-container"><span className="pulse-dot"></span> LIVE</span>
                        <span className="fw-bold tracking-wider">HAPPENING NOW</span>
                    </div>
                    <h3 className="text-white fw-bold mb-4">{liveStreamStatus.title}</h3>
                    <div className="ratio ratio-16x9 shadow-lg rounded-3 overflow-hidden border border-white border-opacity-10">
                        <iframe
                            src={liveStreamStatus.embedUrl}
                            title="Live Stream"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                            className="w-100 h-100 border-0"
                        ></iframe>
                    </div>
                    <div className="mt-4">
                        <Button variant="outline-light" href="/live" className="rounded-pill px-4">
                            Go to Live Page
                        </Button>
                    </div>
                 </motion.div>
              </Col>
            </Row>
          </Container>
        </section>
      )}

      {/* Features Section */}
      <section className="section-padding bg-transparent position-relative">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-4 fw-bold mb-3">
                Why Choose <span className="text-gradient">New Gate Chapel</span>
              </h2>
              <p className="lead text-muted">
                Discover what makes our church family special
              </p>
            </Col>
          </Row>

          <Row className="g-4">
            {features.map((feature, index) => (
              <Col key={index} md={6} lg={3}>
                <Card className="h-100 border-0 glass-panel text-center p-4 hover-lift">
                  <Card.Body>
                    <div className="text-primary mb-4 p-3 d-inline-block rounded-circle bg-white shadow-sm">
                      <feature.icon size={40} />
                    </div>
                    <Card.Title className="h5 fw-bold mb-3">{feature.title}</Card.Title>
                    <Card.Text className="text-muted small">
                      {feature.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Upcoming Events Section */}
      <section className="section-padding bg-light bg-opacity-50">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-4 fw-bold mb-3">
                Upcoming <span className="text-gradient">Events</span>
              </h2>
              <p className="lead text-muted">
                Join us for these exciting gatherings
              </p>
            </Col>
          </Row>

          <Row className="g-4">
            {upcomingEvents.map((event, index) => (
              <Col key={index} md={6} lg={4}>
                <Card className="h-100 border-0 glass-panel shadow-sm hover-lift">
                  <Card.Body className="p-4 p-lg-5">
                    <div className="d-flex align-items-center mb-4">
                      <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3">
                        <FaCalendarAlt className="text-primary" size={24} />
                      </div>
                      <small className="text-primary fw-bold text-uppercase">{event.date}</small>
                    </div>
                    <Card.Title className="h3 fw-bold mb-3">{event.title}</Card.Title>
                    <Card.Text className="text-muted mb-4">
                      {event.description}
                    </Card.Text>
                    <Button variant="primary" className="px-4" href="/events">
                      Learn More
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Call to Action Section */}
      <section className="section-padding position-relative overflow-hidden">
        <div 
          className="position-absolute top-0 start-0 w-100 h-100" 
          style={{ 
            background: 'linear-gradient(135deg, #E60012 0%, #A0025C 50%, #6B1B7F 100%)',
            opacity: 0.95
          }}
        />
        <Container className="position-relative" style={{ zIndex: 1 }}>
          <div className="glass-panel p-5 p-lg-5 border-white border-opacity-25 text-center text-white">
            <Row className="justify-content-center py-4">
              <Col lg={8}>
                <h2 className="display-4 fw-bold mb-4">
                  Ready to Join Our Community?
                </h2>
                <p className="lead mb-5 opacity-75">
                  Walking into a new church can be intimidating, but we promise a warm welcome. 
                  We'd love to meet you and hear your story.
                </p>
                <div>
                  <Button 
                    variant="light" 
                    size="lg" 
                    className="px-5 shadow-lg fw-bold"
                    href="/contact"
                    style={{ color: '#A0025C' }}
                  >
                    Get Connected
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

    </>
  );
};

export default Home;
