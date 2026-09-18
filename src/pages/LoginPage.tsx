import React, { useState } from 'react';
import { useAml } from '../context/AmlContext';
import { Shield, Eye, Lock, Mail, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginDemo } = useAml();

  const [email, setEmail] = useState('investigator@amlens.demo');
  const [password, setPassword] = useState('AMLens@123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginDemo();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Background Decorative Accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-100/60 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md w-full">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/25 mb-4">
            <div className="relative">
              <Shield className="w-9 h-9" />
              <Eye className="w-4 h-4 text-amber-300 absolute top-2.5 left-2.5" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">AMLens</h1>
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
              FC-02
            </span>
          </div>
          <p className="text-sm font-semibold text-blue-700">
            AI-Powered Anti-Money-Laundering Investigation System
          </p>
          <p className="text-xs text-slate-500 font-medium tracking-wide uppercase mt-1">
            Follow the Money. Explain the Risk.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 backdrop-blur-sm">
          
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">Financial Intelligence Portal</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Secure authenticated access for FIU auditors and compliance officers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Investigator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Passcode / Token
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all font-mono"
                />
              </div>
            </div>

            {/* Standard Sign In */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Sign In</span>
            </button>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase">
                Hackathon Live Judging
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* THE CRUCIAL DEMO BUTTON */}
            <button
              type="button"
              onClick={loginDemo}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white text-sm font-extrabold rounded-xl shadow-md shadow-blue-500/25 transition-all transform active:scale-98 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>ENTER DEMO MODE</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* Quick Demo Credentials Reminder */}
          <div className="mt-6 p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900">
            <div className="font-bold flex items-center gap-1.5 text-blue-800 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Judge Quick-Start Credentials Loaded:</span>
            </div>
            <div className="font-mono text-[11px] text-blue-700 space-y-0.5">
              <div>Email: investigator@amlens.demo</div>
              <div>Password: AMLens@123</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6 font-medium">
          AMLens • Problem Statement FC-02 • Prototype using synthetic transaction data
        </p>

      </div>
    </div>
  );
};
