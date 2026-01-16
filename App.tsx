
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameStatus, GuessRecord, LevelStats } from './types';

const START_LEVEL = 2;
const MAX_LEVEL = 6;

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>('MENU');
  const [currentLevel, setCurrentLevel] = useState(START_LEVEL);
  const [targetNumber, setTargetNumber] = useState<string>('');
  const [guessInput, setGuessInput] = useState<string>('');
  const [history, setHistory] = useState<GuessRecord[]>([]);
  const [allLevelStats, setAllLevelStats] = useState<LevelStats[]>([]);
  const [startTime, setStartTime] = useState<number>(0);

  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const generateTarget = useCallback((len: number) => {
    let result = '';
    for (let i = 0; i < len; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    setTargetNumber(result);
    setStartTime(Date.now());
  }, []);

  const startGame = () => {
    setCurrentLevel(START_LEVEL);
    setAllLevelStats([]);
    startLevel(START_LEVEL);
  };

  const startLevel = (level: number) => {
    setGuessInput('');
    setHistory([]);
    generateTarget(level);
    setStatus('PLAYING');
  };

  const handleInput = (val: string) => {
    if (guessInput.length < currentLevel) {
      setGuessInput(prev => prev + val);
    }
  };

  const handleSubmit = () => {
    if (guessInput.length !== currentLevel) return;

    let correctCount = 0;
    for (let i = 0; i < currentLevel; i++) {
      if (guessInput[i] === targetNumber[i]) correctCount++;
    }

    const newRecord = { guess: guessInput, correctCount };
    const updatedHistory = [...history, newRecord];
    setHistory(updatedHistory);
    setGuessInput('');

    if (correctCount === currentLevel) {
      const stats = {
        level: currentLevel,
        attempts: updatedHistory.length,
        timeSpent: Math.floor((Date.now() - startTime) / 1000)
      };
      setAllLevelStats(prev => [...prev, stats]);
      setStatus('LEVEL_WON');
    }
  };

  const nextLevel = () => {
    if (currentLevel < MAX_LEVEL) {
      setCurrentLevel(prev => prev + 1);
      startLevel(currentLevel + 1);
    } else {
      setStatus('FINAL_STATS');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 bg-black font-mono text-emerald-400">
      <div className="w-full max-w-md flex justify-between items-center py-4 border-b border-emerald-900">
        <h1 className="font-black italic tracking-tighter">I_AM_HACKER.EXE</h1>
        {status === 'PLAYING' && <span className="text-xs">LEVEL: {currentLevel-1}/5</span>}
      </div>

      <div className="flex-1 w-full max-w-md flex flex-col justify-center py-8">
        {status === 'MENU' && (
          <div className="text-center space-y-6">
            <div className="text-6xl animate-pulse">🔒</div>
            <h2 className="text-3xl font-bold">防火墙渗透测试</h2>
            <p className="text-emerald-800 text-sm">找到 2-6 位隐藏密钥以获取系统权限</p>
            <button onClick={startGame} className="w-full py-4 bg-emerald-500 text-black font-bold">初始化</button>
          </div>
        )}

        {status === 'PLAYING' && (
          <div className="space-y-6">
            <div className="flex justify-center gap-2">
              {Array.from({ length: currentLevel }).map((_, i) => (
                <div key={i} className="w-12 h-16 border-2 border-emerald-500 flex items-center justify-center text-3xl">
                  {guessInput[i] || '_'}
                </div>
              ))}
            </div>
            <div className="h-48 border border-emerald-900 p-2 overflow-y-auto text-xs space-y-1">
              {history.map((h, i) => (
                <div key={i} className="flex justify-between border-b border-emerald-900/30">
                  <span>&gt; {h.guess}</span>
                  <span>MATCH: {h.correctCount}</span>
                </div>
              ))}
              <div ref={historyEndRef} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'OK'].map(btn => (
                <button 
                  key={btn}
                  onClick={() => {
                    if (btn === 'C') setGuessInput('');
                    else if (btn === 'OK') handleSubmit();
                    else handleInput(btn.toString());
                  }}
                  className="h-12 border border-emerald-500 hover:bg-emerald-500/20 active:bg-emerald-500 text-emerald-500 active:text-black font-bold"
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        )}

        {status === 'LEVEL_WON' && (
          <div className="text-center space-y-6">
            <h2 className="text-4xl font-bold">🔓 权限已获取</h2>
            <div className="p-4 border border-emerald-500 bg-emerald-500/10">
              <p>尝试次数: {history.length}</p>
              <p>耗时: {allLevelStats[allLevelStats.length-1].timeSpent}s</p>
            </div>
            <button onClick={nextLevel} className="w-full py-4 bg-emerald-500 text-black font-bold">进入下一层</button>
          </div>
        )}

        {status === 'FINAL_STATS' && (
          <div className="text-center space-y-6">
            <h2 className="text-4xl font-bold">🏆 传奇黑客</h2>
            <div className="p-4 border border-emerald-500 text-left space-y-2">
              <p>总尝试次数: {allLevelStats.reduce((a, b) => a + b.attempts, 0)}</p>
              <div className="grid grid-cols-5 gap-1 pt-4">
                {allLevelStats.map((s, i) => (
                  <div key={i} className="text-center bg-emerald-900/30 p-1">
                    <div className="text-[10px]">{s.level}位</div>
                    <div className="font-bold">{s.attempts}</div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={startGame} className="w-full py-4 border border-emerald-500 font-bold">重新开始</button>
          </div>
        )}
      </div>

      <p className="text-[8px] text-emerald-900">OFFLINE_LOCAL_BUILD_V1.0</p>
    </div>
  );
};

export default App;
