/**
 * EventsManagement - Admin CRUD interface for managing church events
 * 
 * Features:
 * - List all events with search functionality
 * - Create new events with image upload
 * - Edit existing events
 * - Delete events with confirmation
 * - Category filtering and badges
 * - Image preview for uploads
 * - Success/error notifications
 * 
 * @component
 */

import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Modal, Form, Row, Col } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaCalendarAlt } from 'react-icons/fa';
import api from '../../../services/api.js';
import { motion } from 'framer-motion';
import DeleteConfirmModal from '../../../components/common/DeleteConfirmModal';
import SuccessModal from '../../../components/common/SuccessModal';

const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successInfo, setSuccessInfo] = useState({ title: '', message: '' });
  const [currentEvent, setCurrentEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    category: 'Special Service',
    location: '',
    date: '',
    time: '',
    description: '',
    image: null,
    imageFile: null,
    imagePreview: null
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
      try {
          const data = await api.getEvents();
          if (data && data.results) setEvents(data.results);
          else if (Array.isArray(data)) setEvents(data);
      } catch (error) {
          // Silent fail - empty list will be shown
      }
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentEvent(null);
    setFormData({
      title: '',
      category: 'Special Service',
      location: '',
      date: '',
      time: '',
      description: '',
      image: null,
      imageFile: null,
      imagePreview: null
    });
  };

  const handleShow = (event = null, index = null) => {
    if (event) {
      setCurrentEvent({ ...event }); // index not needed for API
      setFormData({
        title: event.title,
        category: event.category,
        location: event.location,
        date: event.date,
        time: event.time,
        description: event.description || '',
        image: event.image,
        imageFile: null,
        imagePreview: null
      });
    } else {
      setCurrentEvent(null);
    }
    setShowModal(true);
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert('File is too large. Please upload an image smaller than 20MB.');
        return;
      }
      setFormData({ 
        ...formData, 
        imageFile: file, 
        imagePreview: URL.createObjectURL(file) 
      });
    }
  };

  const handleSave = async () => {
    try {
        if (formData.imageFile) {
            const formDataToSubmit = new FormData();
            formDataToSubmit.append('title', formData.title);
            formDataToSubmit.append('category', formData.category);
            formDataToSubmit.append('location', formData.location);
            formDataToSubmit.append('date', formData.date);
            formDataToSubmit.append('time', formData.time);
            formDataToSubmit.append('description', formData.description || '');
            formDataToSubmit.append('image', formData.imageFile);

            if (currentEvent && currentEvent.id) {
                await api.updateEventWithImage(currentEvent.id, formDataToSubmit);
            } else {
                await api.createEventWithImage(formDataToSubmit);
            }
        } else {
            const eventData = {
                title: formData.title,
                category: formData.category,
                location: formData.location,
                date: formData.date,
                time: formData.time,
                description: formData.description || ''
            };

            if (currentEvent && currentEvent.id) {
                await api.updateEvent(currentEvent.id, eventData);
            } else {
                await api.createEvent(eventData);
            }
        }
        fetchEvents();
        handleClose();
        setSuccessInfo({
            title: currentEvent ? 'Event Updated' : 'Event Created',
            message: `"${formData.title}" has been saved successfully.`
        });
        setShowSuccessModal(true);
    } catch (error) {
        alert("Failed to save event. Please try again.");
    }
  };

  const handleDelete = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    
    setDeleteLoading(true);
    try {
      await api.deleteEvent(eventToDelete.id);
      setShowDeleteModal(false);
      setEventToDelete(null);
      fetchEvents();
      setSuccessInfo({
        title: 'Event Deleted',
        message: 'The event has been permanently removed.'
      });
      setShowSuccessModal(true);
    } catch (error) {
      alert("Failed to delete event. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="events-management">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-5 gap-3">
        <div>
          <h2 className="fw-bold text-white mb-1">Manage Events</h2>
          <p className="text-white opacity-50 small mb-0">Add, edit, or remove church events from the website.</p>
        </div>
        <Button 
          variant="primary" 
          className="d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-lg border-0"
          style={{ background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)' }}
          onClick={() => handleShow()}
        >
          <FaPlus /> Add New Event
        </Button>
      </div>

      <div className="glass-panel glass-panel-dark border-white border-opacity-10 overflow-hidden">
        <div className="p-4 border-bottom border-white border-opacity-10 d-flex align-items-center">
          <div className="position-relative flex-grow-1 max-w-md">
            <FaSearch className="position-absolute start-0 top-50 translate-middle-y ms-3 text-white opacity-25" />
            <Form.Control 
              type="text" 
              placeholder="Search events..." 
              className="border-white border-opacity-10 text-white ps-5 py-2 rounded-3 shadow-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <Table className="table-dark table-hover mb-0 align-middle" style={{ backgroundColor: 'transparent' }}>
            <thead>
              <tr className="text-white opacity-50 small text-uppercase">
                <th className="ps-4">Title</th>
                <th>Category</th>
                <th>Date / Time</th>
                <th>Location</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event.id} className="border-bottom border-white border-opacity-5">
                  <td className="ps-4">
                    <div className="fw-bold text-white">{event.title}</div>
                    <div className="smaller text-white opacity-50 text-truncate" style={{ maxWidth: '200px' }}>{event.description}</div>
                  </td>
                  <td>
                    <Badge bg="primary" className="bg-opacity-25 text-primary border border-primary border-opacity-25 px-3 py-2 rounded-pill">
                      {event.category}
                    </Badge>
                  </td>
                  <td>
                    <div className="small text-white">{event.date}</div>
                    <div className="smaller text-white opacity-50">{event.time}</div>
                  </td>
                  <td className="small text-white">{event.location}</td>
                  <td className="text-end pe-4">
                    <div className="d-flex justify-content-end gap-2">
                      <Button variant="link" className="text-info p-2 hover-bg-white hover-bg-opacity-10 rounded-circle" onClick={() => handleShow(event)}>
                        <FaEdit />
                      </Button>
                      <Button variant="link" className="text-danger p-2 hover-bg-white hover-bg-opacity-10 rounded-circle" onClick={() => handleDelete(event)}>
                        <FaTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleClose} centered className="admin-modal">
        <Modal.Header closeButton className="bg-dark border-white border-opacity-10 text-white">
          <Modal.Title className="fw-bold">{currentEvent ? 'Edit Event' : 'Add New Event'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white p-4">
          <Form>
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold opacity-75">Event Image (Optional)</Form.Label>
              <div className="d-flex align-items-center gap-4">
                <div 
                  className="rounded-3 bg-white bg-opacity-10 d-flex align-items-center justify-content-center overflow-hidden border border-white border-opacity-10 shadow-inner"
                  style={{ width: '120px', height: '80px', flexShrink: 0 }}
                >
                  {formData.imagePreview ? (
                    <img src={formData.imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : formData.image ? (
                    <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <FaCalendarAlt className="opacity-25" size={24} />
                  )}
                </div>
                <div>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="rounded-pill px-3 mb-2 d-block"
                    onClick={() => document.getElementById('event-photo').click()}
                  >
                    {formData.image ? 'Change Photo' : 'Upload Photo'}
                  </Button>
                  <input 
                    type="file" 
                    id="event-photo" 
                    hidden 
                    accept="image/*" 
                    onChange={handleImageUpload}
                  />
                  {formData.image && (
                    <Button 
                      variant="link" 
                      className="text-danger p-0 small text-decoration-none"
                      onClick={() => setFormData({ ...formData, image: null })}
                    >
                      Remove Photo
                    </Button>
                  )}
                </div>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold opacity-75">Event Title</Form.Label>
              <Form.Control 
                type="text" 
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="border-white border-opacity-10 text-white shadow-none"
                placeholder="e.g. Easter Celebration"
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold opacity-75">Category</Form.Label>
                  <Form.Select 
                    value={formData.category} 
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="border-white border-opacity-10 text-white shadow-none"
                  >
                    <option value="Special Service">Special Service</option>
                    <option value="Outreach">Outreach</option>
                    <option value="Youth">Youth</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Family Event">Family Event</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold opacity-75">Location</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={formData.location} 
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="border-white border-opacity-10 text-white shadow-none"
                    placeholder="Main Sanctuary"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold opacity-75">Date</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={formData.date} 
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="border-white border-opacity-10 text-white shadow-none"
                    placeholder="April 12, 2026"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold opacity-75">Time</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={formData.time} 
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="border-white border-opacity-10 text-white shadow-none"
                    placeholder="9:00 AM"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold opacity-75">Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border-white border-opacity-10 text-white shadow-none"
                placeholder="Short description of the event..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-dark border-white border-opacity-10 p-4">
          <Button variant="outline-light" onClick={handleClose} className="rounded-pill px-4">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} className="rounded-pill px-4 shadow-lg border-0 bg-gradient-to-r" style={{ background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)' }}>
            {currentEvent ? 'Update Event' : 'Save Event'}
          </Button>
        </Modal.Footer>
      </Modal>

      <DeleteConfirmModal 
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        itemName={eventToDelete?.title}
        loading={deleteLoading}
      />

      <SuccessModal 
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        title={successInfo.title}
        message={successInfo.message}
      />

      <style>{`
        .admin-modal .modal-content {
          border-radius: 1.5rem;
          overflow: hidden;
          background-color: #0f172a;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .max-w-md {
          max-width: 400px;
        }
        .table-dark {
          --bs-table-bg: transparent;
        }
        .smaller {
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default EventsManagement;
