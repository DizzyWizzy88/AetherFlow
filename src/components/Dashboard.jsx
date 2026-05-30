import React, { useState, useMemo } from 'react';

const initialInventory = [
  { id: 1, name: 'Quantum Core Processor v2', sku: 'SKU-AETH-001', quantity: 14, price: 1249.99, category: 'Hardware' },
  { id: 2, name: 'Optic Fiber Node Array', sku: 'SKU-AETH-002', quantity: 3, price: 450.00, category: 'Networking' },
  { id: 3, name: 'SaaS Gateway Ledger Licence', sku: 'SKU-AETH-003', quantity: 45, price: 89.95, category: 'Software' },
  { id: 4, name: 'Cryo-Cooling Pump Module', sku: 'SKU-AETH-004', quantity: 2, price: 899.00, category: 'Hardware' },
];

export default function Dashboard() {
  const [inventory, setInventory] = useState(initialInventory);
  const [searchQuery, setSearchQuery] = useState('');
  const [usingFallback, setUsingFallback] = useState(true); // Matches your old layout state
  
  // ROLE STATE: 'admin' (your old look) or 'manager' (your new look)
  const [currentRole, setCurrentRole] = useState('manager');

  const [logs, setLogs] = useState([
    { timestamp: new Date().toLocaleTimeString(), message: '[AUTH]: Session active for logistics operator.', type: 'auth' }
  ]);

  const addLog = (message, type = 'system') => {
    const newLog = { timestamp: new Date().toLocaleTimeString(), message, type };
    setLogs((prevLogs) => [newLog, ...prevLogs.slice(0, 14)]);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      addLog(`[FILTER]: Filtering active matrix array for sequence: "${value.trim()}"`, 'filter');
    }
  };

  const analytics = useMemo(() => {
    const totalSkus = inventory.length;
    const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const lowStockTriggers = inventory.filter(item => item.quantity <= 5).length;
    return { totalSkus, totalValue, lowStockTriggers };
  }, [inventory]);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      
      {/* TOP CONTROL PANEL BANNER */}
      <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg mb-6 flex justify-between items-center text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Active Security Context:</span>
          <span className={`font-bold px-2 py-0.5 rounded ${currentRole === 'admin' ? 'bg-purple-950 text-purple-400 border border-purple-800' : 'bg-cyan-950 text-cyan-400 border border-cyan-800'}`}>
            {currentRole === 'admin' ? 'System Administrator' : 'Warehouse Manager'}
          </span>
        </div>
        <button 
          onClick={() => {
            const nextRole = currentRole === 'admin' ? 'manager' : 'admin';
            setCurrentRole(nextRole);
            addLog(`[AUTH]: Context switched to internal level: ${nextRole.toUpperCase()}`, 'auth');
          }}
          className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-3 py-1.5 rounded transition-all"
        >
          Toggle to {currentRole === 'admin' ? 'Warehouse View' : 'Admin View'}
        </button>
      </div>

      {/* HEADER BAR */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-slate-800 gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-slate-900 border border-slate-800 rounded-lg p-2 flex items-center justify-center overflow-hidden shadow-inner">
            <img src="/AetherFlow_Logo.png" alt="AetherFlow Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-wide">AetherFlow Command Panel</h1>
            <p className="text-sm text-slate-400 mt-1">
              {currentRole === 'admin' ? 'Session Active: Dev Admin (System Administrator)' : 'Session Active: Logistics Operator (Warehouse Manager)'}
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => setUsingFallback(!usingFallback)}
          className={`text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${usingFallback ? 'bg-amber-950/40 border-amber-800 text-amber-400' : 'bg-cyan-950/40 border-cyan-800 text-cyan-400'}`}
        >
          {usingFallback ? 'Offline Mode Active' : 'Portal Connected'}
        </button>
      </header>

      {/* OLD SYSTEM ADMIN ALERT BANNER (Conditionally shown if Admin role is selected) */}
      {currentRole === 'admin' && usingFallback && (
        <div className="bg-amber-950/20 border border-amber-900 text-amber-500 p-4 rounded-lg mb-6 flex justify-between items-center text-sm transition-all duration-300">
          <div className="flex items-center gap-2">
            <span>⚠️ Live Cloud Server unreachable. Operating out of Local Backup Cache.</span>
          </div>
          <span className="bg-amber-900/40 text-xs px-2 py-0.5 rounded font-mono uppercase font-bold text-amber-400">Offline Mode</span>
        </div>
      )}

      {/* NEW WAREHOUSE MANAGER METRIC STRIP (Only renders for the Warehouse view) */}
      {currentRole === 'manager' && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-lg flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Monitored Holdings</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-white">{analytics.totalSkus}</span>
              <span className="text-xs text-slate-500">Active SKUs</span>
            </div>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-lg flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Total Value Encumbered</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xs font-semibold text-cyan-400">$</span>
              <span className="text-3xl font-bold text-white">{analytics.totalValue.toFixed(2)}</span>
            </div>
          </div>
          <div className={`bg-slate-900/40 border p-4 rounded-lg flex flex-col justify-between transition-colors duration-300 ${analytics.lowStockTriggers > 0 ? 'border-rose-900/50 bg-rose-950/5' : 'border-slate-800'}`}>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Low-Volume Triggers</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-3xl font-bold ${analytics.lowStockTriggers > 0 ? 'text-red-500' : 'text-white'}`}>{analytics.lowStockTriggers}</span>
              <span className="text-xs text-slate-500">Critical Alerts</span>
            </div>
          </div>
        </section>
      )}

      {/* CORE WORKSPACE GRID */}
      <section className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* MATRIX GRID TABLE CONTAINER */}
        <div className="xl:col-span-3 bg-slate-900/20 border border-slate-900 p-6 rounded-lg">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Search holdings catalog by descriptor string, SKU, or asset category..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
            />
            <button className="bg-cyan-700 hover:bg-cyan-600 text-white font-semibold text-sm px-4 rounded-lg transition-all whitespace-nowrap">
              Query Catalog
            </button>
          </div>

          <div className="overflow-x-auto">
            <h2 className="text-lg font-bold text-white mb-1">Warehouse Holdings Matrix</h2>
            <p className="text-xs text-slate-400 mb-4">Displaying local system configuration schema records</p>
            <table className="w-full text-left text-sm text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider bg-slate-900/50">
                  <th className="py-3 px-4">SKU/ISBN</th>
                  <th className="py-3 px-4">Item Descriptor</th>
                  <th className="py-3 px-4">Stock Category</th>
                  <th className="py-3 px-4 text-right">Available Qty</th>
                  <th className="py-3 px-4 text-right">Unit Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredInventory.length > 0 ? (
                  filteredInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-xs text-cyan-400">{item.sku}</td>
                      <td className="py-3.5 px-4 font-medium text-white">{item.name}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-xs text-slate-400">
                          {item.category}
                        </span>
                      </td>
                      <td className={`py-3.5 px-4 text-right font-mono font-bold ${item.quantity <= 5 ? 'text-red-500' : 'text-emerald-400'}`}>
                        {item.quantity}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono">${item.price.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-slate-500 italic">No inventory nodes match current search parameters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* INTERACTIVE LOG STREAM TERMINAL */}
        <div className="xl:col-span-1 flex flex-col h-full min-h-[350px] bg-slate-900/80 border border-slate-800 rounded-lg overflow-hidden font-mono text-xs">
          <div className="bg-slate-950 border-b border-slate-800 px-4 py-2.5 flex justify-between items-center">
            <span className="text-slate-400 font-bold tracking-wider uppercase text-[10px]">AetherFlow Real-Time Event Stream</span>
            <span className="bg-amber-950 text-amber-500 font-bold px-1.5 py-0.5 rounded text-[10px]">{filteredInventory.length} Matched Logs</span>
          </div>
          <div className="p-4 overflow-y-auto flex-1 flex flex-col-reverse gap-2.5">
            {logs.map((log, idx) => (
              <div key={idx} className="leading-relaxed border-l-2 pl-2 border-slate-800">
                <span className="text-slate-600 mr-2 font-sans">[{log.timestamp}]</span>
                <span className={log.type === 'warning' ? 'text-amber-400' : log.type === 'success' ? 'text-emerald-400' : log.type === 'filter' ? 'text-cyan-400' : 'text-slate-300'}>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
}