import React from 'react';
import { Wifi, Signal, AlertCircle } from 'lucide-react';
import { DetailedNetworkInfo } from '../types/speed';

interface NetworkInfoProps {
  networkInfo: DetailedNetworkInfo;
}

export const NetworkInfo: React.FC<NetworkInfoProps> = ({ networkInfo }) => {
  const getConnectionIcon = () => {
    switch (networkInfo.effectiveType) {
      case '4g':
        return <Signal className="w-6 h-6 text-green-500" />;
      case '3g':
        return <Signal className="w-6 h-6 text-yellow-500" />;
      case '2g':
        return <Signal className="w-6 h-6 text-red-500" />;
      default:
        return <Wifi className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Network Information</h3>
        {getConnectionIcon()}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Connection Type</p>
          <p className="font-medium">{networkInfo.type || 'Unknown'}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Effective Type</p>
          <p className="font-medium">{networkInfo.effectiveType || 'Unknown'}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Round Trip Time</p>
          <p className="font-medium">{networkInfo.rtt ? `${networkInfo.rtt}ms` : 'Unknown'}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Downlink Speed</p>
          <p className="font-medium">{networkInfo.downlink ? `${networkInfo.downlink} Mbps` : 'Unknown'}</p>
        </div>
      </div>
      {networkInfo.saveData && (
        <div className="mt-4 flex items-center text-yellow-600">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="text-sm">Data Saver is enabled</span>
        </div>
      )}
    </div>
  );
};