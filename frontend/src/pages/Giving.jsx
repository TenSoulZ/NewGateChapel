/**
 * Giving Page Component - Displays donation methods and giving information
 * 
 * Features:
 * - Hero section with customizable intro text
 * - Impact section explaining the value of giving
 * - Donation methods (bank transfer, mobile money, online)
 * - Inspirational scripture verses
 * - Animated entry effects with Framer Motion
 * 
 * Data Sources:
 * - Giving options from `/api/giving-options/`
 * - Church info (intro text, verses) from `/api/church-info/`
 * 
 * @component
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaHeart, FaHandHoldingHeart, FaUniversity, FaMobileAlt, FaQuoteRight } from 'react-icons/fa';
import Hero from '../components/common/Hero';
import { motion } from 'framer-motion';

import api from '../services/api';

/**
 * Maps icon names from API to React Icon components.
 * Allows dynamic icon selection from backend data.
 */
const iconMap = {
  FaMobileAlt,
  FaUniversity,
  FaHandHoldingHeart
};

const Giving = () => {
  // State management
  const [options, setOptions] = useState([]);
  const [churchInfo, setChurchInfo] = useState({ giving_intro: '', giving_verses: [] });
  const [loading, setLoading] = useState(true);

  /**
   * Fetches giving options and church information on component mount.
   * Uses Promise.all for parallel API calls to improve performance.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [optionsData, infoData] = await Promise.all([
          api.getGivingOptions(),
          api.getChurchInfo()
        ]);

        // Handle paginated or array response for options
        if (optionsData && optionsData.results) setOptions(optionsData.results);
        else if (Array.isArray(optionsData)) setOptions(optionsData);

        // Extract first church info object (singleton pattern)
        const info = (infoData?.results || infoData || [])[0];
        if (info) setChurchInfo(info);
      } catch (error) {
        // Silent fail - page will display with default content
        // Production app should implement proper error UI
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const verses = churchInfo.giving_verses || [];

  return (
    <>
      <Hero
        subtitle="Support Our Mission"
        title={
          <>
            Generosity & <span className="text-warning">Giving</span>
          </>
        }
        description={churchInfo.giving_intro || "Your generosity enables us to reach our community, support missions, and continue the work of God in our city."}
        backgroundGradient="linear-gradient(135deg, #FFB703 0%, #E63946 50%, #A0025C 100%)"
      />

      {/* Impact Section */}
      <section className="section-padding bg-light">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="display-5 fw-bold mb-4">Your Gift <span className="text-gradient">Makes a Difference</span></h2>
                <p className="lead text-dark mb-4">
                  When you give to New Gate Chapel, you're not just supporting a building; you're investing in lives transformed by the power of God.
                </p>
                <p className="text-dark mb-5">
                  Your tithes and offerings support our local ministries, community outreach programs, global missions, and the daily operations that make our services possible.
                </p>
                <div className="d-flex gap-4 align-items-center">
                  <div className="text-center">
                    <h3 className="fw-bold text-primary mb-0">100%</h3>
                    <small className="text-muted uppercase fw-bold">Transparency</small>
                  </div>
                  <div className="vr opacity-25"></div>
                  <div className="text-center">
                    <h3 className="fw-bold text-primary mb-0">Secure</h3>
                    <small className="text-muted uppercase fw-bold">Processing</small>
                  </div>
                  <div className="vr opacity-25"></div>
                  <div className="text-center">
                    <h3 className="fw-bold text-primary mb-0">Direct</h3>
                    <small className="text-muted uppercase fw-bold">Impact</small>
                  </div>
                </div>
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="glass-panel p-5 bg-white border-0 shadow-lg text-center"
              >
                <FaHeart size={60} className="text-danger mb-4 opacity-75" />
                <h3 className="fw-bold mb-3">A Cheerful Giver</h3>
                <p className="text-dark italic mb-0">
                  "Generosity is an act of worship. It's a way we acknowledge that everything we have 
                  comes from God and belongs to Him."
                </p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Giving Options Section */}
      <section className="section-padding">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-6 fw-bold">Ways to <span className="text-gradient">Give</span></h2>
              <p className="text-muted">Choose the method that works best for you</p>
            </Col>
          </Row>

          <Row className="g-4">
            {options.map((option, index) => {
              const IconComp = iconMap[option.icon_name] || FaHandHoldingHeart;
              return (
              <Col key={option.id} lg={4}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-100 border-0 glass-panel shadow-sm hover-lift overflow-hidden text-center">
                    <div className="p-5 bg-white bg-opacity-50 border-bottom">
                      <div 
                        className="d-inline-flex align-items-center justify-content-center bg-white rounded-circle shadow-sm mb-4"
                        style={{ width: '90px', height: '90px', color: option.color || '#3b82f6', border: '4px solid rgba(255, 255, 255, 0.4)' }}
                      >
                        <IconComp size={40} />
                      </div>
                      <Card.Title className="h3 fw-bold mb-0">{option.title}</Card.Title>
                    </div>
                    <Card.Body className="p-4 p-lg-5">
                      <Card.Text className="text-dark mb-5 lead" style={{ fontSize: '1rem' }}>
                        {option.description}
                      </Card.Text>
                      
                      {option.bank_name ? (
                        <div className="bg-light bg-opacity-50 p-4 rounded-4 text-start mb-0 border border-white">
                          <div className="mb-3"><small className="text-primary uppercase fw-bold pb-2 d-block border-bottom border-primary border-opacity-10">Secure Bank Details</small></div>
                          <div className="small mb-2 d-flex justify-content-between"><strong>Bank:</strong> <span className="text-muted">{option.bank_name}</span></div>
                          <div className="small mb-2 d-flex justify-content-between"><strong>Name:</strong> <span className="text-muted">{option.account_name}</span></div>
                          <div className="small mb-2 d-flex justify-content-between"><strong>Account:</strong> <span className="text-muted font-monospace">{option.account_number}</span></div>
                        </div>
                      ) : option.mobile_number ? (
                        <div className="bg-light bg-opacity-50 p-4 rounded-4 text-start mb-0 border border-white">
                          <div className="mb-3"><small className="text-success uppercase fw-bold pb-2 d-block border-bottom border-success border-opacity-10">Mobile Money</small></div>
                          <div className="small mb-2 text-center"><strong className="d-block mb-1">Number / Code:</strong> <span className="text-muted font-monospace h4">{option.mobile_number}</span></div>
                        </div>
                      ) : (
                        <Button variant="primary" className="w-100 shadow-sm py-3 fw-bold">
                          Give Now
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
              );
            })}
          </Row>
        </Container>
      </section>

      {/* Scripture Section */}
      <section className="py-5 bg-dark text-white">
        <Container>
          <Row className="justify-content-center">
            {verses.map((v, i) => (
              <Col key={i} md={6} className="mb-4 mb-md-0 px-4">
                <div className="text-center">
                  <FaQuoteRight className="text-primary opacity-25 mb-4" size={30} />
                  <p className="lead fw-light mb-3">"{v.text}"</p>
                  <footer className="blockquote-footer text-primary-light">{v.reference}</footer>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Security Info Section */}
      <section className="py-4 bg-white border-top">
        <Container>
          <Row className="text-center">
            <Col>
              <small className="text-muted">
                * All online transactions are encrypted and secure. New Gate Chapel acknowledges all 
                donations with an official receipt for tax purposes.
              </small>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Giving;
