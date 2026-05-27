import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

// Hardcoded Emergency Backup Data Asset Pool
const MOCK_FALLBACK_INVENTORY = [
  { id: 1, sku: 'SKU-AETH-001', name: 'Quantum Core Processor v2', category: 'Hardware', quantity: 14, price: 1249.99 },
  { id: 2, sku: 'SKU-AETH-002', name: 'Optic Fiber Node Array', category: 'Networking', quantity: 3, price: 450.00 },
  { id: 3, sku: 'SKU-AETH-003', name: 'SaaS Gateway Ledger Licence', category: 'Software', quantity: 45, price: 89.95 },
  { id: 4, sku: 'SKU-AETH-004', name: 'Cryo-Cooling Pump Module', category: 'Hardware', quantity: 2, price: 899.00 },
  { id: 5, sku: 'SKU-AETH-005', name: 'Encrypted Solid State Drive 2TB', category: 'Storage', quantity: 22, price: 185.50 }
];

export default function Dashboard() {
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const navigate = useNavigate();

  const currentUserName = localStorage.getItem('userName') || 'Logistics Operator';
  const currentUserRole = localStorage.getItem('userRole') || 'Warehouse Staff';

  // Master fetch function handling both global listing and live query string routing
  const fetchInventoryData = async (query = '') => {
    setIsLoading(true);
    try {
      // Determine target endpoint based on whether a search query exists
      const endpoint = query.trim() 
        ? `https://aetherflow-production.up.railway.app/api/inventory/search?q=${encodeURIComponent(query.trim())}`
        : 'https://aetherflow-production.up.railway.app/api/inventory';

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to synchronize inventory tables.');
      }

      const data = await response.json();
      setInventory(data);
      setUsingFallback(false);
    } catch (err) {
      console.warn('Inventory Sync Error: Falling back to local cache data pool.', err);
      
      // If server fails, handle search filtering entirely on our local backup pool
      if (query.trim()) {
        const filteredMock = MOCK_FALLBACK_INVENTORY.filter(item => 
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.sku.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
        );
        setInventory(filteredMock);
      } else {
        setInventory(MOCK_FALLBACK_INVENTORY);
      }
      setUsingFallback(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger data sync on initial component mount
  useEffect(() => {
    fetchInventoryData();
  }, []);

  // Handle active search inputs using a search button trigger or Enter key submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInventoryData(searchQuery);
  };

  // Clear query and reload master database log
  const handleClearSearch = () => {
    setSearchQuery('');
    fetchInventoryData('');
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      {/* Top App Bar Header Layout */}
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <img src="/AetherFlow_Logo.png" alt="Logo" className="h-8 w-8 object-contain" />
          <div>
            <h1 className="text-xl font-bold text-cyan-400 tracking-wide">AetherFlow Command Panel</h1>
            <p className="text-xs text-slate-400">
              Session Active: <span className="text-slate-200 font-medium">{currentUserName}</span> ({currentUserRole})
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-1.5 text-xs font-medium border border-slate-700 rounded hover:bg-slate-900 hover:text-red-400 transition"
        >
          Disconnect Portal
        </button>
      </header>

      <div className="space-y-6">
        {/* Offline Mode Banner Warning */}
        {usingFallback && (
          <div className="p-3 text-sm rounded bg-amber-950/40 border border-amber-600/60 text-amber-200 flex items-center justify-between">
            <span>⚠️ Live Cloud Server unreachable. Operating out of Local Backup Cache.</span>
            <Badge variant="outline" className="text-amber-400 border-amber-500/30 text-[10px]">Offline Mode</Badge>
          </div>
        )}

        {/* Restored Search Layout Controls Block */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-xl">
          <form onSubmit={handleSearchSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search holdings catalog by descriptor string, SKU, or asset category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-cyan-500 pr-8"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300 text-sm font-bold"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-sm font-medium transition duration-200 shadow-md shadow-cyan-900/20"
            >
              Query Catalog
            </button>
          </form>
        </div>

        {/* Inventory Table Output Card Container */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-semibold tracking-wide">Warehouse Holdings Matrix</CardTitle>
                <p className="text-xs text-slate-400">
                  {usingFallback 
                    ? 'Displaying local system configuration schema records' 
                    : 'Real-time inventory synchronization via cloud data streams'}
                </p>
              </div>
              <Badge className={`border ${usingFallback ? 'bg-amber-950/30 text-amber-400 border-amber-500/30' : 'bg-cyan-900/50 text-cyan-400 border-cyan-500/30'}`}>
                {inventory.length} Matched Logs
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12 text-sm text-slate-400 animate-pulse">
                Running catalog lookups...
              </div>
            ) : inventory.length === 0 ? (
              <div className="text-center py-12 text-sm text-slate-500 space-y-2">
                <p>No active inventory logs found matching your criteria.</p>
                <button 
                  onClick={handleClearSearch} 
                  className="text-xs text-cyan-400 underline hover:text-cyan-300"
                >
                  Reset filtering parameters
                </button>
              </div>
            ) : (
              <div className="border border-slate-800 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-950">
                    <TableRow className="border-b border-slate-800 hover:bg-transparent">
                      <TableHead className="text-slate-400 font-medium w-[120px]">SKU/ISBN</TableHead>
                      <TableHead className="text-slate-400 font-medium">Item Descriptor</TableHead>
                      <TableHead className="text-slate-400 font-medium">Stock Category</TableHead>
                      <TableHead className="text-slate-400 font-medium text-right">Available Qty</TableHead>
                      <TableHead className="text-slate-400 font-medium text-right">Unit Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.map((item) => (
                      <TableRow key={item.id || item.sku} className="border-b border-slate-800 hover:bg-slate-900/40 transition-colors">
                        <TableCell className="font-mono text-cyan-400 text-xs font-semibold">
                          {item.sku || item.isbn || 'N/A'}
                        </TableCell>
                        <TableCell className="font-medium text-slate-200">
                          {item.name || item.title || 'Unknown Asset'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-slate-950 border-slate-800 text-slate-400 text-[11px]">
                            {item.category || 'General'}
                          </Badge>
                        </TableCell>
                        <TableCell className={`text-right font-semibold ${item.quantity <= 5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {item.quantity ?? 0}
                        </TableCell>
                        <TableCell className="text-right font-mono text-slate-300">
                          ${typeof item.price === 'number' ? item.price.toFixed(2) : (parseFloat(item.price) || 0).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}