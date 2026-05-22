import React, { useState } from 'react';
import logo from '../../assets/AetherFlow_Logo.png';
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for tracking inventory items
  const [inventory, setInventory] = useState([
    { id: 1, sku: 'AETH9821X', name: 'Server Rack Rails 2U', qty: 45, category: 'Hardware', location: 'Aisle 4B' },
    { id: 2, sku: 'AETH1043M', name: 'Cat6 Ethernet Cable 100ft', qty: 8, category: 'Networking', location: 'Aisle 2A' }, 
    { id: 3, sku: 'AETH5542L', name: 'Managed PoE Switch 24-Port', qty: 15, category: 'Networking', location: 'Aisle 1A' },
    { id: 4, sku: 'BR129841K', name: 'Rare Edition Logistics Ledger', qty: 3, category: 'Documentation', location: 'Vault A' }
  ]);

  // Form State for User Story AF-106 (Adding New Catalog Items)
  const [newItemName, setNewItemName] = useState('');
  const [newItemSku, setNewItemSku] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemLocation, setNewItemLocation] = useState('');

  // AF-103: Real-Time Inventory Search Filter Logic
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Frontend Submission Handler preparing the structure for Garrett's validation & Nathan's SQL pipelines
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName || !newItemSku || !newItemQty) return;

    const newAsset = {
      id: inventory.length + 1,
      sku: newItemSku.toUpperCase().trim(),
      name: newItemName.trim(),
      category: newItemCategory.trim() || 'Unclassified',
      qty: parseInt(newItemQty, 10),
      location: newItemLocation.trim() || 'Receiving Dock'
    };

    setInventory([...inventory, newAsset]);

    // Reset Form fields
    setNewItemName('');
    setNewItemSku('');
    setNewItemCategory('');
    setNewItemQty('');
    setNewItemLocation('');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans antialiased flex flex-col">
      {/* Navigation Header */}
      <header className="w-full border-b bg-white px-8 py-4 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="AetherFlow Logo" className="h-9 w-auto object-contain" />
          <div className="h-6 w-px bg-slate-200" />
          <span className="text-lg font-semibold tracking-tight text-slate-900">AetherFlow Core Hub</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Daniel Rhoads (UI/UX Lead)
        </div>
      </header>

      {/* Main Content Layout Grid */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto">
        
        {/* Left Column: Operations Desk (Search & Add Forms) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* AF-103: Interactive Filtering Deck */}
          <Card className="border-slate-200/60 shadow-sm rounded-lg bg-white">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 px-5 py-3">
              <CardTitle className="text-sm font-bold text-slate-700">Catalog Search Desk</CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="relative w-full">
                <Input 
                  type="text" 
                  placeholder="Search by SKU or name..." 
                  className="w-full border-slate-200 focus-visible:ring-2 focus-visible:ring-[#007BFF] rounded-lg font-medium text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* AF-106: Add New Item Catalog Intake Form Layout */}
          <Card className="border-slate-200/60 shadow-sm rounded-lg bg-white">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 px-5 py-3">
              <CardTitle className="text-sm font-bold text-slate-700">Catalog Registry Intake</CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <form onSubmit={handleAddItem} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Asset Description</label>
                  <Input 
                    type="text" 
                    placeholder="e.g. Cisco Edge Router 4000" 
                    required
                    className="border-slate-200 text-sm font-medium"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">SKU Alpha-Identifier</label>
                  <Input 
                    type="text" 
                    placeholder="e.g. AETH8491M" 
                    required
                    className="border-slate-200 font-mono text-sm font-bold"
                    value={newItemSku}
                    onChange={(e) => setNewItemSku(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Initial Count</label>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      required
                      className="border-slate-200 text-sm font-medium"
                      value={newItemQty}
                      onChange={(e) => setNewItemQty(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Classification</label>
                    <Input 
                      type="text" 
                      placeholder="e.g. Hardware" 
                      className="border-slate-200 text-sm font-medium"
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Physical Warehouse Slot</label>
                  <Input 
                    type="text" 
                    placeholder="e.g. Aisle 3C" 
                    className="border-slate-200 text-sm font-medium"
                    value={newItemLocation}
                    onChange={(e) => setNewItemLocation(e.target.value)}
                  />
                </div>

                <button 
                  type="submit"
                  style={{ backgroundColor: '#007BFF' }}
                  className="w-full text-white font-bold py-2.5 px-4 rounded-lg text-sm mt-2 shadow-sm transition-opacity hover:opacity-90"
                >
                  Commit to Catalog Registry
                </button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Master Registry Ledger */}
        <div className="lg:col-span-2">
          <Card className="border-slate-200/60 shadow-sm overflow-hidden rounded-lg bg-white">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 px-6 py-4">
              <CardTitle className="text-base font-bold text-slate-800">Live Inventory Stock Registry</CardTitle>
            </CardHeader>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/40">
                  <TableRow>
                    <TableHead className="w-[150px] font-bold text-slate-700 pl-6">SKU Identifier</TableHead>
                    <TableHead className="font-bold text-slate-700">Item Description</TableHead>
                    <TableHead className="font-bold text-slate-700">Classification</TableHead>
                    <TableHead className="font-bold text-slate-700">Stock Velocity</TableHead>
                    <TableHead className="font-bold text-slate-700 pr-6 text-right">Allocation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.length > 0 ? (
                    filteredInventory.map((item) => (
                      <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="font-mono font-bold text-slate-900 pl-6 tracking-wide text-xs">{item.sku}</TableCell>
                        <TableCell className="font-medium text-slate-800 text-sm">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-slate-100 text-slate-600 border-none px-2.5 py-0.5 rounded-md font-semibold text-xs">
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {/* AF-105: Low-Stock Visual Warning System executing explicit inline hex style rules */}
                          {item.qty <= 10 ? (
                            <Badge 
                              style={{ backgroundColor: '#D50000' }} 
                              className="text-white font-bold px-2.5 py-0.5 rounded animate-pulse text-xs border-none"
                            >
                              CRITICAL LOW ({item.qty})
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2.5 py-0.5 rounded text-xs">
                              {item.qty} Optimal
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right pr-6 font-semibold text-slate-500 text-sm">{item.location}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-slate-400 font-medium text-sm">
                        No registry items match your active query.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}