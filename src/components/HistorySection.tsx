import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Trade {
  id: string;
  pair: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  profit: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'cancelled';
}

const HistorySection: React.FC = () => {
  const trades: Trade[] = [
    {
      id: '1',
      pair: 'BTC/USD',
      type: 'buy',
      amount: 0.1,
      price: 44200,
      profit: 1250,
      timestamp: '2025-01-21 14:30',
      status: 'completed'
    },
    {
      id: '2',
      pair: 'ETH/USD',
      type: 'sell',
      amount: 2.5,
      price: 3400,
      profit: -180,
      timestamp: '2025-01-21 13:15',
      status: 'completed'
    },
    {
      id: '3',
      pair: 'BTC/USD',
      type: 'buy',
      amount: 0.05,
      price: 43800,
      profit: 890,
      timestamp: '2025-01-21 12:45',
      status: 'completed'
    },
    {
      id: '4',
      pair: 'SOL/USD',
      type: 'sell',
      amount: 10,
      price: 165,
      profit: 320,
      timestamp: '2025-01-21 11:20',
      status: 'pending'
    },
  ];

  return (
    <div className="bg-dark rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Trade History</h3>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {trades.map((trade) => (
          <div
            key={trade.id}
            className="flex items-center justify-between p-3 bg-slate-blue rounded-lg hover:bg-opacity-80 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className={`p-1 rounded ${trade.type === 'buy' ? 'bg-green-400' : 'bg-coral'}`}>
                {trade.type === 'buy' ? (
                  <TrendingUp size={16} className="text-dark" />
                ) : (
                  <TrendingDown size={16} className="text-dark" />
                )}
              </div>
              <div>
                <div className="text-white font-medium">{trade.pair}</div>
                <div className="text-tan text-sm">
                  {trade.amount} @ ${trade.price.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`font-semibold ${
                trade.profit > 0 ? 'text-green-400' : 'text-coral'
              }`}>
                {trade.profit > 0 ? '+' : ''}${trade.profit}
              </div>
              <div className="text-tan text-xs">{trade.timestamp}</div>
              <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                trade.status === 'completed' ? 'bg-green-400 text-dark' :
                trade.status === 'pending' ? 'bg-gold text-dark' :
                'bg-coral text-white'
              }`}>
                {trade.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorySection;