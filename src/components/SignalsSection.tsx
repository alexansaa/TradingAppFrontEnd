import React from 'react';

interface Signal {
  id: string;
  name: string;
  referenceValue: number;
  status: 'bullish' | 'bearish';
  strength: number;
}

const SignalsSection: React.FC = () => {
  const signals: Signal[] = [
    { id: '1', name: 'RSI Divergence', referenceValue: 65.3, status: 'bullish', strength: 85 },
    { id: '2', name: 'MACD Cross', referenceValue: -12.4, status: 'bearish', strength: 72 },
    { id: '3', name: 'Volume Spike', referenceValue: 1.8, status: 'bullish', strength: 91 },
    { id: '4', name: 'Support Break', referenceValue: 43800, status: 'bearish', strength: 68 },
    { id: '5', name: 'EMA Golden Cross', referenceValue: 44200, status: 'bullish', strength: 79 },
  ];

  return (
    <div className="bg-dark rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Trading Signals</h3>
      <div className="space-y-3">
        {signals.map((signal) => (
          <div
            key={signal.id}
            className="flex items-center justify-between p-3 bg-slate-blue rounded-lg hover:bg-opacity-80 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  signal.status === 'bullish' ? 'bg-green-400' : 'bg-coral'
                } shadow-lg`}
              />
              <div>
                <div className="text-white font-medium">{signal.name}</div>
                <div className="text-tan text-sm">
                  Ref: {signal.referenceValue.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-semibold ${
                signal.status === 'bullish' ? 'text-green-400' : 'text-coral'
              }`}>
                {signal.status.toUpperCase()}
              </div>
              <div className="text-tan text-xs">
                {signal.strength}% confidence
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignalsSection;