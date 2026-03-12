import React from 'react';
import { FileText, Download, Printer, CheckCircle, ShieldAlert } from 'lucide-react';

export default function ReportPage({ claimId, farmArea, claimDetails, onReturnHome }) {
    const aiCalculatedDamage = (claimDetails.damagePercent * 1.08).toFixed(1); // 8% variance
    const estimatedValuePerAcre = 1200; // Mock base valuation for the crop

    // Calculate raw numeric value then format to both currencies
    const baseClaimValue = farmArea * estimatedValuePerAcre * (aiCalculatedDamage / 100);
    const totalClaimableUSD = baseClaimValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    const totalClaimableINR = (baseClaimValue * 83).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

    return (
        <div style={{ flex: 1, overflowY: 'auto', width: '100%', backgroundColor: 'var(--bg-color)' }}>
            <div className="report-page-wrapper" style={{ padding: '60px', maxWidth: '900px', margin: '0 auto', fontFamily: 'var(--font-family)', minHeight: '100%' }}>
                <div className="report-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '26px', display: 'flex', alignItems: 'center', gap: '16px', fontWeight: 600, color: 'var(--text-dark)' }}>
                        <div style={{ background: '#E6FFFA', padding: '12px', borderRadius: '12px' }}>
                            <FileText color="var(--primary-color)" size={28} />
                        </div>
                        Verification Report
                    </h1>
                    <div className="report-page-actions" style={{ display: 'flex', gap: '16px' }}>
                        <button className="btn btn-outline" style={{ padding: '12px 20px', fontSize: '14px', background: '#fff', boxShadow: 'var(--shadow-sm)' }}>
                            <Printer size={18} /> Print PDF
                        </button>
                        <button className="btn btn-primary" style={{ padding: '12px 20px', fontSize: '14px', boxShadow: 'var(--shadow-md)' }}>
                            <Download size={18} /> Submit to Policy Database
                        </button>
                    </div>
                </div>

                <div style={{ background: '#fff', padding: '48px', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', borderTop: '4px solid var(--primary-color)' }}>
                    <div style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '32px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <h2 style={{ fontSize: '24px', color: 'var(--text-dark)', marginBottom: '8px', fontWeight: 700 }}>Claim #{claimId || 'CLM-10928'}</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Automated Drone Assessment & Intelligence Platform</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <h3 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '6px' }}>Verified On</h3>
                            <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-dark)' }}>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>

                    <div className="report-page-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                        <div style={{ background: '#F7FAFC', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                            <h3 style={{ fontSize: '14px', marginBottom: '20px', color: 'var(--secondary-color)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>Farmer & Policy Details</h3>
                            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                                <tbody>
                                    <tr><th style={{ color: 'var(--text-muted)', fontWeight: 500, width: '40%' }}>Farmer Name</th><td style={{ fontWeight: 600, color: 'var(--text-dark)' }}>Verified Customer</td></tr>
                                    <tr><th style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Location Vector</th><td style={{ fontWeight: 600, color: 'var(--text-dark)' }}>California Region</td></tr>
                                    <tr><th style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Crop Insured</th><td style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{claimDetails.cropType}</td></tr>
                                    <tr><th style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Peril Claimed</th><td style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{claimDetails.disasterType}</td></tr>
                                </tbody>
                            </table>
                        </div>

                        <div style={{ background: '#F7FAFC', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                            <h3 style={{ fontSize: '14px', marginBottom: '20px', color: 'var(--secondary-color)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>Drone Survey Data</h3>
                            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                                <tbody>
                                    <tr><th style={{ color: 'var(--text-muted)', fontWeight: 500, width: '40%' }}>Ground Scanned</th><td style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{farmArea ? farmArea.toFixed(2) : '38.45'} Acres</td></tr>
                                    <tr><th style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Image Quality</th><td style={{ fontWeight: 600, color: 'var(--text-dark)' }}>4K High-Res RGB + NDVI</td></tr>
                                    <tr><th style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Hardware</th><td style={{ fontWeight: 600, color: 'var(--text-dark)' }}>DJI Agras T30 Drone</td></tr>
                                    <tr><th style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Status Code</th><td style={{ fontWeight: 600, color: 'var(--primary-color)' }}>Mission Completed</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div style={{ marginTop: '48px', padding: '32px', background: '#FFF5F5', borderRadius: '12px', border: '1px solid #FED7D7', position: 'relative' }}>
                        <ShieldAlert size={40} color="#C53030" style={{ position: 'absolute', top: '-20px', left: '-20px', background: '#FFF5F5', borderRadius: '50%', padding: '4px', border: '2px solid white' }} />
                        <h3 style={{ fontSize: '20px', color: '#9B2C2C', marginBottom: '20px', fontWeight: 700 }}>AI Damage Consensus Match</h3>

                        <div className="report-claim-boxes" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', gap: '16px' }}>
                            <div style={{ background: 'white', padding: '16px 24px', borderRadius: '8px', border: '1px solid #FED7D7', flex: '1' }}>
                                <p style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Farmer Declaration</p>
                                <span style={{ fontSize: '24px', color: 'var(--text-dark)', fontWeight: 700 }}>{claimDetails.damagePercent}% Loss</span>
                            </div>
                            <div style={{ background: 'white', padding: '16px 24px', borderRadius: '8px', border: '1px solid #FED7D7', flex: '1' }}>
                                <p style={{ color: '#C53030', fontSize: '13px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>AI Computated Damage</p>
                                <span style={{ fontSize: '24px', color: '#9B2C2C', fontWeight: 700 }}>{aiCalculatedDamage}% Loss</span>
                            </div>
                            <div style={{ background: '#F0FFF4', padding: '16px 24px', borderRadius: '8px', border: '1px solid #C6F6D5', flex: '1' }}>
                                <p style={{ color: 'var(--primary-hover)', fontSize: '13px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' }}>Claimable Amount</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ fontSize: '24px', color: 'var(--primary-color)', fontWeight: 700, lineHeight: 1 }}>{totalClaimableUSD}</span>
                                    <span style={{ fontSize: '15px', color: '#276749', fontWeight: 600 }}>(~ {totalClaimableINR})</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ fontSize: '15px', color: '#742A2A', lineHeight: '1.6', background: 'rgba(255, 255, 255, 0.5)', padding: '16px', borderRadius: '8px' }}>
                            <strong style={{ display: 'block', marginBottom: '8px', color: '#9B2C2C' }}>Detected Reason vs Farmer Reason:</strong>
                            The AI Computer Vision analysis of the multispectral drone imagery corroborates the farmer's assessment of <strong>{claimDetails.disasterType}</strong> within acceptable spatial variance limits.
                            Widespread crop anomalies and physical stress signatures consistent with {claimDetails.disasterType} are clearly identified across {aiCalculatedDamage}% of the bounded {farmArea > 0 ? farmArea.toFixed(2) : '38.45'} acre geometry.
                        </div>
                    </div>

                    <div style={{ marginTop: '48px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', background: '#F0FFF4', padding: '20px 48px', borderRadius: '50px', border: '2px solid #C6F6D5', boxShadow: '0 10px 15px -3px rgba(47, 133, 90, 0.1)' }}>
                            <div style={{ background: 'var(--primary-color)', borderRadius: '50%', padding: '4px' }}>
                                <CheckCircle color="white" size={24} />
                            </div>
                            <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary-color)', letterSpacing: '-0.5px' }}>Claim Approved for Auto-Processing</span>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <button className="btn btn-outline" onClick={onReturnHome} style={{ padding: '14px 40px', fontSize: '15px', fontWeight: 600, border: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                        ← Verify Another Claim Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
