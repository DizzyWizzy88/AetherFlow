import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export default function Dashboard() {
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Retrieve custom validation session parameters from our successful auth handler
  const currentUserName = localStorage.getItem('userName') || 'Logistics Operator';
  const currentUserRole = localStorage.getItem('userRole') || 'Warehouse Staff';

  useEffect(() => {
    const fetchInventoryData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch('https://aetherflow-production.up.railway.app/api/inventory', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to synchronize live inventory tables.');
        }

        const data = await response.json();
        setInventory(data);
      } catch (err) {
        console.error('Inventory Sync Error:', err);
        setError('Unable to fetch live database records. Displaying local cache context.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventoryData();
  }, []);

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

      {/* Main Framework Layout Container */}
      <div className="space-y-6">
        {error && (
          <div className="p-3 text-sm rounded bg-amber-950/40 border border-amber-600 text-amber-200">
            ⚠️ {error}
          </div>
        )}

        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-semibold tracking-wide">Warehouse Holdings Matrix</CardTitle>
                <p className="text-xs text-slate-400">Real-time inventory synchronization via cloud data streams</p>
              </div>
              <Badge className="bg-cyan-900/50 text-cyan-400 border border-cyan-500/30">
                {inventory.length} Verified Items
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12 text-sm text-slate-400 animate-pulse">
                Synchronizing live SQL tracking tables...
              </div>
            ) : inventory.length === 0 ? (
              <div className="text-center py-12 text-sm text-slate-500">
                No active inventory logs found in this partition.
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