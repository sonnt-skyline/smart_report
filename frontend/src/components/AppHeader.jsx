import React, { useState } from 'react';
import logo from '../assets/react.svg';
import { Link } from 'react-router-dom';

function AccountIcon() {
  return (
    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#3a3a7a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 24 }}>
      <span role="img" aria-label="User">👤</span>
    </div>
  );
}

export default function AppHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <header className="dashboard-header-row" style={{ width: '1200px' }}>
        <div className="header-left">
          <img src={logo} alt="Logo" className="dashboard-logo" />
          <h1 className="dashboard-title">Constellation</h1>
        </div>
        
        <nav className="main-navigation">
          <Link to="/" className="nav-link">Overview</Link>
          <Link to="/actions" className="nav-link">Actions</Link>
          <Link to="/status-timeline" className="nav-link">Timeline</Link>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/summary" className="nav-link">Summary</Link>
          <Link to="/weekly-report" className="nav-link">Weekly Report</Link>
          <Link to="/member-ranking" className="nav-link">Rankings</Link>
        </nav>
        
        <button
          className={menuOpen ? 'hamburger-menu open' : 'hamburger-menu'}
          aria-label="Account"
          onClick={() => setMenuOpen(m => !m)}
        >
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
        </button>
        <nav className={menuOpen ? 'nav-menu open' : 'nav-menu'}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Overview</Link>
          <Link to="/actions" onClick={() => setMenuOpen(false)}>Actions</Link>
          <Link to="/status-timeline" onClick={() => setMenuOpen(false)}>Status Timeline</Link>
          <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <Link to="/summary" onClick={() => setMenuOpen(false)}>Summary</Link>
          <Link to="/weekly-report" onClick={() => setMenuOpen(false)}>Weekly Report</Link>
          <Link to="/member-ranking" onClick={() => setMenuOpen(false)}>Rankings</Link>
          <div className="account-menu-mobile"><AccountIcon /></div>
        </nav>
      </header>
    </div>
  );
}
