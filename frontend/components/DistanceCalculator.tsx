'use client';

import { useState } from 'react';
import { fetchDistance } from '@/lib/api';

export default function DistanceCalculator() {
    const [srcAirport, setSrcAirport] = useState('');
    const [dstAirport, setDstAirport] = useState('');
    const [distance, setDistance] = useState<{
        src: string;
        dst: string;
        distance_km: number;
        distance_mi: number;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch distance from backend
    const handleCalculate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setDistance(null);

        if (!srcAirport.trim() || !dstAirport.trim()) {
            setError('Please enter both source and destination airports');
            return;
        }

        if (srcAirport === dstAirport) {
            setError('Source and destination cannot be the same');
            return;
        }

        setLoading(true);
        try {
            const result = await fetchDistance(srcAirport, dstAirport);
            setDistance(result);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card animate-in">
            <div className="flex items-center mb-lg">
                <div style={{ fontSize: '2rem', marginRight: '1rem' }}>📏</div>
                <div>
                    <h3>Distance Calculator</h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                        Calculate distance between two airports
                    </p>
                </div>
            </div>

            <form onSubmit={handleCalculate} className="grid grid-2" style={{ gap: 'var(--space-md)' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 500 }}>
                        Source Airport (IATA)
                    </label>
                    <input
                        type="text"
                        value={srcAirport}
                        onChange={(e) => setSrcAirport(e.target.value.toUpperCase())}
                        placeholder="e.g., SFO"
                        maxLength={3}
                        style={{ textTransform: 'uppercase', width: '100%' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 500 }}>
                        Destination Airport (IATA)
                    </label>
                    <input
                        type="text"
                        value={dstAirport}
                        onChange={(e) => setDstAirport(e.target.value.toUpperCase())}
                        placeholder="e.g., ORD"
                        maxLength={3}
                        style={{ textTransform: 'uppercase', width: '100%' }}
                    />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                    <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Calculating...' : 'Calculate Distance'}
                    </button>
                </div>
            </form>

            {error && (
                <div style={{
                    marginTop: 'var(--space-md)',
                    padding: 'var(--space-md)',
                    background: 'hsla(0, 85%, 60%, 0.1)',
                    border: '1px solid hsla(0, 85%, 60%, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-error)'
                }}>
                    {error}
                </div>
            )}

            {distance && (
                <div style={{ marginTop: 'var(--space-lg)' }}>
                    <div style={{
                        padding: 'var(--space-lg)',
                        background: 'var(--gradient-surface)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)'
                    }}>
                        <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
                            <h4 style={{ color: 'var(--color-primary-light)', fontSize: '1.5rem', marginBottom: 'var(--space-xs)' }}>
                                {distance.src} → {distance.dst}
                            </h4>
                        </div>

                        <div className="grid grid-2" style={{ gap: 'var(--space-lg)', textAlign: 'center' }}>
                            <div style={{
                                padding: 'var(--space-lg)',
                                background: 'hsla(210, 100%, 56%, 0.05)',
                                borderRadius: 'var(--radius-md)'
                            }}>
                                <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                    Distance (km)
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary-light)' }}>
                                    {distance.distance_km.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </div>
                            </div>

                            <div style={{
                                padding: 'var(--space-lg)',
                                background: 'hsla(140, 70%, 55%, 0.05)',
                                borderRadius: 'var(--radius-md)'
                            }}>
                                <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                    Distance (miles)
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-success)' }}>
                                    {distance.distance_mi.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
