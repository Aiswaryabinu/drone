import React, { useState } from 'react';
import TopNav from './TopNav';
import LeftPanel from './LeftPanel';
import MapPanel from './MapPanel';
import BottomPanel from './BottomPanel';
import MissionPage from './MissionPage';
import AnalysisPage from './AnalysisPage';
import ReportPage from './ReportPage';
import './index.css';

function App() {
  const [farmArea, setFarmArea] = useState(0);
  const [missionStatus, setMissionStatus] = useState('Scheduled'); // Not Started / Scheduled / In Progress / Completed
  const [droneAssigned, setDroneAssigned] = useState('DJI Agras T30');
  const [estimatedFlightTime, setEstimatedFlightTime] = useState('45 mins');
  const [coordinates, setCoordinates] = useState([]);

  const [farmerClaimDetails, setFarmerClaimDetails] = useState({
    disasterType: 'Severe Storm / Flood',
    cropType: 'Wheat (Winter)',
    damagePercent: 30
  });

  // Generate random claim ID
  const [claimId] = useState(`CLM-${Math.floor(10000 + Math.random() * 90000)}`);

  const [view, setView] = useState('dashboard'); // 'dashboard' or 'mission'

  const handleStartMission = (details) => {
    if (details) {
      setFarmerClaimDetails(details);
    }
    setMissionStatus('In Progress');
    setView('mission');
  };

  const handleMissionComplete = () => {
    setMissionStatus('Completed');
    setView('analysis');
  };

  const handleAnalysisComplete = () => {
    setView('report');
  };

  return (
    <div className="app-container">
      <TopNav view={view} setView={setView} />
      {view === 'dashboard' ? (
        <div className="main-content">
          <LeftPanel
            claimId={claimId}
            farmArea={farmArea}
            onStartMission={handleStartMission}
          />
          <MapPanel
            setFarmArea={setFarmArea}
            coordinates={coordinates}
            setCoordinates={setCoordinates}
          />
        </div>
      ) : view === 'mission' ? (
        <MissionPage coordinates={coordinates} farmArea={farmArea} droneAssigned={droneAssigned} onMissionComplete={handleMissionComplete} />
      ) : view === 'analysis' ? (
        <AnalysisPage onComplete={handleAnalysisComplete} />
      ) : (
        <ReportPage claimId={claimId} farmArea={farmArea} claimDetails={farmerClaimDetails} onReturnHome={() => { setView('dashboard'); setMissionStatus('Scheduled'); setCoordinates([]); setFarmArea(0); }} />
      )}
      <BottomPanel
        status={missionStatus}
        areaCovered={farmArea}
        droneAssigned={droneAssigned}
        flightTime={estimatedFlightTime}
      />
    </div>
  );
}

export default App;
