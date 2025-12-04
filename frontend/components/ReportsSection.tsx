'use client';

import { useState } from 'react';
import {
    fetchAirlineReport,
    fetchAirportReport,
    fetchAirlineRoutesReport,
    fetchAirportRoutesReport
} from '@/lib/api';

export default function ReportsSection() {
    const [airlineReport, setAirlineReport] = useState<any[]>([]);
    const [airportReport, setAirportReport] = useState<any[]>([]);
    const [airlineReportLoading, setAirlineReportLoading] = useState(false);
    const [airportReportLoading, setAirportReportLoading] = useState(false);

    const [airlineRoutesInput, setAirlineRoutesInput] = useState('');
    const [airlineRoutesResult, setAirlineRoutesResult] = useState<any | null>(null);
    const [airlineRoutesLoading, setAirlineRoutesLoading] = useState(false);
    const [airlineRoutesError, setAirlineRoutesError] = useState('');

    const [airportRoutesInput, setAirportRoutesInput] = useState('');
    const [airportRoutesResult, setAirportRoutesResult] = useState<any | null>(null);
    const [airportRoutesLoading, setAirportRoutesLoading] = useState(false);
    const [airportRoutesError, setAirportRoutesError] = useState('');

    const downloadCsv = (rows: any[], filename: string, columns: { key: string; label: string }[]) => {
        if (!rows.length) return;
        const header = columns.map(col => col.label).join(',');
        const lines = rows.map(row =>
            columns.map(col => {
                const value = row[col.key] ?? '';
                if (typeof value === 'string') {
                    const needsQuotes = value.includes(',') || value.includes('"') || value.includes('\n');
                    const escaped = value.replace(/"/g, '""');
                    return needsQuotes ? `"${escaped}"` : escaped;
                }
                return value;
            }).join(',')
        );
        const csv = [header, ...lines].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const loadAirlineReport = async () => {
        setAirlineReportLoading(true);
        try {
            const data = await fetchAirlineReport();
            setAirlineReport(data);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setAirlineReportLoading(false);
        }
    };

    const loadAirportReport = async () => {
        setAirportReportLoading(true);
        try {
            const data = await fetchAirportReport();
            setAirportReport(data);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setAirportReportLoading(false);
        }
    };

    const handleAirlineRoutesReport = async (e: React.FormEvent) => {
        e.preventDefault();
        setAirlineRoutesError('');
        setAirlineRoutesResult(null);

        if (!airlineRoutesInput.trim()) {
            setAirlineRoutesError('Please enter an Airline IATA code');
            return;
        }

        setAirlineRoutesLoading(true);
        try {
            const data = await fetchAirlineRoutesReport(airlineRoutesInput);
            setAirlineRoutesResult(data);
        } catch (err: any) {
            setAirlineRoutesError(err.message);
        } finally {
            setAirlineRoutesLoading(false);
        }
    };

    const handleAirportRoutesReport = async (e: React.FormEvent) => {
        e.preventDefault();
        setAirportRoutesError('');
        setAirportRoutesResult(null);

        if (!airportRoutesInput.trim()) {
            setAirportRoutesError('Please enter an Airport IATA code');
            return;
        }

        setAirportRoutesLoading(true);
        try {
            const data = await fetchAirportRoutesReport(airportRoutesInput);
            setAirportRoutesResult(data);
        } catch (err: any) {
            setAirportRoutesError(err.message);
        } finally {
            setAirportRoutesLoading(false);
        }
    };

    return (
        <div className="flex-col" style={{ gap: 'var(--space-xl)' }}>
            {/* Airline Report */}
            <div className="glass-card animate-in">
                <div className="flex items-center justify-between mb-lg">
                    <div className="flex items-center">
                        <div style={{ fontSize: '2rem', marginRight: '1rem' }}>🛫</div>
                        <div>
                            <h3>Airline Report</h3>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                                All airlines ordered by Airline IATA code (served directly from backend)
                            </p>
                        </div>
                    </div>
                    <div className="flex" style={{ gap: 'var(--space-sm)' }}>
                        <button className="btn-primary" onClick={loadAirlineReport} disabled={airlineReportLoading}>
                            {airlineReportLoading ? 'Loading...' : 'Load Report'}
                        </button>
                        {airlineReport.length > 0 && (
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() =>
                                    downloadCsv(airlineReport, 'airline-report.csv', [
                                        { key: 'iata', label: 'IATA' },
                                        { key: 'name', label: 'Name' },
                                        { key: 'country', label: 'Country' },
                                        { key: 'active', label: 'Active' }
                                    ])
                                }
                            >
                                Download CSV
                            </button>
                        )}
                    </div>
                </div>

                {airlineReport.length > 0 ? (
                    <div style={{
                        overflowX: 'auto',
                        overflowY: 'auto',
                        maxHeight: '320px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)'
                    }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>IATA</th>
                                    <th>Name</th>
                                    <th>Country</th>
                                    <th>Active</th>
                                </tr>
                            </thead>
                            <tbody>
                                {airlineReport.map((airline: any) => (
                                    <tr key={airline.id}>
                                        <td><code>{airline.iata || '—'}</code></td>
                                        <td>{airline.name}</td>
                                        <td>{airline.country}</td>
                                        <td>{airline.active}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                        Click "Load Report" to fetch airline data.
                    </p>
                )}
            </div>

            {/* Airport Report */}
            <div className="glass-card animate-in">
                <div className="flex items-center justify-between mb-lg">
                    <div className="flex items-center">
                        <div style={{ fontSize: '2rem', marginRight: '1rem' }}>🛬</div>
                        <div>
                            <h3>Airport Report</h3>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                                All airports ordered by Airport IATA code (served directly from backend)
                            </p>
                        </div>
                    </div>
                    <div className="flex" style={{ gap: 'var(--space-sm)' }}>
                        <button className="btn-primary" onClick={loadAirportReport} disabled={airportReportLoading}>
                            {airportReportLoading ? 'Loading...' : 'Load Report'}
                        </button>
                        {airportReport.length > 0 && (
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() =>
                                    downloadCsv(airportReport, 'airport-report.csv', [
                                        { key: 'iata', label: 'IATA' },
                                        { key: 'name', label: 'Name' },
                                        { key: 'city', label: 'City' },
                                        { key: 'country', label: 'Country' }
                                    ])
                                }
                            >
                                Download CSV
                            </button>
                        )}
                    </div>
                </div>

                {airportReport.length > 0 ? (
                    <div style={{
                        overflowX: 'auto',
                        overflowY: 'auto',
                        maxHeight: '320px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)'
                    }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>IATA</th>
                                    <th>Name</th>
                                    <th>City</th>
                                    <th>Country</th>
                                </tr>
                            </thead>
                            <tbody>
                                {airportReport.map((airport: any) => (
                                    <tr key={airport.id}>
                                        <td><code>{airport.iata || '—'}</code></td>
                                        <td>{airport.name}</td>
                                        <td>{airport.city}</td>
                                        <td>{airport.country}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                        Click "Load Report" to fetch airport data.
                    </p>
                )}
            </div>

            {/* Reports Ordered by # Routes */}
            <div className="glass-card animate-in">
                <div className="flex items-center mb-lg">
                    <div style={{ fontSize: '2rem', marginRight: '1rem' }}>#️⃣</div>
                    <div>
                        <h3>Reports Ordered by # Routes</h3>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                            Each row includes an extra “# Routes” value calculated on the server
                        </p>
                    </div>
                </div>

                <div className="grid grid-2" style={{ gap: 'var(--space-xl)' }}>
                    {/* 3a Airline -> Airports */}
                    <div>
                        <h4 style={{ marginBottom: 'var(--space-sm)' }}>3a. Airline → Airports</h4>
                        <form onSubmit={handleAirlineRoutesReport} className="flex" style={{ gap: 'var(--space-md)' }}>
                            <input
                                type="text"
                                value={airlineRoutesInput}
                                onChange={(e) => setAirlineRoutesInput(e.target.value.toUpperCase())}
                                placeholder="Airline IATA (e.g., AA)"
                                maxLength={2}
                                style={{ flex: 1, textTransform: 'uppercase' }}
                            />
                            <button type="submit" className="btn-primary" disabled={airlineRoutesLoading}>
                                {airlineRoutesLoading ? 'Loading...' : 'Run'}
                            </button>
                        </form>

                        {airlineRoutesError && (
                            <div style={{
                                marginTop: 'var(--space-md)',
                                padding: 'var(--space-md)',
                                background: 'hsla(0, 85%, 60%, 0.1)',
                                border: '1px solid hsla(0, 85%, 60%, 0.3)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--color-error)'
                            }}>
                                {airlineRoutesError}
                            </div>
                        )}

                        {airlineRoutesResult && (
                            <div style={{ marginTop: 'var(--space-md)' }}>
                                <div style={{ marginBottom: 'var(--space-sm)', fontWeight: 600 }}>
                                    Airline: {airlineRoutesResult.airline.name} ({airlineRoutesResult.airline.iata})
                                </div>
                                {airlineRoutesResult.airports.length > 0 ? (
                                    <div style={{ overflowX: 'auto' }}>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Airport</th>
                                                    <th>City</th>
                                                    <th># Routes</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {airlineRoutesResult.airports.map((airport: any) => (
                                                    <tr key={airport.iata}>
                                                        <td>
                                                            <div style={{ fontWeight: 600 }}>{airport.name}</div>
                                                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                                                                {airport.iata}
                                                            </div>
                                                        </td>
                                                        <td>{airport.city}</td>
                                                        <td style={{ fontWeight: 600, color: 'var(--color-primary-light)' }}>
                                                            {airport.routes}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p style={{ color: 'var(--color-text-secondary)' }}>
                                        No airports found for this airline.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 3b Airport -> Airlines */}
                    <div>
                        <h4 style={{ marginBottom: 'var(--space-sm)' }}>3b. Airport → Airlines</h4>
                        <form onSubmit={handleAirportRoutesReport} className="flex" style={{ gap: 'var(--space-md)' }}>
                            <input
                                type="text"
                                value={airportRoutesInput}
                                onChange={(e) => setAirportRoutesInput(e.target.value.toUpperCase())}
                                placeholder="Airport IATA (e.g., SFO)"
                                maxLength={3}
                                style={{ flex: 1, textTransform: 'uppercase' }}
                            />
                            <button type="submit" className="btn-primary" disabled={airportRoutesLoading}>
                                {airportRoutesLoading ? 'Loading...' : 'Run'}
                            </button>
                        </form>

                        {airportRoutesError && (
                            <div style={{
                                marginTop: 'var(--space-md)',
                                padding: 'var(--space-md)',
                                background: 'hsla(0, 85%, 60%, 0.1)',
                                border: '1px solid hsla(0, 85%, 60%, 0.3)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--color-error)'
                            }}>
                                {airportRoutesError}
                            </div>
                        )}

                        {airportRoutesResult && (
                            <div style={{ marginTop: 'var(--space-md)' }}>
                                <div style={{ marginBottom: 'var(--space-sm)', fontWeight: 600 }}>
                                    Airport: {airportRoutesResult.airport.name} ({airportRoutesResult.airport.iata})
                                </div>
                                {airportRoutesResult.airlines.length > 0 ? (
                                    <div style={{ overflowX: 'auto' }}>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Airline</th>
                                                    <th>Country</th>
                                                    <th># Routes</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {airportRoutesResult.airlines.map((airline: any) => (
                                                    <tr key={airline.iata}>
                                                        <td>
                                                            <div style={{ fontWeight: 600 }}>{airline.name}</div>
                                                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                                                                {airline.iata}
                                                            </div>
                                                        </td>
                                                        <td>{airline.country}</td>
                                                        <td style={{ fontWeight: 600, color: 'var(--color-primary-light)' }}>
                                                            {airline.routes}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p style={{ color: 'var(--color-text-secondary)' }}>
                                        No airlines found for this airport.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
