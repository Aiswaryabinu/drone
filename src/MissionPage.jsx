import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Camera, Battery, Clock, Activity, Image as ImageIcon } from 'lucide-react';

// Setup leaflet marker icons manually
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl,
    shadowUrl: iconShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const droneIconHtml = `
  <div style="background: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.5); transform: translate(-20px, -20px); border: 2px solid var(--primary-color);">
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 22h20"/><path d="M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2l4.19-2.06a2.41 2.41 0 0 1 3.15 1.69c.82 2.15-1.89 3.29-3.74 2.71L6.36 17.4Z"/>
    </svg>
  </div>
`;
const DroneIcon = L.divIcon({
    html: droneIconHtml,
    className: 'custom-drone-icon',
    iconSize: [0, 0]
});

// Generate Boustrophedon path strictly inside the polygon
function generateClippedBoustrophedon(locations) {
    if (locations.length < 3) return [];

    let minLat = Math.min(...locations.map(c => c.lat));
    let maxLat = Math.max(...locations.map(c => c.lat));

    const numPasses = 12; // number of passes for grid
    const latStep = (maxLat - minLat) / numPasses;

    const path = [];
    let leftToRight = true;

    for (let i = 0; i <= numPasses; i++) {
        const y = minLat + (i * latStep);
        let intersections = [];

        for (let j = 0; j < locations.length; j++) {
            const p1 = locations[j];
            const p2 = locations[(j + 1) % locations.length];

            if ((p1.lat <= y && p2.lat > y) || (p2.lat <= y && p1.lat > y)) {
                const x = p1.lng + (y - p1.lat) * (p2.lng - p1.lng) / (p2.lat - p1.lat);
                intersections.push(x);
            }
        }

        intersections.sort((a, b) => a - b);

        if (intersections.length >= 2) {
            const x1 = intersections[0];
            const x2 = intersections[intersections.length - 1];

            // Shrink slightly to ensure drone visually stays inside boundary
            const margin = (x2 - x1) * 0.02;

            if (leftToRight) {
                path.push({ lat: y, lng: x1 + margin });
                path.push({ lat: y, lng: x2 - margin });
            } else {
                path.push({ lat: y, lng: x2 - margin });
                path.push({ lat: y, lng: x1 + margin });
            }
            leftToRight = !leftToRight;
        }
    }
    return path;
}

function MapCenterer({ coordinates }) {
    const map = useMap();
    useEffect(() => {
        if (coordinates && coordinates.length >= 3) {
            const bounds = L.latLngBounds(coordinates.map(c => [c.lat, c.lng]));
            map.fitBounds(bounds, { padding: [50, 50], animate: true });
        }
    }, [coordinates, map]);
    return null;
}

