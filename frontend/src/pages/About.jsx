/**
 * About Page Component - Church history, mission, values, and leadership
 * 
 * Features:
 * - Hero section with church intro
 * - Our Story section with mission statement
 * - Our Vision section
 * - Core Values display with dynamic icons
 * - Leadership team profiles with images
 * - All sections have animated entry effects
 * 
 * Data Sources:
 * - Church values from `/api/values/`
 * - Leadership team from `/api/leadership/`
 * - Church info (story, mission, vision) from `/api/church-info/`
 * 
 * @component
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { 
  FaHeart, FaUsers, FaHandsHelping, FaSeedling, FaPray,
  FaBible, FaLightbulb, FaShieldAlt, FaStar, FaCross,
  FaHands, FaGlobe, FaChurch, FaInfinity, FaPeace, FaTwitter
} from 'react-icons/fa';
import Hero from '../components/common/Hero';
import SEO from '../components/common/SEO';
import { motion } from 'framer-motion';
import api from '../services/api.js';

/**
 * Maps icon names from API to React Icon components.
 * Allows dynamic icon selection in values section.
 */
const iconMap = {
  FaHeart, FaUsers, FaHandsHelping, FaSeedling, FaPray,
  FaBible, FaLightbulb, FaShieldAlt, FaStar, FaCross,
  FaHands, FaGlobe, FaChurch, FaInfinity, FaPeace
};

const About = () => {
  // State management
  const [values, setValues] = useState([]);
  const [leadership, setLeadership] = useState([]);
  const [churchInfo, setChurchInfo] = useState({
    about_story: "New Gate Chapel was founded with a vision to create a welcoming space where people from all walks of life could encounter God's love and grow in their faith.",
    about_mission: "To glorify God by making disciples of Jesus Christ who love God, love others, and serve the world.",
    about_vision: "A community where every person experiences the transforming love of Christ and discovers their God-given purpose."
  });
  const [loading, setLoading] = useState(true);

  /**
   * Fetches about page data on component mount.
   * Includes values (with icon mapping), leadership, and church info.
   */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [valuesData, leadershipData, infoData] = await Promise.all([
          api.getValues(),
          api.getLeadership(),
          api.getChurchInfo()
        ]);
        
        // Map values with dynamic icons from backend
        const mappedValues = (valuesData?.results || valuesData || []).map(v => ({
          ...v,
          icon: iconMap[v.icon_name] || FaHeart
        }));
        
        setValues(mappedValues);
        setLeadership(leadershipData?.results || leadershipData || []);
        
        // Extract church info (singleton pattern)
        const info = (infoData?.results || infoData || [])[0];
        if (info) {
          setChurchInfo(info);
        }
      } catch (error) {
        // Silent fail - page displays with default content
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <SEO 
        title="About Us" 
        description="Learn about the history, mission, and values of New Gate Chapel. A community of believers passionate about worship and service."
      />
      
      <Hero
        subtitle="Get to Know Us"
        title={
          <>
            About <span className="text-warning">New Gate Chapel</span>
          </>
        }
        description="We are a community of believers passionate about worship, fellowship, and making a difference in the world."
        backgroundGradient="linear-gradient(135deg, #002855 0%, #003D7A 50%, #0088BF 100%)"
      />

      {/* Our Story Section */}
      <section className="section-padding">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="display-5 fw-bold mb-4">
                  Our <span className="text-gradient">Story</span>
                </h2>
                <div className="lead text-muted mb-4" style={{ whiteSpace: 'pre-wrap' }}>
                  {churchInfo.about_story}
                </div>
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div
                className="glass-panel p-5 text-center"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="h2 mb-4 text-gradient">Our Mission</h3>
                <p className="lead text-muted mb-0">
                  {churchInfo.about_mission}
                </p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Vision Section */}
      <section className="section-padding bg-transparent">
        <Container>
            <Row className="justify-content-center">
                <Col lg={10} className="text-center">
                     <motion.h2 
                        className="display-5 fw-bold mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                      >
                        Our <span className="text-gradient">Vision</span>
                      </motion.h2>
                      <motion.p 
                        className="lead text-muted"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                      >
                        {churchInfo.about_vision}
                      </motion.p>
                </Col>
            </Row>
        </Container>
      </section>

      {/* Our Values Section */}
      <section className="section-padding bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <motion.h2 
                className="display-5 fw-bold mb-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Our <span className="text-gradient">Values</span>
              </motion.h2>
              <motion.p 
                className="lead text-muted"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                The principles that guide everything we do
              </motion.p>
            </Col>
          </Row>

          <Row className="g-4">
            {values.map((value, index) => (
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
                        <value.icon size={40} />
                      </div>
                      <Card.Title className="h5 fw-bold mb-3">{value.title}</Card.Title>
                      <Card.Text className="text-muted small">
                        {value.description}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Leadership Section */}
      <section className="section-padding">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold mb-3">
                Our <span className="text-gradient">Leadership</span>
              </h2>
              <p className="lead text-muted">
                Meet the team dedicated to serving our church family
              </p>
            </Col>
          </Row>

          <Row className="justify-content-center">
            {leadership.map((member, index) => (
              <Col key={index} md={6} lg={4}>
                <Card className="border-0 glass-panel shadow hover-lift text-center overflow-hidden">
                  <Card.Body className="p-5">
                    <div className="mb-4">
                      <div 
                        className="rounded-circle bg-gradient-logo-full mx-auto d-flex align-items-center justify-content-center text-white shadow-sm overflow-hidden"
                        style={{ width: '120px', height: '120px', fontSize: '3rem', border: '4px solid rgba(255, 255, 255, 0.2)' }}
                      >
                        {member.image ? (
                          <img 
                            src={member.image} 
                            alt={member.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              // Fallback to emoji icon on image load error
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<span style="font-size: 3rem">👤</span>';
                            }}
                          />
                        ) : (
                          '👤'
                        )}
                      </div>
                    </div>
                    <Card.Title className="h3 fw-bold mb-2">{member.name}</Card.Title>
                    <p className="text-primary fw-bold mb-3">{member.role}</p>
                    <Card.Text className="text-muted mb-4">
                      {member.description}
                    </Card.Text>
                    {member.x_url && (
                      <a href={member.x_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary rounded-pill btn-sm d-inline-flex align-items-center gap-2 px-3">
                        <FaTwitter /> Follow on X
                      </a>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default About;
