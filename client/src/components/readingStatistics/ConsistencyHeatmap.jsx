import { useMemo } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip } from 'react-tooltip';
import 'react-calendar-heatmap/dist/styles.css';

const SCALE_THRESHOLDS = [
  { count: 15, class: 'color-scale-1', label: '< 15 min', color: '#d6e9c6' },
  { count: 45, class: 'color-scale-2', label: '15-45 min', color: '#97c95c' },
  { count: 90, class: 'color-scale-3', label: '45-90 min', color: '#48992b' },
  { count: Infinity, class: 'color-scale-4', label: '> 90 min', color: '#1d5f14' },
];

const EMPTY_COLOR = '#ebedf0';

const shiftDate = (date, numDays) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
};

const ConsistencyHeatmap = ({ data = [] }) => {
  const heatmapData = useMemo(() => {
    return data.map(item => ({
      date: item.date,
      count: item.totalMinutes
    }));
  }, [data]);

  const { startDate, endDate } = useMemo(() => {
    const today = new Date();
    return {
      startDate: shiftDate(today, -365),
      endDate: today
    };
  }, []);

  const getClassForValue = (value) => {
    if (!value || !value.count) return 'color-empty';
    const threshold = SCALE_THRESHOLDS.find(t => value.count < t.count);
    return threshold ? threshold.class : 'color-scale-4';
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Reading Consistency (Last Year)</h3>
      
      <div className="w-full overflow-x-auto">
        <div className="min-w-[600px]">
            <CalendarHeatmap
                startDate={startDate}
                endDate={endDate}
                values={heatmapData}
                classForValue={getClassForValue}
                tooltipDataAttrs={value => ({
                  'data-tooltip-id': 'heatmap-tooltip',
                  'data-tooltip-content': value.date ? `${value.date}: ${value.count} min` : 'No reading',
                })}
                showWeekdayLabels={true}
            />
            <Tooltip id="heatmap-tooltip" style={{ fontSize: '12px' }} />

            <div className="flex justify-end items-center gap-2 mt-4 text-xs text-gray-500 font-medium">
                <span>Less</span>
                
                <span 
                    className="w-3 h-3 rounded-sm inline-block border border-gray-200"
                    style={{ backgroundColor: EMPTY_COLOR }}
                    title="0 min"
                ></span>
                
                {SCALE_THRESHOLDS.map((threshold) => (
                    <span 
                        key={threshold.class}
                        className="w-3 h-3 rounded-sm inline-block"
                        style={{ backgroundColor: threshold.color }}
                        title={threshold.label}
                    />
                ))}
                
                <span>More</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ConsistencyHeatmap;