import { useState } from 'react'

const Login = () => {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')

  const handleLogin = () => {
    if (user && pass) {
      alert(`System: Access request received for "${user}". \n\nStatus: UI Validated. \nNext Step: Sprint 2 SQL/JWT Integration.`);
    } else {
      alert("Validation Error: Please enter User Identification and Security Key.");
    }
  }

  return (
    <div 
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      className="bg-gradient-to-br from-blue-700 via-[#007BFF] to-blue-900 p-6"
    >
      
      {/* High-Fidelity Container - I removed the duplicate div that was here */}
      <div className="bg-white/95 backdrop-blur-md p-10 rounded-[8px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-full max-w-md border-t-8 border-[#007BFF] transform transition-all duration-500 hover:scale-[1.01]">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-[#007BFF] tracking-tight">AetherFlow</h1>
          <p className="text-slate-500 text-sm mt-2 uppercase tracking-widest font-semibold">Cloud-Native Inventory</p>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 ml-1 uppercase">User Identification</label>
            <input 
              type="text" 
              placeholder="Username"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-[8px] focus:ring-2 focus:ring-[#007BFF] focus:bg-white outline-none transition-all"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 ml-1 uppercase">Security Key</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-[8px] focus:ring-2 focus:ring-[#007BFF] focus:bg-white outline-none transition-all"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>

          <button 
            type="button" 
            onClick={handleLogin}
            className="w-full bg-[#007BFF] text-white py-4 rounded-[8px] font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 mt-4"
          >
            Authenticate Access
          </button>
        </form>

        <p className="text-center text-[10px] text-slate-400 mt-8 uppercase tracking-widest font-medium">
          Authorized Personnel Only • Encrypted Session
        </p>
      </div>
    </div>
  )
}

export default Login