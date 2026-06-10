import { useState, useEffect, useRef } from 'react';
import { sentences, quotes } from './text';
import './App.css';

function App() {
  const [status, setStatus] = useState('waiting');
  const [targetText, setTargetText] = useState(sentences[0]);
  const [userInput, setUserInput] = useState("");
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [theme, setTheme] = useState('matrix');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [previewTheme, setPreviewTheme] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [hasPunctuation, setHasPunctuation] = useState(false);
  const [hasNumbers, setHasNumbers] = useState(false);
  const [gameMode, setGameMode] = useState('quotes');

  const [highScore, setHighScore] = useState(() => {
    const savedScore = localStorage.getItem('bestWPM');
    return savedScore ? Number(savedScore) : 0;
  });

  const inputRef = useRef(null);

  const handleChange = (e) => {
    const valeur = e.target.value

    if (status === 'waiting' && valeur.length === 1) {
      setStatus('playing');
    }

    if (valeur.length === targetText.length) {
      setStatus('finished');
    }

    if (valeur.length > userInput.length) {
      const lastIndex = valeur.length - 1;
      if (valeur[lastIndex] !== targetText[lastIndex]){
        playBip();
      }
    }

    setUserInput(valeur);
  };

  const handleRestart = () => {
    const randomIndex = Math.floor(Math.random() * sentences.length);

    setTargetText(sentences[randomIndex]);
    setUserInput("");
    setSecondsElapsed(0);
    setStatus('waiting');

    if (gameMode === 'quotes') {
      const randomIndex = Math.floor(Math.random() * quotes.length); 
      setTargetText(quotes[randomIndex])
    } else {
      const randomIndex = Math.floor(Math.random() * sentences.length);
      setTargetText(sentences[randomIndex]);
    }
  };


  useEffect(() => {
    if (status === 'playing') {
      const chrono = setInterval(() => {
        setSecondsElapsed((tempsPrecedent) => tempsPrecedent +1);
      }, 1000);

      return () => clearInterval(chrono);
    }
  }, [status]);



  // Decompte des caractères corrects
  const correctCharsCount = userInput.split('').filter((char, index) => {
    return char === targetText[index];
  }).length;

  // Calcul de la précision
  const precision = userInput.length > 0 
    ? Math.round((correctCharsCount / userInput.length) * 100) 
    : 100;

  // Calcul du WPM
  const timeInMinutes = secondsElapsed / 60;
  const wpm = timeInMinutes > 0 
    ? Math.round((correctCharsCount / 5) / timeInMinutes) 
    : 0;

  // Bip du loser
  const playBip = () => {
    if (isMuted) return;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
  }

    useEffect(() => {
    if (status === 'finished') {
      if (wpm > highScore) {
        setHighScore(wpm)
        localStorage.setItem('bestWPM', wpm)
      }
      return
    }
  }, [status, wpm, highScore]);

  return (
    <div className={`app-container ${previewTheme || theme}`}>
        <header className="game-header">
          <div className="logo-section">
            <h1>Typing Speed Test</h1>
          </div>

          <div><p>🏆 Record : {highScore} wpm</p></div>

          <div className="settings-section">
            
            <div className="theme-selector-container">
              <button
                onClick={() => {
                  setIsMuted(!isMuted);
                  inputRef.current?.focus();
                }}
                className="icon-btn"
                title={isMuted ? "Activer le son" : "Couper le son"}
                >
                  {isMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                      <line x1="22" y1="9" x2="16" y2="15"></line>
                      <line x1="16" y1="9" x2="22" y2="15"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                    </svg>
                  )}
                </button>
              <button
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                  inputRef.current?.focus();
                }}
                className="icon-btn palette-btn"
                title="Changer de thème"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.01443 19.1559 5.2343 19.2227 5.44917 19.1797C6.8398 18.9015 8.1602 18.9015 9.55083 19.1797C9.7657 19.2227 9.98557 19.1559 10.1414 19C11.1444 19.9936 12 22 12 22Z" />
                  <circle cx="7.5" cy="10.5" r="1" fill="currentColor"/>
                  <circle cx="11.5" cy="7.5" r="1" fill="currentColor"/>
                  <circle cx="16.5" cy="9.5" r="1" fill="currentColor"/>
                  <circle cx="15.5" cy="14.5" r="1" fill="currentColor"/>
                </svg>
              </button>

              {isMenuOpen && (
                <div className="theme-dropdown"
                onMouseLeave={() => setIsMenuOpen(false)}
                >
                  <button
                    onClick={() => { setTheme('matrix'); setIsMenuOpen(false); setPreviewTheme(null); inputRef.current?.focus(); }}
                    onMouseEnter={() => setPreviewTheme('matrix')}
                    onMouseLeave={() => setPreviewTheme(null)}
                    title="Thème Matrix"
                  >
                    <span className="theme-dot dot-matrix"></span>
                  </button>

                  <button
                    onClick={() => { setTheme('serika'); setIsMenuOpen(false); setPreviewTheme(null); inputRef.current?.focus(); }}
                    onMouseEnter={() => setPreviewTheme('serika')}
                    onMouseLeave={() => setPreviewTheme(null)}
                    title="Thème Serika"
                  >
                    <span className="theme-dot dot-serika"></span>
                  </button>

                  <button
                    onClick={() => { setTheme('parchment'); setIsMenuOpen(false); setPreviewTheme(null); inputRef.current?.focus(); }}
                    onMouseEnter={() => setPreviewTheme('parchment')}
                    onMouseLeave={() => setPreviewTheme(null)}
                    title="Thème Journal"
                  >
                    <span className="theme-dot dot-parchment"></span>
                  </button>

                  <button
                    onClick={() => { setTheme('coffee'); setIsMenuOpen(false); setPreviewTheme(null); inputRef.current?.focus(); }}
                    onMouseEnter={() => setPreviewTheme('coffee')}
                    onMouseLeave={() => setPreviewTheme(null)}
                    title="Thème Café Chaud"
                  >
                    <span className="theme-dot dot-coffee"></span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="options-bar" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => { setHasPunctuation(!hasPunctuation); inputRef.current?.focus(); }} 
            className={`mode-btn ${hasPunctuation ? 'active' : ''}`}
          >
            ! - ponctuation
          </button>
          
          <button 
            onClick={() => { setHasNumbers(!hasNumbers); inputRef.current?.focus(); }} 
            className={`mode-btn ${hasNumbers ? 'active' : ''}`}
          >
            42 - nombres
          </button>

          <button 
            onClick={() => { 
              setGameMode('quotes'); 
              handleRestart('quotes');
            }} 
            className={`mode-btn ${gameMode === 'quotes' ? 'active' : ''}`}
          >
            citation
          </button>
        </div>

        <main id="center" onClick={() => inputRef.current?.focus()}>
          {status !== 'finished' ? (
            <>
              <div className="chrono-display">
                {status === 'playing' ? (
                  <span>{secondsElapsed} s | {wpm} wpm</span>
                  ) : (
                    <span>Commence à taper dès que tu es prêt !</span>
                  )}
              </div>
          
              <div className="text-container">
                {targetText.split('').map((lettre, index) => (
                  <span key={index} className={
                    index === userInput.length 
                      ? "cursor" 
                      : index < userInput.length 
                        ? (lettre === userInput[index] ? "correct" : "incorrect") 
                        : ""
                  }>
                    {lettre}
                  </span>
                ))}
              </div>

              <button onClick={handleRestart} className="icon-btn restart-action-btn" title="Recommencer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <polyline points="3 3 3 8 8 8" />
                </svg>
              </button>

              <input 
                ref={inputRef}
                type="text"
                className="hidden-input"
                value={userInput}
                onChange={handleChange}
                autoFocus
              />
            </>
          ) : (
            <div className="results-container">
              <div className='stats-grid'>
                <div className='stat-box'>
                  <span className='stat-label'>wpm</span>
                  <span className='stat-value'>{wpm}</span>
                </div>

                <div className='stat-box'>
                  <span className='stat-label'>Précision</span>
                  <span className='stat-value'>{precision}%</span>
                </div>

                <div className='stat-box'>
                  <span className='stat-label'>temps</span>
                  <span className='stat-value'>{secondsElapsed}s</span>
                </div>

                <div className='stat-box'>
                  <span className='stat-label'>Record</span>
                  <span className='stat-value'>{highScore} wpm</span>
                </div>
              </div>
              
              <button onClick={handleRestart} className="icon-btn restart-action-btn" title="Recommencer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <polyline points="3 3 3 8 8 8" />
                </svg>
              </button>
            </div>
          )}  
        </main>
      </div>
  );
}


export default App;