import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/dashboard" element={
            <div className="p-10 text-3xl font-bold text-center">
                Dashboard Coming Soon! 🚀
            </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;