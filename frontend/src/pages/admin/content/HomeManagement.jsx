import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import { FaSave, FaHome, FaInfoCircle, FaStar, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import api from '../../../services/api.js';
import { motion } from 'framer-motion';
import DeleteConfirmModal from '../../../components/common/DeleteConfirmModal';
import SuccessModal from '../../../components/common/SuccessModal';

const HomeManagement = () => {
    const [churchInfo, setChurchInfo] = useState({
        id: null,
        hero_subtitle: '',
        hero_title: '',
        hero_description: '',
        about_story: '',
        about_mission: '',
        about_vision: '',
        address: '',
        phone: '',
        email: ''
    });
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showFeatureModal, setShowFeatureModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [featureToDelete, setFeatureToDelete] = useState(null);
    const [editingFeature, setEditingFeature] = useState(null);
    const [featureForm, setFeatureForm] = useState({ title: '', description: '', icon_name: 'FaStar' });
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [successInfo, setSuccessInfo] = useState({ title: '', message: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [infoData, featuresData] = await Promise.all([
                api.getChurchInfo(),
                api.getHomeFeatures()
            ]);

            const info = (infoData?.results || infoData || [])[0];
            if (info) setChurchInfo(info);

            const featList = featuresData?.results || featuresData || [];
            if (Array.isArray(featList)) setFeatures(featList);
            else if (featList.results) setFeatures(featList.results);
        } catch (error) {
            console.error("Failed to fetch home management data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInfoChange = (field, value) => {
        setChurchInfo(prev => ({ ...prev, [field]: value }));
    };

    const saveChurchInfo = async () => {
        setLoading(true);
        try {
            if (churchInfo.id) {
                await api.updateChurchInfo(churchInfo.id, churchInfo);
                setSuccessInfo({
                    title: 'Site Info Saved',
                    message: 'General church information and hero content updated successfully.'
                });
                setShowSuccessModal(true);
            }
        } catch (error) {
            console.error("Failed to save church info", error);
            alert("Failed to save church info.");
        } finally {
            setLoading(false);
        }
    };

    const handleFeatureSave = async () => {
        setLoading(true);
        try {
            if (editingFeature) {
                await api.updateHomeFeature(editingFeature.id, featureForm);
            } else {
                await api.createHomeFeature({ ...featureForm, order: features.length });
            }
            await fetchData();
            setShowFeatureModal(false);
            setEditingFeature(null);
            setFeatureForm({ title: '', description: '', icon_name: 'FaStar' });
            setSuccessInfo({
                title: editingFeature ? 'Feature Updated' : 'Feature Added',
                message: 'Home page feature has been saved successfully.'
            });
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Failed to save feature", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFeatureEdit = (feature) => {
        setEditingFeature(feature);
        setFeatureForm({
            title: feature.title,
            description: feature.description,
            icon_name: feature.icon_name
        });
        setShowFeatureModal(true);
    };

    const deleteFeature = (feature) => {
        setFeatureToDelete(feature);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!featureToDelete) return;

        setDeleteLoading(true);
        try {
            await api.deleteHomeFeature(featureToDelete.id);
            setShowDeleteModal(false);
            setFeatureToDelete(null);
            await fetchData();
            setSuccessInfo({
                title: 'Feature Deleted',
                message: 'The home page feature has been removed.'
            });
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Failed to delete feature", error);
            alert("Failed to delete feature.");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="home-management">
            <div className="d-flex align-items-center justify-content-between mb-5">
                <div>
                    <h2 className="fw-bold text-white mb-1">Home & Site Management</h2>
                    <p className="text-white opacity-50 small mb-0">Manage hero content, core church information, and home page features.</p>
                </div>
                <Button 
                    variant="success" 
                    className="d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-lg border-0"
                    onClick={saveChurchInfo}
                    disabled={loading}
                >
                    <FaSave /> {loading ? 'Saving...' : 'Save Site Info'}
                </Button>
            </div>

            <Row className="g-4">
                <Col lg={12}>
                    <Card className="glass-panel glass-panel-dark border-white border-opacity-10 mb-4">
                        <Card.Header className="bg-transparent border-white border-opacity-10 p-4">
                            <h5 className="fw-bold text-white mb-0 d-flex align-items-center gap-2">
                                <FaHome className="text-primary" /> Hero Section (Home Page)
                            </h5>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="smaller fw-bold opacity-50">Hero Subtitle</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            value={churchInfo.hero_subtitle} 
                                            onChange={(e) => handleInfoChange('hero_subtitle', e.target.value)}
                                            className="bg-white bg-opacity-5 border-white border-opacity-10 text-white"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="smaller fw-bold opacity-50">Hero Title</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            value={churchInfo.hero_title} 
                                            onChange={(e) => handleInfoChange('hero_title', e.target.value)}
                                            className="bg-white bg-opacity-5 border-white border-opacity-10 text-white"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-0">
                                <Form.Label className="smaller fw-bold opacity-50">Hero Description (Pillar text)</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    rows={3}
                                    value={churchInfo.hero_description} 
                                    onChange={(e) => handleInfoChange('hero_description', e.target.value)}
                                    className="bg-white bg-opacity-5 border-white border-opacity-10 text-white"
                                />
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={12}>
                    <Card className="glass-panel glass-panel-dark border-white border-opacity-10 mb-4">
                        <Card.Header className="bg-transparent border-white border-opacity-10 p-4">
                            <h5 className="fw-bold text-white mb-0 d-flex align-items-center gap-2">
                                <FaInfoCircle className="text-primary" /> Church Story, Mission & Vision (About Page)
                            </h5>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Form.Group className="mb-3">
                                <Form.Label className="smaller fw-bold opacity-50">Our Story</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    rows={5}
                                    value={churchInfo.about_story} 
                                    onChange={(e) => handleInfoChange('about_story', e.target.value)}
                                    className="bg-white bg-opacity-5 border-white border-opacity-10 text-white"
                                />
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="smaller fw-bold opacity-50">Our Mission</Form.Label>
                                        <Form.Control 
                                            as="textarea" 
                                            rows={3}
                                            value={churchInfo.about_mission} 
                                            onChange={(e) => handleInfoChange('about_mission', e.target.value)}
                                            className="bg-white bg-opacity-5 border-white border-opacity-10 text-white"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="smaller fw-bold opacity-50">Our Vision</Form.Label>
                                        <Form.Control 
                                            as="textarea" 
                                            rows={3}
                                            value={churchInfo.about_vision} 
                                            onChange={(e) => handleInfoChange('about_vision', e.target.value)}
                                            className="bg-white bg-opacity-5 border-white border-opacity-10 text-white"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={12}>
                    <Card className="glass-panel glass-panel-dark border-white border-opacity-10">
                        <Card.Header className="bg-transparent border-white border-opacity-10 p-4 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold text-white mb-0 d-flex align-items-center gap-2">
                                <FaStar className="text-primary" /> Home Page Features
                            </h5>
                            <Button 
                                variant="primary" 
                                size="sm" 
                                className="rounded-pill px-3 fw-bold" 
                                onClick={() => { setEditingFeature(null); setFeatureForm({ title: '', description: '', icon_name: 'FaStar' }); setShowFeatureModal(true); }}
                            >
                                <FaPlus className="me-1" /> Add Feature
                            </Button>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Row className="g-3">
                                {features.map((feature) => (
                                    <Col md={6} lg={4} key={feature.id}>
                                        <div className="p-4 rounded-4 border border-white border-opacity-10 bg-white bg-opacity-5 h-100 d-flex flex-column">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary">
                                                    <FaStar size={18} />
                                                </div>
                                                <div className="d-flex gap-2">
                                                    <Button variant="link" className="text-info p-0" onClick={() => handleFeatureEdit(feature)}>
                                                        <FaEdit size={16} />
                                                    </Button>
                                                    <Button variant="link" className="text-danger p-0" onClick={() => deleteFeature(feature)}>
                                                        <FaTrash size={16} />
                                                    </Button>
                                                </div>
                                            </div>
                                            <h6 className="fw-bold text-white mb-2">{feature.title}</h6>
                                            <p className="text-white opacity-50 small mb-0 flex-grow-1">{feature.description}</p>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={showFeatureModal} onHide={() => setShowFeatureModal(false)} centered className="admin-modal">
                <Modal.Header closeButton className="bg-dark text-white border-white border-opacity-10">
                    <Modal.Title className="fw-bold">{editingFeature ? 'Edit Feature' : 'Add Feature'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-white p-4">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="smaller fw-bold opacity-50">Feature Title</Form.Label>
                            <Form.Control 
                                type="text"
                                value={featureForm.title}
                                onChange={(e) => setFeatureForm({...featureForm, title: e.target.value})}
                                className="bg-white bg-opacity-5 border-white border-opacity-10 text-white"
                                placeholder="e.g. Community Outreach"
                            />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label className="smaller fw-bold opacity-50">Description</Form.Label>
                            <Form.Control 
                                as="textarea"
                                rows={3}
                                value={featureForm.description}
                                onChange={(e) => setFeatureForm({...featureForm, description: e.target.value})}
                                className="bg-white bg-opacity-5 border-white border-opacity-10 text-white"
                                placeholder="Briefly describe this feature..."
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-3 mt-4">
                            <Button variant="link" className="text-white opacity-50 text-decoration-none" onClick={() => setShowFeatureModal(false)}>Cancel</Button>
                            <Button variant="primary" className="rounded-pill px-5 py-2 fw-bold" onClick={handleFeatureSave} disabled={loading}>
                                <FaSave className="me-2" /> {loading ? 'Saving...' : 'Save Feature'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <DeleteConfirmModal 
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                itemName={featureToDelete?.title}
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

export default HomeManagement;
