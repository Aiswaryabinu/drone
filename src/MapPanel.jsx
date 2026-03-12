import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Pencil, Trash2, Edit3, Upload, Navigation } from 'lucide-react';

// Setup leaflet marker icons manually since react-leaflet sometimes misses them 
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl,
    shadowUrl: iconShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Area calculation in Acres (Approximation based on Shoelace on Sphere)
function calculateAreaInAcres(locations) {
    if (locations.length < 3) return 0;
    const radius = 6378137;
    let area = 0;
    for (let i = 0; i < locations.length; i++) {
        let p1 = locations[i];
        let p2 = locations[(i + 1) % locations.length];
        area += ((p2.lng - p1.lng) * Math.PI / 180) *
            (2 + Math.sin(p1.lat * Math.PI / 180) + Math.sin(p2.lat * Math.PI / 180));
    }
    area = Math.abs(area * radius * radius / 2.0); // M^2
    return area * 0.000247105; // M^2 to Acres
}

// Component to handle clicks safely
function MapInteraction({ isDrawing, onMapClick }) {
    useMapEvents({
        click(e) {
            if (isDrawing) {
                onMapClick(e.latlng);
            }
        }
    });
    return null;
}

// Ensure Center View on Coordinates safely
function MapCenterer({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center && center.lat && center.lng) {
            map.flyTo([center.lat, center.lng], 16, { animate: true });
        }
    }, [center, map]);
    return null;
}

export default function MapPanel({ setFarmArea, coordinates, setCoordinates }) {
    const [isDrawing, setIsDrawing] = useState(false);
    const [centerMap, setCenterMap] = useState({ lat: 37.7749, lng: -122.4194 }); // default San Francisco or whatever farm area

    const handleMapClick = (latlng) => {
        const newCoords = [...coordinates, latlng];
        setCoordinates(newCoords);
        if (newCoords.length >= 3) {
            setFarmArea(calculateAreaInAcres(newCoords));
        }
    };

    const handleDrawToggle = () => {
        setIsDrawing(!isDrawing);
    };

    const handleDelete = () => {
        setCoordinates([]);
        setFarmArea(0);
        setIsDrawing(false);
    };

    const centerOnFarm = () => {
        if (coordinates.length > 0) {
            // average lat lng
            const avgLat = coordinates.reduce((sum, c) => sum + c.lat, 0) / coordinates.length;
            const avgLng = coordinates.reduce((sum, c) => sum + c.lng, 0) / coordinates.length;
            setCenterMap({ lat: avgLat, lng: avgLng });
        }
    };

    // Upload placeholder functionality
    const handleUpload = () => {
        alert("Coordinate upload dialog would open here.");
    };

    return (
        <div className="right-panel">
            {/* Map Toolbar */}
            <div className="map-toolbar">
                <button
                    className={`map-tool-btn ${isDrawing ? 'active' : ''}`}
                    onClick={handleDrawToggle}
                    title="Draw Boundary"
                >
                    <Pencil size={20} />
                </button>
                <button className="map-tool-btn" title="Edit Boundary" onClick={() => alert("Edit mode not implemented in demo.")}>
                    <Edit3 size={20} />
                </button>
                <button className="map-tool-btn" onClick={handleDelete} title="Delete Boundary">
                    <Trash2 size={20} />
                </button>
                <button className="map-tool-btn" onClick={handleUpload} title="Upload Coordinates">
                    <Upload size={20} />
                </button>
                <button className="map-tool-btn" onClick={centerOnFarm} title="Center Map on Farm">
                    <Navigation size={20} />
                </button>
            </div>

            <div className="map-container">
                {/* We use a satellite layer as required */}
                <MapContainer center={[centerMap.lat, centerMap.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
                    {/* Esri World Imagery maps for beautiful satellite view */}
                    <TileLayer
                        attribution='&copy; <a href="https://www.esri.com/">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                    <MapInteraction isDrawing={isDrawing} onMapClick={handleMapClick} />
                    <MapCenterer center={centerMap} />

                    {coordinates.map((pos, idx) => (
                        <Marker key={idx} position={[pos.lat, pos.lng]} />
                    ))}

                    {coordinates.length >= 3 && (
                        <Polygon
                            positions={coordinates.map(c => [c.lat, c.lng])}
                            pathOptions={{ color: 'var(--primary-color)', fillColor: 'var(--primary-hover)', fillOpacity: 0.4, weight: 3 }}
                        />
                    )}
                </MapContainer>
            </div>

            {/* Info Status Box Overlay */}
            {coordinates.length > 0 && (
                <div className="map-info-overlay">
                    <div className="map-info-title">Farm Coordinates Data</div>
                    <div className="map-info-data">
                        <div className="info-item">
                            <span className="info-label">Total Points</span>
                            <span className="info-value">{coordinates.length}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Area Calculated</span>
                            <span className="info-value">{calculateAreaInAcres(coordinates).toFixed(2)} Acres</span>
                        </div>
                        <div className="info-item" style={{ marginTop: '8px' }}>
                            <span className="info-label" style={{ fontSize: '11px' }}>Latest Point:</span>
                            <span className="info-value" style={{ fontSize: '11px', fontFamily: 'monospace' }}>
                                {coordinates[coordinates.length - 1].lat.toFixed(5)}, {coordinates[coordinates.length - 1].lng.toFixed(5)}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
