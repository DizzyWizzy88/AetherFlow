import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(false);

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanPassword) {
      setError('Please enter both a username and password.');
      return;
    }

    // 1. Dev Bypass Handler
    if (cleanUsername.toLowerCase() === 'admin' && cleanPassword === 'password123') {
      localStorage.setItem('token', 'dev-bypass-token');
      localStorage.setItem('userRole', 'System Administrator');
      localStorage.setItem('userName', 'Dev Admin');
      navigate('/dashboard');
      return;
    }

    // 2. Live Railway Production Auth Authentication Pipeline
    setIsLoading(true);
    try {
      const response = await fetch('https://aetherflow-production.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: cleanUsername,
          password: cleanPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Consolidated key names to ensure full backend integration compatibility
        localStorage.setItem('token', data.accessToken || data.token);
        localStorage.setItem('userRole', data.role || 'Warehouse Manager');
        localStorage.setItem('userName', data.username || cleanUsername);
        navigate('/dashboard');
      } else {
        // Catches database mismatches and maps them to your UI error alert banner
        setError(data.message || 'Invalid username or password.');
      }
    } catch (err) {
      console.error('API Connection Error:', err);
      setError('Server connection failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700 text-slate-100 shadow-2xl">
        <CardHeader className="space-y-3 flex flex-col items-center">
          {/* Centered & Enlarged Logo Wrapper Block */}
          <div className="flex flex-col items-center space-y-3 mb-2 w-full">
            <img 
              src="/AetherFlow_Logo.png" 
              alt="AetherFlow Logo" 
              className="h-20 w-20 object-contain drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]"
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
            <span className="text-3xl font-extrabold tracking-widest text-cyan-400">AetherFlow</span>
          </div>
          <CardTitle className="text-xl font-semibold text-center">Cloud Inventory Portal</CardTitle>
          <CardDescription className="text-slate-400 text-center">
            Enter your provisioned security credentials to log in
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {/* Error Notification Alert Box - Dynamically displays auth errors */}
            {error && (
              <div className="p-3 text-sm rounded bg-red-900/50 border border-red-500 text-red-200 animate-pulse">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300" htmlFor="username">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="e.g., Daniel1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="bg-slate-950 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-cyan-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="bg-slate-950 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-cyan-500"
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 rounded bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-900/30"
            >
              {isLoading ? 'Authenticating...' : 'Authenticate'}
            </button>
            
            {/* Admin Provisioning Subtext - Addresses Garrett's Signup Page Question */}
            <div className="text-xs text-center text-slate-500 space-y-1">
              <p>Account registration is restricted for security.</p>
              <p>
                New logistics keys must be issued by a{' '}
                <Badge variant="outline" className="text-[10px] text-cyan-500 border-cyan-500/30 px-1 py-0 bg-transparent">
                  System Administrator
                </Badge>
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}