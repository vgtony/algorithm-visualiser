import { useState, useEffect, useRef, useCallback } from 'react';
import './SlotMachineBogosort.css';
import '../index.css';

// ===== Web Audio API Sound Effects =====
const createSoundEffects = () => {
  let ctx: AudioContext | null = null;

  const getCtx = () => {
    if (!ctx) ctx = new AudioContext();
    return ctx;
  };

  const playTick = () => {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'square';
    osc.frequency.value = 800 + Math.random() * 400;
    gain.gain.setValueAtTime(0.08, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.05);
    osc.connect(gain).connect(c.destination);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.05);
  };

  const playStop = () => {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, c.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2);
    osc.connect(gain).connect(c.destination);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.2);
  };

  // Metallic coin clink sound
  const playCoinClink = () => {
    const c = getCtx();
    // High-pitched metallic hit
    const osc1 = c.createOscillator();
    const osc2 = c.createOscillator();
    const gain = c.createGain();
    osc1.type = 'sine';
    osc1.frequency.value = 3000 + Math.random() * 2000;
    osc2.type = 'square';
    osc2.frequency.value = 6000 + Math.random() * 3000;
    gain.gain.setValueAtTime(0.15, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.08);
    const filter = c.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 4000;
    filter.Q.value = 10;
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain).connect(c.destination);
    osc1.start(c.currentTime);
    osc1.stop(c.currentTime + 0.08);
    osc2.start(c.currentTime);
    osc2.stop(c.currentTime + 0.08);
  };

  const playWin = () => {
    const c = getCtx();

    // === 1. SIREN WOBBLE (attention-grabbing) ===
    const siren = c.createOscillator();
    const sirenGain = c.createGain();
    siren.type = 'sawtooth';
    siren.frequency.setValueAtTime(400, c.currentTime);
    siren.frequency.linearRampToValueAtTime(800, c.currentTime + 0.3);
    siren.frequency.linearRampToValueAtTime(400, c.currentTime + 0.6);
    siren.frequency.linearRampToValueAtTime(800, c.currentTime + 0.9);
    siren.frequency.linearRampToValueAtTime(400, c.currentTime + 1.2);
    sirenGain.gain.setValueAtTime(0.12, c.currentTime);
    sirenGain.gain.setValueAtTime(0.12, c.currentTime + 1.0);
    sirenGain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1.5);
    siren.connect(sirenGain).connect(c.destination);
    siren.start(c.currentTime);
    siren.stop(c.currentTime + 1.5);

    // === 2. ASCENDING FANFARE (loud, multi-harmonic) ===
    const fanfareNotes = [
      { freq: 392, t: 0.1 },   // G4
      { freq: 523, t: 0.25 },  // C5
      { freq: 659, t: 0.4 },   // E5
      { freq: 784, t: 0.55 },  // G5
      { freq: 1047, t: 0.7 },  // C6
      { freq: 1319, t: 0.85 }, // E6
      { freq: 1568, t: 1.0 },  // G6
      { freq: 2093, t: 1.15 }, // C7
    ];
    fanfareNotes.forEach(({ freq, t }) => {
      // Main tone
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const start = c.currentTime + t;
      g.gain.setValueAtTime(0, start);
      g.gain.linearRampToValueAtTime(0.25, start + 0.04);
      g.gain.exponentialRampToValueAtTime(0.01, start + 0.5);
      osc.connect(g).connect(c.destination);
      osc.start(start);
      osc.stop(start + 0.5);
      // Bright harmonic
      const osc2 = c.createOscillator();
      const g2 = c.createGain();
      osc2.type = 'triangle';
      osc2.frequency.value = freq * 2;
      g2.gain.setValueAtTime(0, start);
      g2.gain.linearRampToValueAtTime(0.08, start + 0.04);
      g2.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
      osc2.connect(g2).connect(c.destination);
      osc2.start(start);
      osc2.stop(start + 0.35);
    });

    // === 3. VICTORY CHORD (sustained, powerful) ===
    setTimeout(() => {
      const chordFreqs = [523, 659, 784, 1047]; // C major
      chordFreqs.forEach(freq => {
        ['sine', 'triangle'].forEach((type, ti) => {
          const osc = c.createOscillator();
          const g = c.createGain();
          osc.type = type as OscillatorType;
          osc.frequency.value = freq * (ti === 1 ? 2 : 1);
          g.gain.setValueAtTime(ti === 0 ? 0.18 : 0.06, c.currentTime);
          g.gain.setValueAtTime(ti === 0 ? 0.18 : 0.06, c.currentTime + 1.0);
          g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 2.0);
          osc.connect(g).connect(c.destination);
          osc.start(c.currentTime);
          osc.stop(c.currentTime + 2.0);
        });
      });
    }, 1300);

    // === 4. COIN CLINKS (scattered metallic hits for 3 seconds) ===
    for (let i = 0; i < 25; i++) {
      setTimeout(() => playCoinClink(), Math.random() * 3000 + 200);
    }

    // === 5. SECOND FANFARE WAVE ===
    setTimeout(() => {
      const notes2 = [784, 988, 1175, 1568]; // G5 B5 D6 G6
      notes2.forEach((freq, i) => {
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const start = c.currentTime + i * 0.1;
        g.gain.setValueAtTime(0, start);
        g.gain.linearRampToValueAtTime(0.2, start + 0.03);
        g.gain.exponentialRampToValueAtTime(0.001, start + 0.6);
        osc.connect(g).connect(c.destination);
        osc.start(start);
        osc.stop(start + 0.6);
      });
    }, 2500);
  };

  return { playTick, playStop, playWin, playCoinClink };
};

