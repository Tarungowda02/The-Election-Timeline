import React from 'react';

const TIMELINE_DATA = [
  {
    title: 'Voter Registration',
    date: 'Months Before',
    desc: 'Register to vote online, by mail, or in person. Check your local deadline!',
    icon: '📝'
  },
  {
    title: 'Research Candidates',
    date: 'Weeks Before',
    desc: 'Read about the candidates, their platforms, and local propositions.',
    icon: '🔍'
  },
  {
    title: 'Early/Absentee Voting',
    date: 'Days Before',
    desc: 'Cast your ballot early by mail or at designated early voting locations.',
    icon: '✉️'
  },
  {
    title: 'Election Day',
    date: 'November',
    desc: 'Go to your assigned polling station, present ID if required, and vote.',
    icon: '🗳️'
  },
  {
    title: 'Results & Certification',
    date: 'After Election',
    desc: 'Votes are counted, audited, and officially certified by election officials.',
    icon: '✅'
  }
];

function InteractiveTimeline() {
  return (
    <div className="container">
      <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>The <span className="gradient-text">Election Timeline</span></h2>
      
      <div className="timeline-container" style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
        {/* Vertical Line */}
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '4px',
          height: '100%',
          background: 'linear-gradient(to bottom, var(--primary), var(--secondary))',
          borderRadius: '2px',
          zIndex: 0
        }} className="timeline-line"></div>

        {TIMELINE_DATA.map((item, index) => (
          <div 
            key={index} 
            className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
            style={{
              display: 'flex',
              justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
              padding: '2rem 0',
              position: 'relative',
              zIndex: 1,
              width: '100%'
            }}
          >
            {/* Center Node */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '40px',
              height: '40px',
              background: 'var(--surface)',
              border: '4px solid var(--primary)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              zIndex: 2,
              boxShadow: '0 0 15px rgba(79, 70, 229, 0.5)'
            }}>
              {item.icon}
            </div>

            {/* Content Card */}
            <div className="glass timeline-card" style={{
              width: '45%',
              padding: '1.5rem',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = `scale(1.05) ${index % 2 === 0 ? 'translateX(-10px)' : 'translateX(10px)'}`}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) translateX(0)'}
            >
              <span style={{ color: 'var(--primary-light)', fontWeight: 600, fontSize: '0.9rem' }}>{item.date}</span>
              <h3 style={{ margin: '0.5rem 0' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Mobile CSS Fallback inline for simplicity */}
      <style>{`
        @media (max-width: 768px) {
          .timeline-line { left: 20px !important; transform: none !important; }
          .timeline-item { justify-content: flex-end !important; padding-left: 50px !important; }
          .timeline-item > div:first-child { left: 20px !important; transform: translate(-50%, -50%) !important; }
          .timeline-card { width: 100% !important; }
        }
      `}</style>
    </div>
  );
}

export default InteractiveTimeline;
