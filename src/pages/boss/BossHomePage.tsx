import React from 'react';
import { Navigate } from 'react-router-dom';

// BossHomePage redirects to the main Boss Overview
const BossHomePage = () => {
  return <Navigate to="/dashboard/boss" replace />;
};

export default BossHomePage;
