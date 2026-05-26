import React from 'react';
import AgentChat from './components/AgentChat';
import InteractiveTimeline from './components/InteractiveTimeline';
import VoterQuiz from './components/VoterQuiz';
import PollingSimulator from './components/PollingSimulator';
import './index.css';

function App() {
  return (
    <div className="app-wrapper">
      <header className="hero section container" style={{ textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 className="animate-fade-in">
          Understand the <span className="gradient-text">Election Process</span>
        </h1>
        <p className="animate-fade-in" style={{ animationDelay: '0.2s', fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Your interactive guide to voting, timelines, and how your voice matters. Explore the steps below or ask our AI Agent anything!
        </p>
        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
           <button className="btn btn-primary" onClick={() => document.getElementById('timeline').scrollIntoView({ behavior: 'smooth' })}>
             Start Exploring
           </button>
        </div>
      </header>

      <main>
        <section id="timeline" className="section">
          <InteractiveTimeline />
        </section>

        <section id="quiz" className="section" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <VoterQuiz />
        </section>

        <section id="simulator" className="section">
          <PollingSimulator />
        </section>
      </main>

      <footer style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
        <p>Built for PromptWars Hackathon 🚀</p>
      </footer>

      {/* Floating Agent */}
      <AgentChat />
    </div>
  );
}

export default App;
