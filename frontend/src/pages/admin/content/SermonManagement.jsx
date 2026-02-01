/**
 * SermonManagement - Admin CRUD interface for managing sermon archive
 * 
 * Features:
 * - List all sermons with speaker and series info
 * - Create new sermons with video embeds and image upload
 * - Edit existing sermons
 * - Delete sermons with confirmation  
 * - Category and series organization
 * - YouTube/Vimeo video URL embedding
 * - Success/error notifications
 * 
 * @component
 */

import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Badge } from 'react-bootstrap';
import { FaSave, FaPlus, FaTrash, FaEdit, FaMicrophone, FaPlay, FaCalendarAlt, FaUser, FaTag } from 'react-icons/fa';
import api from '../../../services/api.js';
import DeleteConfirmModal from '../../../components/common/DeleteConfirmModal';
import SuccessModal from '../../../components/common/SuccessModal';

const SermonManagement = () => {
  const [sermons, setSermons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successInfo, setSuccessInfo] = useState({ title: '', message: '' });
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    speaker: '',
    description: '',
    series: '',
    category: '',
    video_url: '',
    image: null,
    imageFile: null,
    imagePreview: null
  });

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    try {
      const data = await api.getSermons();
      if (data && data.results) setSermons(data.results);
      else if (Array.isArray(data)) setSermons(data);
    } catch (error) {
      // Silent fail - empty list will be shown
    }
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
      let cleanVideoUrl = formData.video_url || '';
      if (cleanVideoUrl.includes('<iframe') && cleanVideoUrl.includes('src="')) {
        const match = cleanVideoUrl.match(/src="([^"]+)"/);
        if (match && match[1]) {
          cleanVideoUrl = match[1];
        }
      }

      if (formData.imageFile) {
        const formDataToSubmit = new FormData();
        formDataToSubmit.append('title', formData.title);
        formDataToSubmit.append('date', formData.date);
        formDataToSubmit.append('speaker', formData.speaker);
        formDataToSubmit.append('description', formData.description);
        formDataToSubmit.append('series', formData.series || '');
        formDataToSubmit.append('category', formData.category);
        formDataToSubmit.append('video_url', cleanVideoUrl);
        formDataToSubmit.append('image', formData.imageFile);

        if (editingItem && editingItem.id) {
          await api.updateSermonWithImage(editingItem.id, formDataToSubmit);
        } else {
          await api.createSermonWithImage(formDataToSubmit);
        }
      } else {
        const sermonData = {
          title: formData.title,
          date: formData.date,
          speaker: formData.speaker,
          description: formData.description,
          series: formData.series || '',
          category: formData.category,
          video_url: cleanVideoUrl
        };

        if (editingItem && editingItem.id) {
          await api.updateSermon(editingItem.id, sermonData);
        } else {
          await api.createSermon(sermonData);
        }
      }
      fetchSermons();
      setShowModal(false);
      resetForm();
      setSuccessInfo({
        title: editingItem ? 'Sermon Updated' : 'Sermon Created',
        message: `"${formData.title}" has been saved successfully.`
      });
      setShowSuccessModal(true);
    } catch (error) {
      alert("Failed to save sermon. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      speaker: '',
      description: '',
      series: '',
      category: 'Faith',
      video_url: '',
      image: null,
      imageFile: null,
      imagePreview: null
    });
    setEditingItem(null);
  };

  const handleEdit = (sermon) => {
    setEditingItem(sermon);
    setFormData({
      title: sermon.title,
      date: sermon.date,
      speaker: sermon.speaker,
      description: sermon.description,
      series: sermon.series || '',
      category: sermon.category,
      video_url: sermon.video_url || '',
      image: sermon.image,
      imageFile: null,
      imagePreview: null
    });
    setShowModal(true);
  };

  const handleDelete = (sermon) => {
    setItemToDelete(sermon);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleteLoading(true);
    try {
      await api.deleteSermon(itemToDelete.id);
      setShowDeleteModal(false);
      setItemToDelete(null);
      fetchSermons();
      setSuccessInfo({
        title: 'Sermon Deleted',
        message: 'The sermon record has been removed.'
      });
      setShowSuccessModal(true);
    } catch (error) {
      alert("Failed to delete sermon. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="admin-page animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-white fw-bold mb-0">Sermon Management</h2>
          <p className="text-white opacity-50 mb-0">Update and organize the sermon archive</p>
        </div>
        <Button 
          variant="primary" 
          className="d-flex align-items-center gap-2 rounded-pill px-4"
          onClick={() => { resetForm(); setShowModal(true); }}
        >
          <FaPlus /> Add New Sermon
        </Button>
      </div>

      <Card className="glass-panel glass-panel-dark border-0 shadow-lg">
        <Card.Body className="p-0">
          <Table responsive hover variant="dark" className="mb-0 text-white border-white border-opacity-10">
            <thead>
              <tr>
                <th className="px-4 py-3 border-0 opacity-50 small uppercase fw-bold">Sermon Details</th>
                <th className="px-4 py-3 border-0 opacity-50 small uppercase fw-bold">Speaker</th>
                <th className="px-4 py-3 border-0 opacity-50 small uppercase fw-bold">Series / Category</th>
                <th className="px-4 py-3 border-0 opacity-50 small uppercase fw-bold text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="border-0">
              {sermons.map((item) => (
                <tr key={item.id} className="border-white border-opacity-10">
                  <td className="px-4 py-4 align-middle border-0">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary">
                        <FaMicrophone size={18} />
                      </div>
                      <div>
                        <div className="fw-bold d-flex align-items-center gap-2">
                          {item.title}
                          {item.video_url && <FaPlay size={10} className="text-primary" title="Video attached" />}
                        </div>
                        <div className="small opacity-50"><FaCalendarAlt size={10} className="me-1" />{item.date}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle border-0">
                    <div className="small fw-bold"><FaUser size={10} className="me-1 opacity-50" /> {item.speaker}</div>
                  </td>
                  <td className="px-4 py-4 align-middle border-0">
                    <div className="d-flex flex-column gap-1">
                      <Badge bg="info" className="bg-opacity-10 text-info fw-normal text-start d-inline-block w-fit-content">
                        {item.series}
                      </Badge>
                      <Badge bg="light" className="bg-opacity-10 text-white fw-normal border border-white border-opacity-10 text-start d-inline-block w-fit-content">
                         <FaTag size={8} className="me-1" /> {item.category}
                      </Badge>
                    </div>
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
            {editingItem !== null ? 'Edit Sermon' : 'Add New Sermon'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white p-4">
          <Form>
            <Form.Group className="mb-4">
              <Form.Label className="small uppercase fw-bold opacity-50">Sermon Cover Photo (Optional)</Form.Label>
              <div className="d-flex align-items-center gap-4">
                <div 
                  className="rounded-3 bg-white bg-opacity-10 d-flex align-items-center justify-content-center overflow-hidden border border-white border-opacity-10 shadow-inner"
                  style={{ width: '160px', height: '90px', flexShrink: 0 }}
                >
                  {formData.imagePreview ? (
                    <img src={formData.imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : formData.image ? (
                    <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <FaMicrophone className="opacity-25" size={24} />
                  )}
                </div>
                <div>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="rounded-pill px-3 mb-2 d-block"
                    onClick={() => document.getElementById('sermon-photo').click()}
                  >
                    {formData.image || formData.imageFile ? 'Change Photo' : 'Upload Photo'}
                  </Button>
                  <input 
                    type="file" 
                    id="sermon-photo" 
                    hidden 
                    accept="image/*" 
                    onChange={handleImageUpload}
                  />
                  {formData.imageFile && (
                    <Button 
                      variant="link" 
                      className="text-danger p-0 small text-decoration-none"
                      onClick={() => setFormData({ ...formData, imageFile: null, imagePreview: null })}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small uppercase fw-bold opacity-50">Sermon Title</Form.Label>
              <Form.Control 
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Walking in Faith"
                className="border-white border-opacity-10 text-white py-2 shadow-none"
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label className="small uppercase fw-bold opacity-50">Speaker</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={formData.speaker}
                    onChange={(e) => setFormData({...formData, speaker: e.target.value})}
                    placeholder="e.g. Pastor John Smith"
                    className="border-white border-opacity-10 text-white py-2 shadow-none"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label className="small uppercase fw-bold opacity-50">Date</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    placeholder="e.g. December 10, 2023"
                    className="border-white border-opacity-10 text-white py-2 shadow-none"
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label className="small uppercase fw-bold opacity-50">Series Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={formData.series}
                    onChange={(e) => setFormData({...formData, series: e.target.value})}
                    placeholder="e.g. Living Faith Series"
                    className="border-white border-opacity-10 text-white py-2 shadow-none"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label className="small uppercase fw-bold opacity-50">Category</Form.Label>
                  <Form.Select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="border-white border-opacity-10 text-white py-2 shadow-none"
                  >
                    <option value="Faith" className="bg-dark">Faith</option>
                    <option value="Spiritual Growth" className="bg-dark">Spiritual Growth</option>
                    <option value="Christian Living" className="bg-dark">Christian Living</option>
                    <option value="Leadership" className="bg-dark">Leadership</option>
                    <option value="Mission" className="bg-dark">Mission</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label className="small uppercase fw-bold opacity-50">Description / Key Points</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Brief summary of the message..."
                className="border-white border-opacity-10 text-white py-2 shadow-none"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="small uppercase fw-bold opacity-50">Video Embed URL (Optional)</Form.Label>
              <Form.Control 
                type="text" 
                value={formData.video_url || ''}
                onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                placeholder="e.g. https://www.youtube.com/embed/..."
                className="border-white border-opacity-10 text-white py-2 shadow-none font-monospace"
              />
              <Form.Text className="text-white opacity-25 smaller">
                Use the <strong>embed</strong> URL from YouTube or Vimeo.
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end gap-3 mt-4">
              <Button variant="link" className="text-white opacity-50 text-decoration-none" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" className="rounded-pill px-5 py-2 fw-bold d-flex align-items-center gap-2" onClick={handleSave}>
                <FaSave /> Save Sermon
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <DeleteConfirmModal 
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.title}
        loading={deleteLoading}
      />

      <SuccessModal 
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        title={successInfo.title}
        message={successInfo.message}
      />

      <style>{`
        .w-fit-content { width: fit-content; }
        .admin-modal .modal-content { border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
      `}</style>
    </div>
  );
};

export default SermonManagement;
