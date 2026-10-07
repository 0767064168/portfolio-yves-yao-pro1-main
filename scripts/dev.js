import { spawn } from 'node:child_process';

const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error('npm_execpath est introuvable. Lancez ce script avec npm run dev.');

const processes = [
  ['run', 'dev', '--workspace', 'server'],
  ['run', 'dev', '--workspace', 'client']
].map((args) => spawn(process.execPath, [npmCli, ...args], { stdio: 'inherit' }));
let stopping = false;

function stopAll(signal = 'SIGTERM') {
  if (stopping) return;
  stopping = true;
  processes.forEach((child) => {
    if (child.exitCode === null) child.kill(signal);
  });
}

processes.forEach((child) => child.on('exit', (code) => {
  if (!stopping) {
    process.exitCode = code || 0;
    stopAll();
  }
}));
process.on('SIGINT', () => stopAll('SIGINT'));
process.on('SIGTERM', () => stopAll('SIGTERM'));
