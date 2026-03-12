import React, { useState } from 'react';
import { FileUp, Database, PlaneTakeoff, Info } from 'lucide-react';

export default function LeftPanel({ claimId, farmArea, onStartMission }) {
    const [damagePercent, setDamagePercent] = useState(30);
    const [disasterType, setDisasterType] = useState('');
    const [cropType, setCropType] = useState('');

    const handleGenerateMission = () => {
        if (farmArea === 0) {
            alert("Please draw a farm boundary first to calculate the farm area!");
            return;
        }

        onStartMission({
            disasterType: disasterType || 'Severe Storm / Flood',
            damagePercent: damagePercent,
            cropType: cropType || 'Wheat (Winter)'
        });
    };

    return (
        <div className="left-panel">
            <div className="panel-header">
                <h2><Info size={18} /> Claim Information</h2>
            </div>

            <div className="panel-body">
                {/* Insurance Claim Details */}
                <div className="form-section">
                    <div className="form-section-title">Insurance Claim Details</div>

                    <div className="form-group">
                        <label>Claim ID</label>
                        <input type="text" className="form-control" value={claimId} disabled />
                    </div>

                    <div className="form-group">
                        <label>Farmer Name</label>
                        <input type="text" className="form-control" placeholder="Enter farmer name" />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="tel" className="form-control" placeholder="+1..." />
                        </div>
                        <div className="form-group">
                            <label>District / Location</label>
                            <input type="text" className="form-control" placeholder="City or region" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Crop Type</label>
                            <select className="form-control" value={cropType} onChange={e => setCropType(e.target.value)}>
                                <option value="" disabled>Select crop</option>
                                <option value="Rice">Rice</option>
                                <option value="Wheat">Wheat</option>
                                <option value="Banana">Banana</option>
                                <option value="Coffee">Coffee</option>
                                <option value="Rubber">Rubber</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Crop Variety (optional)</label>
                            <input type="text" className="form-control" placeholder="E.g. Basmati" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Sowing Date</label>
                            <input type="date" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Expected Harvest Date</label>
                            <input type="date" className="form-control" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Disaster Type</label>
                            <select className="form-control" value={disasterType} onChange={e => setDisasterType(e.target.value)}>
                                <option value="" disabled>Select disaster</option>
                                <option value="Flood">Flood</option>
                                <option value="Drought">Drought</option>
                                <option value="Pest Attack">Pest Attack</option>
                                <option value="Storm Damage">Storm Damage</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Disaster Date</label>
                            <input type="date" className="form-control" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Estimated Damage Percentage</label>
                        <div className="slider-container">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={damagePercent}
                                onChange={(e) => setDamagePercent(e.target.value)}
                                className="slider"
                            />
                            <span className="slider-value">{damagePercent}%</span>
                        </div>
                    </div>
                </div>

                {/* Farm Information */}
                <div className="form-section">
                    <div className="form-section-title">Farm Information</div>

                    <div className="form-group">
                        <label>Survey Number / Land Record ID</label>
                        <input type="text" className="form-control" placeholder="Enter record ID" />
                    </div>

                    <div className="form-group">
                        <label>Farm Area (Auto-calculated)</label>
                        <input
                            type="text"
                            className="form-control"
                            value={farmArea > 0 ? `${farmArea.toFixed(2)} Acres` : 'Draw boundary to calculate'}
                            disabled
                        />
                    </div>

                    <div className="action-buttons">
                        <button className="btn btn-secondary">
                            <FileUp size={16} />
                            Upload Land Record File (.geojson/.shp)
                        </button>
                        <button className="btn btn-outline">
                            <Database size={16} />
                            Import From Government Records
                        </button>
                        <button className="btn btn-primary" onClick={handleGenerateMission}>
                            <PlaneTakeoff size={16} />
                            Generate Drone Survey Mission
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
