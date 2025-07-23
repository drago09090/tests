import React from 'react';
import { Gauge } from 'lucide-react';

interface SpeedMeterProps {
  speed: number;
  type: 'download' | 'upload';
  isLoading: boolean;
  latency?: number;
  jitter?: number;
}

export const SpeedMeter: React.FC<SpeedMeterProps> = ({ speed, type, isLoading, latency, jitter }) => {
  const formatSpeed = (speed: number) => {
    if (speed < 1) return `${(speed * 1000).toFixed(0)} Kbps`;
    return `${speed.toFixed(1)} Mbps`;
  };

  const getSpeedQuality = (speed: number) => {
    if (speed >= 100) return 'Excellent';
    if (speed >= 50) return 'Very Good';
    if (speed >= 25) return 'Good';
    if (speed >= 10) return 'Fair';
    return 'Poor';
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'Excellent': return 'text-green-500';
      case 'Very Good': return 'text-emerald-500';
      case 'Good': return 'text-blue-500';
      case 'Fair': return 'text-yellow-500';
      default: return 'text-red-500';
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg">
      <div className={`text-4xl mb-4 ${type === 'download' ? 'text-blue-500' : 'text-green-500'}`}>
        <Gauge className="w-12 h-12" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        {type === 'download' ? 'Download' : 'Upload'}
      </h3>
      <div className="text-3xl font-bold text-gray-900 mb-2">
        {isLoading ? (
          <div className="animate-pulse">Testing...</div>
        ) : (
          formatSpeed(speed)
        )}
      </div>
      {!isLoading && speed > 0 && (
        <>
          <div className={`text-sm font-medium ${getQualityColor(getSpeedQuality(speed))}`}>
            {getSpeedQuality(speed)}
          </div>
          {latency && (
            <div className="mt-2 text-sm text-gray-600">
              Latency: {latency.toFixed(0)}ms
            </div>
          )}
          {jitter && (
            <div className="text-sm text-gray-600">
              Jitter: {jitter.toFixed(1)}ms
            </div>
          )}
        </>
      )}
    </div>
  );
};