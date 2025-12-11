import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ShieldCheck, UserCircle, KeyRound, Mail, Lock } from 'lucide-react';
import { login, register } from '../services/auth';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Get return url or default to home
  const from = location.state?.from?.pathname || '/directory';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const user = login(email, password);
      if (user) {
        if (user.role === 'ADMIN') navigate('/admin/dashboard');
        else if (user.role === 'PARTNER') navigate('/partner/dashboard');
        else navigate(from);
      } else {
        setError('Invalid credentials.');
      }
    } else {
      if (name && email && password) {
        register(name, email, password);
        navigate(from);
      } else {
        setError('Please fill all fields.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 py-12">
      <Link to="/" className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-white tracking-widest">PPOTH</h1>
      </Link>
      
      <div className="bg-white max-w-md w-full rounded-xl shadow-2xl overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button 
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider ${isLogin ? 'bg-white text-hamptons-navy' : 'bg-gray-50 text-gray-400'}`}
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            Sign In
          </button>
          <button 
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider ${!isLogin ? 'bg-white text-hamptons-navy' : 'bg-gray-50 text-gray-400'}`}
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            Register
          </button>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif font-bold text-hamptons-navy mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-500 text-sm">
              {isLogin ? 'Access your account or dashboard.' : 'Join the exclusive community.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <UserCircle className="h-4 w-4 text-gray-400" />
                   </div>
                   <input
                     type="text"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-hamptons-navy focus:border-hamptons-navy text-gray-900 bg-white text-sm"
                     placeholder="John Doe"
                   />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Mail className="h-4 w-4 text-gray-400" />
                 </div>
                 <input
                   type="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-hamptons-navy focus:border-hamptons-navy text-gray-900 bg-white text-sm"
                   placeholder="name@example.com"
                 />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Lock className="h-4 w-4 text-gray-400" />
                 </div>
                 <input
                   type="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-hamptons-navy focus:border-hamptons-navy text-gray-900 bg-white text-sm"
                   placeholder="••••••••"
                 />
              </div>
            </div>

            {error && <div className="text-red-600 text-xs text-center bg-red-50 p-2 rounded">{error}</div>}

            <button type="submit" className="w-full bg-hamptons-navy text-white py-3 rounded font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors shadow-lg text-sm mt-4">
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
          
          {isLogin && (
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">
                Partner or Admin? Use your credentials above.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};