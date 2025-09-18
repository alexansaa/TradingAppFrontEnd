import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
import {
  useAppDispatch,
  useAppSelector
} from '../redux/hooks';
import { getPricesHistory } from '../redux/prices/priceSlice';

interface PricePoint {
  BarDate: string;
  Close: number;
}

const PriceChart: React.FC = () => {
  const dispatch = useAppDispatch();
  // const { prices, isLoading, error } = useAppSelector((store) => store.price);
  const prices = useAppSelector(s => s.price.prices);
  const isLoading = useAppSelector(s => s.price.isLoading);
  const error = useAppSelector(s => s.price.error);

  const [priceData, setPriceData] = useState<PricePoint[]>([]);

  useEffect(() => {
    // dispatch(getPricesHistory());
    dispatch(getPricesHistory({ symbol: 'AAPL', start: '2022-11-02', end: '2023-02-17' }));
  }, [dispatch]);

  useEffect(() => {
    console.log("retrieved prices: ");
    console.log(prices);
  }, [prices]);

  useEffect(() => {
    if (!Array.isArray(prices)) {
      setPriceData([]);
      return;
    }
    console.log("computing next");
    console.log(prices);
    
    const next: PricePoint[] = prices.map(b => ({
      BarDate: new Date(b.BarDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      Close: b.Close,
    }));
    console.log("printing next");
    console.log(next);

    setPriceData(next); // replace; see “append” variant below
  }, [prices]);

  // const priceData: PricePoint[] = React.useMemo(
  //   () =>
  //     prices.map(b => ({
  //       time: new Date(b.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  //       price: b.close,
  //     })),
  //   [prices]
  // );

  if (isLoading) {
    return <div>Content is Loading...!</div>
  }

  if (error) {
    return <div>Content error! Something went wrong!</div>
  }

  if (priceData.length < 2) return <div>No data yet</div>;

  // // Mock price data
  // const priceData: PricePoint[] = [
  //   { time: '09:00', price: 42500 },
  //   { time: '10:00', price: 43200 },
  //   { time: '11:00', price: 42800 },
  //   { time: '12:00', price: 44100 },
  //   { time: '13:00', price: 43900 },
  //   { time: '14:00', price: 45200 },
  //   { time: '15:00', price: 44800 },
  //   { time: '16:00', price: 46300 },
  // ];

  const pricesOnly = priceData.map(p => p.Close);
  const maxPrice = Math.max(...pricesOnly);
  const minPrice = Math.min(...pricesOnly);
  const rangeRaw = maxPrice - minPrice;
  const priceRange = rangeRaw === 0 ? 1 : rangeRaw;

  const currentPrice = priceData[priceData.length - 1].Close;
  const previousPrice = priceData[priceData.length - 2].Close;
  const isUp = currentPrice > previousPrice;
  const change = currentPrice - previousPrice;
  const changePercent = ((change / previousPrice) * 100).toFixed(2);

  const createPath = () => {
    const width = 400;
    const height = 200;
    const padding = 20;

    return priceData
      .map((point, index) => {
        const x = padding + (index * (width - 2 * padding)) / (priceData.length - 1);
        const y = height - padding - ((point.Close - minPrice) / priceRange) * (height - 2 * padding);
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  return (
    <div className="bg-slate-blue rounded-xl p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">BTC/USD</h2>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-white">
              ${currentPrice.toLocaleString()}
            </span>
            <span className={`text-sm font-medium ${isUp ? 'text-green-400' : 'text-coral'}`}>
              {isUp ? '+' : ''}{change.toLocaleString()} ({isUp ? '+' : ''}{changePercent}%)
            </span>
          </div>
        </div>
        <div className="text-right text-tan text-sm">
          <div>24h Volume</div>
          <div className="font-semibold">$2.4B</div>
        </div>
      </div>

      <div className="relative">
        <svg
          width="100%"
          height="200"
          viewBox="0 0 400 200"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f3c130" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f3c130" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="20"
              y1={20 + i * 40}
              x2="380"
              y2={20 + i * 40}
              stroke="#414a6b"
              strokeOpacity="0.3"
              strokeWidth="1"
            />
          ))}

          {/* Area under curve */}
          <path
            d={`${createPath()} L 380 180 L 20 180 Z`}
            fill="url(#priceGradient)"
          />

          {/* Price line */}
          <path
            d={createPath()}
            stroke="#f3c130"
            strokeWidth="3"
            fill="none"
            className="drop-shadow-sm"
          />

          {/* Data points */}
          {priceData.map((point, index) => {
            const x = 20 + (index * 340) / (priceData.length - 1);
            const y = 180 - ((point.Close - minPrice) / priceRange) * 140;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill="#f3c130"
                stroke="#1c1b20"
                strokeWidth="2"
                className="hover:r-6 transition-all duration-200"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default PriceChart;