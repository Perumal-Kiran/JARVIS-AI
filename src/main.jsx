import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

function App() {
  const [status, setStatus] = useState({
    connected: false,
    modelAvailable: false,
    model: 'qwen3.5:9b',
    models: []
  });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const end = useRef(null);

  async function refresh() {
    try {
      if (window.jarvis) setStatus(await window.jarvis.getStatus());
    } catch {
      setStatus((current) => ({ ...current, connected: false, modelAvailable: false }));
    }
  }

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, busy]);

  async function chooseModel(event) {
    const model = event.target.value;
    if (!model) return;
    setError('');
    try {
      await window.jarvis.setModel(model);
      await refresh();
    } catch (problem) {
      setError(problem.message || 'Could not change the local model.');
    }
  }

  async function send(event) {
    event.preventDefault();
    const question = input.trim();
    if (!question || busy) return;

    setInput('');
    setError('');
    setMessages((current) => [...current, { role: 'user', text: question }]);
    setBusy(true);

    try {
      const result = await window.jarvis.chat(question);
      setMessages((current) => [...current, { role: 'assistant', text: result.reply }]);
    } catch (problem) {
      setError(problem.message || 'Cannot reach the local AI engine.');
    } finally {
      setBusy(false);
      refresh();
    }
  }

  const engineLabel = !status.connected
    ? 'LOCAL AI ENGINE OFFLINE'
    : status.modelAvailable
      ? 'AI MODEL READY'
      : 'OLLAMA CONNECTED — MODEL NOT INSTALLED';

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand"><b>J</b> J.A.R.V.I.S.</div>
        <div className="online"><i className={status.connected ? 'good' : ''} />{status.connected ? 'LOCAL ENGINE ONLINE' : 'SYSTEMS STANDBY'}</div>
        <div className="version">WINDOWS DESKTOP <span>BUILD 003</span></div>
      </header>

      <section className="layout">
        <section className="hero">
          <small>PERSONAL AI SYSTEM • LOCAL-FIRST</small>
          <h1>At your service, Sir.</h1>
          <p>Your personal assistant is standing by.</p>
          <div className="core">
            <div className="orbit one" />
            <div className="orbit two" />
            <div className="triangle"><span>J</span></div>
          </div>
          <div className="engine"><i className={status.connected && status.modelAvailable ? 'good' : ''} />{engineLabel}</div>
          <small className="privacy">LOCAL PROCESSING • NO PAID API REQUIRED</small>
        </section>

        <section className="chat">
          <div className="chathead">
            <div><small>INTERFACE 01</small><h2>Command centre</h2></div>
            <button type="button" onClick={refresh}>CHECK ENGINE ↻</button>
          </div>

          <div className="model-row">
            <label htmlFor="model-choice">LOCAL AI MODEL</label>
            <select id="model-choice" value={status.modelAvailable ? status.model : ''} onChange={chooseModel} disabled={!status.connected || !status.models.length}>
              <option value="">{status.connected ? 'Choose an installed model' : 'Ollama offline'}</option>
              {status.models.map((model) => <option key={model} value={model}>{model}</option>)}
            </select>
          </div>

          <div className="messages">
            {!messages.length && (
              <div className="empty">
                <b>◇</b>
                <strong>Awaiting your instruction</strong>
                <p>{status.modelAvailable ? 'The local AI engine is ready. Send your first instruction.' : 'Install a local Ollama model to enable AI replies.'}</p>
              </div>
            )}
            {messages.map((message, index) => (
              <article className={message.role} key={index}>
                <label>{message.role === 'user' ? 'SIR' : 'J.A.R.V.I.S.'}</label>
                <p>{message.text}</p>
              </article>
            ))}
            {busy && <div className="thinking">JARVIS IS THINKING •••</div>}
            <div ref={end} />
          </div>

          {error && <div className="error">{error}</div>}
          <form onSubmit={send}>
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Enter a command or ask JARVIS..." aria-label="Message JARVIS" />
            <button disabled={busy || !input.trim() || !status.modelAvailable}>SEND ↗</button>
          </form>
          <small className="privacy">MESSAGES ARE SENT TO THE SELECTED LOCAL OLLAMA MODEL</small>
        </section>
      </section>

      <footer>
        <span>● INTERFACE <b>ONLINE</b></span>
        <span>AI ENGINE <b>{status.modelAvailable ? 'READY' : 'NOT READY'}</b></span>
        <span>VOICE <b>NEXT STAGE</b></span>
        <span>PROJECT JARVIS — BUILD 003</span>
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
