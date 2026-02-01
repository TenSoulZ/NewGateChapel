import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Badge, Modal, Tabs, Tab, Nav } from 'react-bootstrap';
import { FaHeart, FaPlus, FaTrash, FaEdit, FaSave, FaUniversity, FaMobileAlt, FaHandHoldingHeart, FaQuoteRight, FaTag } from 'react-icons/fa';
import api from '../../../services/api.js';
const initialOptions = [
  {
    id: 1,
    title: 'Mobile Money',
    text: 'Give securely via Ecocash or OneMoney using our merchant code or biller numbers.',
    iconName: 'FaMobileAlt',
    color: '#E60012',
    button: { text: 'Give via Mobile' }
  },
  {
    id: 2,
    title: 'Bank Transfer',
    text: 'Transfer directly from your bank account to our church account.',
    iconName: 'FaUniversity',
    color: '#002855',
    details: {
      bankName: 'Steward Bank',
      accountName: 'New Gate Chapel',
      accountNumber: '100XXXXXXXX',
      reference: 'Tithe/Offering'
    }
  },
  {
    id: 3,
    title: 'Online Giving',
    text: 'Give using your debit or credit card through our secure online portal.',
    iconName: 'FaHandHoldingHeart',
    color: '#A0025C',
    button: { text: 'Give Online' }
  }
];

const initialPageContent = {
  introText: "Your generosity enables us to reach our community, support missions, and continue the work of God in our city.",
  verses: [
    {
      id: 1,
      text: "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.",
      reference: "2 Corinthians 9:7"
    },
    {
      id: 2,
      text: "Give, and it will be given to you. A good measure, pressed down, shaken together and running over, will be poured into your lap.",
      reference: "Luke 6:38"
    }
  ]
};
import DeleteConfirmModal from '../../../components/common/DeleteConfirmModal';
import SuccessModal from '../../../components/common/SuccessModal';

const iconMap = {
  FaMobileAlt: FaMobileAlt,
  FaUniversity: FaUniversity,
  FaHandHoldingHeart: FaHandHoldingHeart,
};

