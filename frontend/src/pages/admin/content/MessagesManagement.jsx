import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import { FaEye, FaTrash, FaEnvelopeOpen, FaEnvelope, FaExclamationCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/api';
import SEO from '../../../components/common/SEO';

const MessagesManagement = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await api.getContactMessages();
      setMessages(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch messages', err);
      setError('Could not load messages. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (message) => {
    setSelectedMessage(message);
    setReplyText(message.reply_text || '');
    setShowModal(true);
    if (!message.is_read) {
      handleToggleRead(message.id, true);
    }
  };

  const handleReplyUpdate = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    
    try {
      setIsReplying(true);
      const data = { 
        reply_text: replyText,
        replied_at: new Date().toISOString(),
        is_read: true // Assuming replying marks it as read
      };
      
      const response = await api.updateContactMessage(selectedMessage.id, data);
      
      setMessages(messages.map(m => m.id === selectedMessage.id ? response : m));
      setSelectedMessage(response);
      setShowModal(false);
      setReplyText('');
    } catch (err) {
      console.error('Failed to send reply', err);
    } finally {
      setIsReplying(false);
    }
  };

  const handleToggleRead = async (id, status) => {
    try {
      const response = await api.updateContactMessage(id, { is_read: status });
      setMessages(messages.map(m => m.id === id ? response : m));
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await api.deleteContactMessage(id);
        setMessages(messages.filter(m => m.id !== id));
      } catch (err) {
        console.error('Failed to delete message', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-management">
      <SEO title="Inquiries Management" />
      
      <div className="d-flex align-items-center justify-content-between mb-5">
        <div>
          <h2 className="fw-bold mb-1 text-white">Guest Inquiries</h2>
          <p className="text-white opacity-50 small mb-0">Manage messages from your website's contact form.</p>
        </div>
        <Button variant="outline-primary" onClick={fetchMessages} className="glass-panel text-white hover-lift">
          Refresh Inbox
        </Button>
      </div>

      {error && (
        <Card className="bg-danger bg-opacity-10 border-danger border-opacity-25 p-4 mb-4">
          <div className="d-flex align-items-center gap-3 text-white">
            <FaExclamationCircle size={24} className="text-danger" />
            <p className="mb-0">{error}</p>
          </div>
        </Card>
      )}

      <Card className="glass-panel glass-panel-dark border-white border-opacity-10 shadow-2xl overflow-hidden">
        <div className="table-responsive">
          <Table className="admin-table mb-0 text-white align-middle">
            <thead>
              <tr className="bg-white bg-opacity-5 border-bottom border-white border-opacity-10">
                <th className="px-4 py-3">Status</th>
                <th className="py-3">From</th>
                <th className="py-3">Subject</th>
                <th className="py-3 text-center">Date</th>
                <th className="px-4 py-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.length > 0 ? (
                messages.map((message) => (
                  <tr key={message.id} className={`border-bottom border-white border-opacity-5 ${!message.is_read ? 'bg-white bg-opacity-5 fw-bold' : 'opacity-75'}`}>
                    <td className="px-4 py-3">
                      {!message.is_read ? (
                        <Badge bg="primary" className="rounded-pill px-3 py-2">New</Badge>
                      ) : message.reply_text ? (
                        <Badge bg="success" className="bg-opacity-25 rounded-pill px-3 py-2">Replied</Badge>
                      ) : (
                        <Badge bg="secondary" className="bg-opacity-25 rounded-pill px-3 py-2">Read</Badge>
                      )}
                    </td>
                    <td className="py-3">
                      <div>
                        <div className="fw-bold">{message.name}</div>
                        <div className="small opacity-50">{message.email}</div>
                      </div>
                    </td>
                    <td className="py-3 text-truncate" style={{ maxWidth: '200px' }}>
                      {message.subject}
                    </td>
                    <td className="py-3 text-center small opacity-50">
                      {new Date(message.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <Button 
                          variant="link" 
                          className="text-primary p-2 hover-lift"
                          onClick={() => handleView(message)}
                        >
                          <FaEye size={18} />
                        </Button>
                        <Button 
                          variant="link" 
                          className="text-danger p-2 hover-lift"
                          onClick={() => handleDelete(message.id)}
                        >
                          <FaTrash size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5 opacity-50">
                    No inquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* View Message Modal */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        centered
        className="glass-modal"
        contentClassName="glass-panel glass-panel-dark border-white border-opacity-10 text-white shadow-2xl"
      >
        <Modal.Header closeButton className="border-white border-opacity-10 close-white">
          <Modal.Title className="fw-bold">Guest Message</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedMessage && (
            <>
              <div className="d-flex justify-content-between mb-4">
                <div>
                  <h6 className="opacity-50 small text-uppercase mb-1">From</h6>
                  <p className="fw-bold mb-0">{selectedMessage.name}</p>
                  <p className="small opacity-75">{selectedMessage.email}</p>
                </div>
                <div className="text-end">
                  <h6 className="opacity-50 small text-uppercase mb-1">Date</h6>
                  <p className="small mb-0">{new Date(selectedMessage.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="mb-4">
                <h6 className="opacity-50 small text-uppercase mb-1">Subject</h6>
                <p className="fw-bold fs-5 text-primary">{selectedMessage.subject}</p>
              </div>
              <div style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.4)', 
                padding: '24px', 
                borderRadius: '16px', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
              }}>
                <h6 style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Guest Message
                </h6>
                <p style={{ 
                  color: '#ffffff', 
                  margin: 0, 
                  overflow: 'auto', 
                  maxHeight: '400px', 
                  whiteSpace: 'pre-wrap', 
                  lineHeight: '1.8', 
                  fontSize: '1.1rem',
                  fontWeight: '400'
                }}>
                  {selectedMessage.message}
                </p>
              </div>
              <div className="mt-4">
                <h6 style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Admin Response
                </h6>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Type your response here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="glass-panel glass-panel-dark border-white border-opacity-10 text-white p-3 rounded-4"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                />
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 p-4 pt-0">
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowModal(false)}
            className="rounded-pill border-white border-opacity-20 text-white"
          >
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={handleReplyUpdate}
            disabled={isReplying || !replyText.trim()}
            className="rounded-pill shadow-lg border-0 bg-gradient-to-r"
            style={{ background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)' }}
          >
            {isReplying ? 'Saving...' : selectedMessage?.reply_text ? 'Update Reply' : 'Save Reply'}
          </Button>
          {!selectedMessage?.reply_text && (
            <Button 
              variant="link" 
              onClick={() => handleToggleRead(selectedMessage.id, !selectedMessage.is_read)}
              className="text-white opacity-50 small text-decoration-none ms-auto"
            >
              {selectedMessage?.is_read ? 'Mark Unread' : 'Mark Read'}
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <style>{`
        .admin-table tbody tr:hover {
          background-color: rgba(255, 255, 255, 0.02) !important;
        }
        .close-white .btn-close {
          filter: invert(1) grayscale(100%) brightness(200%);
        }
      `}</style>
    </div>
  );
};

export default MessagesManagement;
