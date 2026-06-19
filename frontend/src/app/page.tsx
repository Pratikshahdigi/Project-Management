"use client";

import { useState } from 'react';
import { Shield, Sparkles, KeyRound, Mail, AlertCircle } from 'lucide-react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Invalid email or password');
      }

      const data = await response.json();
      
      // Store real token and user properties
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);
      localStorage.setItem('user_role', data.user.role);
      localStorage.setItem('user_email', data.user.email);
      localStorage.setItem('user_name', `${data.user.firstName} ${data.user.lastName}`);
      localStorage.setItem('tenant_id', data.user.tenantId);

      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Connecting to backend failed. Make sure backend on port 3001 is active.');
      setLoading(false);
    }
  };

  const fillCredentials = (mEmail: string, mPass: string) => {
    setEmail(mEmail);
    setPassword(mPass);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#07070a] overflow-hidden px-4">
      {/* Decorative background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#8b5cf6] rounded-full blur-[160px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#10b981] rounded-full blur-[160px] opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      <div className="z-10 max-w-4xl text-center flex flex-col items-center w-full">
        {/* Sparkles header badge */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full glass-panel text-xs text-[#a78bfa] mb-6 border-zinc-800 shadow-glow-violet glow-animation">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Connected to Live API Server (Port 3001)</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-50 via-zinc-200 to-zinc-400 mb-4 font-sans leading-none">
          AGENCY OPERATING SYSTEM
        </h1>
        <p className="max-w-2xl text-zinc-400 text-xs md:text-sm mb-8 leading-relaxed">
          Log in using your registered credentials. The system routes access controls dynamically, shielding departmental data assets based on your assigned role.
        </p>

        <div className="w-full max-w-md mx-auto items-start">
          
          {/* Form Login Card */}
          <div className="glass-panel rounded-2xl p-6 md:p-8 border border-glassBorder shadow-2xl relative text-left bg-glass-grad">
            <div className="absolute top-4 right-4 text-[10px] text-zinc-500 flex items-center space-x-1">
              <Shield className="w-3 h-3 text-[#10b981]" />
              <span>OWASP Shield Active</span>
            </div>

            <h3 className="text-lg font-bold text-zinc-200 mb-6">Secure Portal Login</h3>

            {error && (
              <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 text-xs text-rose-400 flex items-start space-x-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@agency.com"
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl py-2.5 pl-10 pr-4 text-xs text-zinc-200 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Secret Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl py-2.5 pl-10 pr-4 text-xs text-zinc-200 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              <button
                id="btn-login-submit"
                type="submit"
                disabled={loading}
                className="w-full bg-violet-600 hover:bg-violet-750 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-glow-violet flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Authenticate Session</span>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>

      <div className="mt-16 text-[10px] text-zinc-600 flex items-center space-x-1.5 z-10">
        <span>© 2026 Agency OS Inc.</span>
        <span>•</span>
        <span>JWT session rotation</span>
        <span>•</span>
        <span>Local Database Vault</span>
      </div>
    </div>
  );
}
