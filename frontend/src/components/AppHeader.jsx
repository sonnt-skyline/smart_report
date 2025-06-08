import logo from '../assets/react.svg';
import { Link } from 'react-router-dom';

function AccountIcon() {
  return (
    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#3a3a7a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 24 }} aria-label="Account">
      <span role="img" aria-label="User">👤</span>
    </div>
  );
}

export default function AppHeader() {
  return (
    <div className="dashboard-header-row">
      <img src={logo} alt="Logo" className="dashboard-logo" />
      <h1 className="dashboard-title">My Weekly Actions Status</h1>
      <nav>
        <Link to="/" style={{ marginRight: 16 }}>Home</Link>
        <Link to="/status-timeline">Status Timeline</Link>
      </nav>
      <AccountIcon />
    </div>
  );
}
