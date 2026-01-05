import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const TOOLTIP_STYLE = { 
  borderRadius: '8px', 
  border: 'none', 
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
};

const AXIS_STYLE = { 
  fill: '#9CA3AF', 
  fontSize: 12 
};

const CURSOR_STYLE = { 
  fill: '#F3F4F6' 
};

const BAR_COLOR = "#16A34A"; 

const DailyPagesChart = ({ data = [] }) => {
  
  const formatDateTick = useCallback((dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, []);

  const hasData = data && data.length > 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Pages Read</h3>
      
      <div className="h-64 w-full">
        {!hasData ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
             No data for selected period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDateTick} 
                tick={AXIS_STYLE} 
                axisLine={false} 
                tickLine={false} 
                dy={10}
              />
              
              <YAxis 
                tick={AXIS_STYLE} 
                axisLine={false} 
                tickLine={false} 
              />
              
              <Tooltip 
                contentStyle={TOOLTIP_STYLE} 
                cursor={CURSOR_STYLE}
                formatter={(value) => [`${value} pages`, 'Read']}
              />
              
              <Bar 
                dataKey="totalPages" 
                name="Pages" 
                fill={BAR_COLOR} 
                radius={[4, 4, 0, 0]} 
                maxBarSize={50} 
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

DailyPagesChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      totalPages: PropTypes.number.isRequired,
    })
  ),
};

export default DailyPagesChart;