/**
 * Footer Component - Site-wide footer with church info and social links
 * 
 * Features:
 * - Church contact information (address, phone, email)
 * - Service times (static, could be made dynamic)
 * - Social media links (Facebook, X/Twitter)
 * - Affiliated links section
 * - Copyright notice with current year
 * 
 * Data Sources:
 * - Church contact info from `/api/church-info/`
 * 
 * @component
 */

import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { FaFacebook, FaTwitter, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import api from '../services/api'

const Footer = () => {
  // State with default fallback values
  const [churchInfo, setChurchInfo] = useState({
    facebook_url: 'https://www.facebook.com/profile.php?id=61557353668205',
    twitter_url: 'https://x.com/newgatechapel1?s=11',
    address: 'Stand Number 15493, Figtree Road, Buckland Terraces, Harare',
    phone: '+263 71 233 2632',
    email: 'info@newgatechapel.org'
  })

  /**
   * Fetches church contact information on mount.
   * Merges API data with defaults to prevent empty values.
   */
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const infoData = await api.getChurchInfo()
        const info = (infoData?.results || infoData || [])[0]
        if (info) {
          // Merge API data with defaults, only using API values if they're not empty
          setChurchInfo(prev => ({
            facebook_url: info.facebook_url || prev.facebook_url,
            twitter_url: info.twitter_url || prev.twitter_url,
            address: info.address || prev.address,
            phone: info.phone || prev.phone,
            email: info.email || prev.email
          }))
        }
      } catch (error) {
        // Silent fail - default contact info will be used
      }
    }
    fetchInfo()
  }, [])
  return (
    <footer className="footer mt-5 py-4">
      <Container>
        <Row>
          <Col md={3} className="mb-3">
            <div className="mb-3">
              <img 
                src="/newgatechapellogo.svg" 
                alt="New Gate Chapel Logo" 
                className="img-fluid"
                style={{ maxWidth: '150px', height: 'auto' }}
              />
            </div>
            <h5>New Gate Chapel</h5>
            <p className="mb-2">
              <FaMapMarkerAlt className="me-2" />
              {churchInfo.address}
            </p>
            <p className="mb-2">
              <FaPhone className="me-2" />
              {churchInfo.phone}
            </p>
            <p className="mb-2">
              <FaEnvelope className="me-2" />
              {churchInfo.email}
            </p>
          </Col>
          
          <Col md={3} className="mb-3">
            <h5>Service Times</h5>
            <p className="mb-1">Sunday Worship: 10:00 AM</p>
            <p className="mb-1">Wednesday Bible Study: 7:00 PM</p>
            <p className="mb-1">Youth Group: Friday 6:30 PM</p>
          </Col>
          
          <Col md={3} className="mb-3">
            <h5>Quick Links</h5>
            <div className="d-flex flex-column gap-2">
              <a href="/" className="footer-link">Home</a>
              <a href="/about" className="footer-link">About Us</a>
              <a href="/services" className="footer-link">Services</a>
              <a href="/ministries" className="footer-link">Ministries</a>
              <a href="/events" className="footer-link">Events</a>
              <a href="/sermons" className="footer-link">Sermons</a>
              <a href="/giving" className="footer-link">Give</a>
              <a href="/contact" className="footer-link">Contact</a>
              <a href="/admin/login" className="footer-link text-warning">Admin</a>
            </div>
          </Col>
          
          <Col md={3} className="mb-3">
            <h5>Follow Us</h5>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex gap-3 mb-2">
                {churchInfo.facebook_url && (
                  <a href={churchInfo.facebook_url} target="_blank" rel="noopener noreferrer" className="fs-4 icon-bounce text-light" title="New Gate Chapel Facebook">
                    <FaFacebook />
                  </a>
                )}
                {churchInfo.twitter_url && (
                  <a href={churchInfo.twitter_url} target="_blank" rel="noopener noreferrer" className="fs-4 icon-bounce text-light" title="New Gate Chapel X">
                    <FaTwitter />
                  </a>
                )}
              </div>
              <div className="small text-light opacity-75 mt-2">Affiliated Links:</div>
              <div className="d-flex flex-column gap-1">
                <a href="https://x.com/pemakarimayi?s=11" target="_blank" rel="noopener noreferrer" className="text-light text-decoration-none small hover-opacity-100" title="Pastor Erasmus Makarimayi X">
                  <FaTwitter className="me-1" /> Pastor Erasmus Makarimayi
                </a>
                <a href="https://x.com/creation_daily?s=11" target="_blank" rel="noopener noreferrer" className="text-light text-decoration-none small hover-opacity-100" title="Creation Daily X">
                  <FaTwitter className="me-1" /> Creation Daily
                </a>
              </div>
            </div>
          </Col>
        </Row>
        
        <hr className="my-4" />
        
        <Row>
          <Col className="text-center">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} New Gate Chapel. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
