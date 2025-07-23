import { useCallback } from 'react';
import { useSpeedStore } from '../store/speedStore';
import { SpeedTestResult } from '../types/speed';

const TEST_FILE_SIZE = 25 * 1024 * 1024; // 25MB for more accurate results
const PING_COUNT = 10;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const useSpeedTest = () => {
  const {
    currentTest,
    isLoading,
    history,
    networkInfo,
    error,
    setCurrentTest,
    setIsLoading,
    addToHistory,
    setNetworkInfo,
    setError,
    clearHistory,
  } = useSpeedStore();

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const measureLatency = useCallback(async () => {
    const pings: number[] = [];
    for (let i = 0; i < PING_COUNT; i++) {
      const start = performance.now();
      await fetch('https://speed.cloudflare.com/__down?bytes=1');
      const end = performance.now();
      pings.push(end - start);
      await sleep(100); // Add small delay between pings
    }
    
    // Remove outliers (highest and lowest values)
    pings.sort((a, b) => a - b);
    const trimmedPings = pings.slice(1, -1);
    
    const latency = trimmedPings.reduce((a, b) => a + b) / trimmedPings.length;
    const jitter = Math.sqrt(
      trimmedPings.reduce((acc, ping) => acc + Math.pow(ping - latency, 2), 0) / trimmedPings.length
    );
    
    return { latency, jitter };
  }, []);

  const getNetworkInfo = useCallback(() => {
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      setNetworkInfo({
        type: conn.type || 'unknown',
        effectiveType: conn.effectiveType,
        downlinkMax: conn.downlinkMax,
        rtt: conn.rtt,
        downlink: conn.downlink,
        saveData: conn.saveData
      });
    }
  }, [setNetworkInfo]);

  const measureSpeed = useCallback(async (
    url: string,
    method: 'GET' | 'POST' = 'GET',
    retryCount = 0
  ): Promise<number> => {
    try {
      const startTime = performance.now();
      const response = await fetch(url, {
        method,
        body: method === 'POST' ? new Uint8Array(TEST_FILE_SIZE) : undefined,
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      if (method === 'GET') {
        const reader = response.body?.getReader();
        let receivedLength = 0;

        if (!reader) throw new Error('Response body is null');

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          receivedLength += value.length;
        }

        const endTime = performance.now();
        const durationInSeconds = (endTime - startTime) / 1000;
        return (receivedLength * 8) / (1000000 * durationInSeconds);
      } else {
        const endTime = performance.now();
        const durationInSeconds = (endTime - startTime) / 1000;
        return (TEST_FILE_SIZE * 8) / (1000000 * durationInSeconds);
      }
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        await sleep(RETRY_DELAY);
        return measureSpeed(url, method, retryCount + 1);
      }
      throw error;
    }
  }, []);

  const runSpeedTest = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    getNetworkInfo();

    try {
      const { latency, jitter } = await measureLatency();
      const downloadSpeed = await measureSpeed('https://speed.cloudflare.com/__down?bytes=' + TEST_FILE_SIZE);
      const uploadSpeed = await measureSpeed('https://speed.cloudflare.com/__up', 'POST');

      const result: SpeedTestResult = {
        downloadSpeed,
        uploadSpeed,
        latency,
        jitter,
        timestamp: new Date(),
        networkInfo: {
          type: networkInfo.type,
          downlinkMax: networkInfo.downlinkMax,
          effectiveType: networkInfo.effectiveType
        }
      };

      setCurrentTest(result);
      addToHistory(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Speed test failed');
      console.error('Speed test failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [measureSpeed, measureLatency, getNetworkInfo, networkInfo, setCurrentTest, addToHistory, setIsLoading, setError]);

  return {
    currentTest,
    isLoading,
    history,
    networkInfo,
    error,
    runSpeedTest,
    clearHistory,
  };
};