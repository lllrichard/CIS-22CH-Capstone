'use client';

import { useState } from 'react';

export default function ContactSection() {
    const [status, setStatus] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setTimeout(() => setStatus('sent'), 1500);
    };

    return (
        <div className="animate-fade-in">
            <div className="grid grid-2" style={{ maxWidth: '1000px', margin: '0 auto', gap: 'var(--space-2xl)' }}>

                {/* Contact Info */}
                <div>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>Get in Touch</h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)' }}>
                        Have questions about the database or want to collaborate? We'd love to hear from you.
                    </p>

                    <div className="glass-card" style={{ padding: '0' }}>
                        <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--color-border)' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-xs)' }}>📧 Email</h3>
                            <p style={{ color: 'var(--color-text-secondary)' }}>contact@altus.app</p>
                        </div>
                        <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--color-border)' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-xs)' }}>📍 Location</h3>
                            <p style={{ color: 'var(--color-text-secondary)' }}>Cupertino, CA</p>
                        </div>
                        <div style={{ padding: 'var(--space-lg)' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-xs)' }}>🌐 Social</h3>
                            <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                                <a href="#" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>GitHub</a>
                                <a href="#" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Twitter</a>
                                <a href="#" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>LinkedIn</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="glass-card">
                    <h3 style={{ marginBottom: 'var(--space-lg)' }}>Send a Message</h3>
                    {status === 'sent' ? (
                        <div style={{
                            padding: 'var(--space-xl)',
                            textAlign: 'center',
                            color: 'var(--color-success)',
                            background: 'hsla(140, 70%, 55%, 0.1)',
                            borderRadius: 'var(--radius-md)'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>✓</div>
                            <p>Message sent successfully!</p>
                            <button
                                onClick={() => setStatus('')}
                                style={{
                                    marginTop: 'var(--space-md)',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--color-text-secondary)',
                                    textDecoration: 'underline',
                                    cursor: 'pointer'
                                }}
                            >
                                Send another
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: '0.9rem', fontWeight: 500 }}>Name</label>
                                <input type="text" placeholder="Your name" required />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: '0.9rem', fontWeight: 500 }}>Email</label>
                                <input type="email" placeholder="john@example.com" required />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: '0.9rem', fontWeight: 500 }}>Message</label>
                                <textarea rows={4} placeholder="How can we help?" required></textarea>
                            </div>
                            <button
                                type="submit"
                                className="btn-primary"
                                style={{ marginTop: 'var(--space-sm)' }}
                                disabled={status === 'sending'}
                            >
                                {status === 'sending' ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
