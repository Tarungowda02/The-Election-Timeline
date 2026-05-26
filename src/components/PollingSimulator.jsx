import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import './PollingSimulator.css';

const STEPS = [
  { title: "1. Biometric Check-in", icon: "🪪" },
  { title: "2. Getting Your Ballot", icon: "📄" },
  { title: "3. The Voting Booth", icon: "🗳️" },
  { title: "4. Submit & Celebrate", icon: "🇺🇸" }
];

function PollingSimulator() {
  const [step, setStep] = useState(0);
  
  // Step 0 State
  const [scanProgress, setScanProgress] = useState(0);
  const scanIntervalRef = useRef(null);

  // Step 2 State
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Step 3 State
  const [isDragging, setIsDragging] = useState(false);
  const [isDropped, setIsDropped] = useState(false);

  const nextStep = () => {
    if (step < STEPS.length) {
      setStep(step + 1);
    }
  };

  const reset = () => {
    setStep(0);
    setScanProgress(0);
    setSelectedCandidate(null);
    setIsDragging(false);
    setIsDropped(false);
  };

  // Step 0 Logic: Hold to scan
  const startScan = () => {
    if (scanProgress >= 100) return;
    scanIntervalRef.current = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(scanIntervalRef.current);
          setTimeout(nextStep, 800);
          return 100;
        }
        return prev + 5;
      });
    }, 50);
  };

  const stopScan = () => {
    clearInterval(scanIntervalRef.current);
    if (scanProgress < 100) {
      setScanProgress(0);
    }
  };

  // Step 2 Logic: Select candidate
  const handleSelect = (candidateId) => {
    setSelectedCandidate(candidateId);
    setTimeout(nextStep, 1000);
  };

  // Step 3 Logic: Drag & Drop
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', 'ballot');
    setTimeout(() => setIsDragging(true), 0);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDropped(true);
    
    // Trigger Confetti!
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#4F46E5', '#10B981', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#4F46E5', '#10B981', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    setTimeout(nextStep, 1500);
  };

  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2>Voting <span className="gradient-text">Simulator</span></h2>
        <p style={{ color: 'var(--text-muted)' }}>Experience what it's like inside a polling station.</p>
      </div>

      <div className="glass" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '500px' }}>
        
        {/* Progress Bar */}
        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '3rem', overflow: 'hidden' }}>
          <div style={{ 
            height: '100%', 
            width: `${(step / STEPS.length) * 100}%`, 
            background: 'var(--primary)',
            transition: 'width 0.5s ease'
          }}></div>
        </div>

        {step === 0 && (
          <div className="animate-fade-in" style={{ textAlign: 'center', width: '100%' }}>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>1. Biometric Check-in</h3>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
              Hold the fingerprint scanner to verify your identity on the voter roll.
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div 
                className="fingerprint-btn"
                onMouseDown={startScan}
                onMouseUp={stopScan}
                onMouseLeave={stopScan}
                onTouchStart={startScan}
                onTouchEnd={stopScan}
              >
                <div className="fingerprint-progress" style={{ height: `${scanProgress}%` }}></div>
                <span className="fingerprint-icon">👆</span>
              </div>
            </div>
            <p style={{ marginTop: '1rem', color: scanProgress === 100 ? 'var(--secondary)' : 'var(--text-muted)' }}>
              {scanProgress === 100 ? 'Verified!' : scanProgress > 0 ? 'Scanning...' : 'Hold to scan'}
            </p>
          </div>
        )}

        {step === 1 && (
          <div className="animate-fade-in" style={{ textAlign: 'center', width: '100%' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'pulse-glow 2s infinite', display: 'inline-block', borderRadius: '50%' }}>
              📄
            </div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>2. Getting Your Ballot</h3>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Identity verified. Take your encrypted digital ballot and proceed to the booth.
            </p>
            <button className="btn btn-primary" onClick={nextStep} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Proceed to Booth
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in" style={{ textAlign: 'center', width: '100%' }}>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>3. The Voting Booth</h3>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
              Select your preferred candidate to cast your vote.
            </p>
            
            <div className="candidate-cards">
              <div 
                className={`trading-card ${selectedCandidate === 'A' ? 'selected' : ''}`}
                onClick={() => handleSelect('A')}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👩‍💼</div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Candidate A</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Focuses on education and technology infrastructure.</p>
                <div className="stamp-overlay">VOTED</div>
              </div>

              <div 
                className={`trading-card ${selectedCandidate === 'B' ? 'selected' : ''}`}
                onClick={() => handleSelect('B')}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍🚀</div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Candidate B</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Advocates for space exploration and clean energy.</p>
                <div className="stamp-overlay">VOTED</div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in" style={{ textAlign: 'center', width: '100%' }}>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>4. Submit Ballot</h3>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Drag and drop your marked ballot into the secure scanner.
            </p>
            
            <div className="drag-container">
              {!isDropped && (
                <div 
                  className="draggable-ballot"
                  draggable="true"
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  style={{ opacity: isDragging ? 0.5 : 1 }}
                >
                  <div style={{ fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>OFFICIAL BALLOT</div>
                  <div className="ballot-lines">
                    <div className={`ballot-line ${selectedCandidate === 'A' ? 'check' : ''}`}></div>
                    <div className="ballot-line"></div>
                    <div className={`ballot-line ${selectedCandidate === 'B' ? 'check' : ''}`}></div>
                    <div className="ballot-line"></div>
                  </div>
                </div>
              )}

              <div 
                className="scanner-box"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="scanner-slot"></div>
              </div>
            </div>
          </div>
        )}

        {step >= 4 && (
          <div className="animate-fade-in" style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '150px', height: '150px', 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              borderRadius: '50%', margin: '0 auto 2rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '4rem', boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)',
              border: '4px solid white'
            }}>
              🇺🇸
            </div>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--secondary)' }}>Congratulations!</h3>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>Your vote has been securely recorded.</p>
            <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }} onClick={reset}>
              Restart Simulation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PollingSimulator;
