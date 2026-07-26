import { useState, useEffect } from 'react';
import { allSemestersSubjects, gradePoints } from './data/curriculum';
import { calculateGPA, calculateCGPA, getSemesterTotalCredits } from './utils/calculator';
import './index.css';

export default function App() {
  const [grades, setGrades] = useState<Array<Record<string, string>>>(() =>
    Array.from({ length: 8 }, () => ({}))
  );
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('jce-cgpa-name') || '');
  const [completedSems, setCompletedSems] = useState<number>(() => {
    const saved = localStorage.getItem('jce-cgpa-sems');
    return saved ? parseInt(saved, 10) : 8;
  });
  const [tempName, setTempName] = useState('');
  const [tempSems, setTempSems] = useState<number>(completedSems);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  // Load from local storage
  useEffect(() => {
    let savedGrades = localStorage.getItem('jce-cgpa-grades');
    const oldSem1 = localStorage.getItem('jce-cgpa-sem1');
    const oldSem2 = localStorage.getItem('jce-cgpa-sem2');

    // Migrate v1 data if present
    if (!savedGrades && (oldSem1 || oldSem2)) {
      const migratedGrades = Array.from({ length: 8 }, () => ({}));
      if (oldSem1) migratedGrades[0] = JSON.parse(oldSem1);
      if (oldSem2) migratedGrades[1] = JSON.parse(oldSem2);
      savedGrades = JSON.stringify(migratedGrades);
      
      localStorage.setItem('jce-cgpa-grades', savedGrades);
      localStorage.removeItem('jce-cgpa-sem1');
      localStorage.removeItem('jce-cgpa-sem2');
    }

    if (savedGrades) {
      setGrades(JSON.parse(savedGrades));
    }
  }, []);

  // Save to local storage whenever grades change
  useEffect(() => {
    localStorage.setItem('jce-cgpa-grades', JSON.stringify(grades));
  }, [grades]);

  const handleGradeChange = (semesterIndex: number, code: string, value: string) => {
    setGrades(prev => {
      const newGrades = [...prev];
      newGrades[semesterIndex] = { ...newGrades[semesterIndex], [code]: value };
      return newGrades;
    });
  };

  const getProgress = (semesterIndex: number) => {
    const subjects = allSemestersSubjects[semesterIndex];
    const semGrades = grades[semesterIndex];
    const requiredSubjects = subjects.filter(s => s.credits > 0);
    const filled = requiredSubjects.filter(s => !!semGrades[s.code]).length;
    return requiredSubjects.length > 0 ? (filled / requiredSubjects.length) * 100 : 100;
  };

  const confirmReset = () => {
    setGrades(Array.from({ length: 8 }, () => ({})));
    setUserName('');
    setCompletedSems(8);
    setTempSems(8);
    localStorage.removeItem('jce-cgpa-grades');
    localStorage.removeItem('jce-cgpa-name');
    localStorage.removeItem('jce-cgpa-sems');
    setShowResetConfirm(false);
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      setUserName(tempName.trim());
      setCompletedSems(tempSems);
      localStorage.setItem('jce-cgpa-name', tempName.trim());
      localStorage.setItem('jce-cgpa-sems', tempSems.toString());
    }
  };

  const semesterResults = Array.from({ length: 8 }).map((_, i) => {
    const subjects = allSemestersSubjects[i];
    const gpa = calculateGPA(subjects, grades[i]);
    return { gpa, totalCredits: getSemesterTotalCredits(subjects) };
  });

  const cgpa = calculateCGPA(semesterResults);

  if (!userName) {
    return (
      <div className="min-h-screen bg-base flex flex-col items-center justify-center font-sans p-4">
        <div className="max-w-sm w-full animate-fade-in-up text-center">
          <div className="w-12 h-12 bg-accent text-base flex items-center justify-center font-bold text-lg rounded-xl mx-auto mb-8 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
            JCE
          </div>
          <h1 className="text-2xl font-semibold text-text-primary mb-2 tracking-tight">Welcome</h1>
          <p className="text-text-secondary mb-10 text-sm">Please enter your name and select how many semesters you have completed.</p>
          
          <form onSubmit={handleNameSubmit} className="flex flex-col gap-4">
            <input 
              type="text" 
              value={tempName}
              onChange={e => setTempName(e.target.value)}
              placeholder="Your Name"
              className="linear-input text-center py-3"
              required
              autoFocus
            />
            <select 
              value={tempSems} 
              onChange={e => setTempSems(Number(e.target.value))}
              className="linear-select text-center py-3 font-medium"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <option key={n} value={n}>{n} {n === 1 ? 'Semester' : 'Semesters'}</option>
              ))}
            </select>
            <button type="submit" className="linear-button py-3 mt-2">
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base flex flex-col">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-base/80 backdrop-blur-xl border-b border-border h-16 flex items-center">
        <div className="max-w-6xl w-full mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-accent text-base flex items-center justify-center font-bold text-xs rounded-md shadow-sm">
              JCE
            </div>
            <h1 className="font-medium text-sm tracking-wide text-text-primary">CGPA Calculator</h1>
          </div>
          <div className="flex items-center gap-5">
            <select 
              value={completedSems}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCompletedSems(val);
                localStorage.setItem('jce-cgpa-sems', val.toString());
              }}
              className="bg-transparent text-text-secondary text-xs font-medium outline-none cursor-pointer hover:text-text-primary transition-colors appearance-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <option key={n} value={n} className="bg-surface text-text-primary">
                  {n} {n === 1 ? 'Semester' : 'Semesters'} ▼
                </option>
              ))}
            </select>
            <button 
              onClick={() => setShowResetConfirm(true)}
              className="text-xs font-medium text-text-secondary hover:text-red-400 transition-colors"
            >
              Reset Data
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 flex flex-col lg:flex-row gap-10">
        
        {/* Left Column: Subjects Input */}
        <div className="flex-1 flex flex-col gap-6 h-[calc(100vh-100px)] overflow-y-auto pr-4 custom-scrollbar pb-10">
          <div className="animate-fade-in-up mb-2">
            <h2 className="text-2xl font-semibold text-text-primary tracking-tight">Academic Record</h2>
            <p className="text-text-secondary text-sm mt-1">Enter your grades to calculate your performance.</p>
          </div>
          
          {allSemestersSubjects.slice(0, completedSems).map((subjects, i) => (
            <div key={`sem-${i}`} className={`animate-fade-in-up delay-${Math.min(i * 100, 700)}`}>
              <SemesterSection 
                title={`Semester ${i + 1}`}
                subjects={subjects} 
                grades={grades[i]} 
                onChange={(code: string, val: string) => handleGradeChange(i, code, val)}
                progress={getProgress(i)}
              />
            </div>
          ))}
        </div>

        {/* Right Column: Sticky Results Dashboard */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="sticky top-24 flex flex-col gap-6">
            
            {/* Real-time Results Card */}
            <div className={`linear-card p-6 ${cgpa !== null ? 'animate-pulse-glow border-accent/30' : ''}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wider">{userName}'s CGPA</h2>
              </div>
              
              <div className="flex flex-col items-center justify-center py-6">
                <div key={cgpa} className="text-6xl font-semibold text-text-primary tracking-tighter animate-number-pop">
                  {cgpa !== null ? cgpa.toFixed(2) : '-.--'}
                </div>
                <div className="text-xs text-text-secondary mt-3">Cumulative Grade Point Average</div>
              </div>

              <div className="h-px w-full bg-border my-6"></div>
              
              <div className="max-h-52 overflow-y-auto pr-3 space-y-4 custom-scrollbar">
                {semesterResults.slice(0, completedSems).map((res, i) => (
                  <ResultRow key={`res-${i}`} label={`Sem ${i + 1}`} value={res.gpa} />
                ))}
              </div>
            </div>

            {/* Creator Badge */}
            <div className="flex items-center justify-between text-xs text-text-secondary px-2">
              <span>Made by <span className="text-text-primary font-medium">Kevin Joshua, CSE</span></span>
              <div className="flex gap-3">
                <a href="https://github.com/kevinjosh10" target="_blank" rel="noreferrer" className="hover:text-text-primary transition-colors">GitHub</a>
                <a href="https://www.linkedin.com/in/kevin-josh10/" target="_blank" rel="noreferrer" className="hover:text-text-primary transition-colors">LinkedIn</a>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Custom Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-base/80 backdrop-blur-sm animate-scale-in"
            onClick={() => setShowResetConfirm(false)}
            style={{ animationDuration: '0.2s' }}
          ></div>
          <div className="bg-surface border border-border rounded-xl p-6 max-w-sm w-full relative z-10 shadow-2xl animate-scale-in">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Reset everything?</h3>
            <p className="text-text-secondary text-sm mb-6">
              This will permanently delete all entered grades and your name. You cannot undo this action.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowResetConfirm(false)}
                className="linear-button-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={confirmReset}
                className="bg-red-500/10 text-red-500 border border-red-500/20 font-medium text-sm px-4 py-2 rounded-md hover:bg-red-500 hover:text-white transition-all active:scale-[0.98]"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-components

function SemesterSection({ title, subjects, grades, onChange, progress }: any) {
  return (
    <section className="linear-card overflow-hidden group">
      <div className="bg-surface-hover px-5 py-4 flex items-center justify-between border-b border-border transition-colors">
        <h3 className="font-medium text-sm text-text-primary">{title}</h3>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-medium text-text-secondary uppercase tracking-wider">{Math.round(progress)}% Filled</span>
          <div className="w-16 h-1.5 bg-base rounded-full overflow-hidden">
            <div 
              className="h-full bg-text-primary transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col divide-y divide-border/50">
        {subjects.map((sub: any) => (
          <div 
            key={sub.code} 
            className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-surface-hover/50 transition-colors"
          >
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[10px] font-mono text-text-secondary">{sub.code}</span>
              <span className="text-xs sm:text-sm font-medium text-text-primary truncate" title={sub.name}>
                {sub.name}
              </span>
              <span className="text-[10px] text-text-secondary">{sub.credits > 0 ? `${sub.credits} Credits` : 'Non-Credit'}</span>
            </div>
            
            <div className="w-32 shrink-0 relative">
              <select
                value={grades[sub.code] || ''}
                onChange={e => onChange(sub.code, e.target.value)}
                className="linear-select"
              >
                <option value="" disabled>Grade</option>
                {Object.keys(gradePoints).map(g => (
                  <option key={g} value={g}>{g === 'S' || g === 'O' ? 'O / S' : g} ({gradePoints[g]})</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary text-[10px]">
                ▼
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ResultRow({ label, value }: any) {
  return (
    <div className="flex items-center justify-between py-1 group">
      <span className="text-xs font-medium text-text-secondary group-hover:text-text-primary transition-colors">{label}</span>
      <div className="text-sm font-semibold text-text-primary">
        {value !== null ? value.toFixed(2) : '-'}
      </div>
    </div>
  );
}