// ===== Single Reel Component =====
interface ReelProps {
  value: number;
  isSpinning: boolean;
  onSpinEnd?: () => void;
  spinDuration: number; // ms
}

const Reel = ({ value, isSpinning, onSpinEnd, spinDuration }: ReelProps) => {
  const [displayNumbers, setDisplayNumbers] = useState<number[]>([0, 0, 0]);
  const [phase, setPhase] = useState<'idle' | 'spinning' | 'stopping'>('idle');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Generate random numbers for spinning display
  const randomNum = () => Math.floor(Math.random() * 9) + 1;

  useEffect(() => {
    if (isSpinning) {
      setPhase('spinning');

      // Rapidly cycle random numbers while spinning
      intervalRef.current = setInterval(() => {
        setDisplayNumbers([randomNum(), randomNum(), randomNum()]);
      }, 60);

      // After spinDuration, start the stopping phase
      timeoutRef.current = setTimeout(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        // Show the actual result
        setDisplayNumbers([
          (value + 1) % 9 + 1,
          value,
          (value + 7) % 9 + 1
        ]);
        setPhase('stopping');

        // After bounce animation, go idle
        setTimeout(() => {
          setPhase('idle');
          onSpinEnd?.();
        }, 350);
      }, spinDuration);
    } else {
      // Not spinning - show static values
      setDisplayNumbers([
        (value + 1) % 9 + 1,
        value,
        (value + 7) % 9 + 1
      ]);
      setPhase('idle');
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isSpinning, value, spinDuration]);

  const stripClass = phase === 'spinning' ? 'reel-strip spinning' :
    phase === 'stopping' ? 'reel-strip stopped' :
      'reel-strip';

  return (
    <div className="reel-column">
      <div className={stripClass}>
        <div className="reel-cell">{displayNumbers[0]}</div>
        <div className="reel-cell payline">{displayNumbers[1]}</div>
        <div className="reel-cell">{displayNumbers[2]}</div>
      </div>
    </div>
  );
};

