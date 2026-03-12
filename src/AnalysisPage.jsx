import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle, Search, AlertTriangle } from 'lucide-react';

export default function AnalysisPage({ onComplete }) {
    const [progress, setProgress] = useState(0);
    const [analyzing, setAnalyzing] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(p => {
                const next = p + Math.floor(Math.random() * 15) + 5;
                if (next >= 100) {
                    clearInterval(interval);
                    setAnalyzing(false);
                    return 100;
                }
                return next;
            });
        }, 500); // Mock processing timeline
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ flex: 1, overflowY: 'auto', width: '100%' }}>
            <div className="analysis-page-wrapper" style={{ padding: '60px 40px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: '#E6FFFA', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                    <Cpu size={40} color="var(--primary-color)" />
                </div>

                <h1 style={{ fontSize: '28px', marginBottom: '16px', color: 'var(--text-dark)', fontWeight: 700 }}>AI Imagery Analysis</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '40px', fontSize: '16px' }}>
                    Analyzing captured drone data and calculating crop loss indices using multi-spectral computer vision models.
                </p>

                <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', boxShadow: 'var(--shadow-md)', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <span style={{ fontWeight: 600, color: analyzing ? 'var(--secondary-color)' : 'var(--primary-color)' }}>
                            {analyzing ? 'Processing Dataset...' : 'Analysis Complete'}
                        </span>
                        <span style={{ fontWeight: 700, fontSize: '18px' }}>{progress}%</span>
                    </div>

                    {/* Custom Progress Bar */}
                    <div style={{ width: '100%', height: '12px', background: '#EDF2F7', borderRadius: '6px', overflow: 'hidden' }}>
                        <div style={{ width: `${progress}%`, height: '100%', background: analyzing ? 'var(--secondary-color)' : 'var(--primary-color)', transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                    </div>

                    {!analyzing && (
                        <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left', padding: '24px', background: '#F7FAFC', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-dark)' }}>
                                <div style={{ background: '#C6F6D5', padding: '8px', borderRadius: '50%' }}><CheckCircle color="var(--primary-color)" size={20} /></div>
                                <span style={{ fontSize: '15px', fontWeight: 500 }}>Processed and stitched all grid images accurately.</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-dark)' }}>
                                <div style={{ background: '#EBF8FF', padding: '8px', borderRadius: '50%' }}><Search color="var(--secondary-color)" size={20} /></div>
                                <span style={{ fontSize: '15px', fontWeight: 500 }}>Applied NDVI & Multi-Spectral Crop Stress filters.</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#C53030' }}>
                                <div style={{ background: '#FED7D7', padding: '8px', borderRadius: '50%' }}><AlertTriangle size={20} color="#C53030" /></div>
                                <span style={{ fontSize: '15px', fontWeight: 500 }}>Detected 32% crop area damage (lodging and excess moisture).</span>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ height: '60px' }}>
                    {!analyzing && (
                        <button className="btn btn-primary" onClick={onComplete} style={{ margin: '0 auto', padding: '14px 32px', fontSize: '16px', boxShadow: 'var(--shadow-md)' }}>
                            Review Assessment Report
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
