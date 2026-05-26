import React, { useState } from 'react';

const QUESTIONS = [
  {
    q: "It's a rainy Tuesday morning and you have a busy day at work. How are you casting your vote?",
    options: [
      { text: "I already dropped off my ballot last week!", type: 'early' },
      { text: "I'll vote from my kitchen table in my pajamas and mail it.", type: 'mail' },
      { text: "I'll grab an umbrella and hit the polls after work. I want my sticker!", type: 'dayof' }
    ]
  },
  {
    q: "When you hear the phrase 'Election Research', what is your first thought?",
    options: [
      { text: "I have a spreadsheet tracking every local proposition.", type: 'early' },
      { text: "I'll read the official voter guide while drinking coffee at home.", type: 'mail' },
      { text: "I'll quickly look up the candidates on my phone while waiting in line.", type: 'dayof' }
    ]
  },
  {
    q: "What is your ideal voting environment?",
    options: [
      { text: "Quiet, efficient, and done ahead of schedule.", type: 'early' },
      { text: "Cozy, private, and zero stress or lines.", type: 'mail' },
      { text: "Energetic, civic-minded, and surrounded by my community.", type: 'dayof' }
    ]
  }
];

const PERSONAS = {
  'early': { title: 'The Strategic Planner 🧠', desc: 'You leave nothing to chance. You prefer Early Voting at a designated center. Check your local county website for Early Voting dates and locations to beat the Election Day rush!' },
  'mail': { title: 'The Comfort Voter 🛋️', desc: 'Why wait in line when you can vote in slippers? Absentee/Mail-in voting is perfect for you. Just make sure to request your ballot early and check if your state requires an excuse!' },
  'dayof': { title: 'The Civic Traditionalist 🇺🇸', desc: 'You thrive on the energy of Election Day! You prefer voting in person at your local precinct. Don\'t forget to check your polling location and bring an accepted form of ID if your state requires it.' }
};

function VoterQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState({ early: 0, mail: 0, dayof: 0 });
  const [result, setResult] = useState(null);

  const handleAnswer = (type) => {
    const newScores = { ...scores, [type]: scores[type] + 1 };
    setScores(newScores);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate winner
      const winner = Object.keys(newScores).reduce((a, b) => newScores[a] > newScores[b] ? a : b);
      setResult(PERSONAS[winner]);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setScores({ early: 0, mail: 0, dayof: 0 });
    setResult(null);
  };

  return (
    <div className="container">
      <div className="glass" style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>Find Your <span className="gradient-text">Voter Persona</span></h2>
        
        {!result ? (
          <div className="animate-fade-in" key={currentStep}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Question {currentStep + 1} of {QUESTIONS.length}</p>
            <h3 style={{ marginBottom: '2rem' }}>{QUESTIONS[currentStep].q}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {QUESTIONS[currentStep].options.map((opt, i) => (
                <button 
                  key={i} 
                  className="btn" 
                  style={{ 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text)',
                    padding: '1rem'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(79, 70, 229, 0.2)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                  onClick={() => handleAnswer(opt.type)}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{result.title}</h3>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>{result.desc}</p>
            <button className="btn btn-primary" onClick={reset}>Retake Quiz</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VoterQuiz;
