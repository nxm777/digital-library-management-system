import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const PRIMARY_COLOR = "#3B82F6";
const AXIS_COLOR = "#9CA3AF";

const TOOLTIP_STYLE = { 
  borderRadius: '8px', 
  border: 'none', 
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
};

const AXIS_TICK_STYLE = { 
  fill: AXIS_COLOR, 
  fontSize: 12 
};

const TimeSpentChart = ({ data = [] }) => {
  
  const formatDateTick = useCallback((dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, []);

  const formatTooltipValue = useCallback((value) => [`${value} min`, 'Time Spent'], []);

  const hasData = data && data.length > 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Time Spent (min)</h3>
      
      <div className="h-64 w-full">
        {!hasData ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No data for selected period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PRIMARY_COLOR} stopOpacity={0.1} />
                  <stop offset="95%" stopColor={PRIMARY_COLOR} stopOpacity={0} />
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDateTick} 
                tick={AXIS_TICK_STYLE} 
                axisLine={false} 
                tickLine={false}
                minTickGap={30}
                dy={10}
              />
              
              <YAxis 
                tick={AXIS_TICK_STYLE} 
                axisLine={false} 
                tickLine={false} 
              />
              
              <Tooltip 
                contentStyle={TOOLTIP_STYLE} 
                cursor={{ stroke: AXIS_COLOR, strokeWidth: 1, strokeDasharray: '4 4' }}
                formatter={formatTooltipValue}
              />
              
              <Area 
                type="monotone" 
                dataKey="totalMinutes" 
                name="Minutes" 
                stroke={PRIMARY_COLOR} 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorTime)" 
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

TimeSpentChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      totalMinutes: PropTypes.number.isRequired,
    })
  ),
};

export default TimeSpentChart;