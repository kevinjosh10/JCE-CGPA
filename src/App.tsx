import { useState, useEffect } from 'react';
import { semester1Subjects, semester2Subjects, gradePoints } from './data/curriculum';
import { calculateGPA, calculateCGPA } from './utils/calculator';
import './index.css';

export default function App() {
  const [gradesSem1, setGradesSem1] = useState<Record<string, string>>({});
  const [gradesSem2, setGradesSem2] = useState<Record<string, string>>({});
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('jce-cgpa-name') || '');
  const [tempName, setTempName] = useState('');
  
  // Load from local storage
  useEffect(() => {
    const saved1 = localStorage.getItem('jce-cgpa-sem1');
    const saved2 = localStorage.getItem('jce-cgpa-sem2');
    if (saved1) setGradesSem1(JSON.parse(saved1));
    if (saved2) setGradesSem2(JSON.parse(saved2));
  }, []);

  // Save to local storage whenever grades change
  useEffect(() => {
    localStorage.setItem('jce-cgpa-sem1', JSON.stringify(gradesSem1));
  }, [gradesSem1]);

  useEffect(() => {
    localStorage.setItem('jce-cgpa-sem2', JSON.stringify(gradesSem2));
  }, [gradesSem2]);

  const sem1GPA = calculateGPA(semester1Subjects, gradesSem1);
  const sem2GPA = calculateGPA(semester2Subjects, gradesSem2);
  const cgpa = calculateCGPA(sem1GPA, sem2GPA);

  const handleGradeChange = (semester: 1 | 2, code: string, value: string) => {
    if (semester === 1) {
      setGradesSem1(prev => ({ ...prev, [code]: value }));
    } else {
      setGradesSem2(prev => ({ ...prev, [code]: value }));
    }
  };

  const getProgress = (semester: 1 | 2) => {
    const subjects = semester === 1 ? semester1Subjects : semester2Subjects;
    const grades = semester === 1 ? gradesSem1 : gradesSem2;
    const filled = subjects.filter(s => !!grades[s.code]).length;
    return (filled / subjects.length) * 100;
  };

  const clearData = () => {
    if (confirm('Are you sure you want to reset all grades and your name?')) {
      setGradesSem1({});
      setGradesSem2({});
      setUserName('');
      localStorage.removeItem('jce-cgpa-sem1');
      localStorage.removeItem('jce-cgpa-sem2');
      localStorage.removeItem('jce-cgpa-name');
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      setUserName(tempName.trim());
      localStorage.setItem('jce-cgpa-name', tempName.trim());
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
          <p className="text-slate-400 mb-8">Please enter your name to continue.</p>
          
          <form onSubmit={handleNameSubmit} className="flex flex-col gap-4">
            <input 
              type="text" 
              value={tempName}
              onChange={e => setTempName(e.target.value)}
              placeholder="e.g. Kevin Joshua"
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-center"
              required
            />
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
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
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-lg shadow-lg">
              JCE
            </div>
            <h1 className="font-semibold text-lg sm:text-xl tracking-tight text-white">CGPA Calculator</h1>
          </div>
          <button 
            onClick={clearData}
            className="text-xs sm:text-sm px-4 py-2 rounded-full bg-slate-800 text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-colors border border-slate-700"
          >
            Reset All
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Subjects Input */}
        <div className="flex-1 flex flex-col gap-8">
          
          <SemesterSection 
            title="Semester 1" 
            subjects={semester1Subjects} 
            grades={gradesSem1} 
            onChange={(code: string, val: string) => handleGradeChange(1, code, val)}
            progress={getProgress(1)}
          />

          <SemesterSection 
            title="Semester 2" 
            subjects={semester2Subjects} 
            grades={gradesSem2} 
            onChange={(code: string, val: string) => handleGradeChange(2, code, val)}
            progress={getProgress(2)}
          />

        </div>

        {/* Right Column: Sticky Results Dashboard */}
        <div className="w-full lg:w-80">
          <div className="sticky top-28 flex flex-col gap-6">
            
            {/* Real-time Results Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full pointer-events-none"></div>
              
              <h2 className="text-xl font-semibold mb-6 text-white relative z-10">Your Performance</h2>
              
              <div className="space-y-6 relative z-10">
                <ResultRow label="Semester 1 GPA" value={sem1GPA} totalCredits={22} />
                <div className="h-px w-full bg-slate-800/50"></div>
                <ResultRow label="Semester 2 GPA" value={sem2GPA} totalCredits={23} />
                
                <div className="mt-8 pt-6 border-t border-slate-700/50 flex flex-col items-center">
                  <span className="text-sm font-medium text-slate-400 mb-2">{userName}'s Overall CGPA</span>
                  <div className={`text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${cgpa !== null ? 'from-blue-400 to-purple-400' : 'from-slate-600 to-slate-500'}`}>
                    {cgpa !== null ? cgpa.toFixed(2) : '-.--'}
                  </div>
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
              {sub.name}
            </div>
            <div className="w-full sm:w-48 relative">
              <select
                value={grades[sub.code] || ''}
                onChange={e => onChange(sub.code, e.target.value)}
                className="w-full appearance-none bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              >
                <option value="" disabled>Select Grade</option>
                {Object.keys(gradePoints).map(g => (
                  <option key={g} value={g}>{g === 'S' || g === 'O' ? 'O / S' : g} ({gradePoints[g]})</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
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
        <span className="text-slate-300 font-medium">{label}</span>
        <span className="text-xs text-slate-500">{totalCredits} Credits</span>
      </div>
      <div className="text-2xl font-bold text-white">
        {value !== null ? value.toFixed(2) : '-.--'}
      </div>
    </div>
  );
}
