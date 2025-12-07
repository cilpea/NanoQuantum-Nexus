export enum AppTab {
  SERV = 'SERV',
  QISKIT = 'QISKIT',
  AI_CHAT = 'AI_CHAT'
}

export interface FpgaResource {
  name: string;
  lut: number;
  ff: number;
  color: string;
}

export interface ServConfig {
  target: 'verilator_tb' | 'nexys_a7' | 'lint';
  memsize: number;
  compressed: boolean;
  mdu: boolean;
  firmware: string;
  baudrate?: number;
}

export interface QiskitJob {
  id: string;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  result?: string;
  logs: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}