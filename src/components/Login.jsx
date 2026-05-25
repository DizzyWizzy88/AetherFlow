import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // 🛠️ ROBUST DEV BYPASS: Trims spaces and ignores capitalization
    const cleanUser = user.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (cleanUser === 'admin' && cleanPass === 'password123') {
      localStorage.setItem('authToken', 'mock-development-jwt-token');
      navigate('/dashboard');
      return;
    }

    try {
      const response = await fetch('https://aetherflow-production.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user,
          password: pass
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        navigate('/dashboard');
      } else {
        alert(data.message || 'Authentication Failed');
      }
    } catch (error) {
      console.error('API Connection Error:', error);
    }
  };

  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'linear-gradient(to bottom right, #1d4ed8, #007BFF, #1e3a8a)',
        padding: '24px'
      }}
    >
      <div 
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(12px)',
          padding: '40px', 
          borderRadius: '8px', 
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          width: '100%',
          maxWidth: '448px',
          borderTop: '8px solid #007BFF'
        }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          width: '100%', 
          marginBottom: '32px' 
        }}>
          <img 
            src="/AetherFlow_Logo.png"
            alt="AetherFlow Branding" 
            style={{ 
              width: '100%',      
              maxWidth: '280px',  
              height: 'auto', 
              borderRadius: '4px', 
              border: '1px solid #007BFF',
              backgroundColor: '#000'      
            }} 
          />
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={handleLogin}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', marginLeft: '4px', textTransform: 'uppercase' }}>
              User Identification
            </label>
            <input 
              type="text" 
              placeholder="Username"
              required
              style={{ width: '100%', padding: '12px 16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none' }}
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', marginLeft: '4px', textTransform: 'uppercase' }}>
              Security Key
            </label>
            <input 
              type="password" 
              placeholder="••••••••"
              required
              style={{ width: '100%', padding: '12px 16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none' }}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              backgroundColor: '#007BFF', 
              color: 'white', 
              padding: '16px', 
              borderRadius: '8px', 
              fontWeight: '700', 
              border: 'none', 
              cursor: 'pointer',
              marginTop: '16px',
              boxShadow: '0 10px 15px -3px rgba(0, 123, 255, 0.3)'
            }}
          >
            Authenticate Access
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '10px', color: '#94a3b8', marginTop: '32px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '500' }}>
          Authorized Personnel Only • Encrypted Session
        </p>
      </div>
    </div>
  );
};

export default Login;