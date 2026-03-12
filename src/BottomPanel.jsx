import React from 'react';
import { Activity, Map as MapIcon, PlaneTakeoff, Clock } from 'lucide-react';

export default function BottomPanel({ status, areaCovered, droneAssigned, flightTime }) {
    const getStatusClass = () => {
        switch (status) {
            case 'In Progress': return 'in-progress';
            case 'Scheduled': return 'scheduled';
            case 'Completed': return 'completed';
            default: return '';
        }
    };

    return (
        <div className="bottom-panel">
            <div className="status-items">
                <div className="status-item">
                    <Activity size={18} className="status-icon" />
                    <span className="status-label">Mission Status:</span>
                    <span className={`status-badge ${getStatusClass()}`}>{status}</span>
                </div>

                <div className="status-item">
                    <MapIcon size={18} className="status-icon" />
                    <span className="status-label">Farm Area Covered:</span>
                    <span className="status-value">{areaCovered > 0 ? `${areaCovered.toFixed(2)} Acres` : '--'}</span>
                </div>

                <div className="status-item">
                    <PlaneTakeoff size={18} className="status-icon" />
                    <span className="status-label">Drone Assigned:</span>
                    <span className="status-value">{droneAssigned}</span>
                </div>

                <div className="status-item">
                    <Clock size={18} className="status-icon" />
                    <span className="status-label">Estimated Flight Time:</span>
                    <span className="status-value">{flightTime}</span>
                </div>
            </div>
        </div>
    );
}
