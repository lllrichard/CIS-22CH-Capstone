'use client';

import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';

interface AirlineForm {
    id?: number;
    name?: string;
    iata?: string;
    icao?: string;
    callsign?: string;
    country?: string;
    active?: string;
}

interface AirportForm {
    id?: number;
    name?: string;
    iata?: string;
    icao?: string;
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
}

interface RouteForm {
    airlineId?: number;
    srcAirportId?: number;
    dstAirportId?: number;
    stops?: number;
}

export default function UpdatingSection() {
    const [activeEntity, setActiveEntity] = useState<'airline' | 'airport' | 'route'>('airline');
    const [operation, setOperation] = useState<'insert' | 'modify' | 'remove'>('insert');
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const [loading, setLoading] = useState(false);

    // Form states
    const [airlineForm, setAirlineForm] = useState<AirlineForm>({});
    const [airportForm, setAirportForm] = useState<AirportForm>({});
    const [routeForm, setRouteForm] = useState<RouteForm>({});

    const showMessage = (text: string, type: 'success' | 'error') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 5000);
    };

    const handleAirlineSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (operation === 'insert') {
                // POST /airline - insert new airline
                const response = await fetch(`${API_BASE}/airline`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: airlineForm.id,
                        name: airlineForm.name || '',
                        iata: airlineForm.iata || '',
                        icao: airlineForm.icao || '',
                        callsign: airlineForm.callsign || '',
                        country: airlineForm.country || '',
                        active: airlineForm.active || 'Y'
                    })
                });
                const data = await response.json();
                if (data.error) {
                    showMessage(`Error: ${data.error}`, 'error');
                } else {
                    showMessage('Airline inserted successfully (in-memory)', 'success');
                    setAirlineForm({});
                }
            } else if (operation === 'modify') {
                // PUT /airline/<id> - modify airline
                const response = await fetch(`${API_BASE}/airline/${airlineForm.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: airlineForm.name || undefined,
                        iata: airlineForm.iata || undefined,
                        icao: airlineForm.icao || undefined,
                        callsign: airlineForm.callsign || undefined,
                        country: airlineForm.country || undefined,
                        active: airlineForm.active || undefined
                    })
                });
                const data = await response.json();
                if (data.error) {
                    showMessage(`Error: ${data.error}`, 'error');
                } else {
                    showMessage('Airline modified successfully (in-memory)', 'success');
                }
            } else if (operation === 'remove') {
                // DELETE /airline/<id>
                const response = await fetch(`${API_BASE}/airline/${airlineForm.id}`, {
                    method: 'DELETE'
                });
                const data = await response.json();
                if (data.error) {
                    showMessage(`Error: ${data.error}`, 'error');
                } else {
                    showMessage('Airline and associated routes removed (in-memory)', 'success');
                    setAirlineForm({});
                }
            }
        } catch (err) {
            showMessage('Failed to connect to backend. Make sure C++ server is running on port 8080.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAirportSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (operation === 'insert') {
                // POST /airport - insert new airport
                const response = await fetch(`${API_BASE}/airport`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: airportForm.id,
                        name: airportForm.name || '',
                        iata: airportForm.iata || '',
                        icao: airportForm.icao || '',
                        city: airportForm.city || '',
                        country: airportForm.country || '',
                        latitude: airportForm.latitude || 0,
                        longitude: airportForm.longitude || 0
                    })
                });
                const data = await response.json();
                if (data.error) {
                    showMessage(`Error: ${data.error}`, 'error');
                } else {
                    showMessage('Airport inserted successfully (in-memory)', 'success');
                    setAirportForm({});
                }
            } else if (operation === 'modify') {
                // PUT /airport/<id> - modify airport
                const response = await fetch(`${API_BASE}/airport/${airportForm.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: airportForm.name || undefined,
                        iata: airportForm.iata || undefined,
                        icao: airportForm.icao || undefined,
                        city: airportForm.city || undefined,
                        country: airportForm.country || undefined,
                        latitude: airportForm.latitude || undefined,
                        longitude: airportForm.longitude || undefined
                    })
                });
                const data = await response.json();
                if (data.error) {
                    showMessage(`Error: ${data.error}`, 'error');
                } else {
                    showMessage('Airport modified successfully (in-memory)', 'success');
                }
            } else if (operation === 'remove') {
                // DELETE /airport/<id>
                const response = await fetch(`${API_BASE}/airport/${airportForm.id}`, {
                    method: 'DELETE'
                });
                const data = await response.json();
                if (data.error) {
                    showMessage(`Error: ${data.error}`, 'error');
                } else {
                    showMessage('Airport and associated routes removed (in-memory)', 'success');
                    setAirportForm({});
                }
            }
        } catch (err) {
            showMessage('Failed to connect to backend. Make sure C++ server is running on port 8080.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRouteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (operation === 'insert') {
                // POST /route - insert new route
                const response = await fetch(`${API_BASE}/route`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        airlineId: routeForm.airlineId,
                        srcAirportId: routeForm.srcAirportId,
                        dstAirportId: routeForm.dstAirportId,
                        stops: routeForm.stops || 0
                    })
                });
                const data = await response.json();
                if (data.error) {
                    showMessage(`Error: ${data.error}`, 'error');
                } else {
                    showMessage('Route inserted successfully (in-memory)', 'success');
                    setRouteForm({});
                }
            } else if (operation === 'modify') {
                showMessage('Modify Route: Not supported (routes identified by composite key)', 'error');
            } else if (operation === 'remove') {
                // DELETE /route
                const response = await fetch(`${API_BASE}/route`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        airlineId: routeForm.airlineId,
                        srcAirportId: routeForm.srcAirportId,
                        dstAirportId: routeForm.dstAirportId
                    })
                });
                const data = await response.json();
                if (data.error) {
                    showMessage(`Error: ${data.error}`, 'error');
                } else {
                    showMessage('Route removed (in-memory)', 'success');
                    setRouteForm({});
                }
            }
        } catch (err) {
            showMessage('Failed to connect to backend. Make sure C++ server is running on port 8080.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="glass-card">
                <div className="flex items-center mb-lg">
                    <div style={{ fontSize: '2rem', marginRight: '1rem' }}>✏️</div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Update OpenFlights Data</h2>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                            Insert, Modify, or Remove entities (changes are in-memory only)
                        </p>
                    </div>
                </div>

                {/* Important Note */}
                <div style={{
                    padding: 'var(--space-md)',
                    marginBottom: 'var(--space-lg)',
                    borderRadius: 'var(--radius-md)',
                    background: 'hsla(200, 70%, 55%, 0.1)',
                    color: 'var(--color-primary)',
                    border: '1px solid var(--color-primary)',
                    fontSize: '0.9rem'
                }}>
                    <strong>Note:</strong> Changes are made to in-memory data only. Data resets when the web application is restarted. This minimizes hosting costs.
                </div>

                {/* Entity Tabs */}
                <div className="flex mb-lg" style={{ gap: 'var(--space-sm)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-md)' }}>
                    {['airline', 'airport', 'route'].map(entity => (
                        <button
                            key={entity}
                            onClick={() => setActiveEntity(entity as any)}
                            className={`btn-${activeEntity === entity ? 'primary' : 'secondary'}`}
                            style={{ textTransform: 'capitalize' }}
                        >
                            {entity}
                        </button>
                    ))}
                </div>

                {/* Operation Tabs */}
                <div className="flex mb-xl" style={{ gap: 'var(--space-sm)' }}>
                    {['insert', 'modify', 'remove'].map(op => (
                        <button
                            key={op}
                            onClick={() => setOperation(op as any)}
                            style={{
                                padding: 'var(--space-xs) var(--space-md)',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--color-border)',
                                background: operation === op ? 'var(--color-bg-secondary)' : 'transparent',
                                fontWeight: operation === op ? 600 : 400,
                                textTransform: 'capitalize',
                                cursor: 'pointer'
                            }}
                        >
                            {op}
                        </button>
                    ))}
                </div>

                {/* Requirements Info */}
                <div style={{
                    padding: 'var(--space-sm)',
                    marginBottom: 'var(--space-lg)',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-bg-secondary)',
                    fontSize: '0.85rem',
                    color: 'var(--color-text-secondary)'
                }}>
                    {activeEntity === 'airline' && operation === 'insert' && 'Requirement: Airline ID must be unique'}
                    {activeEntity === 'airline' && operation === 'modify' && 'Requirement: Airline ID must exist. Any field not specified is unchanged'}
                    {activeEntity === 'airline' && operation === 'remove' && 'Removes airline and all associated routes'}
                    {activeEntity === 'airport' && operation === 'insert' && 'Requirement: Airport ID must be unique'}
                    {activeEntity === 'airport' && operation === 'modify' && 'Requirement: Airport ID must exist. Any field not specified is unchanged'}
                    {activeEntity === 'airport' && operation === 'remove' && 'Removes airport and all routes to/from it'}
                    {activeEntity === 'route' && operation === 'insert' && 'Requirement: Airline and Airport IDs must be valid'}
                    {activeEntity === 'route' && operation === 'modify' && 'Route modification requires unique identification (not fully supported)'}
                    {activeEntity === 'route' && operation === 'remove' && 'Removes route matching the specified Source/Destination/Airline IDs'}
                </div>

                {message && (
                    <div style={{
                        padding: 'var(--space-md)',
                        marginBottom: 'var(--space-lg)',
                        borderRadius: 'var(--radius-md)',
                        background: message.type === 'success' ? 'hsla(140, 70%, 55%, 0.1)' : 'hsla(0, 70%, 55%, 0.1)',
                        color: message.type === 'success' ? 'var(--color-success)' : 'var(--color-error)',
                        border: `1px solid ${message.type === 'success' ? 'var(--color-success)' : 'var(--color-error)'}`
                    }}>
                        {message.text}
                    </div>
                )}

                {/* Forms */}
                {activeEntity === 'airline' && (
                    <form onSubmit={handleAirlineSubmit} className="grid grid-2" style={{ gap: 'var(--space-md)' }}>
                        <div>
                            <label className="label">Airline ID *</label>
                            <input
                                type="number"
                                required
                                value={airlineForm.id || ''}
                                onChange={e => setAirlineForm({ ...airlineForm, id: Number(e.target.value) })}
                                placeholder="Unique ID"
                            />
                        </div>
                        {operation !== 'remove' && (
                            <>
                                <div>
                                    <label className="label">Name {operation === 'insert' ? '*' : ''}</label>
                                    <input
                                        type="text"
                                        required={operation === 'insert'}
                                        value={airlineForm.name || ''}
                                        onChange={e => setAirlineForm({ ...airlineForm, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="label">IATA {operation === 'insert' ? '*' : ''}</label>
                                    <input
                                        type="text"
                                        required={operation === 'insert'}
                                        value={airlineForm.iata || ''}
                                        onChange={e => setAirlineForm({ ...airlineForm, iata: e.target.value.toUpperCase() })}
                                        maxLength={2}
                                    />
                                </div>
                                <div>
                                    <label className="label">ICAO</label>
                                    <input
                                        type="text"
                                        value={airlineForm.icao || ''}
                                        onChange={e => setAirlineForm({ ...airlineForm, icao: e.target.value.toUpperCase() })}
                                        maxLength={3}
                                    />
                                </div>
                                <div>
                                    <label className="label">Callsign</label>
                                    <input
                                        type="text"
                                        value={airlineForm.callsign || ''}
                                        onChange={e => setAirlineForm({ ...airlineForm, callsign: e.target.value.toUpperCase() })}
                                    />
                                </div>
                                <div>
                                    <label className="label">Country</label>
                                    <input
                                        type="text"
                                        value={airlineForm.country || ''}
                                        onChange={e => setAirlineForm({ ...airlineForm, country: e.target.value })}
                                    />
                                </div>
                            </>
                        )}
                        <div style={{ gridColumn: '1 / -1', marginTop: 'var(--space-md)' }}>
                            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                                {loading ? 'Processing...' : `${operation.toUpperCase()} Airline`}
                            </button>
                        </div>
                    </form>
                )}

                {activeEntity === 'airport' && (
                    <form onSubmit={handleAirportSubmit} className="grid grid-2" style={{ gap: 'var(--space-md)' }}>
                        <div>
                            <label className="label">Airport ID *</label>
                            <input
                                type="number"
                                required
                                value={airportForm.id || ''}
                                onChange={e => setAirportForm({ ...airportForm, id: Number(e.target.value) })}
                                placeholder="Unique ID"
                            />
                        </div>
                        {operation !== 'remove' && (
                            <>
                                <div>
                                    <label className="label">Name {operation === 'insert' ? '*' : ''}</label>
                                    <input
                                        type="text"
                                        required={operation === 'insert'}
                                        value={airportForm.name || ''}
                                        onChange={e => setAirportForm({ ...airportForm, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="label">IATA {operation === 'insert' ? '*' : ''}</label>
                                    <input
                                        type="text"
                                        required={operation === 'insert'}
                                        value={airportForm.iata || ''}
                                        onChange={e => setAirportForm({ ...airportForm, iata: e.target.value.toUpperCase() })}
                                        maxLength={3}
                                    />
                                </div>
                                <div>
                                    <label className="label">ICAO</label>
                                    <input
                                        type="text"
                                        value={airportForm.icao || ''}
                                        onChange={e => setAirportForm({ ...airportForm, icao: e.target.value.toUpperCase() })}
                                        maxLength={4}
                                    />
                                </div>
                                <div>
                                    <label className="label">City</label>
                                    <input
                                        type="text"
                                        value={airportForm.city || ''}
                                        onChange={e => setAirportForm({ ...airportForm, city: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="label">Country</label>
                                    <input
                                        type="text"
                                        value={airportForm.country || ''}
                                        onChange={e => setAirportForm({ ...airportForm, country: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="label">Latitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={airportForm.latitude || ''}
                                        onChange={e => setAirportForm({ ...airportForm, latitude: parseFloat(e.target.value) })}
                                        placeholder="e.g. 37.618972"
                                    />
                                </div>
                                <div>
                                    <label className="label">Longitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={airportForm.longitude || ''}
                                        onChange={e => setAirportForm({ ...airportForm, longitude: parseFloat(e.target.value) })}
                                        placeholder="e.g. -122.374889"
                                    />
                                </div>
                            </>
                        )}
                        <div style={{ gridColumn: '1 / -1', marginTop: 'var(--space-md)' }}>
                            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                                {loading ? 'Processing...' : `${operation.toUpperCase()} Airport`}
                            </button>
                        </div>
                    </form>
                )}

                {activeEntity === 'route' && (
                    <form onSubmit={handleRouteSubmit} className="grid grid-2" style={{ gap: 'var(--space-md)' }}>
                        <div>
                            <label className="label">Airline ID *</label>
                            <input
                                type="number"
                                required
                                value={routeForm.airlineId || ''}
                                onChange={e => setRouteForm({ ...routeForm, airlineId: Number(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="label">Source Airport ID *</label>
                            <input
                                type="number"
                                required
                                value={routeForm.srcAirportId || ''}
                                onChange={e => setRouteForm({ ...routeForm, srcAirportId: Number(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="label">Destination Airport ID *</label>
                            <input
                                type="number"
                                required
                                value={routeForm.dstAirportId || ''}
                                onChange={e => setRouteForm({ ...routeForm, dstAirportId: Number(e.target.value) })}
                            />
                        </div>
                        {operation !== 'remove' && (
                            <div>
                                <label className="label">Stops</label>
                                <input
                                    type="number"
                                    value={routeForm.stops || 0}
                                    onChange={e => setRouteForm({ ...routeForm, stops: Number(e.target.value) })}
                                />
                            </div>
                        )}
                        <div style={{ gridColumn: '1 / -1', marginTop: 'var(--space-md)' }}>
                            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                                {loading ? 'Processing...' : `${operation.toUpperCase()} Route`}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
