import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { SpeedTestResult } from '../types/speed';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SpeedHistoryProps {
  history: SpeedTestResult[];
}

export const SpeedHistory: React.FC<SpeedHistoryProps> = ({ history }) => {
  const data = {
    labels: history.map(result => format(result.timestamp, 'HH:mm:ss')),
    datasets: [
      {
        label: 'Download Speed (Mbps)',
        data: history.map(result => result.downloadSpeed),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Upload Speed (Mbps)',
        data: history.map(result => result.uploadSpeed),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Latency (ms)',
        data: history.map(result => result.latency),
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        fill: true,
        tension: 0.4,
        hidden: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Speed (Mbps) / Latency (ms)',
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-lg">
      <Line options={options} data={data} />
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {history.length > 0 && (
          <>
            <div className="text-center">
              <p className="text-sm text-gray-600">Avg Download</p>
              <p className="font-bold text-blue-500">
                {(history.reduce((acc, curr) => acc + curr.downloadSpeed, 0) / history.length).toFixed(1)} Mbps
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Avg Upload</p>
              <p className="font-bold text-green-500">
                {(history.reduce((acc, curr) => acc + curr.uploadSpeed, 0) / history.length).toFixed(1)} Mbps
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Avg Latency</p>
              <p className="font-bold text-orange-500">
                {(history.reduce((acc, curr) => acc + curr.latency, 0) / history.length).toFixed(0)} ms
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Tests Run</p>
              <p className="font-bold text-gray-700">{history.length}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};