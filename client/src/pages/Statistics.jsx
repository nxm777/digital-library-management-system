import { useState, useEffect } from 'react';
import axios from 'axios';

import ConsistencyHeatmap from '../components/readingStatistics/ConsistencyHeatmap';
import DailyPagesChart from '../components/readingStatistics/DailyPagesChart';
import GenrePieChart from '../components/readingStatistics/GenrePieChart';
import TimeSpentChart from '../components/readingStatistics/TimeSpentChart';

const formatDateForInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Statistics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        const config = { 
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal
        };

        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
        const response = await axios.get(`/api/statistics?${params.toString()}`, config);
        
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error('Error loading stats:', err);
        setError('Failed to load statistics. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    return () => controller.abort();
  }, [startDate, endDate]);

  const setFilterRange = (type) => {
    const today = new Date();
    const start = new Date(today);

    if (type === 'week') {
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1); 
      start.setDate(diff);
    } else if (type === 'month') {
      start.setDate(1);
    }

    setStartDate(formatDateForInput(start));
    setEndDate(formatDateForInput(today));
  };

  const clearDateFilter = () => {
      setStartDate('');
      setEndDate('');
  };

  if (loading && !data) return <div className="p-12 text-center text-gray-500">Loading statistics...</div>;
  if (error) return <div className="p-12 text-center text-red-500">{error}</div>;
  if (!data) return <div className="p-12 text-center text-gray-500">No data available.</div>;

  const { timeline, summary, genres, booksRead } = data;
  const isFiltered = !!(startDate || endDate);

  return (
    <div className="max-w-6xl mx-auto space-y-8 mb-12">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Reading Statistics</h1>
            <p className="text-gray-500 text-sm">
                {isFiltered ? 'Showing stats for selected period' : 'Lifetime statistics'}
            </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center">
            <div className="flex gap-2">
                <FilterButton label="This Week" onClick={() => setFilterRange('week')} />
                <FilterButton label="This Month" onClick={() => setFilterRange('month')} />
            </div>

            <div className="flex gap-2 items-center bg-white p-1 rounded-lg border border-gray-300 shadow-sm h-[42px] w-fit">
                <DateInput value={startDate} onChange={setStartDate} />
                <span className="text-gray-400">-</span>
                <DateInput value={endDate} onChange={setEndDate} />
                
                {isFiltered && (
                    <button onClick={clearDateFilter} className="px-2 h-full text-gray-400 hover:text-red-500 border-l border-gray-200 transition-colors">✕</button>
                )}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
            title={isFiltered ? 'Pages (Period)' : 'Total Pages'} 
            value={summary.totalPages} 
            color="green"
            icon={<path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />}
        />
        <SummaryCard 
            title={isFiltered ? 'Time (Period)' : 'Total Time'} 
            value={summary.totalMinutes} 
            unit="min"
            color="blue"
            icon={<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />}
        />
        <SummaryCard 
            title={isFiltered ? 'Sessions (Period)' : 'Total Sessions'} 
            value={summary.totalSessions} 
            color="purple"
            icon={<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />}
        />
      </div>

      <ConsistencyHeatmap data={timeline} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
              <DailyPagesChart data={timeline} />
              <TimeSpentChart data={timeline} />
          </div>

          <div className="lg:col-span-1">
              <GenrePieChart data={genres} />
          </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-800">
                {isFiltered ? 'Books read in this period' : 'Recently read books'}
            </h3>
        </div>
        
        {booksRead && booksRead.length > 0 ? (
            <div className="divide-y divide-gray-100">
                {booksRead.map((book) => (
                    <BookListItem key={book._id} book={book} />
                ))}
            </div>
        ) : (
            <div className="p-12 text-center text-gray-400 text-sm">
                No reading activity recorded for this period.
            </div>
        )}
      </div>

    </div>
  );
};

const FilterButton = ({ label, onClick }) => (
    <button 
        onClick={onClick}
        className="px-3 py-2 text-xs font-medium bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg shadow-sm transition"
    >
        {label}
    </button>
);

const DateInput = ({ value, onChange }) => (
    <div className="relative">
        <input 
            type="date" 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            className="pl-2 pr-1 py-1 text-sm text-gray-600 outline-none bg-transparent border-none focus:ring-0" 
        />
    </div>
);

const SummaryCard = ({ title, value, unit, color, icon }) => {
    const colorClasses = {
        green: 'bg-green-100 text-green-600',
        blue: 'bg-blue-100 text-blue-600',
        purple: 'bg-purple-100 text-purple-600'
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
                <h4 className="text-3xl font-bold text-gray-800">
                    {value} {unit && <span className="text-sm font-normal text-gray-400">{unit}</span>}
                </h4>
            </div>
            <div className={`p-3 rounded-lg ${colorClasses[color] || 'bg-gray-100'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    {icon}
                </svg>
            </div>
        </div>
    );
};

const BookListItem = ({ book }) => (
    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition gap-4">
        <div className="flex items-center gap-4">
            <div className="w-10 h-14 bg-indigo-50 rounded border border-indigo-100 flex items-center justify-center text-indigo-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.472V5.25c0-1.278-.482-2.446-1.25-3.385a9.721 9.721 0 00-6.75-1.332v20.103z" />
                </svg>
            </div>
            <div>
                <h4 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-1">
                    {book.title}
                </h4>
                <p className="text-xs text-gray-500">
                    {book.author.first_name} {book.author.last_name}
                </p>
            </div>
        </div>

        <div className="flex gap-4 sm:gap-8 justify-start sm:justify-end">
            <StatItem label="Pages" value={`+${book.periodPages}`} />
            <StatItem label="Time" value={`${book.periodMinutes}m`} />
            <StatItem label="Sessions" value={book.sessionsCount} className="hidden sm:block" />
        </div>
    </div>
);

const StatItem = ({ label, value, className = "" }) => (
    <div className={`text-right ${className}`}>
        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{label}</p>
        <p className="font-medium text-gray-700 text-sm">{value}</p>
    </div>
);

export default Statistics;