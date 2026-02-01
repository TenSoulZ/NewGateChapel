import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import {
  FaSave, FaPlus, FaTrash, FaUsers,
  FaHeart, FaHandsHelping, FaSeedling, FaPray,
  FaBible, FaLightbulb, FaShieldAlt, FaStar, FaCross,
  FaHands, FaGlobe, FaChurch, FaInfinity, FaPeace,
  FaBook, FaBookOpen, FaChalkboardTeacher, FaGraduationCap,
  FaMicrophone, FaHeadphones, FaVideo, FaCamera,
  FaCalendar, FaCalendarAlt, FaClock, FaHourglass,
  FaEnvelope, FaEnvelopeOpen, FaComments, FaComment,
  FaPhone, FaMobileAlt, FaMapMarkerAlt, FaLocationArrow,
  FaCar, FaBus, FaPlane, FaShip,
  FaShoppingCart, FaTag, FaTags, FaGift,
  FaPuzzlePiece, FaCogs, FaWrench, FaHammer,
  FaBuilding, FaHome, FaHouseUser, FaDoorOpen,
  FaBed, FaShower, FaToilet, FaUtensils,
  FaCoffee, FaPizzaSlice, FaHamburger, FaAppleAlt,
  FaTree, FaLeaf, FaMountain, FaWater,
  FaSun, FaMoon, FaCloud, FaCloudSun,
  FaSnowflake, FaFire, FaWind,
  FaPaw, FaDog, FaCat, FaHorse,
  FaFish, FaFrog, FaDragon, FaDove,
  FaHeartbeat, FaStethoscope, FaMedkit, FaFirstAid,
  FaHospital, FaClinicMedical, FaPrescription,
  FaVial, FaFlask, FaMicroscope, FaAtom,
  FaRocket, FaSpaceShuttle, FaSatellite, FaSatelliteDish,
  FaGlobeAfrica, FaGlobeAmericas, FaGlobeAsia, FaGlobeEurope,
  FaLanguage, FaMap, FaRoute, FaRoad, FaSubway,
  FaTrain, FaTruck, FaTractor, FaMotorcycle,
  FaBicycle, FaWalking, FaRunning, FaHiking,
  FaSwimmer, FaBiking, FaSkiing, FaSkiingNordic,
  FaSnowboarding, FaBaseballBall, FaBasketballBall,
  FaFootballBall, FaVolleyballBall, FaGolfBall,
  FaChess, FaChessKing,
  FaChessQueen, FaChessBishop, FaChessKnight,
  FaChessRook, FaChessPawn, FaDice, FaDiceOne,
  FaDiceTwo, FaDiceThree, FaDiceFour, FaDiceFive,
  FaDiceSix, FaHatWizard, FaMagic,
  FaGhost, FaSkull, FaSkullCrossbones,
  FaSpider, FaBug, FaEdit
} from 'react-icons/fa';
import api from '../../../services/api.js';
import { motion } from 'framer-motion';
import DeleteConfirmModal from '../../../components/common/DeleteConfirmModal';
import SuccessModal from '../../../components/common/SuccessModal';

