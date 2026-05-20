
import React, { useState } from 'react';
import logo from '../../assets/AetherFlow_Logo.png';
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real mock stock data conforming to your rigid 8–12 character alphanumeric SKU rules
  const [inventory] = useState([
    { id: 1, sku: 'AETH9821X', name: 'Server Rack Rails 2U', qty: 45, category: 'Hardware', location: 'Aisle 4B' },
    { id: 2, sku: 'AETH1043M', name: 'Cat6 Ethernet Cable 100ft', qty: 8, category: 'Networking', location: 'Aisle 2A' }, // Triggers Crimson Alert
    { id: 3, sku: 'AETH5542L', name: 'Managed PoE Switch 24-Port', qty: 15, category: 'Networking', location: 'Aisle 1A' },
    { id: 4, sku: 'BR129841K', name: 'Rare Edition Logistics Ledger', qty: 3, category: 'Documentation', location: 'Vault A' }  // Triggers Crimson Alert
  ]);

  // AF-103: Real-Time Inventory Search Filter Logic (Evaluates item name or SKU identifier match)
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* Main Content Viewport */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6 overflow-y-auto">
        
        {/* AF-103: Interactive Filtering Control Deck (Card component honors global 8px/rounded-lg variable) */}
        <Card className="border-slate-200/60 shadow-sm rounded-lg">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="relative flex-1">
              <Input 
                type="text" 
                placeholder="Search master catalog by SKU or asset name..." 
                className="w-full pl-4 pr-4 py-2 border-slate-200 focus-visible:ring-2 focus-visible:ring-[#007BFF] rounded-lg font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Hardcoded Aether Blue (#007BFF) Token Override */}
            <button 
              className="text-white font-semibold px-5 py-2 rounded-lg bg-aetherBlue"
            >
              Execute Filter
            </button>
          </CardContent>
        </Card>

        {/* Master Registry Table Module Layout Container */}
        <Card className="border-slate-200/60 shadow-sm overflow-hidden rounded-lg bg-white">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 px-6 py-4">
            <CardTitle className="text-base font-bold text-slate-800">Live Inventory Stock Registry</CardTitle>
          </CardHeader>
          
          <Table>
            <TableHeader className="bg-slate-50/40">
              <TableRow>
                <TableHead className="w-[180px] font-bold text-slate-700 pl-6">SKU Identifier</TableHead>
                <TableHead className="font-bold text-slate-700">Item Description</TableHead>
                <TableHead className="font-bold text-slate-700">Classification</TableHead>
                <TableHead className="font-bold text-slate-700">Stock Velocity Status</TableHead>
                <TableHead className="font-bold text-slate-700 pr-6 text-right">Physical Allocation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-mono font-bold text-slate-900 pl-6 tracking-wide">{item.sku}</TableCell>
                    <TableCell className="font-medium text-slate-800">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-slate-100 text-slate-600 border-none px-2.5 py-0.5 rounded-md font-semibold">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {/* AF-105: Low-Stock Visual Warning System triggers if qty <= 10. Hardcoded Crimson Alert (#D50000) Override */}
                      {item.qty <= 10 ? (
                        <Badge className="bg-crimsonAlert text-white font-bold px-2.5 py-0.5 rounded animate-pulse">
                          CRITICAL LOW ({item.qty})
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2.5 py-0.5 rounded">
                          {item.qty} Optimal
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6 font-semibold text-slate-500">{item.location}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-400 font-medium">
                    No registry items match your active query.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
}