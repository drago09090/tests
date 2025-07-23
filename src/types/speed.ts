export interface SpeedTestResult {
  downloadSpeed: number;
  uploadSpeed: number;
  latency: number;
  jitter: number;
  timestamp: Date;
  networkInfo: {
    type: string;
    downlinkMax?: number;
    effectiveType?: string;
  };
}

export interface DetailedNetworkInfo {
  type: string;
  downlinkMax?: number;
  effectiveType?: string;
  rtt?: number;
  downlink?: number;
  saveData?: boolean;
}