// ===== Main Component =====
const SlotMachineBogosort = () => {
  const [slotSize, setSlotSize] = useState(4);
  const [array, setArray] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isSorted, setIsSorted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // reels are visually spinning
  const [speed, setSpeed] = useState(100);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [reelSpinning, setReelSpinning] = useState<boolean[]>([]);
  const [coins, setCoins] = useState<{ id: number; left: number; delay: number; size: number; emoji: string }[]>([]);
  const [screenShake, setScreenShake] = useState(false);
  const stopRef = useRef(false);
  const soundRef = useRef(createSoundEffects());
  const coinIdRef = useRef(0);

  useEffect(() => {
    generateArray();
  }, []);

  const generateArray = () => {
    if (isSorting || isAnimating) return;
    const newArray = Array.from({ length: slotSize }, () => Math.floor(Math.random() * 9) + 1);
    setIsSorted(false);
    setArray(newArray);
    setReelSpinning(new Array(slotSize).fill(false));
    setCoins([]);
  };

  const checkSorted = (arr: number[]) => {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) return false;
    }
    return true;
  };

  const shuffleOnce = (currentArray: number[]) => {
    const arr = [...currentArray];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Spawn coin particles for win celebration — MASSIVE jackpot shower
  const spawnCoins = useCallback(() => {
    const sfx = soundRef.current;
    const coinEmojis = ['🪙', '💰', '🏆', '⭐', '💎', '🪙', '🪙', '🪙'];

    // Screen shake!
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 2000);

    // Wave 1: immediate burst of coins
    const wave1 = Array.from({ length: 20 }, () => ({
      id: coinIdRef.current++,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      size: 1.2 + Math.random() * 1.2,
      emoji: coinEmojis[Math.floor(Math.random() * coinEmojis.length)]
    }));

    // Wave 2: delayed cascade
    const wave2 = Array.from({ length: 20 }, () => ({
      id: coinIdRef.current++,
      left: Math.random() * 100,
      delay: 1.0 + Math.random() * 1.0,
      size: 1.0 + Math.random() * 1.0,
      emoji: coinEmojis[Math.floor(Math.random() * coinEmojis.length)]
    }));

    // Wave 3: final shower
    const wave3 = Array.from({ length: 15 }, () => ({
      id: coinIdRef.current++,
      left: Math.random() * 100,
      delay: 2.2 + Math.random() * 1.0,
      size: 0.8 + Math.random() * 1.5,
      emoji: coinEmojis[Math.floor(Math.random() * coinEmojis.length)]
    }));

    setCoins([...wave1, ...wave2, ...wave3]);

    // Play coin clink sounds throughout
    for (let i = 0; i < 30; i++) {
      setTimeout(() => sfx.playCoinClink(), 300 + Math.random() * 3500);
    }

    setTimeout(() => setCoins([]), 6000);
  }, []);

  // Spin animation: all reels spin, then stop one by one
  const animateSpin = useCallback((nextArray: number[]): Promise<void> => {
    return new Promise(resolve => {
      const sfx = soundRef.current;
      setIsAnimating(true);
      setReelSpinning(new Array(nextArray.length).fill(true));

      // Play tick sounds during spin
      const tickInterval = setInterval(() => sfx.playTick(), 80);

      // Stop reels one by one
      let stoppedCount = 0;
      const baseTime = 1800; // first reel stops at 1.8s
      const stagger = 200;  // 200ms between each reel stop

      nextArray.forEach((_, idx) => {
        setTimeout(() => {
          sfx.playStop();
          setReelSpinning(prev => {
            const next = [...prev];
            next[idx] = false;
            return next;
          });
          stoppedCount++;
          if (stoppedCount === nextArray.length) {
            clearInterval(tickInterval);
            // Wait for bounce animation to finish
            setTimeout(() => {
              setIsAnimating(false);
              resolve();
            }, 400);
          }
        }, baseTime + idx * stagger);
      });
    });
  }, []);

  const handleManualSpin = async () => {
    if (isSorting || isSorted || isAnimating) return;
    setIsSorting(true);

    const nextArray = shuffleOnce(array);
    setArray(nextArray);

    await animateSpin(nextArray);

    if (checkSorted(nextArray)) {
      setIsSorted(true);
      soundRef.current.playWin();
      spawnCoins();
    }
    setIsSorting(false);
  };

  const startAutoSort = async () => {
    if (isSorting || isSorted || isAnimating) return;
    setIsSorting(true);
    stopRef.current = false;

    let currentArray = [...array];

    while (!checkSorted(currentArray)) {
      if (stopRef.current) {
        setIsSorting(false);
        return;
      }

      currentArray = shuffleOnce(currentArray);
      setArray([...currentArray]);
      await animateSpin(currentArray);
      await new Promise(resolve => setTimeout(resolve, speed));

      if (stopRef.current) {
        setIsSorting(false);
        return;
      }
    }

    setIsSorted(true);
    soundRef.current.playWin();
    spawnCoins();
    setIsSorting(false);
  };

  const stopSort = () => {
    stopRef.current = true;
  };

  const busy = isSorting || isAnimating;

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 className="slot-title">🎰 Bogo Slots 🎰</h1>

      <div className={`slot-machine ${screenShake ? 'jackpot-shake' : ''} ${isSorted ? 'jackpot-glow' : ''}`}>
        {/* Win flash overlay */}
        {isSorted && <div className="jackpot-flash" />}

        {/* Coin shower on win */}
        {coins.map(coin => (
          <div
            key={coin.id}
            className="coin-particle"
            style={{
              left: `${coin.left}%`,
              animationDuration: `${1.5 + Math.random() * 1.5}s`,
              animationDelay: `${coin.delay}s`,
              fontSize: `${coin.size}rem`,
              top: 0
            }}
          >
            {coin.emoji}
          </div>
        ))}

        {/* BIG WIN OVERLAY */}
        {isSorted && (
          <div className="big-win-overlay">
            <div className="jackpot-stars">✦ ✦ ✦</div>
            🎉 JACKPOT! 🎉
            <span>💰 SORTED! 💰</span>
            <div className="jackpot-sub">🏆 WINNER WINNER 🏆</div>
          </div>
        )}

        {/* CONTROLS BAR */}
        <div className="controls-bar">
          {/* MODE SELECTOR */}
          <div className="mode-panel">
            <button
              className={`mode-btn ${mode === 'auto' ? 'active' : 'inactive'}`}
              onClick={() => setMode('auto')}
              disabled={busy}
            >
              Auto
            </button>
            <button
              className={`mode-btn ${mode === 'manual' ? 'active' : 'inactive'}`}
              onClick={() => setMode('manual')}
              disabled={busy}
            >
              Manual
            </button>
          </div>

          {/* SIZE SLIDER */}
          <div className="size-slider">
            <span>Slots: {slotSize}</span>
            <input
              type="range"
              min="4"
              max="9"
              value={slotSize}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                setSlotSize(newSize);
                const newArray = Array.from({ length: newSize }, () => Math.floor(Math.random() * 9) + 1);
                setIsSorted(false);
                setArray(newArray);
                setReelSpinning(new Array(newSize).fill(false));
                setCoins([]);
              }}
              disabled={busy}
            />
          </div>
        </div>

        {/* REELS */}
        <div className="reel-container">
          {array.map((val, idx) => (
            <Reel
              key={idx}
              value={val}
              isSpinning={reelSpinning[idx] || false}
              spinDuration={1800 + idx * 200}
            />
          ))}
        </div>

        {/* CONTROLS */}
        {mode === 'auto' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {!busy && !isSorted && (
                <button
                  className="spin-btn"
                  onClick={startAutoSort}
                >
                  🎰 AUTO SPIN!
                </button>
              )}

              {busy && (
                <button
                  className="spin-btn spinning-active"
                  onClick={stopSort}
                >
                  ⏹ STOP
                </button>
              )}

              <button className="reset-btn" onClick={generateArray} disabled={busy}>
                🔄 Reset
              </button>
            </div>

            <div className="size-slider">
              <span>Speed (Delay: {speed}ms)</span>
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                disabled={busy}
              />
            </div>
          </div>
        ) : (
          <div className="manual-controls">
            <div className="manual-buttons">
              <button
                className={`spin-btn ${busy ? 'spinning-active' : ''} ${isSorted ? 'winner' : ''}`}
                onClick={handleManualSpin}
                disabled={isSorted || busy}
              >
                {busy ? '⏳ SPINNING...' : (isSorted ? '🏆 WINNER!' : '🎰 SPIN ONCE')}
              </button>
              <button className="reset-btn" onClick={generateArray} disabled={busy}>
                🔄 Reset
              </button>
            </div>
            <span className="manual-hint">Click to shuffle once. Good luck! 🍀</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotMachineBogosort;