const GivingManagement = () => {
  const [options, setOptions] = useState([]);
  const [churchInfo, setChurchInfo] = useState({ id: null, giving_intro: '', giving_verses: [] });
  const [loading, setLoading] = useState(false);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null); // 'option' or 'verse'
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successInfo, setSuccessInfo] = useState({ title: '', message: '' });
  const [editingOption, setEditingOption] = useState(null);
  const [optionForm, setOptionForm] = useState({
    title: '',
    description: '',
    icon_name: 'FaMobileAlt',
    bank_name: '',
    account_name: '',
    account_number: '',
    mobile_number: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const optionsData = await api.getGivingOptions();
      const infoData = await api.getChurchInfo();
      
      if (optionsData && optionsData.results) setOptions(optionsData.results);
      else if (Array.isArray(optionsData)) setOptions(optionsData);
      
      const info = (infoData?.results || infoData || [])[0];
      if (info) setChurchInfo(info);
    } catch (error) {
      console.error("Failed to fetch giving data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSave = async () => {
    setLoading(true);
    try {
      if (editingOption !== null) {
        await api.updateGivingOption(editingOption.id, optionForm);
      } else {
        await api.createGivingOption(optionForm);
      }
      await fetchData();
      setShowOptionModal(false);
      resetOptionForm();
      setSuccessInfo({
        title: editingOption !== null ? 'Method Updated' : 'Method Added',
        message: `${optionForm.title} has been saved successfully.`
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to save option", error);
      alert("Failed to save option.");
    } finally {
      setLoading(false);
    }
  };

  const saveChurchInfo = async (updatedInfo) => {
    try {
      await api.updateChurchInfo(updatedInfo.id, updatedInfo);
      setChurchInfo(updatedInfo);
    } catch (error) {
      console.error("Failed to save content", error);
    }
  };

  const resetOptionForm = () => {
    setOptionForm({
      title: '',
      description: '',
      icon_name: 'FaMobileAlt',
      bank_name: '',
      account_name: '',
      account_number: '',
      mobile_number: '',
    });
    setEditingOption(null);
  };

  const handleOptionEdit = (option) => {
    setEditingOption(option);
    setOptionForm({
      title: option.title,
      description: option.description,
      icon_name: option.icon_name,
      bank_name: option.bank_name || '',
      account_name: option.account_name || '',
      account_number: option.account_number || '',
      mobile_number: option.mobile_number || '',
    });
    setShowOptionModal(true);
  };

  const handleOptionDelete = (option) => {
    setItemToDelete(option);
    setDeleteType('option');
    setShowDeleteModal(true);
  };

  const addVerse = () => {
    const newVerses = [
      ...churchInfo.giving_verses,
      { id: Date.now(), text: 'New inspirational verse', reference: 'Scripture Reference' }
    ];
    saveChurchInfo({ ...churchInfo, giving_verses: newVerses });
  };

  const updateVerse = (id, field, value) => {
    const newVerses = churchInfo.giving_verses.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    );
    // Local update only, save happens when they finish or we can debounced/auto-save
    setChurchInfo({ ...churchInfo, giving_verses: newVerses });
  };

  const handleVerseBlur = () => {
    saveChurchInfo(churchInfo);
  };

  const deleteVerse = (id) => {
    const verse = churchInfo.giving_verses.find(v => v.id === id);
    setItemToDelete({ id, title: verse?.reference || 'Verse' });
    setDeleteType('verse');
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete || !deleteType) return;
    
    setDeleteLoading(true);
    try {
      if (deleteType === 'option') {
        await api.deleteGivingOption(itemToDelete.id);
      } else {
        const newVerses = churchInfo.giving_verses.filter(v => v.id !== itemToDelete.id);
        await saveChurchInfo({ ...churchInfo, giving_verses: newVerses });
      }
      setShowDeleteModal(false);
      setItemToDelete(null);
      setDeleteType(null);
      await fetchData();
      setSuccessInfo({
        title: 'Item Removed',
        message: 'The selected item has been deleted successfully.'
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to delete item", error);
      alert("Failed to delete item.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="admin-page animate-fade-in">
      <div className="mb-4">
        <h2 className="text-white fw-bold mb-0">Giving Management</h2>
        <p className="text-white opacity-50 mb-0">Customize donation methods and inspired messaging</p>
      </div>

      <Tabs defaultActiveKey="options" className="admin-tabs mb-4 border-0">
        <Tab eventKey="options" title="Giving Methods">
          <div className="d-flex justify-content-end mb-4 mt-2">
            <Button variant="primary" className="rounded-pill px-4 d-flex align-items-center gap-2" onClick={() => { resetOptionForm(); setShowOptionModal(true); }}>
              <FaPlus /> Add Method
            </Button>
          </div>
          <Row className="g-4">
            {options.map((option) => {
              const Icon = iconMap[option.icon_name] || FaMobileAlt;
              return (
                <Col key={option.id} lg={4}>
                  <Card className="glass-panel glass-panel-dark border-0 shadow-lg h-100 position-relative">
                    <Card.Body className="p-4">
                      <div className="d-flex justify-content-between align-items-start mb-4">
                        <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                          <Icon size={24} />
                        </div>
                        <div className="d-flex gap-2">
                          <Button variant="link" className="text-info p-0" onClick={() => handleOptionEdit(option)}><FaEdit /></Button>
                          <Button variant="link" className="text-danger p-0" onClick={() => handleOptionDelete(option)}><FaTrash /></Button>
                        </div>
                      </div>
                      <h4 className="fw-bold text-white mb-3">{option.title}</h4>
                      <p className="small text-white opacity-50 mb-4 h-60px overflow-hidden">{option.description}</p>
                      
                      {option.bank_name ? (
                        <div className="bg-white bg-opacity-5 p-3 rounded-3 small border border-white border-opacity-10 mb-3">
                          <div className="fw-bold text-warning mb-2 uppercase smaller">Bank Details</div>
                          <div className="opacity-75">{option.bank_name}</div>
                          <div className="fw-bold">{option.account_number}</div>
                        </div>
                      ) : option.mobile_number ? (
                        <div className="bg-white bg-opacity-5 p-3 rounded-3 small border border-white border-opacity-10 mb-3">
                          <div className="fw-bold text-success mb-2 uppercase smaller">Mobile Details</div>
                          <div className="fw-bold">{option.mobile_number}</div>
                        </div>
                      ) : (
                        <Badge bg="primary" className="bg-opacity-20 text-white border border-primary border-opacity-25 py-2 px-3 fw-normal w-100">
                           Online / External Link
                        </Badge>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Tab>
        <Tab eventKey="content" title="Page Content & Verses">
          <Card className="glass-panel glass-panel-dark border-0 shadow-lg mt-4">
            <Card.Body className="p-4 p-lg-5">
              <h5 className="fw-bold text-white mb-4 d-flex align-items-center gap-2">
                <FaTag className="text-primary" /> Header & Text
              </h5>
              <Form.Group className="mb-4">
                <Form.Label className="small uppercase fw-bold opacity-50">Page Introduction</Form.Label>
                <Form.Control 
                  as="textarea"
                  rows={3}
                  value={churchInfo.giving_intro}
                  onChange={(e) => setChurchInfo({...churchInfo, giving_intro: e.target.value})}
                  onBlur={handleVerseBlur}
                  className="admin-form-control border-white border-opacity-10 text-white py-3 shadow-none"
                />
              </Form.Group>

              <hr className="my-5 border-white border-opacity-10" />

              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-white mb-0 d-flex align-items-center gap-2">
                  <FaQuoteRight className="text-warning" /> Inspirational Verses
                </h5>
                <Button variant="outline-primary" size="sm" className="rounded-pill px-3" onClick={addVerse}>
                  <FaPlus size={10} className="me-1" /> Add Verse
                </Button>
              </div>

              {churchInfo.giving_verses.map((verse) => (
                <div key={verse.id} className="bg-white bg-opacity-5 p-4 rounded-4 mb-3 border border-white border-opacity-10 position-relative">
                  <Button variant="link" className="text-danger p-0 position-absolute top-0 end-0 m-3" onClick={() => deleteVerse(verse.id)}>
                    <FaTrash size={14} />
                  </Button>
                  <Row className="g-3">
                    <Col md={12}>
                      <Form.Control 
                        as="textarea"
                        rows={2}
                        placeholder="Scripture text..."
                        value={verse.text}
                        onChange={(e) => updateVerse(verse.id, 'text', e.target.value)}
                        onBlur={handleVerseBlur}
                        className="bg-transparent border-0 text-white p-0 fs-5 mb-2 fst-italic shadow-none"
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Control 
                        type="text"
                        placeholder="Reference (e.g. John 3:16)"
                        value={verse.reference}
                        onChange={(e) => updateVerse(verse.id, 'reference', e.target.value)}
                        onBlur={handleVerseBlur}
                        className="bg-white bg-opacity-10 border-0 text-primary small py-1 px-2 shadow-none"
                      />
                    </Col>
                  </Row>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      <Modal show={showOptionModal} onHide={() => setShowOptionModal(false)} centered className="admin-modal">
        <Modal.Header closeButton className="bg-dark text-white border-white border-opacity-10">
          <Modal.Title className="fw-bold">{editingOption !== null ? 'Edit Method' : 'Add Method'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white p-4">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="small uppercase fw-bold opacity-50">Method Title</Form.Label>
              <Form.Control 
                type="text"
                value={optionForm.title}
                onChange={(e) => setOptionForm({...optionForm, title: e.target.value})}
                className="bg-white bg-opacity-5 border-white border-opacity-10 text-white"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="small uppercase fw-bold opacity-50">Icon</Form.Label>
              <div className="d-flex gap-3 bg-white bg-opacity-5 p-3 rounded-3">
                {Object.keys(iconMap).map(iconName => {
                  const IconComp = iconMap[iconName];
                  return (
                    <div 
                      key={iconName}
                      className={`p-3 rounded-3 cursor-pointer ${optionForm.icon_name === iconName ? 'bg-primary' : 'bg-white bg-opacity-5'}`}
                      onClick={() => setOptionForm({...optionForm, icon_name: iconName})}
                    >
                      <IconComp size={20} />
                    </div>
                  );
                })}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small uppercase fw-bold opacity-50">Description</Form.Label>
              <Form.Control 
                as="textarea"
                rows={2}
                value={optionForm.description}
                onChange={(e) => setOptionForm({...optionForm, description: e.target.value})}
                className="bg-white bg-opacity-5 border-white border-opacity-10 text-white"
              />
            </Form.Group>

            <Tab.Container defaultActiveKey={optionForm.bank_name ? "bank" : optionForm.mobile_number ? "mobile" : "other"}>
              <Nav variant="pills" className="admin-pills mb-3 gap-2">
                <Nav.Item>
                  <Nav.Link eventKey="bank" className="rounded-pill small py-1 px-3 border border-white border-opacity-10 text-white opacity-50">Bank</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="mobile" className="rounded-pill small py-1 px-3 border border-white border-opacity-10 text-white opacity-50">Mobile</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="other" className="rounded-pill small py-1 px-3 border border-white border-opacity-10 text-white opacity-50">Other/Link</Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content>
                <Tab.Pane eventKey="bank">
                  <div className="p-3 bg-white bg-opacity-5 rounded-3 border border-white border-opacity-10">
                    <Form.Group className="mb-2">
                      <Form.Control placeholder="Bank Name" value={optionForm.bank_name} onChange={(e) => setOptionForm({...optionForm, bank_name: e.target.value, mobile_number: ''})} size="sm" className="bg-transparent border-0 border-bottom text-white rounded-0 shadow-none px-0" />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Control placeholder="Account Name" value={optionForm.account_name} onChange={(e) => setOptionForm({...optionForm, account_name: e.target.value})} size="sm" className="bg-transparent border-0 border-bottom text-white rounded-0 shadow-none px-0" />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Control placeholder="Account Number" value={optionForm.account_number} onChange={(e) => setOptionForm({...optionForm, account_number: e.target.value})} size="sm" className="bg-transparent border-0 border-bottom text-white rounded-0 shadow-none px-0" />
                    </Form.Group>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="mobile">
                  <div className="p-3 bg-white bg-opacity-5 rounded-3 border border-white border-opacity-10">
                    <Form.Group className="mb-2">
                      <Form.Control placeholder="Mobile Number / Merchant Code" value={optionForm.mobile_number} onChange={(e) => setOptionForm({...optionForm, mobile_number: e.target.value, bank_name: '', account_name: '', account_number: ''})} size="sm" className="bg-transparent border-0 border-bottom text-white rounded-0 shadow-none px-0" />
                    </Form.Group>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="other">
                   <p className="smaller opacity-50 italic">Generic payment method or external link.</p>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>

            <div className="d-flex justify-content-end gap-3 mt-4">
              <Button variant="link" className="text-white opacity-50 text-decoration-none" onClick={() => setShowOptionModal(false)}>Cancel</Button>
              <Button variant="primary" className="rounded-pill px-5 py-2 fw-bold" onClick={handleOptionSave} disabled={loading}><FaSave className="me-2" /> {loading ? 'Saving...' : 'Save Method'}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <style>{`
        .h-60px { height: 60px; }
        .admin-tabs .nav-link { color: white !important; opacity: 0.4; border: 0 !important; font-weight: bold; padding: 1rem 1.5rem; transition: all 0.2s; }
        .admin-tabs .nav-link:hover { opacity: 0.8; }
        .admin-tabs .nav-link.active { opacity: 1; border-bottom: 3px solid var(--bs-primary) !important; background: transparent !important; }
        .admin-pills .nav-link.active { background: var(--bs-primary) !important; opacity: 1 !important; border-color: var(--bs-primary) !important; }
      `}</style>

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
    </div>
  );
};

export default GivingManagement;
