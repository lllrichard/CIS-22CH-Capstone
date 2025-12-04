'use client';

import { useState } from 'react';
import Image from 'next/image';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';

export default function AboutSection() {
    const [studentInfo, setStudentInfo] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGetId = async () => {
        setLoading(true);
        setError('');
        setStudentInfo(null);
        try {
            const res = await fetch(`${API_BASE}/student`);
            const data = await res.json();
            if (data.error) {
                setError(data.error);
            } else {
                setStudentInfo(`${data.name} — ${data.student_id}`);
            }
        } catch (err) {
            setError('Unable to reach backend. Please ensure the C++ server is running on port 8080.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="glass-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>About Altus</h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)' }}>
                        Redefining how you explore air travel data.
                    </p>
                </div>

                <div className="grid grid-2" style={{ alignItems: 'center', gap: 'var(--space-2xl)' }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            position: 'absolute',
                            inset: '-10px',
                            background: 'var(--gradient-primary)',
                            borderRadius: 'var(--radius-lg)',
                            opacity: 0.2,
                            transform: 'rotate(-3deg)'
                        }}></div>
                        <div style={{
                            position: 'relative',
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-lg)'
                        }}>
                            <Image
                                src="/student_photo.jpg"
                                alt="Creative Genius"
                                width={400}
                                height={500}
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="badge mb-md">Creative Genius</div>
                        <h3 style={{ fontSize: '2rem', marginBottom: 'var(--space-md)' }}>
                            Built with Passion
                        </h3>
                        <p style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
                            Altus was born from a desire to make complex airline data accessible and beautiful.
                            What started as a simple database project has evolved into a premium interface
                            for aviation enthusiasts and professionals alike.
                        </p>

                        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                            <div style={{
                                padding: 'var(--space-sm) var(--space-md)',
                                background: 'var(--color-bg-secondary)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.9rem'
                            }}>
                                🚀 Next.js
                            </div>
                            <div style={{
                                padding: 'var(--space-sm) var(--space-md)',
                                background: 'var(--color-bg-secondary)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.9rem'
                            }}>
                                ⚡ C++ Backend
                            </div>
                            <div style={{
                                padding: 'var(--space-sm) var(--space-md)',
                                background: 'var(--color-bg-secondary)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.9rem'
                            }}>
                                🎨 Custom Design
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: 'var(--space-3xl)', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: 'var(--space-lg)' }}>CIS 22C Honors Capstone Project</h3>
                    <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto var(--space-lg)' }}>
                        This capstone project demonstrates the power of combining high-performance C++ algorithms
                        with a modern React-based frontend to deliver aviation data insights.
                    </p>
                    <button className="btn-primary" onClick={handleGetId} disabled={loading} style={{ marginBottom: 'var(--space-md)' }}>
                        {loading ? 'Retrieving...' : 'Get ID'}
                    </button>
                    {error && (
                        <div style={{
                            color: 'var(--color-error)',
                            marginTop: 'var(--space-sm)'
                        }}>
                            {error}
                        </div>
                    )}
                    {studentInfo && (
                        <div style={{
                            marginTop: 'var(--space-sm)',
                            fontWeight: 600,
                            color: 'var(--color-primary)'
                        }}>
                            {studentInfo}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
