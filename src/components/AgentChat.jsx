import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './AgentChat.css';

// Initialize the Gemini API client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Comprehensive built-in knowledge base for instant answers & fallback
const KNOWLEDGE_BASE = [
  {
    keywords: ['register', 'registration', 'sign up', 'enroll'],
    answer: '📝 **How to Register to Vote:**\n\n1. Check eligibility — you must be a citizen and at least 18 years old.\n2. Register online at your state\'s election website, by mail, or in person at your local election office.\n3. Most states have a registration deadline 15–30 days before Election Day.\n4. Some states offer Same-Day Registration, letting you register and vote on Election Day!\n\n💡 Tip: Visit vote.org to check your registration status.'
  },
  {
    keywords: ['when', 'date', 'election day', 'schedule', 'timeline'],
    answer: '📅 **Election Timeline:**\n\n• **Primary Elections:** Typically held between February–June of an election year.\n• **Voter Registration Deadline:** Usually 15–30 days before Election Day.\n• **Early Voting:** Starts 10–45 days before Election Day (varies by state).\n• **Absentee Ballot Request:** Usually 7–30 days before the election.\n• **Election Day:** The Tuesday after the first Monday in November.\n• **Results Certification:** Within 1–5 weeks after Election Day.\n\n💡 Tip: Check your state\'s specific dates at your Secretary of State\'s website.'
  },
  {
    keywords: ['bring', 'id', 'identification', 'need', 'require', 'document'],
    answer: '🪪 **What to Bring on Election Day:**\n\n• **Photo ID** (driver\'s license, state ID, passport) — required in most states.\n• **Non-Photo ID** (utility bill, bank statement, pay stub) — accepted in some states.\n• **Voter Registration Card** — helpful but not always required.\n• Some states have **no ID requirement** at all.\n\n💡 Tip: Check your state\'s specific ID requirements at voteriders.org before heading out!'
  },
  {
    keywords: ['absentee', 'mail', 'mail-in', 'postal', 'remote'],
    answer: '✉️ **Absentee / Mail-in Voting:**\n\n1. **Request a Ballot:** Apply online, by mail, or in person. Deadlines vary (usually 7–30 days before the election).\n2. **Fill it Out:** Mark your choices carefully, following all instructions.\n3. **Return It:** Mail it back (allow time for delivery!) or drop it off at an official drop box or election office.\n4. **Track It:** Most states let you track your ballot status online.\n\n📌 Some states are fully "vote-by-mail" — every registered voter automatically receives a ballot!'
  },
  {
    keywords: ['poll', 'polling', 'station', 'where', 'location', 'place'],
    answer: '📍 **Finding Your Polling Station:**\n\n1. Your polling place is assigned based on your registered address.\n2. Look it up at vote.org/polling-place-locator or your state election website.\n3. Polling hours vary by state, but most are open 7 AM – 8 PM.\n4. You have the right to vote if you are in line before polls close!\n\n💡 Tip: Visit your polling place before Election Day so you know exactly where to go.'
  },
  {
    keywords: ['count', 'result', 'winner', 'certification', 'after'],
    answer: '📊 **After You Vote — How Results Work:**\n\n1. **Polls Close:** Counting begins immediately.\n2. **Unofficial Results:** Media outlets project winners on election night based on data.\n3. **Canvassing:** Election officials verify every ballot over the following days/weeks.\n4. **Certification:** Results are officially certified by the state (1–5 weeks later).\n5. **Recounts:** Triggered automatically in very close races in most states.\n\n🔒 Every ballot is secured and audited to ensure accuracy.'
  },
  {
    keywords: ['early', 'advance', 'before'],
    answer: '⏰ **Early Voting:**\n\n• Early voting lets you cast your ballot in person before Election Day.\n• Availability varies: some states offer 45 days, others just a few days.\n• You can vote at designated early voting centers (may differ from your Election Day polling place).\n• Benefits: shorter lines, flexible schedule, and peace of mind!\n\n💡 Tip: Check your state\'s early voting dates and locations at vote.org.'
  },
  {
    keywords: ['candidate', 'party', 'choose', 'platform', 'research'],
    answer: '🔍 **How to Research Candidates:**\n\n1. **Official Voter Guide:** Mailed to you or available online from your state.\n2. **Ballotpedia.org:** Non-partisan info on every candidate and ballot measure.\n3. **Candidate Websites:** Read their platforms and policy positions.\n4. **Local News & Debates:** Watch or read coverage of debates and forums.\n5. **Vote411.org:** Side-by-side candidate comparisons from the League of Women Voters.\n\n💡 Tip: Don\'t just vote for the top of the ticket — local races matter too!'
  },
  {
    keywords: ['right', 'law', 'protection', 'intimidation', 'problem'],
    answer: '⚖️ **Your Voting Rights:**\n\n• You have the right to vote if you are a registered, eligible citizen.\n• No one can intimidate or pressure you at the polls.\n• If your name isn\'t on the roster, you can cast a **provisional ballot**.\n• Your employer must give you time to vote in many states.\n• If you need help due to a disability, you can bring someone to assist you.\n\n📞 Report problems: Call the Election Protection Hotline at 1-866-OUR-VOTE.'
  },
  {
    keywords: ['hi', 'hello', 'hey', 'help', 'what can you'],
    answer: '👋 **Hello! I\'m your Election Guide Agent!**\n\nI can help you with:\n• 📝 How to **register** to vote\n• 📅 Election **timelines & dates**\n• 🪪 What **ID to bring** on Election Day\n• ✉️ **Absentee / mail-in** voting\n• 📍 Finding your **polling station**\n• 🔍 How to **research candidates**\n• ⚖️ Your **voting rights**\n• ⏰ **Early voting** options\n\nJust type your question and I\'ll guide you!'
  }
];

