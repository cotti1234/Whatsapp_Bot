import os from 'os';
import fs from 'fs';

// Helper function to format bytes into a readable string
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to format uptime into a readable string
const formatUptime = (seconds: number): string => {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
};

// Function to get a formatted OS string
const getPrettyOS = (): string => {
  const platform = os.platform();
  const arch = os.arch();

  if (platform === 'linux') {
    try {
      const osRelease = fs.readFileSync('/etc/os-release', 'utf8');
      const match = osRelease.match(/^PRETTY_NAME="(.+?)"/m);
      if (match) {
        return `${match[1]} (${arch})`;
      }
    } catch (e) {
      // fallback
    }
    return `Linux (${os.release()}) (${arch})`;
  }
  if (platform === 'win32') {
    const release = os.release().split('.');
    const major = parseInt(release[0]);
    let name = 'Windows';
    if (major >= 10) {
        name = 'Windows 10/11';
    } else if (major === 6) {
        if (parseInt(release[1]) === 1) name = 'Windows 7';
        else if (parseInt(release[1]) === 2) name = 'Windows 8';
        else if (parseInt(release[1]) === 3) name = 'Windows 8.1';
    }
    return `${name} (${arch})`;
  }
  if (platform === 'darwin') {
    return `macOS (${os.release()}) (${arch})`;
  }
  return `${platform} (${os.release()}) (${arch})`;
};

export interface SystemInfo {
  hostname: string;
  os: string;
  cpu: string;
  cpuCores: number;
  totalRam: string;
  freeRam: string;
  uptime: string;
  nodejsVersion: string;
}

export function getSystemInfo(): SystemInfo {
  const cpus = os.cpus();
  return {
    hostname: os.hostname(),
    os: getPrettyOS(),
    cpu: cpus.length > 0 ? cpus[0].model : 'N/A',
    cpuCores: cpus.length,
    totalRam: formatBytes(os.totalmem()),
    freeRam: formatBytes(os.freemem()),
    uptime: formatUptime(os.uptime()),
    nodejsVersion: process.version,
  };
}