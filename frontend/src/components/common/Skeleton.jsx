import React from 'react';
import { Card, Placeholder } from 'react-bootstrap';
import PropTypes from 'prop-types';

/**
 * Skeleton component for card-based content.
 * Displays a pulsating placeholder mimicking a card layout.
 */
export const SkeletonCard = ({ height = '300px' }) => {
  return (
    <Card className="h-100 border-0 glass-panel shadow-sm overflow-hidden" aria-hidden="true">
      <Card.Body className="p-4">
        {/* Icon placeholder */}
        <Placeholder as="div" animation="glow" className="mb-4">
          <Placeholder xs={3} style={{ height: '40px', borderRadius: '50%' }} className="bg-secondary opacity-25" />
        </Placeholder>
        
        {/* Title placeholder */}
        <Placeholder as="h5" animation="glow" className="mb-3">
          <Placeholder xs={8} className="bg-secondary opacity-25 rounded" />
        </Placeholder>
        
        {/* Text placeholder */}
        <Placeholder as="p" animation="glow">
          <Placeholder xs={12} className="bg-secondary opacity-10 mb-2 rounded" />
          <Placeholder xs={10} className="bg-secondary opacity-10 mb-2 rounded" />
          <Placeholder xs={8} className="bg-secondary opacity-10 rounded" />
        </Placeholder>

        {/* Button placeholder (optional based on usage) */}
        <Placeholder.Button variant="secondary" xs={6} className="mt-3 opacity-25 rounded-pill border-0" />
      </Card.Body>
    </Card>
  );
};

SkeletonCard.propTypes = {
  height: PropTypes.string,
};

/**
 * Skeleton component for Hero section.
 */
export const SkeletonHero = () => {
    return (
        <div className="skeleton-hero w-100 d-flex align-items-center justify-content-center" style={{ height: '80vh', background: 'rgba(0,0,0,0.05)' }} aria-hidden="true">
            <div className="text-center w-50">
                 <Placeholder as="h1" animation="glow" className="mb-4">
                    <Placeholder xs={12} size="lg" className="bg-secondary opacity-25 rounded mb-2" style={{ height: '60px' }} />
                    <Placeholder xs={8} size="lg" className="bg-secondary opacity-25 rounded" style={{ height: '60px' }} />
                 </Placeholder>
                 <Placeholder as="p" animation="glow" className="mb-5">
                    <Placeholder xs={12} className="bg-secondary opacity-10 rounded mb-2" />
                    <Placeholder xs={10} className="bg-secondary opacity-10 rounded" />
                 </Placeholder>
                 <div className="d-flex justify-content-center gap-3">
                    <Placeholder.Button variant="secondary" xs={3} className="opacity-25 rounded-pill py-3" />
                    <Placeholder.Button variant="secondary" xs={3} className="opacity-25 rounded-pill py-3" />
                 </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
