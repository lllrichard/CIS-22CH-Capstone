'use client';

export default function DataCharts() {
    // Mock data for visualization
    const airlineStats = [
        { label: 'North America', value: 35, color: 'var(--color-primary)' },
        { label: 'Europe', value: 28, color: 'var(--color-secondary)' },
        { label: 'Asia', value: 22, color: 'var(--color-accent)' },
        { label: 'Others', value: 15, color: 'var(--color-text-tertiary)' },
    ];

    const trafficData = [45, 60, 75, 50, 80, 95, 70];

    return (
        <div className="grid grid-2" style={{ gap: 'var(--space-xl)' }}>
            {/* Distribution Chart */}
            <div className="glass-card">
                <h3 style={{ marginBottom: 'var(--space-lg)' }}>Global Airline Distribution</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xl)' }}>
                    {/* Pie Chart Representation */}
                    <div style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        background: `conic-gradient(
                            var(--color-primary) 0% 35%,
                            var(--color-secondary) 35% 63%,
                            var(--color-accent) 63% 85%,
                            var(--color-text-tertiary) 85% 100%
                        )`,
                        boxShadow: 'var(--shadow-md)'
                    }}></div>

                    {/* Legend */}
                    <div style={{ flex: 1 }}>
                        {airlineStats.map((stat, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: stat.color }}></div>
                                <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{stat.label}</span>
                                <span style={{ marginLeft: 'auto', fontWeight: 600 }}>{stat.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Activity Chart */}
            <div className="glass-card">
                <h3 style={{ marginBottom: 'var(--space-lg)' }}>Search Activity</h3>
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    height: '150px',
                    paddingTop: 'var(--space-md)'
                }}>
                    {trafficData.map((value, i) => (
                        <div key={i} style={{
                            width: '10%',
                            height: `${value}%`,
                            background: 'var(--gradient-primary)',
                            borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                            opacity: 0.8,
                            transition: 'height 0.5s ease',
                            position: 'relative'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '-25px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                fontSize: '0.8rem',
                                color: 'var(--color-text-tertiary)'
                            }}>
                                {value}
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 'var(--space-sm)',
                    color: 'var(--color-text-tertiary)',
                    fontSize: '0.8rem'
                }}>
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
            </div>
        </div>
    );
}
