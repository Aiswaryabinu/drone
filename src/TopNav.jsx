import React from 'react';
import { Plane, Bell, Settings, User } from 'lucide-react';

export default function TopNav({ view, setView }) {
    return (
        <nav className="top-nav">
            <div className="nav-brand">
                <Plane size={24} color="var(--primary-color)" strokeWidth={2.5} />
                <span>Crop Insurance Drone Verification System</span>
            </div>

            <div className="nav-menu">
                <button className={`nav-item ${view === 'dashboard' ? 'active' : ''}`} style={{ background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', fontSize: '14px', cursor: 'pointer' }} onClick={() => setView('dashboard')}>Dashboard</button>
                <button className="nav-item" style={{ background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', fontSize: '14px', cursor: 'pointer' }}>Claims</button>
                <button className={`nav-item ${view === 'mission' ? 'active' : ''}`} style={{ background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', fontSize: '14px', cursor: 'pointer' }} onClick={() => setView('mission')}>Drone Missions</button>
                <button className="nav-item" style={{ background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', fontSize: '14px', cursor: 'pointer' }}>Damage Analysis</button>
                <button className="nav-item" style={{ background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', fontSize: '14px', cursor: 'pointer' }}>Reports</button>
            </div>

            <div className="nav-actions">
                <button className="icon-btn" title="Notifications">
                    <Bell size={20} />
                </button>
                <button className="icon-btn" title="Settings">
                    <Settings size={20} />
                </button>
                <div className="profile-avatar" title="User Profile (Insurance Officer)">
                    <User size={18} />
                </div>
            </div>
        </nav>
    );
}
