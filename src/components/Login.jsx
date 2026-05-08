import { useState } from 'react'

const Login = () => {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')

  return (
    <div className="min-h-screen bg-cloud-gray flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-aether shadow-2xl w-full max-w-md border-t-8 border-aether-blue">
        <h1 className="text-4xl font-black text-aether-blue text-center mb-6">AetherFlow</h1>
        <form className="space-y-4">
          <input 
            type="text" 
            placeholder="User Identification"
            className="w-full px-4 py-3 border border-slate-200 rounded-aether focus:ring-2 focus:ring-aether-blue outline-none"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Security Key"
            className="w-full px-4 py-3 border border-slate-200 rounded-aether focus:ring-2 focus:ring-aether-blue outline-none"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <button type="button" className="w-full bg-aether-blue text-white py-4 rounded-aether font-bold hover:bg-blue-800 transition-all shadow-lg">
            Authenticate Access
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login