export default function MissionPage({ coordinates, farmArea, droneAssigned, onMissionComplete }) {
    const [dronePos, setDronePos] = useState(null);
    const [surveyPath, setSurveyPath] = useState([]);
    const [centerMap, setCenterMap] = useState({ lat: 37.7749, lng: -122.4194 });
    const animationRef = useRef(null);

    // Stats & Data states
    const [battery, setBattery] = useState(100);
    const [pictures, setPictures] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [capturedPhotos, setCapturedPhotos] = useState([]);

    // Sample Unsplash crop/farm imagery to simulate generating photos
    const sampleImages = [
        'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=300&auto=format&fit=crop', // Corn field
        'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=300&auto=format&fit=crop', // Farmland
        'https://images.unsplash.com/photo-1586771107445-d3af18db0d75?q=80&w=300&auto=format&fit=crop', // Tractors
        'https://images.unsplash.com/photo-1592982537447-6f2ec55964f4?q=80&w=300&auto=format&fit=crop', // Top down
        'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=300&auto=format&fit=crop', // Farm path
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=300&auto=format&fit=crop', // Lush field
    ];

    useEffect(() => {
        if (coordinates && coordinates.length >= 3) {
            const avgLat = coordinates.reduce((sum, c) => sum + c.lat, 0) / coordinates.length;
            const avgLng = coordinates.reduce((sum, c) => sum + c.lng, 0) / coordinates.length;
            setCenterMap({ lat: avgLat, lng: avgLng });

            const path = generateClippedBoustrophedon(coordinates);
            setSurveyPath(path);

            if (path.length > 0) {
                let currentSeg = 0;
                let progress = 0;
                const speed = 0.003;

                // Track start time for stats
                const startTime = Date.now();

                const animate = () => {
                    if (currentSeg >= path.length - 1) {
                        cancelAnimationFrame(animationRef.current);
                        if (onMissionComplete) {
                            setTimeout(onMissionComplete, 1000); // Wait 1s then proceed to analysis
                        }
                        return; // Stop at end of mission
                    }

                    const p1 = path[currentSeg];
                    const p2 = path[currentSeg + 1];

                    const lat = p1.lat + (p2.lat - p1.lat) * progress;
                    const lng = p1.lng + (p2.lng - p1.lng) * progress;
                    setDronePos({ lat, lng });

                    progress += speed;
                    if (progress >= 1) {
                        progress = 0;
                        currentSeg++;

                        // We reached a turning point in the grid, take a picture
                        setPictures(prev => {
                            if (prev >= path.length) return prev;

                            // Add a random photo to mock Google Photos style grid
                            const randomPhoto = sampleImages[Math.floor(Math.random() * sampleImages.length)];
                            setCapturedPhotos(photos => [...photos, randomPhoto]);

                            return prev + 1;
                        });
                    }

                    // Update elapsed time
                    const elapsedSecs = Math.floor((Date.now() - startTime) / 1000);
                    setTimeElapsed(elapsedSecs);

                    // Stop decreasing battery
                    setBattery(100);

                    animationRef.current = requestAnimationFrame(animate);
                };

                animationRef.current = requestAnimationFrame(animate);

                return () => cancelAnimationFrame(animationRef.current);
            }
        }
    }, [coordinates]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className="mission-page-container" style={{ display: 'flex', width: '100%', height: 'calc(100vh - 110px)' }}>

            {/* Stats Overlay Panel on the Left */}
            <div className="mission-stats-panel" style={{ width: '350px', backgroundColor: 'var(--card-bg)', padding: '24px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '18px', color: 'var(--text-dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity color="var(--primary-color)" /> Live Mission Tracker
                </h2>

                <div style={{ background: '#F7FAFC', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <Camera size={20} color="var(--secondary-color)" />
                        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)' }}>Grid Pictures Captured</span>
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 600, color: 'var(--text-dark)' }}>{pictures}</div>
                </div>

                <div style={{ background: '#F7FAFC', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <Battery size={20} color={battery > 50 ? 'var(--primary-color)' : (battery > 20 ? '#ED8936' : '#E53E3E')} />
                        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)' }}>Drone Battery Life</span>
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 600, color: 'var(--text-dark)' }}>{battery}%</div>
                    {/* Progress bar visual */}
                    <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '4px', marginTop: '12px', overflow: 'hidden' }}>
                        <div style={{ width: `${battery}%`, height: '100%', background: battery > 50 ? 'var(--primary-color)' : (battery > 20 ? '#ED8936' : '#E53E3E'), transition: 'width 0.3s' }}></div>
                    </div>
                </div>

                <div style={{ background: '#F7FAFC', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <Clock size={20} color="var(--secondary-color)" />
                        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)' }}>Time Elapsed</span>
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 600, color: 'var(--text-dark)' }}>{formatTime(timeElapsed)}</div>
                </div>

                <div style={{ background: '#F7FAFC', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <ImageIcon size={20} color="var(--primary-color)" />
                        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)' }}>Scanning Area</span>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-dark)' }}>{farmArea ? farmArea.toFixed(2) : '0'} Acres</div>
                </div>

            </div>

            {/* Live Map Area (Simplified, Tightly Bounded) */}
            <div className="mission-map-area" style={{ flex: 1, position: 'relative', borderRight: '1px solid var(--border-color)' }}>
                <MapContainer zoom={16} style={{ height: '100%', width: '100%', background: '#F7FAFC' }} zoomControl={false} dragging={false} scrollWheelZoom={false}>
                    <MapCenterer coordinates={coordinates} />

                    {coordinates && coordinates.length >= 3 && (
                        <Polygon
                            positions={coordinates.map(c => [c.lat, c.lng])}
                            pathOptions={{ color: 'var(--primary-color)', fillColor: 'var(--primary-hover)', fillOpacity: 0.2, weight: 3 }}
                        />
                    )}

                    {surveyPath.length > 0 && (
                        <Polyline
                            positions={surveyPath.map(c => [c.lat, c.lng])}
                            pathOptions={{ color: '#2B6CB0', weight: 2, dashArray: '5, 10' }}
                        />
                    )}

                    {dronePos && (
                        <Marker position={[dronePos.lat, dronePos.lng]} icon={DroneIcon} />
                    )}
                </MapContainer>

                {/* Visual Label for the simplified view */}
                <div style={{ position: 'absolute', top: 16, left: 16, background: 'white', padding: '6px 12px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 1000, fontWeight: 600, fontSize: '12px', color: 'var(--text-dark)' }}>
                    Isolated Polygon Tracking View
                </div>
            </div>

            {/* Live Captured Image Grid Panel (Google Photos Prototype Style) */}
            <div className="mission-photo-grid" style={{ width: '400px', backgroundColor: '#fff', padding: '24px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <h2 style={{ fontSize: '18px', color: 'var(--text-dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ImageIcon color="var(--primary-color)" /> Live Image Feed
                </h2>

                {capturedPhotos.length === 0 ? (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                        Waiting for drone to capture imagery...
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', alignContent: 'start' }}>
                        {capturedPhotos.map((url, idx) => (
                            <div key={idx} style={{ position: 'relative', width: '100%', paddingBottom: '100%', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                <img src={url} alt={`Capture ${idx}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', bottom: 4, left: 4, background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>
                                    IMG_{idx.toString().padStart(4, '0')}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}
