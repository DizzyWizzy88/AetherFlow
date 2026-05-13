import React from 'react';
// Make sure you are importing your login component!
import Login from './components/Login'; 

function App() {
  return (
    // The background color for AetherFlow
    <div className="min-h-screen bg-[#007BFF] flex items-center justify-center">
      <div className="bg-white p-8 rounded-[8px] shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">AetherFlow Login</h1>
        
        {/* THIS is where your buttons and inputs live */}
        <Login /> 
        
      </div>
    </div>
  );
}

export default App;