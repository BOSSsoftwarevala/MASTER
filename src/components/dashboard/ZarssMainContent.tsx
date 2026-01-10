import { Search, DollarSign, X, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

const chartData = [
  { day: 'Mon', value: 18000 },
  { day: 'Tue', value: 22000 },
  { day: 'Wed', value: 33567, highlight: true },
  { day: 'Thu', value: 28000 },
  { day: 'Fri', value: 15000 },
  { day: 'Sat', value: 12000 },
  { day: 'Sun', value: 8000 },
];

const orders = [
  { name: 'Ann Minaeva', amount: '$1,456', status: 'Chargeback', date: '11 Sep 2022', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' },
  { name: 'Anatoly Belik', amount: '$42,4378', status: 'Completed', date: '11 Sep 2022', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
  { name: 'Yulia Polishchuk', amount: '$1,456', status: 'Completed', date: '11 Sep 2022', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#2a2a2e] px-3 py-1.5 rounded-lg shadow-lg">
        <p className="text-white text-sm font-medium">$ {payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export const ZarssMainContent = () => {
  return (
    <div className="flex-1 bg-[#141414] p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
          <p className="text-[#6b6b6b] text-sm">Payments Updates</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b6b]" />
          <input 
            type="text"
            placeholder="Search"
            className="w-64 bg-[#1e1e22] border border-[#2a2a2e] rounded-full py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-[#6b6b6b] focus:outline-none focus:border-[#3a3a3e]"
          />
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Balance Card */}
        <div className="bg-[#1e1e22] rounded-2xl p-5 border border-[#2a2a2e]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#c4f441] flex items-center justify-center">
              <span className="text-[#0D0D0D] font-bold text-lg">$</span>
            </div>
            <span className="text-[#6b6b6b] text-sm">Balance</span>
            <span className="ml-auto px-2 py-0.5 rounded-full bg-[#c4f441]/20 text-[#c4f441] text-xs font-medium">+17%</span>
          </div>
          <p className="text-3xl font-bold text-white mb-2">$ 56,874</p>
          <div className="h-8">
            <svg viewBox="0 0 120 30" className="w-full h-full">
              <path 
                d="M0,25 Q10,22 20,20 T40,18 T60,15 T80,12 T100,8 T120,5" 
                fill="none" 
                stroke="#c4f441" 
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Sales Card */}
        <div className="bg-[#1e1e22] rounded-2xl p-5 border border-[#2a2a2e]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#3a3a3e] flex items-center justify-center">
              <X className="w-5 h-5 text-white" />
            </div>
            <span className="text-[#6b6b6b] text-sm">Sales</span>
            <span className="ml-auto px-2 py-0.5 rounded-full bg-[#c4f441]/20 text-[#c4f441] text-xs font-medium">+23%</span>
          </div>
          <p className="text-3xl font-bold text-white mb-2">$ 24,575</p>
          <div className="h-8">
            <svg viewBox="0 0 120 30" className="w-full h-full">
              <path 
                d="M0,22 Q15,20 25,18 T50,16 T75,14 T100,10 T120,6" 
                fill="none" 
                stroke="#c4f441" 
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Upgrade Card */}
        <div className="bg-[#1e1e22] rounded-2xl p-5 border border-[#2a2a2e] flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#c4f441] flex items-center justify-center">
                <X className="w-4 h-4 text-[#0D0D0D]" />
              </div>
              <span className="text-[#c4f441] font-semibold text-sm">Upgrade</span>
            </div>
            <button className="w-6 h-6 rounded-full bg-[#2a2a2e] flex items-center justify-center text-[#6b6b6b] text-lg hover:bg-[#3a3a3e] transition-colors">+</button>
          </div>
          <div>
            <p className="text-[#6b6b6b] text-sm mb-3">Get more information and opportunities</p>
            <button className="px-6 py-2 bg-[#c4f441] text-[#0D0D0D] rounded-full text-sm font-semibold hover:bg-[#d4ff51] transition-colors">
              Go Pro
            </button>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-[#1e1e22] rounded-2xl p-5 border border-[#2a2a2e] mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-medium">User in The Last Week</h3>
            <p className="text-[#c4f441] text-sm font-medium">+ 3,2%</p>
          </div>
          <button className="text-[#6b6b6b] text-sm hover:text-white transition-colors">
            See statistics for all time
          </button>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={40}>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b6b6b', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b6b6b', fontSize: 12 }}
                tickFormatter={(value) => `${value / 1000}K`}
                domain={[0, 40000]}
                ticks={[0, 10000, 20000, 30000, 40000]}
              />
              <Tooltip 
                cursor={false}
                content={<CustomTooltip />}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.highlight ? '#c4f441' : '#3d4a3a'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Last Orders */}
      <div className="bg-[#1e1e22] rounded-2xl p-5 border border-[#2a2a2e]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium">Last Orders</h3>
          <div className="flex items-center gap-4">
            <span className="text-[#6b6b6b] text-xs bg-[#2a2a2e] px-3 py-1.5 rounded-full">
              Data Updates Every 3 Hours
            </span>
            <button className="text-[#c4f441] text-sm font-medium hover:underline">
              View All Orders
            </button>
          </div>
        </div>
        <div className="space-y-1">
          {orders.map((order, index) => (
            <div key={index} className="flex items-center gap-4 py-3 border-b border-[#2a2a2e] last:border-0">
              <img 
                src={order.avatar} 
                alt={order.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-white text-sm font-medium w-36">{order.name}</span>
              <span className="text-white text-sm w-24">{order.amount}</span>
              <div className="flex items-center gap-2 w-28">
                <span className={`w-2 h-2 rounded-full ${
                  order.status === 'Completed' ? 'bg-[#c4f441]' : 'bg-[#f44141]'
                }`} />
                <span className="text-[#6b6b6b] text-sm">{order.status}</span>
              </div>
              <span className="text-[#6b6b6b] text-sm ml-auto">{order.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
