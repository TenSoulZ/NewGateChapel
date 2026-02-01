import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, ListGroup, Modal } from 'react-bootstrap';
import { 
  FaSave, FaPlus, FaTrash, FaUserTie, FaGem,
  FaHeart, FaUsers, FaHandsHelping, FaSeedling, FaPray,
  FaBible, FaLightbulb, FaShieldAlt, FaStar, FaCross,
  FaHands, FaGlobe, FaChurch, FaInfinity, FaPeace, FaEdit
} from 'react-icons/fa';
import api from '../../../services/api.js';
import { motion } from 'framer-motion';
import DeleteConfirmModal from '../../../components/common/DeleteConfirmModal';
import SuccessModal from '../../../components/common/SuccessModal';

const AboutManagement = () => {
  const [values, setValues] = useState([]);
  const [leadership, setLeadership] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showValueModal, setShowValueModal] = useState(false);
  const [showLeaderModal, setShowLeaderModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null); // 'value' or 'leader'
  const [editingValue, setEditingValue] = useState(null);
  const [editingLeader, setEditingLeader] = useState(null);
  
  const [valueForm, setValueForm] = useState({ title: '', description: '', icon_name: 'FaHeart' });
  const [leaderForm, setLeaderForm] = useState({ name: '', role: '', description: '', image: null, imageFile: null, imagePreview: null });
  
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successInfo, setSuccessInfo] = useState({ title: '', message: '' });

  // Icon mapping for available FontAwesome icons
  const iconMap = {
    FaHeart, FaUsers, FaHandsHelping, FaSeedling, FaPray,
    FaBible, FaLightbulb, FaShieldAlt, FaStar, FaCross,
    FaHands, FaGlobe, FaChurch, FaInfinity, FaPeace
  };

  // Available icons for selection
  const availableIcons = [
    { name: 'FaHeart', label: 'Heart', component: FaHeart },
    { name: 'FaUsers', label: 'Community', component: FaUsers },
    { name: 'FaHandsHelping', label: 'Service', component: FaHandsHelping },
    { name: 'FaSeedling', label: 'Growth', component: FaSeedling },
    { name: 'FaPray', label: 'Prayer', component: FaPray },
    { name: 'FaBible', label: 'Faith', component: FaBible },
    { name: 'FaLightbulb', label: 'Wisdom', component: FaLightbulb },
    { name: 'FaShieldAlt', label: 'Protection', component: FaShieldAlt },
    { name: 'FaStar', label: 'Excellence', component: FaStar },
    { name: 'FaCross', label: 'Faith', component: FaCross },
    { name: 'FaHands', label: 'Helping', component: FaHands },
    { name: 'FaGlobe', label: 'Global', component: FaGlobe },
    { name: 'FaChurch', label: 'Church', component: FaChurch },
    { name: 'FaInfinity', label: 'Eternal', component: FaInfinity },
    { name: 'FaPeace', label: 'Peace', component: FaPeace }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [valuesData, leadershipData] = await Promise.all([
        api.getValues(),
        api.getLeadership()
      ]);
      
      const vList = valuesData?.results || valuesData || [];
      setValues(vList);
      
      const lList = leadershipData?.results || leadershipData || [];
      setLeadership(lList);
    } catch (error) {
      console.error("Failed to fetch about content", error);
    } finally {
      setLoading(false);
    }
  };

  const handleValueSave = async () => {
    setLoading(true);
    try {
      if (editingValue) {
        await api.updateValue(editingValue.id, valueForm);
      } else {
        await api.createValue({ ...valueForm, order: values.length });
      }
      await fetchData();
      setShowValueModal(false);
      setSuccessInfo({ title: editingValue ? 'Value Updated' : 'Value Added', message: 'Core value saved successfully.' });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to save value", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaderSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', leaderForm.name);
      formData.append('role', leaderForm.role);
      formData.append('description', leaderForm.description || '');
      formData.append('order', editingLeader ? editingLeader.order : leadership.length);
      
      if (leaderForm.imageFile) {
        formData.append('image', leaderForm.imageFile);
      }

      if (editingLeader) {
        if (leaderForm.imageFile) await api.updateLeadershipWithImage(editingLeader.id, formData);
        else await api.updateLeadership(editingLeader.id, { name: leaderForm.name, role: leaderForm.role, description: leaderForm.description });
      } else {
        if (leaderForm.imageFile) await api.createLeadershipWithImage(formData);
        else await api.createLeadership({ name: leaderForm.name, role: leaderForm.role, description: leaderForm.description, order: leadership.length });
      }
      
      await fetchData();
      setShowLeaderModal(false);
      setSuccessInfo({ title: editingLeader ? 'Leader Updated' : 'Leader Added', message: 'Leadership entry saved successfully.' });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to save leader", error);
    } finally {
      setLoading(false);
    }
  };

  const handleValueEdit = (value) => {
    setEditingValue(value);
    setValueForm({ title: value.title, description: value.description, icon_name: value.icon_name });
    setShowValueModal(true);
  };

  const handleLeaderEdit = (leader) => {
    setEditingLeader(leader);
    setLeaderForm({ 
      name: leader.name, 
      role: leader.role, 
      description: leader.description, 
      image: leader.image,
      imageFile: null,
      imagePreview: null 
    });
    setShowLeaderModal(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLeaderForm({ ...leaderForm, imageFile: file, imagePreview: URL.createObjectURL(file) });
    }
  };

  const removeValue = (value) => {
    setItemToDelete(value);
    setDeleteType('value');
    setShowDeleteModal(true);
  };

  const removeLeader = (leader) => {
    setItemToDelete(leader);
    setDeleteType('leader');
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete || !deleteType) return;
    setDeleteLoading(true);
    try {
      if (deleteType === 'value') await api.deleteValue(itemToDelete.id);
      else await api.deleteLeadership(itemToDelete.id);
      setShowDeleteModal(false);
      await fetchData();
      setSuccessInfo({ title: 'Item Deleted', message: 'Item removed successfully.' });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to delete item", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="about-management animate-fade-in">
      <div className="mb-5">
        <h2 className="fw-bold text-white mb-1">Manage About Us</h2>
        <p className="text-white opacity-50 small mb-0">Update church values, mission, and leadership team.</p>
      </div>

      <Row className="g-4">
        <Col lg={7}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="glass-panel glass-panel-dark border-white border-opacity-10 mb-4">
              <Card.Header className="bg-transparent border-white border-opacity-10 p-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold text-white mb-0 d-flex align-items-center gap-2">
                  <FaGem className="text-primary" /> Core Values
                </h5>
                <Button variant="primary" size="sm" className="rounded-pill px-3 fw-bold" onClick={() => { setEditingValue(null); setValueForm({ title: '', description: '', icon_name: 'FaHeart' }); setShowValueModal(true); }}>
                  <FaPlus className="me-1" /> Add Value
                </Button>
              </Card.Header>
              <Card.Body className="p-4">
                <Row className="g-3">
                  {values.map((value) => {
                    const IconComp = iconMap[value.icon_name] || FaHeart;
                    return (
                      <Col md={12} key={value.id}>
                        <div className="p-4 rounded-4 border border-white border-opacity-5 bg-white bg-opacity-5 hover-lift">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center gap-3">
                              <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                                <IconComp size={20} />
                              </div>
                              <h5 className="fw-bold text-white mb-0">{value.title}</h5>
                            </div>
                            <div className="d-flex gap-2">
                              <Button variant="link" className="text-info p-0" onClick={() => handleValueEdit(value)}><FaEdit /></Button>
                              <Button variant="link" className="text-danger p-0" onClick={() => removeValue(value)}><FaTrash /></Button>
                            </div>
                          </div>
                          <p className="text-white opacity-50 small mb-0">{value.description}</p>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>

        <Col lg={5}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass-panel glass-panel-dark border-white border-opacity-10">
              <Card.Header className="bg-transparent border-white border-opacity-10 p-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold text-white mb-0 d-flex align-items-center gap-2">
                  <FaUserTie className="text-primary" /> Leadership
                </h5>
                <Button variant="primary" size="sm" className="rounded-pill px-3 fw-bold" onClick={() => { setEditingLeader(null); setLeaderForm({ name: '', role: '', description: '', image: null, imageFile: null, imagePreview: null }); setShowLeaderModal(true); }}>
                  <FaPlus className="me-1" /> Add Leader
                </Button>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="d-flex flex-column gap-3">
                  {leadership.map((leader) => (
                    <div key={leader.id} className="p-4 rounded-4 border border-white border-opacity-5 bg-white bg-opacity-5 hover-lift d-flex align-items-center gap-3">
                      <div className="bg-white bg-opacity-10 rounded-circle overflow-hidden shadow-inner" style={{ width: '60px', height: '60px', flexShrink: 0 }}>
                        {leader.image ? <img src={leader.image} alt={leader.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div className="h-100 d-flex align-items-center justify-content-center text-white opacity-25 h3 mb-0">👤</div>}
                      </div>
                      <div className="flex-grow-1 min-vw-0">
                        <h6 className="fw-bold text-white mb-1 text-truncate">{leader.name}</h6>
                        <p className="text-primary small mb-0">{leader.role}</p>
                      </div>
                      <div className="d-flex gap-2">
                        <Button variant="link" className="text-info p-0" onClick={() => handleLeaderEdit(leader)}><FaEdit /></Button>
                        <Button variant="link" className="text-danger p-0" onClick={() => removeLeader(leader)}><FaTrash /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Value Modal */}
      <Modal show={showValueModal} onHide={() => setShowValueModal(false)} centered className="admin-modal">
        <Modal.Header closeButton className="bg-dark text-white border-white border-opacity-10">
          <Modal.Title className="fw-bold">{editingValue ? 'Edit Core Value' : 'Add Core Value'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white p-4">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="smaller fw-bold opacity-50">Title</Form.Label>
              <Form.Control type="text" value={valueForm.title} onChange={(e) => setValueForm({...valueForm, title: e.target.value})} className="bg-white bg-opacity-5 border-white border-opacity-10 text-white" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="smaller fw-bold opacity-50">Icon</Form.Label>
              <div className="bg-white bg-opacity-5 p-3 rounded-4 border border-white border-opacity-10">
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {availableIcons.map((icon) => {
                    const Icon = icon.component;
                    return (
                      <div key={icon.name} className={`p-2 rounded-3 cursor-pointer ${valueForm.icon_name === icon.name ? 'bg-primary' : 'hover-bg-white-opacity-10'}`} onClick={() => setValueForm({...valueForm, icon_name: icon.name})}>
                        <Icon size={18} />
                      </div>
                    );
                  })}
                </div>
                <Form.Select value={valueForm.icon_name} onChange={(e) => setValueForm({...valueForm, icon_name: e.target.value})} className="bg-dark border-white border-opacity-10 text-white small py-1">
                   {availableIcons.map(icon => <option key={icon.name} value={icon.name}>{icon.label}</option>)}
                </Form.Select>
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="smaller fw-bold opacity-50">Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={valueForm.description} onChange={(e) => setValueForm({...valueForm, description: e.target.value})} className="bg-white bg-opacity-5 border-white border-opacity-10 text-white" />
            </Form.Group>
            <div className="d-flex justify-content-end gap-3 mt-4">
              <Button variant="link" className="text-white opacity-50 text-decoration-none" onClick={() => setShowValueModal(false)}>Cancel</Button>
              <Button variant="primary" className="rounded-pill px-5 py-2 fw-bold" onClick={handleValueSave} disabled={loading}>{loading ? 'Saving...' : 'Save Value'}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Leader Modal */}
      <Modal show={showLeaderModal} onHide={() => setShowLeaderModal(false)} centered className="admin-modal">
        <Modal.Header closeButton className="bg-dark text-white border-white border-opacity-10">
          <Modal.Title className="fw-bold">{editingLeader ? 'Edit Leader' : 'Add Leader'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white p-4">
          <Form>
            <div className="text-center mb-4">
              <div className="bg-white bg-opacity-10 rounded-circle mx-auto overflow-hidden shadow-lg border border-white border-opacity-10" style={{ width: '120px', height: '120px' }}>
                {leaderForm.imagePreview ? <img src={leaderForm.imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : leaderForm.image ? <img src={leaderForm.image} alt="Current" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div className="h-100 d-flex align-items-center justify-content-center text-white opacity-25 h1 mb-0">👤</div>}
              </div>
              <Button variant="link" className="text-primary small mt-2" onClick={() => document.getElementById('leader-photo-upload').click()}>Update Photo</Button>
              <input type="file" id="leader-photo-upload" hidden accept="image/*" onChange={handleImageUpload} />
            </div>
            <Form.Group className="mb-3">
              <Form.Label className="smaller fw-bold opacity-50">Full Name</Form.Label>
              <Form.Control type="text" value={leaderForm.name} onChange={(e) => setLeaderForm({...leaderForm, name: e.target.value})} className="bg-white bg-opacity-5 border-white border-opacity-10 text-white" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="smaller fw-bold opacity-50">Role</Form.Label>
              <Form.Control type="text" value={leaderForm.role} onChange={(e) => setLeaderForm({...leaderForm, role: e.target.value})} className="bg-white bg-opacity-5 border-white border-opacity-10 text-white" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="smaller fw-bold opacity-50">Brief Bio</Form.Label>
              <Form.Control as="textarea" rows={3} value={leaderForm.description} onChange={(e) => setLeaderForm({...leaderForm, description: e.target.value})} className="bg-white bg-opacity-5 border-white border-opacity-10 text-white" />
            </Form.Group>
            <div className="d-flex justify-content-end gap-3 mt-4">
              <Button variant="link" className="text-white opacity-50 text-decoration-none" onClick={() => setShowLeaderModal(false)}>Cancel</Button>
              <Button variant="primary" className="rounded-pill px-5 py-2 fw-bold" onClick={handleLeaderSave} disabled={loading}>{loading ? 'Saving...' : 'Save Leader'}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <DeleteConfirmModal 
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.title || itemToDelete?.name}
        loading={deleteLoading}
      />

      <SuccessModal 
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        title={successInfo.title}
        message={successInfo.message}
      />
      <style>{`
        .hover-bg-white-opacity-10:hover { background: rgba(255, 255, 255, 0.1); }
      `}</style>
    </div>
  );
};

export default AboutManagement;