const MinistriesManagement = () => {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMinistryModal, setShowMinistryModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [ministryToDelete, setMinistryToDelete] = useState(null);
  const [editingMinistry, setEditingMinistry] = useState(null);
  const [ministryForm, setMinistryForm] = useState({ 
    title: '', 
    description: '', 
    color: '#0077b6', 
    icon_name: 'FaUsers',
    image: null,
    imageFile: null,
    imagePreview: null 
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successInfo, setSuccessInfo] = useState({ title: '', message: '' });

  // Icon mapping for available FontAwesome icons
  const iconMap = {
    FaHeart, FaUsers, FaHandsHelping, FaSeedling, FaPray,
    FaBible, FaLightbulb, FaShieldAlt, FaStar, FaCross,
    FaHands, FaGlobe, FaChurch, FaInfinity, FaPeace,
    FaBook, FaBookOpen, FaChalkboardTeacher, FaGraduationCap,
    FaMicrophone, FaHeadphones, FaVideo, FaCamera,
    FaCalendar, FaCalendarAlt, FaClock, FaHourglass,
    FaEnvelope, FaEnvelopeOpen, FaComments, FaComment,
    FaPhone, FaMobileAlt, FaMapMarkerAlt, FaLocationArrow,
    FaCar, FaBus, FaPlane, FaShip,
    FaShoppingCart, FaTag, FaTags, FaGift,
    FaPuzzlePiece, FaCogs, FaWrench, FaHammer,
    FaBuilding, FaHome, FaHouseUser, FaDoorOpen,
    FaBed, FaShower, FaToilet, FaUtensils,
    FaCoffee, FaPizzaSlice, FaHamburger, FaAppleAlt,
    FaTree, FaLeaf, FaMountain, FaWater,
    FaSun, FaMoon, FaCloud, FaCloudSun,
    FaSnowflake, FaFire, FaWind, FaPaw,
    FaDog, FaCat, FaHorse, FaFish,
    FaFrog, FaDragon, FaDove, FaHeartbeat,
    FaStethoscope, FaMedkit, FaFirstAid, FaHospital,
    FaClinicMedical, FaPrescription, FaVial, FaFlask,
    FaMicroscope, FaAtom, FaRocket, FaSpaceShuttle,
    FaSatellite, FaSatelliteDish, FaGlobeAfrica,
    FaGlobeAmericas, FaGlobeAsia, FaGlobeEurope,
    FaLanguage, FaMap, FaRoute, FaRoad, FaSubway,
    FaTrain, FaTruck, FaTractor, FaMotorcycle,
    FaBicycle, FaWalking, FaRunning, FaHiking,
    FaSwimmer, FaBiking, FaSkiing, FaSkiingNordic,
    FaSnowboarding, FaBaseballBall, FaBasketballBall,
    FaFootballBall, FaVolleyballBall, FaGolfBall,
    FaChess, FaChessKing,
    FaChessQueen, FaChessBishop, FaChessKnight,
    FaChessRook, FaChessPawn, FaDice, FaDiceOne,
    FaDiceTwo, FaDiceThree, FaDiceFour, FaDiceFive,
    FaDiceSix, FaHatWizard, FaMagic, FaGhost,
    FaSkull, FaSkullCrossbones, FaSpider, FaBug
  };

  // Available icons for selection - categorized for easier browsing
  const availableIcons = [
    // Faith & Spirituality
    { name: 'FaHeart', label: 'Heart (Love)', category: 'Faith' },
    { name: 'FaPray', label: 'Prayer', category: 'Faith' },
    { name: 'FaBible', label: 'Bible', category: 'Faith' },
    { name: 'FaCross', label: 'Cross', category: 'Faith' },
    { name: 'FaChurch', label: 'Church', category: 'Faith' },
    { name: 'FaInfinity', label: 'Eternal', category: 'Faith' },
    { name: 'FaPeace', label: 'Peace', category: 'Faith' },
    { name: 'FaDove', label: 'Dove (Holy Spirit)', category: 'Faith' },
    { name: 'FaStar', label: 'Star (Guidance)', category: 'Faith' },
    { name: 'FaLightbulb', label: 'Wisdom', category: 'Faith' },
    { name: 'FaShieldAlt', label: 'Protection', category: 'Faith' },
    { name: 'FaBook', label: 'Scripture', category: 'Faith' },
    { name: 'FaBookOpen', label: 'Study', category: 'Faith' },
    { name: 'FaChalkboardTeacher', label: 'Teaching', category: 'Faith' },
    { name: 'FaGraduationCap', label: 'Discipleship', category: 'Faith' },
    { name: 'FaMicrophone', label: 'Preaching', category: 'Faith' },
    { name: 'FaVideo', label: 'Media Ministry', category: 'Faith' },
    { name: 'FaCamera', label: 'Photography', category: 'Faith' },
    { name: 'FaHeadphones', label: 'Sound Tech', category: 'Faith' },
    { name: 'FaComments', label: 'Counseling', category: 'Faith' },
    { name: 'FaComment', label: 'Testimony', category: 'Faith' },
    { name: 'FaEnvelope', label: 'Correspondence', category: 'Faith' },
    { name: 'FaEnvelopeOpen', label: 'Communication', category: 'Faith' },
    { name: 'FaPhone', label: 'Phone Ministry', category: 'Faith' },
    { name: 'FaMobileAlt', label: 'Mobile Outreach', category: 'Faith' },
    { name: 'FaMapMarkerAlt', label: 'Location', category: 'Faith' },
    { name: 'FaLocationArrow', label: 'Direction', category: 'Faith' },
    { name: 'FaCalendar', label: 'Events', category: 'Faith' },
    { name: 'FaCalendarAlt', label: 'Schedule', category: 'Faith' },
    { name: 'FaClock', label: 'Time', category: 'Faith' },
    { name: 'FaHourglass', label: 'Patience', category: 'Faith' },
    { name: 'FaUsers', label: 'Community', category: 'Community' },
    { name: 'FaHandsHelping', label: 'Service', category: 'Community' },
    { name: 'FaHands', label: 'Helping Hands', category: 'Community' },
    { name: 'FaGlobe', label: 'Global Mission', category: 'Community' },
    { name: 'FaGlobeAfrica', label: 'Africa Mission', category: 'Community' },
    { name: 'FaGlobeAmericas', label: 'Americas Mission', category: 'Community' },
    { name: 'FaGlobeAsia', label: 'Asia Mission', category: 'Community' },
    { name: 'FaGlobeEurope', label: 'Europe Mission', category: 'Community' },
    { name: 'FaLanguage', label: 'Language Ministry', category: 'Community' },
    { name: 'FaMap', label: 'Missions Map', category: 'Community' },
    { name: 'FaRoute', label: 'Journey', category: 'Community' },
    { name: 'FaRoad', label: 'Path', category: 'Community' },
    { name: 'FaSubway', label: 'Transport', category: 'Community' },
    { name: 'FaTrain', label: 'Travel', category: 'Community' },
    { name: 'FaCar', label: 'Transportation', category: 'Community' },
    { name: 'FaBus', label: 'Bus Ministry', category: 'Community' },
    { name: 'FaPlane', label: 'Air Travel', category: 'Community' },
    { name: 'FaShip', label: 'Sea Travel', category: 'Community' },
    { name: 'FaTruck', label: 'Logistics', category: 'Community' },
    { name: 'FaTractor', label: 'Agriculture', category: 'Community' },
    { name: 'FaMotorcycle', label: 'Motorcycle Ministry', category: 'Community' },
    { name: 'FaBicycle', label: 'Bicycle Ministry', category: 'Community' },
    { name: 'FaWalking', label: 'Walking Ministry', category: 'Community' },
    { name: 'FaRunning', label: 'Fitness Ministry', category: 'Community' },
    { name: 'FaHiking', label: 'Outdoor Ministry', category: 'Community' },
    { name: 'FaSwimmer', label: 'Swimming Ministry', category: 'Community' },
    { name: 'FaBiking', label: 'Cycling Ministry', category: 'Community' },
    { name: 'FaSkiing', label: 'Winter Ministry', category: 'Community' },
    { name: 'FaSkiingNordic', label: 'Cross Country', category: 'Community' },
    { name: 'FaSnowboarding', label: 'Snow Ministry', category: 'Community' },
    { name: 'FaSeedling', label: 'Growth', category: 'Growth' },
    { name: 'FaTree', label: 'Tree of Life', category: 'Growth' },
    { name: 'FaLeaf', label: 'Nature', category: 'Growth' },
    { name: 'FaMountain', label: 'Mountains', category: 'Growth' },
    { name: 'FaWater', label: 'Water', category: 'Growth' },
    { name: 'FaSun', label: 'Sun', category: 'Growth' },
    { name: 'FaMoon', label: 'Moon', category: 'Growth' },
    { name: 'FaCloud', label: 'Clouds', category: 'Growth' },
    { name: 'FaCloudSun', label: 'Weather', category: 'Growth' },
    { name: 'FaSnowflake', label: 'Snow', category: 'Growth' },
    { name: 'FaFire', label: 'Fire', category: 'Growth' },
    { name: 'FaWind', label: 'Wind', category: 'Growth' },
    { name: 'FaPaw', label: 'Animals', category: 'Growth' },
    { name: 'FaDog', label: 'Dogs', category: 'Growth' },
    { name: 'FaCat', label: 'Cats', category: 'Growth' },
    { name: 'FaHorse', label: 'Horses', category: 'Growth' },
    { name: 'FaFish', label: 'Fish', category: 'Growth' },
    { name: 'FaFrog', label: 'Frogs', category: 'Growth' },
    { name: 'FaDragon', label: 'Dragons', category: 'Growth' },
    { name: 'FaHeartbeat', label: 'Health', category: 'Health' },
    { name: 'FaStethoscope', label: 'Medical', category: 'Health' },
    { name: 'FaMedkit', label: 'First Aid', category: 'Health' },
    { name: 'FaFirstAid', label: 'Emergency', category: 'Health' },
    { name: 'FaHospital', label: 'Hospital', category: 'Health' },
    { name: 'FaClinicMedical', label: 'Clinic', category: 'Health' },
    { name: 'FaPrescription', label: 'Medication', category: 'Health' },
    { name: 'FaVial', label: 'Laboratory', category: 'Health' },
    { name: 'FaFlask', label: 'Science', category: 'Health' },
    { name: 'FaMicroscope', label: 'Research', category: 'Health' },
    { name: 'FaAtom', label: 'Physics', category: 'Health' },
    { name: 'FaRocket', label: 'Space', category: 'Technology' },
    { name: 'FaSpaceShuttle', label: 'Space Shuttle', category: 'Technology' },
    { name: 'FaSatellite', label: 'Satellite', category: 'Technology' },
    { name: 'FaSatelliteDish', label: 'Communication', category: 'Technology' },
    { name: 'FaPuzzlePiece', label: 'Puzzles', category: 'Recreation' },
    { name: 'FaCogs', label: 'Technology', category: 'Technology' },
    { name: 'FaWrench', label: 'Tools', category: 'Technology' },
    { name: 'FaHammer', label: 'Construction', category: 'Technology' },
    { name: 'FaBuilding', label: 'Building', category: 'Technology' },
    { name: 'FaHome', label: 'Home', category: 'Technology' },
    { name: 'FaHouseUser', label: 'Family', category: 'Technology' },
    { name: 'FaDoorOpen', label: 'Welcome', category: 'Technology' },
    { name: 'FaBed', label: 'Rest', category: 'Technology' },
    { name: 'FaShower', label: 'Cleanliness', category: 'Technology' },
    { name: 'FaToilet', label: 'Facilities', category: 'Technology' },
    { name: 'FaUtensils', label: 'Kitchen', category: 'Technology' },
    { name: 'FaCoffee', label: 'Coffee', category: 'Technology' },
    { name: 'FaPizzaSlice', label: 'Food', category: 'Technology' },
    { name: 'FaHamburger', label: 'Burgers', category: 'Technology' },
    { name: 'FaAppleAlt', label: 'Fruit', category: 'Technology' },
    { name: 'FaShoppingCart', label: 'Shopping', category: 'Commerce' },
    { name: 'FaTag', label: 'Sale', category: 'Commerce' },
    { name: 'FaTags', label: 'Discounts', category: 'Commerce' },
    { name: 'FaGift', label: 'Gifts', category: 'Commerce' },
    { name: 'FaBaseballBall', label: 'Baseball', category: 'Sports' },
    { name: 'FaBasketballBall', label: 'Basketball', category: 'Sports' },
    { name: 'FaFootballBall', label: 'Football', category: 'Sports' },
    { name: 'FaVolleyballBall', label: 'Volleyball', category: 'Sports' },
    { name: 'FaGolfBall', label: 'Golf', category: 'Sports' },
    { name: 'FaChess', label: 'Chess', category: 'Games' },
    { name: 'FaChessKing', label: 'Chess King', category: 'Games' },
    { name: 'FaChessQueen', label: 'Chess Queen', category: 'Games' },
    { name: 'FaChessBishop', label: 'Chess Bishop', category: 'Games' },
    { name: 'FaChessKnight', label: 'Chess Knight', category: 'Games' },
    { name: 'FaChessRook', label: 'Chess Rook', category: 'Games' },
    { name: 'FaChessPawn', label: 'Chess Pawn', category: 'Games' },
    { name: 'FaDice', label: 'Dice', category: 'Games' },
    { name: 'FaDiceOne', label: 'Dice One', category: 'Games' },
    { name: 'FaDiceTwo', label: 'Dice Two', category: 'Games' },
    { name: 'FaDiceThree', label: 'Dice Three', category: 'Games' },
    { name: 'FaDiceFour', label: 'Dice Four', category: 'Games' },
    { name: 'FaDiceFive', label: 'Dice Five', category: 'Games' },
    { name: 'FaDiceSix', label: 'Dice Six', category: 'Games' },
    { name: 'FaHatWizard', label: 'Wizard', category: 'Fantasy' },
    { name: 'FaMagic', label: 'Magic', category: 'Fantasy' },
    { name: 'FaGhost', label: 'Ghost', category: 'Fantasy' },
    { name: 'FaSkull', label: 'Skull', category: 'Fantasy' },
    { name: 'FaSkullCrossbones', label: 'Pirate', category: 'Fantasy' },
    { name: 'FaSpider', label: 'Spider', category: 'Fantasy' },
    { name: 'FaBug', label: 'Bug', category: 'Nature' }
  ];

  useEffect(() => {
    fetchMinistries();
  }, []);

  const fetchMinistries = async () => {
    setLoading(true);
    try {
      const data = await api.getMinistries();
      const mList = data?.results || data || [];
      setMinistries(mList);
    } catch (error) {
      console.error("Failed to fetch ministries", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMinistrySave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', ministryForm.title);
      formData.append('description', ministryForm.description);
      formData.append('color', ministryForm.color);
      formData.append('icon_name', ministryForm.icon_name);
      
      if (ministryForm.imageFile) {
        formData.append('image', ministryForm.imageFile);
      }

      if (editingMinistry) {
        if (ministryForm.imageFile) await api.updateMinistryWithImage(editingMinistry.id, formData);
        else await api.updateMinistry(editingMinistry.id, { title: ministryForm.title, description: ministryForm.description, color: ministryForm.color, icon_name: ministryForm.icon_name });
      } else {
        if (ministryForm.imageFile) await api.createMinistryWithImage(formData);
        else await api.createMinistry({ title: ministryForm.title, description: ministryForm.description, color: ministryForm.color, icon_name: ministryForm.icon_name });
      }
      
      // Invalidate cache to show changes immediately
      api.invalidateMinistriesCache();
      await fetchMinistries();
      setShowMinistryModal(false);
      setSuccessInfo({ title: editingMinistry ? 'Ministry Updated' : 'Ministry Added', message: 'Ministry data saved successfully.' });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to save ministry", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMinistryEdit = (ministry) => {
    setEditingMinistry(ministry);
    setMinistryForm({ 
      title: ministry.title, 
      description: ministry.description, 
      color: ministry.color, 
      icon_name: ministry.icon_name,
      image: ministry.image,
      imageFile: null,
      imagePreview: null 
    });
    setShowMinistryModal(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMinistryForm({ ...ministryForm, imageFile: file, imagePreview: URL.createObjectURL(file) });
    }
  };

  const removeMinistry = (ministry) => {
    setMinistryToDelete(ministry);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!ministryToDelete) return;
    setDeleteLoading(true);
    try {
      await api.deleteMinistry(ministryToDelete.id);
      // Invalidate cache to show changes immediately
      api.invalidateMinistriesCache();
      setShowDeleteModal(false);
      await fetchMinistries();
      setSuccessInfo({ title: 'Ministry Deleted', message: 'Ministry removed successfully.' });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to delete ministry", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="ministries-management animate-fade-in">
      <div className="mb-5">
        <h2 className="fw-bold text-white mb-1">Manage Ministries</h2>
        <p className="text-white opacity-50 small mb-0">Customize and organize the various ministries of the chapel.</p>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Row className="g-4">
          {ministries.map((ministry) => {
            const IconComp = iconMap[ministry.icon_name] || FaUsers;
            return (
              <Col key={ministry.id} md={6} xl={4}>
                <Card className="glass-panel glass-panel-dark border-white border-opacity-10 h-100 p-3 hover-lift border-hover-primary transition-all">
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                      <div 
                        className="rounded-4 p-3 d-flex align-items-center justify-content-center shadow-lg"
                        style={{
                          width: '64px',
                          height: '64px',
                          background: `linear-gradient(135deg, ${ministry.color}, ${ministry.color}cc)`,
                          color: 'white'
                        }}
                      >
                        <IconComp size={28} />
                      </div>
                      <div className="d-flex gap-2">
                        <Button variant="link" className="text-info p-0" onClick={() => handleMinistryEdit(ministry)}><FaEdit /></Button>
                        <Button variant="link" className="text-danger p-0" onClick={() => removeMinistry(ministry)}><FaTrash /></Button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="fw-bold text-white mb-2">{ministry.title}</h5>
                      <p className="text-white opacity-50 small mb-0 line-clamp-3" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ministry.description}</p>
                    </div>

                    <div className="mt-auto pt-3 border-top border-white border-opacity-5 d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle" style={{ width: '12px', height: '12px', backgroundColor: ministry.color }}></div>
                        <span className="smaller text-white opacity-50 font-monospace text-uppercase">{ministry.color}</span>
                      </div>
                      {ministry.image && (
                        <div className="bg-white bg-opacity-10 rounded-pill px-2 py-1 smaller text-white opacity-50">
                          Has Image
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
          <Col md={6} xl={4}>
            <div
              className="glass-panel glass-panel-dark border-white border-opacity-10 h-100 d-flex flex-column align-items-center justify-content-center p-5 text-center cursor-pointer bg-hover-white-opacity-5 transition-all group border-dashed"
              onClick={() => {
                setEditingMinistry(null);
                setMinistryForm({ title: '', description: '', color: '#0077b6', icon_name: 'FaUsers', image: null, imageFile: null, imagePreview: null });
                setShowMinistryModal(true);
              }}
              style={{ minHeight: '320px', borderStyle: 'dashed' }}
            >
              <div className="bg-white bg-opacity-10 p-4 rounded-circle mb-3 group-hover-scale transition-all">
                <FaPlus className="text-white opacity-50" size={32} />
              </div>
              <h5 className="text-white opacity-50 fw-bold">Add New Ministry</h5>
            </div>
          </Col>
        </Row>
      </motion.div>

      {/* Ministry Modal */}
      <Modal show={showMinistryModal} onHide={() => setShowMinistryModal(false)} centered size="lg" className="admin-modal">
        <Modal.Header closeButton className="bg-dark text-white border-white border-opacity-10">
          <Modal.Title className="fw-bold">{editingMinistry ? 'Edit Ministry' : 'Add Ministry'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white p-4">
          <Form>
            <Row className="g-4">
              <Col md={5}>
                <div className="text-center mb-4">
                  <div className="rounded-4 bg-white bg-opacity-5 border border-white border-opacity-10 mx-auto overflow-hidden shadow-inner position-relative mb-3" style={{ width: '100%', aspectRatio: '1/1' }}>
                    {ministryForm.imagePreview ? <img src={ministryForm.imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : ministryForm.image ? <img src={ministryForm.image} alt="Current" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (
                      <div className="h-100 d-flex flex-column align-items-center justify-content-center opacity-25">
                         {React.createElement(iconMap[ministryForm.icon_name] || FaUsers, { size: 64, style: { color: ministryForm.color } })}
                         <span className="smaller mt-2">No Image</span>
                      </div>
                    )}
                  </div>
                  <Button variant="outline-primary" size="sm" className="rounded-pill px-4" onClick={() => document.getElementById('ministry-image-upload').click()}>
                    {ministryForm.image || ministryForm.imageFile ? 'Change Image' : 'Upload Image'}
                  </Button>
                  <input type="file" id="ministry-image-upload" hidden accept="image/*" onChange={handleImageUpload} />
                </div>
              </Col>
              <Col md={7}>
                <Form.Group className="mb-3">
                  <Form.Label className="smaller fw-bold opacity-50 text-uppercase ls-1">Ministry Name</Form.Label>
                  <Form.Control type="text" value={ministryForm.title} onChange={(e) => setMinistryForm({...ministryForm, title: e.target.value})} className="bg-white bg-opacity-5 border-white border-opacity-10 text-white" placeholder="e.g. Youth Ministry" />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="smaller fw-bold opacity-50 text-uppercase ls-1">Theme Color</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control type="color" value={ministryForm.color} onChange={(e) => setMinistryForm({...ministryForm, color: e.target.value})} className="p-1 border-white border-opacity-10 shadow-none" style={{ width: '50px', height: '38px' }} />
                    <Form.Control type="text" value={ministryForm.color} onChange={(e) => setMinistryForm({...ministryForm, color: e.target.value})} className="bg-white bg-opacity-5 border-white border-opacity-10 text-white font-monospace" />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="smaller fw-bold opacity-50 text-uppercase ls-1 d-block mb-3">Select Icon</Form.Label>
                  <div className="p-3 bg-white bg-opacity-5 rounded-4 border border-white border-opacity-10" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <div className="d-flex flex-wrap gap-2">
                      {availableIcons.map((icon) => {
                        const Icon = iconMap[icon.name];
                        return (
                          <div 
                            key={icon.name} 
                            contentEditable={false}
                            className={`p-2 rounded-3 cursor-pointer transition-all ${ministryForm.icon_name === icon.name ? 'bg-primary shadow-lg scale-110' : 'bg-white bg-opacity-5 hover-bg-white-opacity-10'}`} 
                            title={icon.label}
                            onClick={() => setMinistryForm({...ministryForm, icon_name: icon.name})}
                          >
                            <Icon size={18} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-0">
                  <Form.Label className="smaller fw-bold opacity-50 text-uppercase ls-1">Description</Form.Label>
                  <Form.Control as="textarea" rows={4} value={ministryForm.description} onChange={(e) => setMinistryForm({...ministryForm, description: e.target.value})} className="bg-white bg-opacity-5 border-white border-opacity-10 text-white" placeholder="Tell us more about this ministry..." />
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-end gap-3 mt-5">
              <Button variant="link" className="text-white opacity-50 text-decoration-none" onClick={() => setShowMinistryModal(false)}>Cancel</Button>
              <Button variant="primary" className="rounded-pill px-5 py-2 fw-bold shadow-lg" onClick={handleMinistrySave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Ministry'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <DeleteConfirmModal 
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        itemName={ministryToDelete?.title}
        loading={deleteLoading}
      />

      <SuccessModal 
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        title={successInfo.title}
        message={successInfo.message}
      />
      <style>{`
        .bg-hover-white-opacity-5:hover { background: rgba(255, 255, 255, 0.05) !important; }
        .border-dashed { border-style: dashed !important; }
        .line-clamp-3 { line-height: 1.5; }
        .ls-1 { letter-spacing: 1px; }
        .scale-110 { transform: scale(1.1); }
      `}</style>
    </div>
  );
};

export default MinistriesManagement;