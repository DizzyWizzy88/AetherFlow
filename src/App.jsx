import React from 'react';
import Login from './components/Login'; 

function App() {
  return (
    // This keeps the Aether Blue background and centers the login box
    <div className="min-h-screen bg-[#007BFF] flex items-center justify-center">
        {/* We removed the extra H1 and div here to prevent doubling up */}
        <Login /> 
    </div>
  );
}

export default App;