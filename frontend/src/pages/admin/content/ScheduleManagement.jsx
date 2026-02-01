import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Badge } from 'react-bootstrap';
import { FaSave, FaPlus, FaTrash, FaEdit, FaTimes, FaClock, FaBible, FaPrayingHands, FaMusic, FaChild } from 'react-icons/fa';
import api from '../../../services/api.js';
import DeleteConfirmModal from '../../../components/common/DeleteConfirmModal';
import SuccessModal from '../../../components/common/SuccessModal';

const iconMap = {
  FaBible: FaBible,
  FaPrayingHands: FaPrayingHands,
  FaMusic: FaMusic,
  FaChild: FaChild,
};

const ScheduleManagement = () => {
  const [schedule, setSchedule] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successInfo, setSuccessInfo] = useState({ title: '', message: '' });
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    day: '',
    time: '',
    type: '',
    description: '',
    timezone: 'America/New_York'
  });

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const data = await api.getSchedule();
      if (data && data.results) setSchedule(data.results);
      else if (Array.isArray(data)) setSchedule(data);
    } catch (error) {
      console.error("Failed to fetch schedule", error);
    }
  };

  const handleSave = async () => {
    try {
      if (editingItem !== null && editingItem.id) {
        await api.updateSchedule(editingItem.id, formData);
      } else {
        await api.createSchedule(formData);
      }
      fetchSchedule();
      setShowModal(false);
      resetForm();
      setSuccessInfo({
        title: editingItem ? 'Schedule Updated' : 'Service Added',
        message: `The "${formData.type}" service has been saved successfully.`
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to save schedule", error);
      alert("Failed to save schedule.");
    }
  };

  const resetForm = () => {
    setFormData({
      day: '',
      time: '',
      type: '',
      description: '',
      timezone: 'America/New_York'
    });
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      day: item.day,
      time: item.time,
      type: item.type,
      description: item.description || '',
      timezone: item.timezone || 'America/New_York'
    });
    setShowModal(true);
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleteLoading(true);
    try {
      await api.deleteSchedule(itemToDelete.id);
      setShowDeleteModal(false);
      setItemToDelete(null);
      fetchSchedule();
      setSuccessInfo({
        title: 'Service Removed',
        message: 'The schedule entry has been deleted.'
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to delete schedule", error);
      alert("Failed to delete schedule.");
    } finally {
      setDeleteLoading(false);
    }
  };


  return (
    <div className="admin-page animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-white fw-bold mb-0">Weekly Schedule</h2>
          <p className="text-white opacity-50 mb-0">Manage service times and descriptions</p>
        </div>
        <Button 
          variant="primary" 
          className="d-flex align-items-center gap-2 rounded-pill px-4"
          onClick={() => { resetForm(); setShowModal(true); }}
        >
          <FaPlus /> Add New Service
        </Button>
      </div>

      <Card className="glass-panel glass-panel-dark border-0 shadow-lg">
        <Card.Body className="p-0">
          <Table responsive hover variant="dark" className="mb-0 text-white border-white border-opacity-10">
            <thead className="bg-white bg-opacity-5">
              <tr>
                <th className="px-4 py-3 border-0 opacity-50 small uppercase fw-bold">Service Type</th>
                <th className="px-4 py-3 border-0 opacity-50 small uppercase fw-bold">Day & Time</th>
                <th className="px-4 py-3 border-0 opacity-50 small uppercase fw-bold">Description</th>
                <th className="px-4 py-3 border-0 opacity-50 small uppercase fw-bold text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="border-0">
              {schedule.map((item) => (
                <tr key={item.id} className="border-white border-opacity-10">
                  <td className="px-4 py-4 align-middle border-0">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary">
                        <FaClock size={20} />
                      </div>
                      <div className="fw-bold">{item.type}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle border-0">
                    <div className="fw-bold">{item.day}</div>
                    <Badge bg="info" className="bg-opacity-10 text-info fw-normal mt-1">{item.time}</Badge>
                  </td>
                  <td className="px-4 py-4 align-middle border-0">
                    <div className="small opacity-75 text-truncate" style={{ maxWidth: '300px' }}>{item.description}</div>
                  </td>
                  <td className="px-4 py-4 align-middle border-0 text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <Button variant="link" className="text-info p-0" onClick={() => handleEdit(item)}>
                        <FaEdit size={18} />
                      </Button>
                      <Button variant="link" className="text-danger p-0" onClick={() => handleDelete(item)}>
                        <FaTrash size={18} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg" className="admin-modal">
        <Modal.Header closeButton className="bg-dark text-white border-white border-opacity-10">
          <Modal.Title className="fw-bold">
            {editingItem !== null ? 'Edit Service' : 'Add New Service'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white p-4">
          <Form>
            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label className="small uppercase fw-bold opacity-50">Service Type</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    placeholder="e.g. Sunday Morning Worship"
                    className="border-white border-opacity-10 text-white py-2"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label className="small uppercase fw-bold opacity-50">Day</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={formData.day}
                    onChange={(e) => setFormData({...formData, day: e.target.value})}
                    placeholder="e.g. Sunday"
                    className="border-white border-opacity-10 text-white py-2"
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label className="small uppercase fw-bold opacity-50">Time</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    placeholder="e.g. 10:00 AM"
                    className="border-white border-opacity-10 text-white py-2"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label className="small uppercase fw-bold opacity-50">Timezone</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={formData.timezone}
                    onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                    placeholder="e.g. America/New_York"
                    className="border-white border-opacity-10 text-white py-2"
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-4">
              <Form.Label className="small uppercase fw-bold opacity-50">Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Brief description of the service..."
                className="bg-white bg-opacity-5 border-white border-opacity-10 text-white py-2"
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-3 mt-4">
              <Button variant="link" className="text-white opacity-50 text-decoration-none" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" className="rounded-pill px-5 py-2 fw-bold d-flex align-items-center gap-2" onClick={handleSave}>
                <FaSave /> Save Service
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <DeleteConfirmModal 
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.type}
        loading={deleteLoading}
      />

      <SuccessModal 
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        title={successInfo.title}
        message={successInfo.message}
      />
    </div>
  );
};

export default ScheduleManagement;
