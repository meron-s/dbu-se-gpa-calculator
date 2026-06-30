import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Download, Upload, Trash2, Keyboard, ShieldAlert, CheckCircle, RefreshCw, Smartphone } from 'lucide-react';

export default function Settings() {
  const {
    theme,
    toggleTheme,
    resetAllData,
    exportBackup,
    importBackup
  } = useApp();

  const [importText, setImportText] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const backupStr = exportBackup();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(backupStr);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `dbu_se_gpa_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerSuccess('Backup file downloaded successfully!');
  };

  const handleImportTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;
    const success = importBackup(importText);
    if (success) {
      setImportText('');
      triggerSuccess('Backup JSON data imported successfully!');
    } else {
      triggerError('Failed to import data. Please verify the JSON format.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importBackup(content);
      if (success) {
        triggerSuccess('Backup file imported successfully!');
      } else {
        triggerError('Failed to parse file. Invalid backup format.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('CRITICAL WARNING: This will permanently delete all your customized grades, course entries, and history. Are you absolutely sure you want to proceed?')) {
      if (window.confirm('FINAL CONFIRMATION: Type OK to wipe everything.')) {
        resetAllData();
        triggerSuccess('All local data wiped successfully.');
      }
    }
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setErrorMsg(null);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    setSuccessMsg(null);
    setTimeout(() => setErrorMsg(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-250">
      {/* Intro */}
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs">
        <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">
          System Control Center
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Configure preferences, inspect offline status, synchronize backups, and manage local storage states securely.
        </p>
      </div>

      {/* Success/Error Alerts */}
      {successMsg && (
        <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 p-4 text-xs font-black text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 p-4 text-xs font-black text-rose-800 dark:text-rose-400 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sync & Backup Panels */}
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
              Backup Synchronization
            </h3>
            <p className="text-xxs text-gray-400 dark:text-gray-500">
              Export your profile as a JSON file or restore from a previous backup
            </p>
          </div>

          <div className="space-y-4">
            {/* Export action */}
            <div className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-800/20 p-4 border border-gray-50 dark:border-gray-850">
              <div>
                <h4 className="text-xs font-black text-gray-800 dark:text-gray-200">Download Backup</h4>
                <p className="text-xxs text-gray-400">Save your entire grade timeline to your device</p>
              </div>
              <button
                onClick={handleExport}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3 text-xs font-bold shadow-xs cursor-pointer transition-all"
              >
                <Download className="h-4 w-4" /> Export JSON
              </button>
            </div>

            {/* Import file upload */}
            <div className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-800/20 p-4 border border-gray-50 dark:border-gray-850">
              <div>
                <h4 className="text-xs font-black text-gray-800 dark:text-gray-200">Upload Backup File</h4>
                <p className="text-xxs text-gray-400">Restore your profile from a downloaded `.json` file</p>
              </div>
              <div>
                <input
                  type="file"
                  accept=".json"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-3 text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer shadow-2xs transition-all"
                >
                  <Upload className="h-4 w-4" /> Select File
                </button>
              </div>
            </div>

            {/* Paste JSON form */}
            <form onSubmit={handleImportTextSubmit} className="space-y-2">
              <label className="block text-xxs font-black uppercase tracking-wider text-gray-400">
                Paste Backup JSON string
              </label>
              <textarea
                placeholder='Paste raw exported JSON contents here (e.g., {"version":"1.0","gradesHistory":...})'
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-3 text-xxs font-mono text-gray-700 dark:text-gray-300 outline-hidden focus:border-blue-500 focus:bg-white"
              />
              <button
                type="submit"
                disabled={!importText.trim()}
                className="w-full h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Import JSON String
              </button>
            </form>
          </div>
        </div>

        {/* Shortcuts & Dangerous Zone */}
        <div className="space-y-6">
          {/* Keyboard shortcuts panel */}
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Keyboard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">
                System Keyboard Shortcuts
              </h3>
            </div>

            <div className="space-y-2.5 text-xxs font-semibold">
              <div className="flex justify-between border-b border-gray-50 dark:border-gray-800/40 pb-1.5 text-gray-500">
                <span>Toggle Course Search Modal</span>
                <span className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 font-mono text-gray-800 dark:text-gray-200">⌘K / Ctrl+K</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 dark:border-gray-800/40 pb-1.5 text-gray-500">
                <span>Undo Last Grade Entry</span>
                <span className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 font-mono text-gray-800 dark:text-gray-200">Ctrl+Z</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 dark:border-gray-800/40 pb-1.5 text-gray-500">
                <span>Close Active Dialog / Overlay</span>
                <span className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 font-mono text-gray-800 dark:text-gray-200">Esc</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Toggle Dark / Light Theme</span>
                <span className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 font-mono text-gray-800 dark:text-gray-200">Alt+T</span>
              </div>
            </div>
          </div>

          {/* Progressive Web App / Offline Info */}
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Offline PWA Availability
              </h3>
            </div>
            <p className="text-xxs text-gray-500 dark:text-gray-400 leading-relaxed">
              This GPA Portal runs as a fully optimized Client-Side Single Page Application (SPA). All your input, grade histories, and custom course adjustments are saved instantly to local browser storage, meaning the app will perform seamlessly offline without requiring active server connections or exposing private grade information to third parties.
            </p>
          </div>

          {/* Dangerous Zone */}
          <div className="rounded-2xl border border-rose-100 dark:border-rose-950 bg-rose-50/50 dark:bg-rose-950/10 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="h-4 w-4" />
              <h3 className="text-xs font-black uppercase tracking-wider">
                Dangerous Action Zone
              </h3>
            </div>
            <p className="text-xxs text-rose-800/80 dark:text-rose-400/80 leading-relaxed mb-4">
              Wiping your local database is irreversible. All of your manually logged course grades, custom courses, and achievement badges will be permanently erased from your browser cache.
            </p>
            <button
              onClick={handleReset}
              className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white px-4 text-xs font-black transition-all cursor-pointer shadow-md shadow-rose-600/10"
            >
              <Trash2 className="h-4 w-4" /> Wipe Local Storage Database
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