function getLocalAnswer(userMsg) {
  const lower = userMsg.toLowerCase();
  for (const entry of KNOWLEDGE_BASE) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      return entry.answer;
    }
  }
  return null;
}

function AgentChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "👋 Hi! I'm your **Election Guide Agent**. Ask me anything about voting, registration, timelines, or your rights!", sender: 'agent' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setInput('');
    setIsTyping(true);

    // Try local knowledge base first for instant response
    const localAnswer = getLocalAnswer(userMsg);

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        const prompt = `You are an expert Election Process Education Assistant for a Hackathon project called 'PromptWars'. 
Your goal is to help users understand the election process, timelines, and how to vote.
Keep your answers concise (under 150 words), helpful, friendly, and encouraging.
Use bullet points and emojis to make the answer easy to scan.

User asks: ${userMsg}`;

        const result = await model.generateContent(prompt);
        const reply = result.response.text();
        
        setMessages(prev => [...prev, { text: reply, sender: 'agent' }]);
      } catch (error) {
        console.error("Gemini API Error:", error);
        // Fallback to local knowledge base
        const fallback = localAnswer || "I couldn't connect to my AI brain right now, but I have a built-in knowledge base! Try asking about **registration**, **election dates**, **what ID to bring**, **absentee voting**, **polling locations**, or **your voting rights**.";
        setMessages(prev => [...prev, { text: fallback, sender: 'agent' }]);
      }
    } else {
      // No API key — use local knowledge base
      setTimeout(() => {
        const reply = localAnswer || "Great question! I can help you with **registration**, **election dates**, **what ID to bring**, **absentee voting**, **polling locations**, **candidate research**, and **your voting rights**. Try asking about one of those topics!";
        setMessages(prev => [...prev, { text: reply, sender: 'agent' }]);
      }, 600);
    }

    setIsTyping(false);
  };

  return (
    <div className={`agent-wrapper ${isOpen ? 'open' : ''}`}>
      {!isOpen && (
        <button className="agent-trigger pulse" onClick={() => setIsOpen(true)}>
          <span style={{ fontSize: '1.5rem' }}>🤖</span>
        </button>
      )}
      
      {isOpen && (
        <div className="agent-window glass">
          <div className="agent-header">
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Election Agent</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>● Online {isTyping ? '(Thinking...)' : ''}</span>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          <div className="agent-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <form className="agent-input-area" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Ask about voting, registration, ID..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} disabled={isTyping}>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AgentChat;
