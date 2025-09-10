import React, { useState } from 'react';
import { Settings, DollarSign, Target, AlertTriangle } from 'lucide-react';

const ConfigureTradeSection: React.FC = () => {
  const [tradeConfig, setTradeConfig] = useState({
    pair: 'BTC/USD',
    type: 'buy',
    amount: '',
    stopLoss: '',
    takeProfit: '',
    leverage: '1x'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Trade configured:', tradeConfig);
    // Add trade execution logic here
  };

  const pairs = ['BTC/USD', 'ETH/USD', 'SOL/USD', 'ADA/USD', 'DOT/USD'];
  const leverageOptions = ['1x', '2x', '5x', '10x', '20x'];

  return (
    <div className="bg-dark rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="text-gold" size={20} />
        <h3 className="text-xl font-bold text-white">Configure New Trade</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-tan text-sm font-medium mb-2">
              Trading Pair
            </label>
            <select
              value={tradeConfig.pair}
              onChange={(e) => setTradeConfig({ ...tradeConfig, pair: e.target.value })}
              className="w-full bg-slate-blue text-white rounded-lg px-3 py-2 border border-tan/20 focus:border-gold focus:outline-none transition-colors"
            >
              {pairs.map(pair => (
                <option key={pair} value={pair}>{pair}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-tan text-sm font-medium mb-2">
              Trade Type
            </label>
            <div className="flex rounded-lg bg-slate-blue p-1">
              <button
                type="button"
                onClick={() => setTradeConfig({ ...tradeConfig, type: 'buy' })}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  tradeConfig.type === 'buy'
                    ? 'bg-green-400 text-dark'
                    : 'text-tan hover:text-white'
                }`}
              >
                BUY
              </button>
              <button
                type="button"
                onClick={() => setTradeConfig({ ...tradeConfig, type: 'sell' })}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  tradeConfig.type === 'sell'
                    ? 'bg-coral text-white'
                    : 'text-tan hover:text-white'
                }`}
              >
                SELL
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-tan text-sm font-medium mb-2">
              <DollarSign className="inline w-4 h-4 mr-1" />
              Amount
            </label>
            <input
              type="number"
              step="0.001"
              value={tradeConfig.amount}
              onChange={(e) => setTradeConfig({ ...tradeConfig, amount: e.target.value })}
              placeholder="0.00"
              className="w-full bg-slate-blue text-white rounded-lg px-3 py-2 border border-tan/20 focus:border-gold focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-tan text-sm font-medium mb-2">
              Leverage
            </label>
            <select
              value={tradeConfig.leverage}
              onChange={(e) => setTradeConfig({ ...tradeConfig, leverage: e.target.value })}
              className="w-full bg-slate-blue text-white rounded-lg px-3 py-2 border border-tan/20 focus:border-gold focus:outline-none transition-colors"
            >
              {leverageOptions.map(leverage => (
                <option key={leverage} value={leverage}>{leverage}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-tan text-sm font-medium mb-2">
              <AlertTriangle className="inline w-4 h-4 mr-1" />
              Stop Loss
            </label>
            <input
              type="number"
              step="0.01"
              value={tradeConfig.stopLoss}
              onChange={(e) => setTradeConfig({ ...tradeConfig, stopLoss: e.target.value })}
              placeholder="Optional"
              className="w-full bg-slate-blue text-white rounded-lg px-3 py-2 border border-tan/20 focus:border-gold focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-tan text-sm font-medium mb-2">
              <Target className="inline w-4 h-4 mr-1" />
              Take Profit
            </label>
            <input
              type="number"
              step="0.01"
              value={tradeConfig.takeProfit}
              onChange={(e) => setTradeConfig({ ...tradeConfig, takeProfit: e.target.value })}
              placeholder="Optional"
              className="w-full bg-slate-blue text-white rounded-lg px-3 py-2 border border-tan/20 focus:border-gold focus:outline-none transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!tradeConfig.amount}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            tradeConfig.amount
              ? 'bg-gold text-dark hover:bg-gold/90 hover:scale-[1.02] shadow-lg'
              : 'bg-tan/20 text-tan/50 cursor-not-allowed'
          }`}
        >
          Execute Trade
        </button>
      </form>
    </div>
  );
};

export default ConfigureTradeSection;