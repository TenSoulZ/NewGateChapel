/**
 * Admin Dashboard Component - Analytics overview with charts
 * 
 * Features:
 * - Summary statistics cards (events, sermons, ministries, leaders, messages)
 * - Visitor trends line chart (7-day visualization)
 * - Content distribution pie chart
 * - Animated card entrance effects
 * - Real-time data from analytics endpoint
 * - Glassmorphism dark theme design
 * 
 * Data Sources:
 * - Analytics from `/api/analytics/`
 * 
 * Charts:
 * - Recharts library for data visualization
 * - Responsive containers for mobile support
 * 
 * @component
 */

import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { 
  FaEye, 
  FaEnvelope, 
  FaPray, 
  FaUserPlus, 
  FaArrowUp, 
  FaArrowDown, 
  FaRegClock,
  FaCalendarAlt,
  FaBible,
  FaUsers,
  FaUserTie
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import api from '../../services/api';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches analytics data on component mount.
   * Analytics include stats, visitor trends, and content distribution.
   */
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await api.getAnalytics();
        setAnalytics(data);
      } catch (error) {
        // Silent fail - empty dashboard will be shown
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  /**
   * Returns the appropriate icon component for a stat type.
   * @param {string} type - Stat type (event, sermon, ministry, leader, message)
   * @returns {React.Component} FontAwesome icon component
   */
  const getIcon = (type) => {
    switch (type) {
      case 'event': return FaCalendarAlt;
      case 'sermon': return FaBible;
      case 'ministry': return FaUsers;
      case 'leader': return FaUserTie;
      case 'message': return FaEnvelope;
      default: return FaEye;
    }
  };

  /**
   * Returns the theme color for a stat type.
   * @param {string} type - Stat type
   * @returns {string} Hex color code
   */
  const getStatColor = (type) => {
    switch (type) {
      case 'event': return '#3b82f6';
      case 'sermon': return '#10b981';
      case 'ministry': return '#f59e0b';
      case 'leader': return '#8b5cf6';
      case 'message': return '#ec4899';
      default: return '#3b82f6';
    }
  };

  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
    <div className="dashboard-wrapper">
      <div className="d-flex align-items-center justify-content-between mb-5">
        <div>
          <h2 className="fw-bold mb-1 text-white">Analytics Overview</h2>
          <p className="text-white opacity-50 small mb-0">Welcome back! Here's what's happening across the chapel.</p>
        </div>
        <div className="bg-white bg-opacity-10 px-3 py-2 rounded-3 small text-white border border-white border-opacity-10">
          <FaRegClock className="me-2" />
          Last update: Just now
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Row className="g-4 mb-5">
          {analytics?.stats.map((stat, index) => {
            const Icon = getIcon(stat.type);
            const color = getStatColor(stat.type);
            return (
              <Col key={index} sm={6} xl={3}>
                <motion.div variants={itemVariants}>
                  <Card className="glass-panel glass-panel-dark border-white border-opacity-10 h-100 p-3 shadow-lg">
                    <Card.Body>
                      <div className="d-flex justify-content-between mb-4">
                        <div 
                          className="rounded-circle p-3 d-flex align-items-center justify-content-center shadow-sm"
                          style={{ backgroundColor: `${color}20`, color: color, width: '50px', height: '50px' }}
                        >
                          <Icon size={22} />
                        </div>
                        <div className={`small d-flex align-items-center ${stat.isPositive ? 'text-success' : 'text-danger'} fw-bold`}>
                          {stat.isPositive ? <FaArrowUp className="me-1" /> : <FaArrowDown className="me-1" />}
                          {stat.change}
                        </div>
                      </div>
                      <h3 className="fw-bold h2 text-white mb-2">{stat.value}</h3>
                      <p className="text-white opacity-50 small mb-0">{stat.label}</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            );
          })}
        </Row>

        <Row className="g-4 mb-5">
          <Col lg={8}>
            <motion.div variants={itemVariants}>
              <Card className="glass-panel glass-panel-dark border-white border-opacity-10 h-100 p-4">
                <h5 className="fw-bold text-white mb-4">Visitor Trends</h5>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart data={analytics?.visitorTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="rgba(255,255,255,0.5)" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="rgba(255,255,255,0.5)" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(value) => `${value/1000}k`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="visits" 
                        stroke="#3b82f6" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} 
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
          </Col>
          <Col lg={4}>
            <motion.div variants={itemVariants}>
              <Card className="glass-panel glass-panel-dark border-white border-opacity-10 h-100 p-4">
                <h5 className="fw-bold text-white mb-4">Content Distribution</h5>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={analytics?.contentDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {analytics?.contentDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                         contentStyle={{ 
                          backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        wrapperStyle={{ paddingTop: '20px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </motion.div>

      <style>{`
        .recharts-cartesian-grid-horizontal line {
          stroke: rgba(255, 255, 255, 0.05);
        }
        .recharts-tooltip-cursor {
          stroke: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
