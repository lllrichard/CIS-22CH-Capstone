'use client';

import { useState } from 'react';
import Image from 'next/image';
import ReportsSection from '@/components/ReportsSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import DistanceCalculator from '@/components/DistanceCalculator';
import OneHopSection from '@/components/OneHopSection';
import UpdatingSection from '@/components/UpdatingSection';
import CodeViewSection from '@/components/CodeViewSection';
import IndividualSection from '@/components/IndividualSection';

export default function Home() {
    const [activeTab, setActiveTab] = useState('home');

    return (
        <main style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Sticky Header with Big Branding */}
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                background: 'var(--color-surface)',
                borderBottom: '1px solid var(--color-border)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
                {/* Branding Section */}
                <div style={{
                    padding: 'var(--space-xl) var(--space-xl) var(--space-md)',
                    textAlign: 'center',
                    borderBottom: '1px solid var(--color-border)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-xs)' }}>
                        <Image
                            src="/icon.png"
                            alt="Altus Logo"
                            width={64}
                            height={64}
                            style={{ borderRadius: '12px' }}
                        />
                        <h1 style={{
                            fontSize: '3.5rem',
                            fontWeight: 800,
                            letterSpacing: '-0.03em',
                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            margin: 0
                        }}>
                            Altus
                        </h1>
                    </div>
                    <p style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: '1.1rem',
                        margin: 0
                    }}>
                        Air Travel Database — Powered by C++ Backend on Port 8080
                    </p>
                </div>

                {/* Big Tabs Navigation */}
                <nav style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 'var(--space-sm)',
                    padding: 'var(--space-md) var(--space-xl)',
                    background: 'var(--color-surface)',
                    flexWrap: 'wrap'
                }}>
                    {[
                        { id: 'home', label: '⌂ Home' },
                        { id: 'reports', label: '▭ Reports' },
                        { id: 'individual', label: '👤 Individual' },
                        { id: 'distance', label: '📏 Distance' },
                        { id: 'onehop', label: '🔄 One Hop' },
                        { id: 'updating', label: '✏️ Updating' },
                        { id: 'code', label: '💻 Get Code' },
                        { id: 'about', label: 'ℹ About' },
                        { id: 'contact', label: '✉ Contact' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: 'var(--space-md) var(--space-xl)',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                borderRadius: 'var(--radius-lg)',
                                border: 'none',
                                background: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-surface-glass)',
                                color: activeTab === tab.id ? 'white' : 'var(--color-text-secondary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </header>

            {/* Scrollable Content Area */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: 'var(--space-xl)',
                background: 'var(--color-background)'
            }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>

                    {activeTab === 'home' && (
                        <div className="animate-fade-in">
                            <div style={{ textAlign: 'center', padding: 'var(--space-3xl) 0' }}>
                                <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-lg)' }}>
                                    Welcome to Altus
                                </h2>
                                <p style={{
                                    fontSize: '1.25rem',
                                    color: 'var(--color-text-secondary)',
                                    maxWidth: '600px',
                                    margin: '0 auto var(--space-2xl)',
                                    lineHeight: 1.6
                                }}>
                                    Your comprehensive air travel database platform powered by a C++ Crow backend. Search airlines, explore airports, calculate distances, and find one-hop connections.
                                </p>

                                {/* Feature Cards */}
                                <div className="grid grid-2" style={{ gap: 'var(--space-lg)', marginTop: 'var(--space-2xl)' }}>
                                    <div className="glass-card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setActiveTab('reports')}>
                                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)', fontWeight: 300 }}>▭</div>
                                        <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>Reports</h3>
                                        <p style={{ color: 'var(--color-text-secondary)' }}>
                                            Airlines for airport, top cities for airline
                                        </p>
                                    </div>

                                    <div className="glass-card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setActiveTab('individual')}>
                                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)', fontWeight: 300 }}>👤</div>
                                        <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>Individual</h3>
                                        <p style={{ color: 'var(--color-text-secondary)' }}>
                                            Retrieve airline or airport entities by IATA code
                                        </p>
                                    </div>

                                    <div className="glass-card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setActiveTab('distance')}>
                                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)', fontWeight: 300 }}>📏</div>
                                        <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>Distance</h3>
                                        <p style={{ color: 'var(--color-text-secondary)' }}>
                                            Calculate distances between airports
                                        </p>
                                    </div>

                                    <div className="glass-card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setActiveTab('onehop')}>
                                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)', fontWeight: 300 }}>🔄</div>
                                        <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>One Hop</h3>
                                        <p style={{ color: 'var(--color-text-secondary)' }}>
                                            Find 1-stop connections between airports
                                        </p>
                                    </div>

                                    <div className="glass-card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setActiveTab('updating')}>
                                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)', fontWeight: 300 }}>✏️</div>
                                        <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>Updating</h3>
                                        <p style={{ color: 'var(--color-text-secondary)' }}>
                                            Insert, modify, or remove data entries
                                        </p>
                                    </div>

                                    <div className="glass-card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setActiveTab('code')}>
                                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)', fontWeight: 300 }}>💻</div>
                                        <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>Get Code</h3>
                                        <p style={{ color: 'var(--color-text-secondary)' }}>
                                            View the C++ backend implementation
                                        </p>
                                    </div>

                                    <div className="glass-card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setActiveTab('about')}>
                                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)', fontWeight: 300 }}>ℹ</div>
                                        <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>About</h3>
                                        <p style={{ color: 'var(--color-text-secondary)' }}>
                                            Learn more about this project
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reports' && (
                        <div className="animate-fade-in">
                            <div style={{ marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
                                <h2 style={{ fontSize: '2rem', marginBottom: 'var(--space-xs)' }}>Data Reports</h2>
                                <p style={{ color: 'var(--color-text-secondary)' }}>Airlines for airport and top cities for airline (from backend)</p>
                            </div>
                            <ReportsSection />
                        </div>
                    )}

                    {activeTab === 'individual' && (
                        <div className="animate-fade-in">
                            <div style={{ marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
                                <h2 style={{ fontSize: '2rem', marginBottom: 'var(--space-xs)' }}>Individual Entity Retrieval</h2>
                                <p style={{ color: 'var(--color-text-secondary)' }}>
                                    Fetch a single Airline or Airport entity directly from the backend by IATA code
                                </p>
                            </div>
                            <IndividualSection />
                        </div>
                    )}

                    {activeTab === 'distance' && (
                        <div className="animate-fade-in">
                            <div style={{ marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
                                <h2 style={{ fontSize: '2rem', marginBottom: 'var(--space-xs)' }}>Distance Calculator</h2>
                                <p style={{ color: 'var(--color-text-secondary)' }}>Calculate distance between two airports (from backend)</p>
                            </div>
                            <DistanceCalculator />
                        </div>
                    )}

                    {activeTab === 'onehop' && (
                        <div className="animate-fade-in">
                            <div style={{ marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
                                <h2 style={{ fontSize: '2rem', marginBottom: 'var(--space-xs)' }}>One Hop Report</h2>
                                <p style={{ color: 'var(--color-text-secondary)' }}>
                                    Find route pairs (S→X / X→D) with 0 stops, sorted by total air miles
                                </p>
                            </div>
                            <OneHopSection />
                        </div>
                    )}

                    {activeTab === 'updating' && (
                        <div className="animate-fade-in">
                            <div style={{ marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
                                <h2 style={{ fontSize: '2rem', marginBottom: 'var(--space-xs)' }}>Update OpenFlights Data</h2>
                                <p style={{ color: 'var(--color-text-secondary)' }}>
                                    Insert, modify, or remove Airlines, Airports, and Routes (in-memory changes)
                                </p>
                            </div>
                            <UpdatingSection />
                        </div>
                    )}

                    {activeTab === 'code' && (
                        <div className="animate-fade-in">
                            <div style={{ marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
                                <h2 style={{ fontSize: '2rem', marginBottom: 'var(--space-xs)' }}>Get Code</h2>
                                <p style={{ color: 'var(--color-text-secondary)' }}>
                                    View the Vibe-generated C++ code implementing this website (fetched from backend)
                                </p>
                            </div>
                            <CodeViewSection />
                        </div>
                    )}

                    {activeTab === 'about' && <AboutSection />}

                    {activeTab === 'contact' && <ContactSection />}
                </div>
            </div>
        </main>
    );
}
