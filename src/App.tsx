import React from 'react';
import { Activity, RefreshCw, Trash2 } from 'lucide-react';
import { SpeedMeter } from './components/SpeedMeter';
import { SpeedHistory } from './components/SpeedHistory';
import { NetworkInfo } from './components/NetworkInfo';
import { ErrorMessage } from './components/ErrorMessage';
import { useSpeedTest } from './hooks/useSpeedTest';

function App() {
  const {
    currentTest,
    isLoading,
    history,
    networkInfo,
    error,
    runSpeedTest,
    clearHistory,
  } = useSpeedTest();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <Activity className="w-10 h-10 text-blue-500 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">Advanced Speed Test</h1>
        </div>

        {error && <ErrorMessage message={error} />}

        {/* Network Info Card */}
        <div className="mb-8">
          <NetworkInfo networkInfo={networkInfo} />
        </div>

        {/* Speed Test Section */}
        <div className="mb-8">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <SpeedMeter
              speed={currentTest?.downloadSpeed || 0}
              type="download"
              isLoading={isLoading}
              latency={currentTest?.latency}
              jitter={currentTest?.jitter}
            />
            <SpeedMeter
              speed={currentTest?.uploadSpeed || 0}
              type="upload"
              isLoading={isLoading}
              latency={currentTest?.latency}
              jitter={currentTest?.jitter}
            />
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={runSpeedTest}
              disabled={isLoading}
              className="flex items-center px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                         transition-all transform hover:scale-105 disabled:bg-blue-300 disabled:cursor-not-allowed
                         disabled:hover:scale-100 shadow-lg"
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Running Speed Test...' : 'Start Speed Test'}
            </button>

            {history.length > 0 && (
              <button
                onClick={clearHistory}
                disabled={isLoading}
                className="flex items-center px-6 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 
                           transition-all transform hover:scale-105 disabled:bg-red-300 disabled:cursor-not-allowed
                           disabled:hover:scale-100 shadow-lg"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Clear History
              </button>
            )}
          </div>
        </div>

        {/* History Chart */}
        {history.length > 0 && (
          <div className="mb-8">
            <SpeedHistory history={history} />
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p className="mb-2">Using Cloudflare's speed test infrastructure for accurate results</p>
          <p>For best results, close other applications and browser tabs</p>
        </div>
      </div>
    </div>
  );
}

export default App;