'use client';

import { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';

export default function CodeViewSection() {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`${API_BASE}/code`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setCode(data.code);
                }
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch code from backend. Make sure the C++ server is running on port 8080.');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="glass-card flex justify-center items-center" style={{ minHeight: '400px' }}>
                <div className="animate-spin" style={{ fontSize: '2rem' }}>⚡</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-card" style={{ color: 'var(--color-error)', textAlign: 'center' }}>
                <h3>Error loading code</h3>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="glass-card" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-md)',
                    borderBottom: '1px solid var(--color-border)',
                    paddingBottom: 'var(--space-md)'
                }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>app.cpp</h2>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                            Backend Implementation (fetched from C++ server)
                        </p>
                    </div>
                    <div style={{
                        padding: 'var(--space-xs) var(--space-sm)',
                        background: 'var(--color-bg-secondary)',
                        borderRadius: 'var(--radius-sm)',
                        fontFamily: 'monospace',
                        fontSize: '0.8rem'
                    }}>
                        C++
                    </div>
                </div>

                <div style={{
                    background: '#1e1e1e',
                    color: '#d4d4d4',
                    padding: 'var(--space-lg)',
                    borderRadius: 'var(--radius-md)',
                    overflowX: 'auto',
                    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    maxHeight: '70vh',
                    overflowY: 'auto',
                    whiteSpace: 'pre'
                }}>
                    {code}
                </div>
            </div>
        </div>
    );
}
