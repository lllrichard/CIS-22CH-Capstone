'use client';

import { useState } from 'react';
import { fetchAirline, fetchAirport } from '@/lib/api';

export default function IndividualSection() {
    const [airlineCode, setAirlineCode] = useState('');
    const [airlineResult, setAirlineResult] = useState<any | null>(null);
    const [airlineError, setAirlineError] = useState('');
    const [airlineLoading, setAirlineLoading] = useState(false);

    const [airportCode, setAirportCode] = useState('');
    const [airportResult, setAirportResult] = useState<any | null>(null);
    const [airportError, setAirportError] = useState('');
    const [airportLoading, setAirportLoading] = useState(false);

    const handleAirlineLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        setAirlineError('');
        setAirlineResult(null);

        if (!airlineCode.trim()) {
            setAirlineError('Please enter an Airline IATA code');
            return;
        }

        setAirlineLoading(true);
        try {
            const data = await fetchAirline(airlineCode);
            setAirlineResult(data);
        } catch (err: any) {
            setAirlineError(err.message);
        } finally {
            setAirlineLoading(false);
        }
    };

    const handleAirportLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        setAirportError('');
        setAirportResult(null);

        if (!airportCode.trim()) {
            setAirportError('Please enter an Airport IATA code');
            return;
        }

        setAirportLoading(true);
        try {
            const data = await fetchAirport(airportCode);
            setAirportResult(data);
        } catch (err: any) {
            setAirportError(err.message);
        } finally {
            setAirportLoading(false);
        }
    };

    return (
        <div className="grid grid-2" style={{ gap: 'var(--space-xl)' }}>
            {/* Airline Lookup */}
            <div className="glass-card animate-in">
                <div className="flex items-center mb-lg">
                    <div style={{ fontSize: '2rem', marginRight: '1rem' }}>🛫</div>
                    <div>
                        <h3>Lookup Airline Entity</h3>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                            Given an OpenFlights Airline IATA Code → return the full Airline entity
                        </p>
                    </div>
                </div>

                <form onSubmit={handleAirlineLookup} className="flex" style={{ gap: 'var(--space-md)' }}>
                    <input
                        type="text"
                        value={airlineCode}
                        onChange={(e) => setAirlineCode(e.target.value.toUpperCase())}
                        placeholder="Airline IATA (e.g., AA)"
                        maxLength={2}
                        style={{ flex: 1, textTransform: 'uppercase' }}
                    />
                    <button type="submit" className="btn-primary" disabled={airlineLoading}>
                        {airlineLoading ? 'Searching...' : 'Search'}
                    </button>
                </form>

                {airlineError && (
                    <div style={{
                        marginTop: 'var(--space-md)',
                        padding: 'var(--space-md)',
                        background: 'hsla(0, 85%, 60%, 0.1)',
                        border: '1px solid hsla(0, 85%, 60%, 0.3)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--color-error)'
                    }}>
                        {airlineError}
                    </div>
                )}

                {airlineResult && (
                    <div style={{ marginTop: 'var(--space-lg)', lineHeight: 1.7 }}>
                        <div><strong>Name:</strong> {airlineResult.name}</div>
                        <div><strong>IATA:</strong> {airlineResult.iata}</div>
                        <div><strong>ICAO:</strong> {airlineResult.icao}</div>
                        <div><strong>Callsign:</strong> {airlineResult.callsign}</div>
                        <div><strong>Country:</strong> {airlineResult.country}</div>
                        <div><strong>Active:</strong> {airlineResult.active}</div>
                    </div>
                )}
            </div>

            {/* Airport Lookup */}
            <div className="glass-card animate-in">
                <div className="flex items-center mb-lg">
                    <div style={{ fontSize: '2rem', marginRight: '1rem' }}>🛬</div>
                    <div>
                        <h3>Lookup Airport Entity</h3>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                            Given an OpenFlights Airport IATA Code → return the full Airport entity
                        </p>
                    </div>
                </div>

                <form onSubmit={handleAirportLookup} className="flex" style={{ gap: 'var(--space-md)' }}>
                    <input
                        type="text"
                        value={airportCode}
                        onChange={(e) => setAirportCode(e.target.value.toUpperCase())}
                        placeholder="Airport IATA (e.g., SFO)"
                        maxLength={3}
                        style={{ flex: 1, textTransform: 'uppercase' }}
                    />
                    <button type="submit" className="btn-primary" disabled={airportLoading}>
                        {airportLoading ? 'Searching...' : 'Search'}
                    </button>
                </form>

                {airportError && (
                    <div style={{
                        marginTop: 'var(--space-md)',
                        padding: 'var(--space-md)',
                        background: 'hsla(0, 85%, 60%, 0.1)',
                        border: '1px solid hsla(0, 85%, 60%, 0.3)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--color-error)'
                    }}>
                        {airportError}
                    </div>
                )}

                {airportResult && (
                    <div style={{ marginTop: 'var(--space-lg)', lineHeight: 1.7 }}>
                        <div><strong>Name:</strong> {airportResult.name}</div>
                        <div><strong>IATA:</strong> {airportResult.iata}</div>
                        <div><strong>City:</strong> {airportResult.city}</div>
                        <div><strong>Country:</strong> {airportResult.country}</div>
                        <div><strong>Latitude:</strong> {airportResult.latitude}</div>
                        <div><strong>Longitude:</strong> {airportResult.longitude}</div>
                    </div>
                )}
            </div>
        </div>
    );
}

