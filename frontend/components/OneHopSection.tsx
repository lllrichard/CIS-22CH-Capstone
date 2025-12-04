'use client';

import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';

interface OneHopConnection {
    hub_iata: string;
    hub_name: string;
    hub_city: string;
    leg1_km: number;
    leg2_km: number;
    total_km: number;
    total_mi: number;
}

interface OneHopResponse {
    src: string;
    dst: string;
    connections: OneHopConnection[];
    count: number;
    error?: string;
}

export default function OneHopSection() {
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [results, setResults] = useState<OneHopConnection[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        const s = source.toUpperCase();
        const d = destination.toUpperCase();

        if (s === d) {
            setError("Source and Destination cannot be the same");
            return;
        }

        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const response = await fetch(`${API_BASE}/onehop/${s}/${d}`);
            const data: OneHopResponse = await response.json();

            if (data.error) {
                setError(data.error);
            } else {
                setResults(data.connections);
            }
        } catch (err) {
            setError('Failed to fetch from backend. Make sure the C++ server is running on port 8080.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="glass-card">
                <div className="flex items-center mb-lg">
                    <div style={{ fontSize: '2rem', marginRight: '1rem' }}>🔄</div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>One Hop Report</h2>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                            Find 1-stop connections between airports (S → X → D where both routes have 0 stops)
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="grid grid-2" style={{ gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 500 }}>Source Airport (IATA)</label>
                        <input
                            type="text"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            placeholder="e.g. SFO"
                            maxLength={3}
                            required
                            style={{ textTransform: 'uppercase' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 500 }}>Destination Airport (IATA)</label>
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="e.g. JFK"
                            maxLength={3}
                            required
                            style={{ textTransform: 'uppercase' }}
                        />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Searching...' : 'Find Connections'}
                        </button>
                    </div>
                </form>

                {error && (
                    <div style={{
                        padding: 'var(--space-md)',
                        marginBottom: 'var(--space-lg)',
                        borderRadius: 'var(--radius-md)',
                        background: 'hsla(0, 70%, 55%, 0.1)',
                        color: 'var(--color-error)',
                        border: '1px solid var(--color-error)'
                    }}>
                        {error}
                    </div>
                )}

                {results && (
                    <div className="animate-in">
                        <h3 style={{ marginBottom: 'var(--space-md)' }}>
                            Found {results.length} Connection{results.length !== 1 ? 's' : ''} (sorted by total distance)
                        </h3>

                        {results.length > 0 ? (
                            <div style={{ overflowX: 'auto' }}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Via Airport (Hub)</th>
                                            <th>Route</th>
                                            <th>Leg 1 Distance</th>
                                            <th>Leg 2 Distance</th>
                                            <th>Total Distance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.map((conn, i) => (
                                            <tr key={i}>
                                                <td>
                                                    <div style={{ fontWeight: 600 }}>{conn.hub_iata}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                                                        {conn.hub_name}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                                        {conn.hub_city}
                                                    </div>
                                                </td>
                                                <td>
                                                    {source.toUpperCase()} → {conn.hub_iata} → {destination.toUpperCase()}
                                                </td>
                                                <td>
                                                    {Math.round(conn.leg1_km).toLocaleString()} km
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                                                        ({Math.round(conn.leg1_km * 0.621371).toLocaleString()} mi)
                                                    </div>
                                                </td>
                                                <td>
                                                    {Math.round(conn.leg2_km).toLocaleString()} km
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                                                        ({Math.round(conn.leg2_km * 0.621371).toLocaleString()} mi)
                                                    </div>
                                                </td>
                                                <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                                                    {Math.round(conn.total_km).toLocaleString()} km
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                                                        ({Math.round(conn.total_mi).toLocaleString()} mi)
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div style={{
                                padding: 'var(--space-xl)',
                                textAlign: 'center',
                                background: 'var(--color-bg-secondary)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--color-text-secondary)'
                            }}>
                                No 1-hop connections found between these airports.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
