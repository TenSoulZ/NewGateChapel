/**
 * Ministries Page Component - Displays church ministries and service opportunities
 * 
 * Features:
 * - Hero section
 * - Ministries grid with custom icons and colors
 * - Dynamic icon mapping (extensive icon library)
 * - Image or icon display for each ministry
 * - Call-to-action section for getting involved
 * 
 * Data Sources:
 * - Ministries from `/api/ministries/`
 * 
 * @component
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Hero from '../components/common/Hero';
import SEO from '../components/common/SEO';
import { motion } from 'framer-motion';
import { 
  FaHeart, FaUsers, FaHandsHelping, FaSeedling, FaPray,
  FaBible, FaLightbulb, FaShieldAlt, FaStar, FaCross,
  FaHands, FaGlobe, FaChurch, FaInfinity,
  FaMale, FaFemale, FaChild, FaMusic, FaBullhorn, FaUserTie,
  FaBook, FaBookOpen, FaChalkboardTeacher, FaGraduationCap,
  FaMicrophone, FaHeadphones, FaVideo, FaCamera,
  FaCalendar, FaCalendarAlt, FaClock, FaHourglass,
  FaEnvelope, FaEnvelopeOpen, FaComments, FaComment,
  FaPhone, FaMobileAlt, FaMapMarkerAlt, FaLocationArrow,
  FaCar, FaBus, FaPlane, FaShip,
  FaShoppingCart, FaTag, FaTags, FaGift,
  FaPuzzlePiece, FaCogs, FaWrench, FaHammer,
  FaBuilding, FaHome, FaHouseUser, FaDoorOpen,
  FaBed, FaShower, FaToilet, FaUtensils,
  FaCoffee, FaPizzaSlice, FaHamburger, FaAppleAlt,
  FaTree, FaLeaf, FaMountain, FaWater,
  FaSun, FaMoon, FaCloud, FaCloudSun,
  FaSnowflake, FaFire, FaWind, FaPaw,
  FaDog, FaCat, FaHorse, FaFish,
  FaFrog, FaDragon, FaDove, FaHeartbeat,
  FaStethoscope, FaMedkit, FaFirstAid, FaHospital,
  FaClinicMedical, FaPrescription, FaVial, FaFlask,
  FaMicroscope, FaAtom, FaRocket, FaSpaceShuttle,
  FaSatellite, FaSatelliteDish, FaGlobeAfrica,
  FaGlobeAmericas, FaGlobeAsia, FaGlobeEurope,
  FaLanguage, FaMap, FaRoute, FaRoad, FaSubway,
  FaTrain, FaTruck, FaTractor, FaMotorcycle,
  FaBicycle, FaWalking, FaRunning, FaHiking,
  FaSwimmer, FaBiking, FaSkiing, FaSkiingNordic,
  FaSnowboarding, FaBaseballBall, FaBasketballBall,
  FaFootballBall, FaVolleyballBall, FaGolfBall,
  FaChess, FaChessKing,
  FaChessQueen, FaChessBishop, FaChessKnight,
  FaChessRook, FaChessPawn, FaDice, FaDiceOne,
  FaDiceTwo, FaDiceThree, FaDiceFour, FaDiceFive,
  FaDiceSix, FaHatWizard, FaMagic, FaGhost,
  FaSkull, FaSkullCrossbones, FaSpider, FaBug
} from 'react-icons/fa';
import api from '../services/api.js';

const Ministries = () => {
  const [ministries, setMinistries] = useState([]);

  /**
   * Icon mapping for extensive FontAwesome icon library.
   * Allows backend to specify icon names dynamically.
   */
  const iconMap = {
    FaHeart, FaUsers, FaHandsHelping, FaSeedling, FaPray,
    FaBible, FaLightbulb, FaShieldAlt, FaStar, FaCross,
    FaHands, FaGlobe, FaChurch, FaInfinity,
    FaMale, FaFemale, FaChild, FaMusic, FaBullhorn, FaUserTie,
    FaBook, FaBookOpen, FaChalkboardTeacher, FaGraduationCap,
    FaMicrophone, FaHeadphones, FaVideo, FaCamera,
    FaCalendar, FaCalendarAlt, FaClock, FaHourglass,
    FaEnvelope, FaEnvelopeOpen, FaComments, FaComment,
    FaPhone, FaMobileAlt, FaMapMarkerAlt, FaLocationArrow,
    FaCar, FaBus, FaPlane, FaShip,
    FaShoppingCart, FaTag, FaTags, FaGift,
    FaPuzzlePiece, FaCogs, FaWrench, FaHammer,
    FaBuilding, FaHome, FaHouseUser, FaDoorOpen,
    FaBed, FaShower, FaToilet, FaUtensils,
    FaCoffee, FaPizzaSlice, FaHamburger, FaAppleAlt,
    FaTree, FaLeaf, FaMountain, FaWater,
    FaSun, FaMoon, FaCloud, FaCloudSun,
    FaSnowflake, FaFire, FaWind, FaPaw,
    FaDog, FaCat, FaHorse, FaFish,
    FaFrog, FaDragon, FaDove, FaHeartbeat,
    FaStethoscope, FaMedkit, FaFirstAid, FaHospital,
    FaClinicMedical, FaPrescription, FaVial, FaFlask,
    FaMicroscope, FaAtom, FaRocket, FaSpaceShuttle,
    FaSatellite, FaSatelliteDish, FaGlobeAfrica,
    FaGlobeAmericas, FaGlobeAsia, FaGlobeEurope,
    FaLanguage, FaMap, FaRoute, FaRoad, FaSubway,
    FaTrain, FaTruck, FaTractor, FaMotorcycle,
    FaBicycle, FaWalking, FaRunning, FaHiking,
    FaSwimmer, FaBiking, FaSkiing, FaSkiingNordic,
    FaSnowboarding, FaBaseballBall, FaBasketballBall,
    FaFootballBall, FaVolleyballBall, FaGolfBall,
    FaChess, FaChessKing,
    FaChessQueen, FaChessBishop, FaChessKnight,
    FaChessRook, FaChessPawn, FaDice, FaDiceOne,
    FaDiceTwo, FaDiceThree, FaDiceFour, FaDiceFive,
    FaDiceSix, FaHatWizard, FaMagic, FaGhost,
    FaSkull, FaSkullCrossbones, FaSpider, FaBug
  };

  /**
   * Fetches ministries and maps them with icons on component mount.
   */
  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        const data = await api.getMinistries();
        const ministriesData = (data?.results || data || []);
        
        // Map ministries with dynamic icons from backend
        const mappedMinistries = ministriesData.map(m => ({
          ...m,
          icon: iconMap[m.icon_name] || FaUsers
        }));
        
        setMinistries(mappedMinistries);
      } catch (error) {
        // Silent fail - empty state will be shown
      }
    };
    fetchMinistries();
  }, []);

  return (
    <>
      <SEO 
        title="Our Ministries" 
        description="Explore the various ministries at New Gate Chapel. Find a place to serve and grow in your faith."
      />

      <Hero
        subtitle="Serve With Us"
        title={
          <>
            Our <span className="text-warning">Ministries</span>
          </>
        }
        description="Discover opportunities to serve, grow, and make a difference through our various Grace ministries."
        primaryButton={{ text: 'Get Involved', href: '/contact' }}
        backgroundGradient="linear-gradient(135deg, #00D4FF 0%, #0088BF 25%, #003D7A 50%, #A0025C 75%, #E60012 100%)"
      />

      {/* Ministries Grid Section */}
      <section className="section-padding">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <motion.h2 
                className="display-5 fw-bold mb-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Grace <span className="text-gradient">Ministries</span>
              </motion.h2>
              <motion.p 
                className="lead text-muted"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Every member is a minister - find your place to serve
              </motion.p>
            </Col>
          </Row>

          <Row className="g-4">
            {ministries.map((ministry, index) => (
              <Col key={index} md={6} lg={4}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="h-100 border-0 glass-panel shadow-sm hover-lift overflow-hidden">
                    <Card.Body className="p-4 p-lg-5 text-center">
                      <div 
                        className="mb-4 d-inline-flex align-items-center justify-content-center rounded-circle shadow-sm overflow-hidden"
                        style={{ 
                          width: '90px', 
                          height: '90px',
                          background: `linear-gradient(135deg, ${ministry.color}, ${ministry.color}cc)`,
                          color: 'white',
                          border: '4px solid rgba(255, 255, 255, 0.2)'
                        }}
                      >
                        {ministry.image ? (
                          <img src={ministry.image} alt={ministry.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <ministry.icon size={40} />
                        )}
                      </div>
                      <Card.Title className="h4 fw-bold mb-3">{ministry.title}</Card.Title>
                      <Card.Text className="text-muted small px-3">
                        {ministry.description}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Get Involved CTA Section */}
      <section className="section-padding position-relative overflow-hidden">
        <div 
          className="position-absolute top-0 start-0 w-100 h-100" 
          style={{ 
            background: 'linear-gradient(135deg, #002855 0%, #0088BF 50%, #00D4FF 100%)',
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
                  Ready to Serve?
                </motion.h2>
                <motion.p 
                  className="lead mb-5 opacity-75"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  Every member has a unique gift intended to build up the church. 
                  We'd love to help you find the ministry that matches your passion.
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
                    className="px-5 shadow-lg fw-bold"
                    href="/contact"
                    style={{ color: '#003D7A' }}
                  >
                    Start Serving Today
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

export default Ministries;
