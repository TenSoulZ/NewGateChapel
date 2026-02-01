/**
 * Hero Component - Full-width hero section with glassmorphism design
 * 
 * Displays a prominent hero banner at the top of pages with:
 * - Animated entrance effects using Framer Motion
 * - Glassmorphism panel design with blur effect
 * - Customizable background (gradient and/or image)
 * - Optional primary and secondary action buttons
 * - Organic wave decoration at bottom
 * - Parallax background effect (fixed attachment)
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string|JSX.Element} props.title - Main heading (can include JSX for styling) 
 * @param {string} [props.subtitle] - Optional uppercase subtitle text
 * @param {string} [props.description] - Optional description paragraph
 * @param {Object} [props.primaryButton] - Primary action button {text, href}
 * @param {Object} [props.secondaryButton] - Secondary action button {text, href}
 * @param {string} [props.backgroundImage] - Optional background image URL
 * @param {string} [props.backgroundGradient] - CSS gradient (default: blue gradient)
 * 
 * @example
 * <Hero
 *   title="Welcome Home"
 *   subtitle="New Gate Chapel"
 *   description="Join us for worship"
 *   primaryButton={{text: "Visit Us", href: "/contact"}}
 * />
 */
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const Hero = ({ 
  title, 
  subtitle, 
  description, 
  primaryButton, 
  secondaryButton,
  backgroundImage,
  backgroundGradient = 'linear-gradient(135deg, rgba(0, 119, 182, 0.8) 0%, rgba(3, 4, 94, 0.9) 100%)'
}) => {

  return (
    <section 
      className="hero-section position-relative d-flex align-items-center" 
      style={{ 
        minHeight: '85vh', 
        marginTop: '-80px', // Adjust for navbar overlap
        overflow: 'hidden'
      }}
    >
      {/* Optimized Fixed Background */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          background: backgroundImage 
            ? `${backgroundGradient}, url(${backgroundImage})`
            : backgroundGradient,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          willChange: 'transform', // Hint to browser for optimization
          pointerEvents: 'none'
        }}
      />
      <Container className="position-relative" style={{ zIndex: 2 }}>
        <Row className="align-items-center justify-content-center">
          <Col lg={10} xl={9} className="text-center">
            <div
              className="glass-panel p-5 p-md-5 mx-auto text-white shadow-lg"
              style={{ maxWidth: '900px' }}
            >
              {subtitle && (
                <p 
                  className="text-warning text-uppercase fw-bold mb-3"
                  style={{ letterSpacing: '3px', fontSize: '0.9rem' }}
                >
                  {subtitle}
                </p>
              )}
              
              <h1 
                className="display-2 fw-bold text-white mb-4"
                style={{ lineHeight: 1.1 }}
              >
                {title}
              </h1>
              
              {description && (
                <p 
                  className="lead text-light mb-5 mx-auto opacity-75" 
                  style={{ maxWidth: '700px', lineHeight: 1.6 }}
                >
                  {description}
                </p>
              )}
              
              <div 
                className="d-flex gap-3 justify-content-center flex-wrap"
              >
                {primaryButton && (
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="px-5 shadow-lg fw-bold"
                    href={primaryButton.href}
                  >
                    {primaryButton.text}
                  </Button>
                )}
                {secondaryButton && (
                  <Button 
                    variant="outline-light" 
                    size="lg" 
                    className="px-5 rounded-pill fw-bold"
                    href={secondaryButton.href}
                  >
                    {secondaryButton.text}
                  </Button>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Hero-specific organic shapes */}
      <div className="position-absolute bottom-0 start-0 w-100 overflow-hidden" style={{ height: '100px', pointerEvents: 'none' }}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: 'calc(100% + 1.3px)', height: '100px' }}>
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#F8FAFC" style={{ opacity: 0.1 }}></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
