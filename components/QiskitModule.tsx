import React, { useState, useEffect, useCallback } from 'react';
import { Box, Play, UploadCloud, FileCode, CheckCircle2, Clock, XCircle, RotateCw } from 'lucide-react';
import { Button } from './Button';
import { CodeBlock } from './CodeBlock';
import { QiskitJob } from '../types';

const SAMPLE_FUNCTION = `from qiskit import QuantumCircuit
from qiskit.transpiler import generate_preset_pass_manager
from qiskit_ibm_runtime import SamplerV2 as Sampler
from qiskit_ibm_runtime.fake_provider import FakeVigoV2
from qiskit_serverless import save_result

# 1. Bell-state circuit
circuit = QuantumCircuit(2)
circuit.h(0)
circuit.cx(0, 1)
circuit.measure_all()

# 2. Transpile
backend = FakeVigoV2()
pm = generate_preset_pass_manager(backend=backend, optimization_level=1)
isa_circuit = pm.run(circuit)

# 3. Run Sampler
sampler = Sampler(backend)
quasi_dists = sampler.run([isa_circuit]).result()[0].data.meas.get_counts()

save_result(quasi_dists)`;

export const QiskitModule: React.FC = () => {
  const [job, setJob] = useState<QiskitJob | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);

  const runSimulation = useCallback(() => {
    setIsDeploying(true);
    setJob(null);

    // Simulate deploy
    setTimeout(() => {
      setIsDeploying(false);
      const newJob: QiskitJob = {
        id: `job-${Math.random().toString(36).substr(2, 8)}`,
        status: 'QUEUED',
        logs: ['Job submitted to gateway...', 'Waiting for resources...'],
      };
      setJob(newJob);
    }, 1500);
  }, []);

  // Effect to simulate job state progression
  useEffect(() => {
    if (!job || job.status === 'COMPLETED' || job.status === 'FAILED') return;

    const timer = setTimeout(() => {
      setJob(prev => {
        if (!prev) return null;
        if (prev.status === 'QUEUED') {
          return {
            ...prev,
            status: 'RUNNING',
            logs: [...prev.logs, 'Runtime env is setting up.', 'Running function...']
          };
        }
        if (prev.status === 'RUNNING') {
          return {
            ...prev,
            status: 'COMPLETED',
            result: "{'11': 535, '00': 489}",
            logs: [...prev.logs, 'Completed running function.', 'Results saved.']
          };
        }
        return prev;
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [job]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
            <Box size={24} />
          </div>
          <h2 className="text-xl font-bold text-white">Qiskit Serverless Functions</h2>
        </div>
        <p className="text-slate-400">
          Execute quantum workloads remotely without managing infrastructure. Define your function, deploy to the gateway, and retrieve results.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Editor */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden flex flex-col h-[500px]">
          <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-slate-300 font-mono">
              <FileCode size={14} /> function.py
            </span>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="primary" 
                onClick={runSimulation}
                isLoading={isDeploying || (job?.status !== 'COMPLETED' && job !== null)}
                disabled={isDeploying || (job?.status !== 'COMPLETED' && job !== null)}
              >
                {isDeploying ? 'Deploying...' : 'Deploy & Run'}
              </Button>
            </div>
          </div>
          <div className="flex-grow overflow-auto p-0">
            <CodeBlock code={SAMPLE_FUNCTION} language="python" />
          </div>
        </div>

        {/* Execution Status */}
        <div className="flex flex-col gap-4">
           {/* Steps Visualization */}
           <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 backdrop-blur-sm">
              <h3 className="text-sm font-semibold text-slate-300 mb-4">Workflow</h3>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className={`flex flex-col items-center gap-2 ${job ? 'text-green-400' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${job ? 'border-green-500 bg-green-500/20' : 'border-slate-600'}`}>1</div>
                  <span>Upload</span>
                </div>
                <div className="h-0.5 flex-grow bg-slate-700 mx-2"></div>
                <div className={`flex flex-col items-center gap-2 ${job?.status === 'RUNNING' || job?.status === 'COMPLETED' ? 'text-green-400' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${job?.status === 'RUNNING' || job?.status === 'COMPLETED' ? 'border-green-500 bg-green-500/20' : 'border-slate-600'}`}>2</div>
                  <span>Run</span>
                </div>
                <div className="h-0.5 flex-grow bg-slate-700 mx-2"></div>
                 <div className={`flex flex-col items-center gap-2 ${job?.status === 'COMPLETED' ? 'text-green-400' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${job?.status === 'COMPLETED' ? 'border-green-500 bg-green-500/20' : 'border-slate-600'}`}>3</div>
                  <span>Result</span>
                </div>
              </div>
           </div>

           {/* Console / Logs */}
           <div className="bg-black rounded-xl border border-slate-700 flex-grow font-mono text-xs p-4 overflow-y-auto min-h-[250px] shadow-inner">
             {!job && !isDeploying && (
               <div className="h-full flex flex-col items-center justify-center text-slate-600">
                 <Play size={32} className="mb-2 opacity-50" />
                 <p>Ready to deploy function.</p>
               </div>
             )}
             
             {isDeploying && (
               <div className="flex items-center gap-2 text-yellow-500">
                 <UploadCloud size={14} className="animate-bounce" />
                 <span>Uploading function package (function.py)...</span>
               </div>
             )}

             {job && (
               <div className="space-y-2">
                 <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-2">
                    <span className="text-slate-500">JOB ID:</span> 
                    <span className="text-white">{job.id}</span>
                    <span className={`ml-auto px-2 py-0.5 rounded text-[10px] uppercase font-bold
                      ${job.status === 'QUEUED' ? 'bg-yellow-900 text-yellow-200' : 
                        job.status === 'RUNNING' ? 'bg-blue-900 text-blue-200 animate-pulse' : 
                        'bg-green-900 text-green-200'}
                    `}>
                      {job.status}
                    </span>
                 </div>
                 
                 {job.logs.map((log, i) => (
                   <div key={i} className="text-slate-300 flex gap-2">
                     <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
                     {log}
                   </div>
                 ))}

                 {job.status === 'COMPLETED' && (
                   <div className="mt-4 p-3 bg-green-900/20 border border-green-800 rounded">
                     <div className="text-green-400 mb-1 font-bold">Execution Result:</div>
                     <div className="text-green-300">{job.result}</div>
                   </div>
                 )}
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};