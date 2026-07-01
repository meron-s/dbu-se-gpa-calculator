import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { calculateCGPA, getGraduationClass } from '../utils/gpaUtils';
import { Sparkles, HelpCircle, Sliders, TrendingUp, AlertTriangle, CheckCircle, GraduationCap } from 'lucide-react';

export default function Prediction() {
  const { gradesHistory } = useApp();
  const { cgpa: currentCGPA, completedCredits: currentCredits } = calculateCGPA(gradesHistory);

  // Constants
  const TOTAL_CURRICULUM_CREDITS = 121;
  const remainingCreditsDefault = Math.max(0, TOTAL_CURRICULUM_CREDITS - currentCredits);

  // Simulation inputs
  const [targetCGPA, setTargetCGPA] = useState<number>(() => {
    return currentCGPA > 0 ? Number(Math.min(4.0, currentCGPA + 0.2).toFixed(2)) : 3.5;
  });
  const [customCurrentCGPA, setCustomCurrentCGPA] = useState<number>(currentCGPA || 3.0);
  const [customCurrentCredits, setCustomCurrentCredits] = useState<number>(currentCredits || 60);
  const [customRemainingCredits, setCustomRemainingCredits] = useState<number>(remainingCreditsDefault || 61);

  // Sync inputs with actual values on mount/load
  useEffect(() => {
    if (currentCGPA > 0) {
      setCustomCurrentCGPA(currentCGPA);
      setCustomCurrentCredits(currentCredits);
      setCustomRemainingCredits(remainingCreditsDefault);
    }
  }, [currentCGPA, currentCredits, remainingCreditsDefault]);

  // Sliders for future semesters (e.g., simulating 3 upcoming semesters)
  const [upcomingSem1, setUpcomingSem1] = useState(3.5);
  const [upcomingSem2, setUpcomingSem2] = useState(3.5);
  const [upcomingSem3, setUpcomingSem3] = useState(3.5);

  // Calculations for average target required
  const totalFutureCredits = customRemainingCredits;
  const totalCreditsGrad = customCurrentCredits + totalFutureCredits;
  
  const requiredGPANumerator = (targetCGPA * totalCreditsGrad) - (customCurrentCurrentPoints());
  const requiredGPA = totalFutureCredits > 0 ? requiredGPANumerator / totalFutureCredits : 0;

  function customCurrentCurrentPoints() {
    return customCurrentCGPA * customCurrentCredits;
  }

  // Simulator curve calculation
  const simFutureCredits1 = Math.round(totalFutureCredits / 3) || 15;
  const simFutureCredits2 = Math.round(totalFutureCredits / 3) || 15;
  const simFutureCredits3 = Math.max(0, totalFutureCredits - simFutureCredits1 - simFutureCredits2);

  const simPoints1 = upcomingSem1 * simFutureCredits1;
  const simPoints2 = upcomingSem2 * simFutureCredits2;
  const simPoints3 = upcomingSem3 * simFutureCredits3;

  const simFinalPoints = (customCurrentCGPA * customCurrentCredits) + simPoints1 + simPoints2 + simPoints3;
  const simFinalCredits = customCurrentCredits + simFutureCredits1 + simFutureCredits2 + simFutureCredits3;
  const simFinalCGPA = simFinalCredits > 0 ? Number((simFinalPoints / simFinalCredits).toFixed(2)) : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-250">
      {/* Intro Hero */}
      <div className="rounded-2xl border border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
          <Sparkles className="h-5 w-5 fill-current animate-pulse" />
          <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
            GPA Prediction & Simulation Engine
          </h2>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
          Plan your target graduation classification. Enter your desired CGPA and remaining credits to predict the required average performance, or interactively slide future semester GPAs to view real-time projections.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Core Prediction Math */}
        <div className="rounded-2xl border border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Target CGPA Predictor
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              Calculate requirements to achieve your desired graduation standing
            </p>
          </div>

          <div className="space-y-4">
            {/* Target input slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Desired Graduation CGPA
                </label>
                <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                  {targetCGPA.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="2.0"
                max="4.0"
                step="0.05"
                value={targetCGPA}
                onChange={(e) => setTargetCGPA(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Simulated Inputs toggles */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 bg-slate-50/50 dark:bg-black/20 rounded-xl p-4 border border-slate-100 dark:border-slate-900">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  Current CGPA
                </label>
                <input
                  type="number"
                  min="0"
                  max="4.0"
                  step="0.01"
                  value={customCurrentCGPA}
                  onChange={(e) => setCustomCurrentCGPA(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  Current Credits
                </label>
                <input
                  type="number"
                  min="0"
                  max="121"
                  value={customCurrentCredits}
                  onChange={(e) => setCustomCurrentCredits(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  Remaining Credits
                </label>
                <input
                  type="number"
                  min="0"
                  max="121"
                  value={customRemainingCredits}
                  onChange={(e) => setCustomRemainingCredits(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Prediction Result Alert Panel */}
            <div className="mt-4">
              {requiredGPA > 4.0 ? (
                <div className="rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 p-4 flex gap-3 text-rose-800 dark:text-rose-400">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider">Impossible Target!</h4>
                    <p className="text-[10px] leading-relaxed mt-1">
                      To hit a CGPA of <span className="font-bold">{targetCGPA.toFixed(2)}</span>, you would need an average GPA of <span className="font-bold">{requiredGPA.toFixed(2)}</span> over your remaining {customRemainingCredits} credits, which exceeds the perfect 4.00 limit. Try adjusting to a lower target.
                    </p>
                  </div>
                </div>
              ) : requiredGPA < 2.0 ? (
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 p-4 flex gap-3 text-emerald-800 dark:text-emerald-400">
                  <CheckCircle className="h-5 w-5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider">Target Easily Achievable!</h4>
                    <p className="text-[10px] leading-relaxed mt-1">
                      You are in a phenomenal academic standing! To hit <span className="font-bold">{targetCGPA.toFixed(2)}</span>, you need to average an easily manageable GPA of <span className="font-bold">{Math.max(0, requiredGPA).toFixed(2)}</span> over your remaining credits. Keep up the brilliant momentum!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 p-4 flex gap-3 text-blue-800 dark:text-blue-400">
                  <TrendingUp className="h-5 w-5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider">Target Achievable!</h4>
                    <p className="text-[10px] leading-relaxed mt-1">
                      To secure your target CGPA of <span className="font-bold">{targetCGPA.toFixed(2)}</span>, you need to maintain an average semester GPA of <span className="font-bold">{requiredGPA.toFixed(2)}</span> across your remaining <span className="font-bold">{customRemainingCredits}</span> credits.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sliding Future Semesters Simulator */}
        <div className="rounded-2xl border border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Interactive Future Simulator
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              Drag future semester estimates to preview your ultimate CGPA growth
            </p>
          </div>

          <div className="space-y-5">
            {/* Future semester 1 */}
            <div>
              <div className="flex justify-between items-center text-[10px] mb-1.5 font-bold">
                <span className="text-slate-500">Upcoming Semester A ({simFutureCredits1} credits)</span>
                <span className="font-black text-blue-600 dark:text-blue-400">{upcomingSem1.toFixed(2)} GPA</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="4.0"
                step="0.05"
                value={upcomingSem1}
                onChange={(e) => setUpcomingSem1(Number(e.target.value))}
                className="w-full h-1 bg-slate-100 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Future semester 2 */}
            <div>
              <div className="flex justify-between items-center text-[10px] mb-1.5 font-bold">
                <span className="text-slate-500">Upcoming Semester B ({simFutureCredits2} credits)</span>
                <span className="font-black text-blue-600 dark:text-blue-400">{upcomingSem2.toFixed(2)} GPA</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="4.0"
                step="0.05"
                value={upcomingSem2}
                onChange={(e) => setUpcomingSem2(Number(e.target.value))}
                className="w-full h-1 bg-slate-100 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Future semester 3 */}
            <div>
              <div className="flex justify-between items-center text-[10px] mb-1.5 font-bold">
                <span className="text-slate-500">Upcoming Semester C ({simFutureCredits3} credits)</span>
                <span className="font-black text-blue-600 dark:text-blue-400">{upcomingSem3.toFixed(2)} GPA</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="4.0"
                step="0.05"
                value={upcomingSem3}
                onChange={(e) => setUpcomingSem3(Number(e.target.value))}
                className="w-full h-1 bg-slate-100 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Simulator Output Outcome */}
            <div className="rounded-xl bg-linear-to-b from-blue-900 to-indigo-950 p-5 text-white shadow-lg text-center mt-6">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-200">Simulated Graduation Standing</span>
              <div className="mt-2">
                <span className="text-4xl font-black">{simFinalCGPA.toFixed(2)}</span>
                <p className="text-[10px] font-black text-emerald-300 uppercase tracking-wider mt-1 truncate">
                  {getGraduationClass(simFinalCGPA)}
                </p>
              </div>
              <div className="mt-4 border-t border-white/10 pt-3 text-[10px] text-blue-200 flex justify-around">
                <div>
                  <p>Attempted Credits</p>
                  <p className="font-black text-white text-xs mt-0.5">{simFinalCredits}</p>
                </div>
                <div className="border-l border-white/10 h-6"></div>
                <div>
                  <p>Quality Points</p>
                  <p className="font-black text-white text-xs mt-0.5">{simFinalPoints.toFixed(1)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
