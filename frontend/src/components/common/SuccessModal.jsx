import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const SuccessModal = ({ show, onHide, title, message }) => {
  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered 
      contentClassName="glass-panel glass-panel-dark border-success border-opacity-25 overflow-hidden"
    >
      <Modal.Body className="p-5 text-center">
        <AnimatePresence>
          {show && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            >
              <div className="bg-success bg-opacity-10 rounded-circle p-4 d-inline-block mb-4 shadow-sm">
                <FaCheckCircle className="text-success" size={60} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <h3 className="text-white fw-bold mb-3">{title || 'Success!'}</h3>
        <p className="text-white opacity-75 mb-4">
          {message || 'Your changes have been saved successfully.'}
        </p>
        
        <Button 
          variant="success" 
          className="px-5 py-2 rounded-pill shadow-lg border-0 fw-bold"
          onClick={onHide}
          style={{ background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)' }}
        >
          Great, thanks!
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default SuccessModal;
