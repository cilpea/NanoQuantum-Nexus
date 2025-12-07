import React, { useState } from 'react';
import { Cpu, Box, LayoutDashboard, Github, Layers } from 'lucide-react';
import { ServModule } from './components/ServModule';
import { QiskitModule } from './components/QiskitModule';
import { AiChat } from './components/AiChat';
import { AppTab } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.SERV);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 w-full backdrop-blur-lg bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                <Layers size={20} className="text-white" />
              </div>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 hidden sm:block">
                NanoQuantum Nexus
              </span>
            </div>
            
            <div className="flex gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveTab(AppTab.SERV)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === AppTab.SERV 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Cpu size={16} />
                <span>SERV</span>
              </button>
              <button
                onClick={() => setActiveTab(AppTab.QISKIT)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === AppTab.QISKIT 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Box size={16} />
                <span>Qiskit</span>
              </button>
            </div>

            <div className="flex items-center gap-4">
               <a href="#" className="text-slate-400 hover:text-white transition-colors">
                 <Github size={20} />
               </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20">
        
        {/* Dynamic Header */}
        <div className="mb-8">
           <h1 className="text-3xl font-bold text-white mb-2">
             {activeTab === AppTab.SERV ? 'RISC-V Microarchitecture' : 'Quantum Serverless Compute'}
           </h1>
           <p className="text-slate-400 max-w-2xl">
             {activeTab === AppTab.SERV 
                ? 'Configure and simulate the SERV core, the world\'s smallest RISC-V CPU, optimized for FPGA efficiency.'
                : 'Prototype and deploy quantum functions to serverless infrastructure using Qiskit.'
             }
           </p>
        </div>

        {/* Tab Content */}
        {activeTab === AppTab.SERV && <ServModule />}
        {activeTab === AppTab.QISKIT && <QiskitModule />}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2024 NanoQuantum Nexus. Based on SERV (OLOFK) and Qiskit Serverless.</p>
        </div>
      </footer>

      {/* AI Chat Widget */}
      <AiChat />
    </div>
  );
}

export default App;