import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaTrash, FaExclamationTriangle } from 'react-icons/fa';

const DeleteConfirmModal = ({ show, onHide, onConfirm, title, itemName, loading }) => {
  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered 
      contentClassName="glass-panel glass-panel-dark border-danger border-opacity-25"
    >
      <Modal.Header closeButton closeVariant="white" className="border-white border-opacity-10">
        <Modal.Title className="text-white d-flex align-items-center gap-2">
          <FaExclamationTriangle className="text-danger" /> {title || 'Confirm Deletion'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4 text-center">
        <div className="bg-danger bg-opacity-10 rounded-circle p-4 d-inline-block mb-4">
          <FaTrash className="text-danger" size={40} />
        </div>
        <h5 className="text-white mb-3">Are you sure?</h5>
        <p className="text-white opacity-50">
          You are about to delete <strong>{itemName || 'this item'}</strong>. 
          This action cannot be undone.
        </p>
      </Modal.Body>
      <Modal.Footer className="border-white border-opacity-10 p-3">
        <Button 
          variant="link" 
          className="text-white text-decoration-none opacity-50 hover-opacity-100" 
          onClick={onHide}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          variant="danger" 
          className="px-4 py-2 rounded-pill shadow-lg border-0"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Yes, Delete'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmModal;
