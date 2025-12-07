import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Cpu, Settings, Terminal, Zap } from 'lucide-react';
import { Button } from './Button';
import { CodeBlock } from './CodeBlock';
import { ServConfig, FpgaResource } from '../types';

const RESOURCE_DATA: FpgaResource[] = [
  { name: 'Lattice iCE40', lut: 198, ff: 164, color: '#3b82f6' },
  { name: 'Intel Cyclone 10LP', lut: 239, ff: 164, color: '#8b5cf6' },
  { name: 'AMD Artix-7', lut: 125, ff: 164, color: '#10b981' },
];

export const ServModule: React.FC = () => {
  const [config, setConfig] = useState<ServConfig>({
    target: 'verilator_tb',
    memsize: 16384,
    compressed: false,
    mdu: false,
    firmware: '$SERV/sw/zephyr_hello.hex',
    baudrate: 57600
  });

  const generateCommand = () => {
    const commands: string[] = [];

    // Prepend library addition if MDU is requested
    if (config.mdu) {
      commands.push("fusesoc library add mdu https://github.com/zeeshanrafique23/mdu");
    }

    let cmd = `fusesoc run --target=${config.target}`;
    if (config.target === 'verilator_tb' || config.target === 'nexys_a7') {
      cmd += ` servant`;
      if (config.baudrate) cmd += ` --uart_baudrate=${config.baudrate}`;
      if (config.firmware) cmd += ` --firmware=${config.firmware}`;
      if (config.memsize) cmd += ` --memsize=${config.memsize}`;
    } else {
      cmd += ` serv`; // lint or synth targets usually target core
    }

    if (config.compressed) cmd += ` --compressed=1`;
    if (config.mdu) cmd += ` --mdu=1`; 

    commands.push(cmd);
    return commands.join('\n');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hero Info */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
              <Cpu size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">SERV: The Bit-Serial RISC-V</h2>
          </div>
          <p className="text-slate-400 mb-4">
            The world's smallest RISC-V CPU. Perfect for when silicon real estate is at a premium.
            Integrates seamlessly with Zephyr RTOS and FuseSoC.
          </p>
          <div className="flex gap-2">
             <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">Award Winning</span>
             <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">Open Source (ISC)</span>
          </div>
        </div>

        {/* Resource Chart */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <Zap size={16} /> FPGA Resource Usage (LUTs)
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={RESOURCE_DATA} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={110} fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
                  itemStyle={{ color: '#f1f5f9' }}
                />
                <Bar dataKey="lut" radius={[0, 4, 4, 0]}>
                  {RESOURCE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Configuration Builder */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex items-center justify-between">
          <h3 className="text-lg font-medium text-white flex items-center gap-2">
            <Terminal size={18} /> FuseSoC Command Builder
          </h3>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Target</label>
              <select 
                value={config.target}
                onChange={(e) => setConfig({...config, target: e.target.value as any})}
                className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="verilator_tb">Verilator Simulation</option>
                <option value="nexys_a7">Nexys A7 FPGA</option>
                <option value="lint">Lint Check</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Memory Size</label>
                <input 
                  type="number"
                  value={config.memsize}
                  onChange={(e) => setConfig({...config, memsize: parseInt(e.target.value)})}
                  className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
               <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Baud Rate</label>
                <input 
                  type="number"
                  value={config.baudrate}
                  onChange={(e) => setConfig({...config, baudrate: parseInt(e.target.value)})}
                  className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Firmware Path</label>
              <input 
                type="text"
                value={config.firmware}
                onChange={(e) => setConfig({...config, firmware: e.target.value})}
                className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={config.compressed}
                  onChange={(e) => setConfig({...config, compressed: e.target.checked})}
                  className="rounded border-slate-600 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-800"
                />
                <span className="text-sm text-slate-300">Compressed Extension</span>
              </label>
               <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={config.mdu}
                  onChange={(e) => setConfig({...config, mdu: e.target.checked})}
                  className="rounded border-slate-600 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-800"
                />
                <span className="text-sm text-slate-300">MDU Support</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col">
             <label className="block text-xs font-medium text-slate-400 mb-1">Generated Command</label>
             <div className="flex-grow">
               <CodeBlock code={generateCommand()} language="bash" />
             </div>
             <p className="text-xs text-slate-500 mt-2">
               Run this command from your SERV workspace after installing FuseSoC.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};