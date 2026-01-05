import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer 
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const TOOLTIP_STYLE = { 
  borderRadius: '8px', 
  border: 'none', 
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
};

const GenrePieChart = ({ data = [] }) => {

  const chartData = useMemo(() => {
    return data ? data.map(g => ({ name: g._id, value: g.count })) : [];
  }, [data]);

  const hasData = chartData && chartData.length > 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Favorite Genres</h3>
      <p className="text-xs text-gray-400 mb-6">Based on number of sessions</p>
      
      <div className="flex-1 min-h-[300px] w-full">
        {!hasData ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            No genre data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    strokeWidth={0}
                  />
                ))}
              </Pie>
              
              <Tooltip 
                contentStyle={TOOLTIP_STYLE} 

                formatter={(value) => [`${value} sesje`]} 
              />

              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                formatter={(value) => <span className="text-gray-600 text-xs ml-1">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

GenrePieChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ),
};

export default GenrePieChart;