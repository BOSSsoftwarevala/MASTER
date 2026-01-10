import { MoreHorizontal } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const pieData = [
  { name: 'Giveaway', value: 60, color: '#c4f441' },
  { name: 'Affiliate', value: 24, color: '#f4c441' },
  { name: 'Offline Sales', value: 16, color: '#41c4f4' },
];

const recentSales = [
  { name: 'Bogdan Nikitin', time: '02 Minutes Ago', amount: '+$52.00', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face' },
  { name: 'Anatoly Belik', time: '02 Minutes Ago', amount: '+$83.00', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
  { name: 'Yulia Polishchuk', time: '05 Minutes Ago', amount: '+$61.60', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' },
  { name: 'Ksenia Bator', time: '05 Minutes Ago', amount: '+$2351.00', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face' },
  { name: 'Alex Samoluk', time: '10 Minutes Ago', amount: '+$152.00', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' },
  { name: 'Ann Minaeva', time: '12 Minutes Ago', amount: '+$542.00', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face' },
];

export const ZarssRightPanel = () => {
  return (
    <div className="w-[320px] bg-[#1a1a1e] p-5 overflow-auto border-l border-[#2a2a2e]">
      {/* Monthly Profits */}
      <div className="bg-[#1e1e22] rounded-2xl p-5 border border-[#2a2a2e] mb-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-white font-medium">Monthly Profits</h3>
          <button className="w-8 h-8 rounded-lg bg-[#2a2a2e] flex items-center justify-center text-[#6b6b6b] hover:text-white transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[#6b6b6b] text-xs mb-4">Total Profit Growth of 26%</p>
        
        <div className="relative h-44 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
                startAngle={90}
                endAngle={-270}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[#6b6b6b] text-xs">Total</p>
            <p className="text-white text-xl font-bold">$76,356</p>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2.5 mt-4">
          {pieData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[#6b6b6b] text-sm">{item.name}</span>
              </div>
              <span className="text-white text-sm font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-[#1e1e22] rounded-2xl p-5 border border-[#2a2a2e]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium">Recent Sales</h3>
          <button className="text-[#c4f441] text-sm font-medium hover:underline">See All</button>
        </div>
        <div className="space-y-4">
          {recentSales.map((sale, index) => (
            <div key={index} className="flex items-center gap-3">
              <img 
                src={sale.avatar} 
                alt={sale.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{sale.name}</p>
                <p className="text-[#6b6b6b] text-xs">{sale.time}</p>
              </div>
              <span className="text-[#c4f441] text-sm font-medium">{sale.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
