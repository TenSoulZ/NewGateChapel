import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Alert, Badge } from 'react-bootstrap';
import { FaVideo, FaBroadcastTower, FaClock, FaCalendarAlt, FaLink, FaSave, FaPowerOff } from 'react-icons/fa';
import api from '../../../services/api.js';
import SuccessModal from '../../../components/common/SuccessModal';
import { convertToEmbedUrl } from '../../../utils/urlUtils';

const LiveStreamManagement = () => {
  const [isLive, setIsLive] = useState(false);
  const [streamUrl, setStreamUrl] = useState('');
  const [streamId, setStreamId] = useState(null);
  const [nextService, setNextService] = useState({
    day: 'Sunday Morning',
    time: '9:00 AM',
    title: 'Sunday Worship Service'
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successInfo, setSuccessInfo] = useState({ title: '', message: '' });

  useEffect(() => {
    const fetchData = async () => {
        try {
            const data = await api.getLiveStream();
            const stream = (data.results || data || [])[0];
            
            if (stream) {
                setStreamId(stream.id);
                setIsLive(stream.status === 'live' || stream.is_live);
                setStreamUrl(stream.embed_url || '');
                setNextService({
                    title: stream.title || 'Sunday Worship Service',
                    day: stream.date || 'Sunday Morning',
                    time: stream.description || '9:00 AM'
                });
            } else {
                // If somehow list is empty even with backend fallback
                console.warn("No livestream record found.");
            }
        } catch (error) {
            console.error("Error fetching live stream data", error);
        }
    };
    fetchData();
  }, []);

  const handleUrlChange = (e) => {
    setStreamUrl(convertToEmbedUrl(e.target.value));
  };

  const handleSave = async () => {
    try {
        const cleanedUrl = convertToEmbedUrl(streamUrl);
        const payload = {
            embed_url: cleanedUrl,
            status: isLive ? 'live' : 'offline',
            is_live: isLive,
            title: nextService.title,
            date: nextService.day,
            description: nextService.time
        };

        if (streamId) {
            await api.updateLiveStream(streamId, payload);
        } else {
            const created = await api.createLiveStream(payload);
            if (created) setStreamId(created.id);
        }

        setSuccessInfo({
            title: 'Settings Saved',
            message: 'Live stream configuration and countdown updated.'
        });
        setShowSuccessModal(true);
    } catch (error) {
        console.error("Error saving stream settings", error);
        const detail = error.response?.data?.detail || JSON.stringify(error.response?.data) || error.message;
        alert("Failed to save stream settings. Error: " + detail);
    }
  };

  const toggleLive = async () => {
    const newStatus = !isLive;
    setIsLive(newStatus);
    
    if (streamId) {
        try {
            const cleanedUrl = convertToEmbedUrl(streamUrl);
            await api.updateLiveStream(streamId, {
                status: newStatus ? 'live' : 'offline',
                is_live: newStatus,
                embed_url: cleanedUrl,
                title: nextService.title,
                date: nextService.day,
                description: nextService.time
            });
            setSuccessInfo({
                title: newStatus ? 'Broadcast Started' : 'Broadcast Stopped',
                message: newStatus 
                    ? 'The live stream is now active on the public website.' 
                    : 'The live stream has been deactivated.'
            });
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Error toggling live status", error);
            const detail = error.response?.data?.detail || JSON.stringify(error.response?.data) || error.message;
            alert("Failed to update broadcast status. Error: " + detail);
            setIsLive(!newStatus);
        }
    }
  };

  return (
    <div className="admin-page animate-fade-in">
      <div className="mb-4">
        <h2 className="text-white fw-bold mb-0">Live Stream Control</h2>
        <p className="text-white opacity-50 mb-0">Manage your digital pulpit and broadcast schedule</p>
      </div>

      <Row className="g-4">
        <Col lg={4}>
          <Card className={`glass-panel glass-panel-dark border-0 shadow-lg h-100 transition-all ${isLive ? 'border-success border-opacity-25' : ''}`}>
            <Card.Body className="p-4 p-lg-5 text-center d-flex flex-column justify-content-center">
              <div className={`mb-4 d-inline-block p-4 rounded-circle transition-all ${isLive ? 'bg-danger animate-pulse shadow-glow' : 'bg-white bg-opacity-5'}`}>
                <FaBroadcastTower size={50} className={isLive ? 'text-white' : 'text-white opacity-25'} />
              </div>
              <h3 className="fw-bold text-white mb-2">Stream Status</h3>
              <div className="mb-4">
                {isLive ? (
                  <Badge bg="danger" className="px-3 py-2 rounded-pill shadow-sm">
                    <span className="pulse-dot me-2"></span> LIVE NOW
                  </Badge>
                ) : (
                  <Badge bg="secondary" className="px-3 py-2 rounded-pill opacity-50">
                    OFFLINE
                  </Badge>
                )}
              </div>
              <Button 
                variant={isLive ? "outline-danger" : "primary"} 
                size="lg" 
                className="rounded-pill fw-bold w-100 py-3 mt-2 shadow-sm d-flex align-items-center justify-content-center gap-2"
                onClick={toggleLive}
              >
                {isLive ? <><FaPowerOff /> Stop Broadcast</> : <><FaVideo /> Start Broadcast</>}
              </Button>
              <p className="small text-white opacity-50 mt-4 mb-0">
                {isLive ? 'The website is currently showing your live player.' : 'The website is currently showing the "Next Service" countdown.'}
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="glass-panel glass-panel-dark border-0 shadow-lg mb-4">
            <Card.Header className="border-white border-opacity-10 p-4">
              <h5 className="fw-bold text-white mb-0 d-flex align-items-center gap-2">
                <FaLink className="text-primary" /> Stream Configuration
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Form.Group className="mb-4">
                <Form.Label className="small uppercase fw-bold opacity-50">Stream URL (YouTube/Facebook Embed)</Form.Label>
                <Form.Control 
                  type="text"
                  placeholder="e.g. https://www.youtube.com/embed/live_stream_id"
                  value={streamUrl}
                  onChange={handleUrlChange}
                  className="border-white border-opacity-10 text-white py-3 font-monospace shadow-none"
                />
                <Form.Text className="text-white opacity-25">
                  Paste the <strong>src</strong> attribute from your platform's embed code.
                </Form.Text>
              </Form.Group>

              <hr className="my-4 border-white border-opacity-10" />

              <h5 className="fw-bold text-white mb-4 d-flex align-items-center gap-2">
                <FaCalendarAlt className="text-warning" /> Next Service Countdown
              </h5>
              
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small uppercase fw-bold opacity-50">Service Title</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={nextService.title}
                      onChange={(e) => setNextService({...nextService, title: e.target.value})}
                  className="border-white border-opacity-10 text-white py-2 shadow-none"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small uppercase fw-bold opacity-50">Day</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={nextService.day}
                      onChange={(e) => setNextService({...nextService, day: e.target.value})}
                      placeholder="e.g. Sunday Morning"
                  className="border-white border-opacity-10 text-white py-2 shadow-none"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small uppercase fw-bold opacity-50">Time</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={nextService.time}
                      onChange={(e) => setNextService({...nextService, time: e.target.value})}
                      placeholder="e.g. 9:00 AM"
                      className="bg-white bg-opacity-5 border-white border-opacity-10 text-white py-2"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-end mt-4 pt-2">
                <Button 
                  variant="primary" 
                  className="rounded-pill px-5 py-2 fw-bold d-flex align-items-center gap-2"
                  onClick={handleSave}
                >
                  <FaSave /> Save Changes
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <SuccessModal 
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        title={successInfo.title}
        message={successInfo.message}
      />

      <style>{`
        .animate-pulse { animation: pulse-red 2s infinite; }
        @keyframes pulse-red {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(220, 53, 69, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); }
        }
        .shadow-glow { box-shadow: 0 0 20px rgba(220, 53, 69, 0.5); }
        .smaller { font-size: 0.75rem; }
      `}</style>
    </div>
  );
};

export default LiveStreamManagement;
