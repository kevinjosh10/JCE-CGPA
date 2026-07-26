import { useState, useEffect } from 'react';
import { allSemestersSubjects, gradePoints } from './data/curriculum';
import { calculateGPA, calculateCGPA, getSemesterTotalCredits } from './utils/calculator';
import './index.css';

export default function App() {
  const [numSemesters, setNumSemesters] = useState<number>(() => {
    const saved = localStorage.getItem('jce-cgpa-completed-sems');
    return saved ? Math.min(8, Math.max(1, parseInt(saved, 10))) : 2;
  });

  const [grades, setGrades] = useState<Record<number, Record<string, string>>>(() => {
    const savedGrades: Record<number, Record<string, string>> = {};
    for (let i = 1; i <= 8; i++) {
      const savedSem = localStorage.getItem(`jce-cgpa-sem${i}`);
      if (savedSem) {
        try {
          savedGrades[i] = JSON.parse(savedSem);
        } catch {
          savedGrades[i] = {};
        }
      } else {
        savedGrades[i] = {};
      }
    }
    return savedGrades;
  });

  const [userName, setUserName] = useState<string>(() => localStorage.getItem('jce-cgpa-name') || '');
  const [tempName, setTempName] = useState('');
  const [tempSemesters, setTempSemesters] = useState<number>(2);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Save completed semesters count
  useEffect(() => {
    localStorage.setItem('jce-cgpa-completed-sems', numSemesters.toString());
  }, [numSemesters]);

  // Save grades to local storage
  useEffect(() => {
    for (let i = 1; i <= 8; i++) {
      if (grades[i]) {
        localStorage.setItem(`jce-cgpa-sem${i}`, JSON.stringify(grades[i]));
      }
    }
  }, [grades]);

  const handleGradeChange = (semesterNum: number, code: string, value: string) => {
    setGrades(prev => ({
      ...prev,
      [semesterNum]: {
        ...(prev[semesterNum] || {}),
        [code]: value
      }
    }));
  };

  const getProgress = (semesterNum: number) => {
    const subjects = allSemestersSubjects[semesterNum - 1] || [];
    const semGrades = grades[semesterNum] || {};
    const filled = subjects.filter(s => !!semGrades[s.code]).length;
    return subjects.length > 0 ? (filled / subjects.length) * 100 : 0;
  };

  const semesterResults = Array.from({ length: numSemesters }, (_, idx) => {
    const semNum = idx + 1;
    const subjects = allSemestersSubjects[idx];
    const semGrades = grades[semNum] || {};
    const gpa = calculateGPA(subjects, semGrades);
    const totalCredits = getSemesterTotalCredits(subjects);
    return { semNum, gpa, totalCredits };
  });

  const cgpa = calculateCGPA(semesterResults);

  const confirmReset = () => {
    const resetGrades: Record<number, Record<string, string>> = {};
    for (let i = 1; i <= 8; i++) {
      resetGrades[i] = {};
      localStorage.removeItem(`jce-cgpa-sem${i}`);
    }
    setGrades(resetGrades);
    setUserName('');
    setNumSemesters(2);
    localStorage.removeItem('jce-cgpa-name');
    localStorage.removeItem('jce-cgpa-completed-sems');
    setShowResetConfirm(false);
  };

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      setUserName(tempName.trim());
      setNumSemesters(tempSemesters);
      localStorage.setItem('jce-cgpa-name', tempName.trim());
      localStorage.setItem('jce-cgpa-completed-sems', tempSemesters.toString());
    }
  };

  if (!userName) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center font-sans p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full pointer-events-none"></div>
          
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-2xl shadow-lg mx-auto mb-6">
            JCE
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to CGPA Calculator</h1>
          <p className="text-slate-400 mb-6">Enter your details to calculate your GPA & CGPA.</p>
          
          <form onSubmit={handleOnboardingSubmit} className="flex flex-col gap-5 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Your Name</label>
              <input 
                type="text" 
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Completed Semesters</label>
              <select
                value={tempSemesters}
                onChange={e => setTempSemesters(parseInt(e.target.value, 10))}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'Semester' : 'Semesters'}
                  </option>
                ))}
              </select>
            </div>

            <button 
              type="submit"
              className="mt-2 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              Get Started
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-lg shadow-lg">
              JCE
            </div>
            <div>
              <h1 className="font-semibold text-lg sm:text-xl tracking-tight text-white">CGPA Calculator</h1>
              <p className="text-xs text-slate-400">Welcome, {userName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Semester selector drop-down */}
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
              <span className="text-xs text-slate-400">Completed Semesters:</span>
              <select
                value={numSemesters}
                onChange={e => setNumSemesters(parseInt(e.target.value, 10))}
                className="bg-transparent text-xs font-semibold text-white outline-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                  <option key={n} value={n} className="bg-slate-900 text-slate-200">
                    Semesters 1 - {n}
                  </option>
                ))}
              </select>
            </div>

            <button 
              onClick={() => setShowResetConfirm(true)}
              className="text-xs sm:text-sm px-4 py-2 rounded-full bg-slate-800 text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-colors border border-slate-700"
            >
              Reset All
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Subjects Input for Selected Semesters */}
        <div className="flex-1 flex flex-col gap-8">
          {Array.from({ length: numSemesters }, (_, i) => {
            const semNum = i + 1;
            const subjects = allSemestersSubjects[i];
            return (
              <SemesterSection 
                key={semNum}
                title={`Semester ${semNum}`} 
                subjects={subjects} 
                grades={grades[semNum] || {}} 
                onChange={(code: string, val: string) => handleGradeChange(semNum, code, val)}
                progress={getProgress(semNum)}
              />
            );
          })}
        </div>

        {/* Right Column: Sticky Results Dashboard */}
        <div className="w-full lg:w-80">
          <div className="sticky top-28 flex flex-col gap-6">
            
            {/* Real-time Results Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full pointer-events-none"></div>
              
              <h2 className="text-xl font-semibold mb-4 text-white relative z-10">Your Performance</h2>
              
              <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar relative z-10">
                {semesterResults.map(res => (
                  <div key={res.semNum}>
                    <ResultRow 
                      label={`Semester ${res.semNum} GPA`} 
                      value={res.gpa} 
                      totalCredits={res.totalCredits} 
                    />
                    {res.semNum < numSemesters && (
                      <div className="h-px w-full bg-slate-800/50 my-3"></div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700/50 flex flex-col items-center relative z-10">
                <span className="text-sm font-medium text-slate-400 mb-2">{userName}'s Overall CGPA</span>
                <div className={`text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${cgpa !== null ? 'from-blue-400 to-purple-400' : 'from-slate-600 to-slate-500'}`}>
                  {cgpa !== null ? cgpa.toFixed(2) : '-.--'}
                </div>
              </div>
            </div>

            {/* Creator Badge */}
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-5 text-center">
              <p className="text-sm text-slate-400 mb-4">
                Made by <strong className="text-slate-200">Kevin Joshua, CSE</strong>
              </p>
              <div className="flex justify-center gap-3">
                <a href="https://github.com/kevinjosh10" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium transition-colors border border-slate-700 hover:border-slate-600 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/kevin-josh10/" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium transition-colors border border-slate-700 hover:border-slate-600 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  LinkedIn
                </a>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Custom Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowResetConfirm(false)}
          ></div>
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-sm w-full relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-5 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">Reset Calculator</h3>
            <p className="text-slate-400 text-center mb-8 text-sm">
              Are you sure you want to clear all your grades and reset your setup? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors font-medium text-sm border border-slate-700"
              >
                Cancel
              </button>
              <button 
                onClick={confirmReset}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors font-medium text-sm shadow-lg shadow-red-500/25"
              >
                Yes, Reset
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
    <section className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="flex items-center gap-3">
          <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-xs font-semibold text-slate-400 w-12 text-right">{Math.round(progress)}%</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        {subjects.map((sub: any) => (
          <div 
            key={sub.code} 
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 transition-colors group"
          >
            <div className="text-sm sm:text-base font-medium text-slate-200 group-hover:text-white transition-colors flex-1">
              {sub.name} <span className="text-xs text-slate-500 ml-1">({sub.credits} {sub.credits === 1 ? 'credit' : 'credits'})</span>
            </div>
            <div className="w-full sm:w-48 relative">
              <select
                value={grades[sub.code] || ''}
                onChange={e => onChange(sub.code, e.target.value)}
                className="w-full appearance-none bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
              >
                <option value="" disabled>Select Grade</option>
                {Object.keys(gradePoints).map(g => (
                  <option key={g} value={g}>{g === 'S' || g === 'O' ? 'O / S' : g} ({gradePoints[g]})</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">
                ▼
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ResultRow({ label, value, totalCredits }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-slate-300 font-medium text-sm">{label}</span>
        <span className="text-xs text-slate-500">{totalCredits} Credits</span>
      </div>
      <div className="text-xl font-bold text-white">
        {value !== null ? value.toFixed(2) : '-.--'}
      </div>
    </div>
  );
}
