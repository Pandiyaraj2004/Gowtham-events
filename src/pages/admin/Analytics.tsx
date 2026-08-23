import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db, ProjectClosureReport } from '../../data/db';
import { FiTrendingUp, FiActivity, FiDollarSign, FiPercent } from 'react-icons/fi';

export const Analytics: React.FC = () => {
  const [reports, setReports] = useState<ProjectClosureReport[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'Corporate' | 'Wedding' | 'Gala'>('all');

  useEffect(() => {
    db.getClosureReports().then(setReports);
  }, []);

  // Filter reports
  const filteredReports = reports.filter((r) => {
    if (filterType === 'all') return true;
    return r.eventType.toLowerCase() === filterType.toLowerCase();
  });

  // Calculate metrics
  const totalRevenue = filteredReports.reduce((acc, r) => acc + r.amountReceived, 0);
  const totalExpenses = filteredReports.reduce((acc, r) => acc + r.expenses + r.additionalExpenses, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  // Group by Event Type for bar charts
  const typeFinancials = reports.reduce((acc, r) => {
    const t = r.eventType || 'Other';
    if (!acc[t]) acc[t] = { revenue: 0, profit: 0 };
    acc[t].revenue += r.amountReceived;
    acc[t].profit += r.netProfit;
    return acc;
  }, {} as Record<string, { revenue: number; profit: number }>);

  // SVG Chart Dimensions
  const chartWidth = 500;
  const chartHeight = 200;
  const padding = 30;

  // Simulated monthly timeline points
  const points = [
    { x: padding, y: chartHeight - padding - 20, val: 12000, label: 'Jan' },
    { x: padding + 90, y: chartHeight - padding - 40, val: 35000, label: 'Mar' },
    { x: padding + 180, y: chartHeight - padding - 15, val: 24000, label: 'May' },
    { x: padding + 270, y: chartHeight - padding - 95, val: 95000, label: 'Jul' },
    { x: padding + 360, y: chartHeight - padding - 75, val: 78000, label: 'Sep' },
    { x: chartWidth - padding, y: chartHeight - padding - 140, val: totalRevenue || 180000, label: 'Nov' },
  ];

  // Draw line path
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-black tracking-tight text-neutral-900 dark:text-zinc-50">
            Business Analytics
          </h1>
          <p className="text-xs text-neutral-500 dark:text-zinc-500 mt-1 font-light">
            Dynamic statistics compiled from completed Project Closure Audits.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex gap-2">
          {(['all', 'Corporate', 'Wedding'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                filterType === t
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/10'
                  : 'bg-white dark:bg-zinc-900 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-zinc-950 border border-neutral-200 dark:border-zinc-850'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow">
          <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-500 w-fit mb-4"><FiDollarSign size={20} /></div>
          <div className="text-xs text-neutral-450 dark:text-zinc-500 uppercase tracking-wider font-semibold">Total Revenue</div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-zinc-50 mt-1.5">${totalRevenue.toLocaleString()}</div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow">
          <div className="p-3.5 rounded-xl bg-red-500/10 text-red-500 w-fit mb-4"><FiActivity size={20} /></div>
          <div className="text-xs text-neutral-450 dark:text-zinc-500 uppercase tracking-wider font-semibold">Total Cost</div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-zinc-50 mt-1.5">${totalExpenses.toLocaleString()}</div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow">
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-500 w-fit mb-4"><FiTrendingUp size={20} /></div>
          <div className="text-xs text-neutral-450 dark:text-zinc-500 uppercase tracking-wider font-semibold">Net Profit</div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-zinc-50 mt-1.5">${netProfit.toLocaleString()}</div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow">
          <div className="p-3.5 rounded-xl bg-purple-500/10 text-purple-500 w-fit mb-4"><FiPercent size={20} /></div>
          <div className="text-xs text-neutral-450 dark:text-zinc-500 uppercase tracking-wider font-semibold">Profit Margin</div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-zinc-50 mt-1.5">{profitMargin.toFixed(1)}%</div>
        </div>
      </div>

      {/* SVG Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Animated Line Chart (Revenue Growth) */}
        <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow">
          <h2 className="text-lg font-heading font-semibold text-neutral-900 dark:text-zinc-50 mb-6">
            Revenue Progression (2026 YTD)
          </h2>
          <div className="relative w-full h-[220px] flex justify-center">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full text-zinc-350 dark:text-zinc-800">
              {/* Horizontal Grid lines */}
              <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="currentColor" strokeWidth={1} strokeDasharray="4 4" />
              <line x1={padding} y1={padding + 40} x2={chartWidth - padding} y2={padding + 40} stroke="currentColor" strokeWidth={0.5} strokeDasharray="4 4" />
              
              {/* Path outline with animate-draw effect */}
              <motion.path
                d={linePath}
                fill="none"
                stroke="var(--color-amber-500)"
                strokeWidth={3}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />

              {/* Dots & Labels */}
              {points.map((p, idx) => (
                <g key={idx}>
                  <circle cx={p.x} cy={p.y} r={4} fill="var(--color-amber-500)" className="cursor-pointer" />
                  <text x={p.x} y={chartHeight - 10} textAnchor="middle" className="text-[10px] fill-zinc-500 font-sans">
                    {p.label}
                  </text>
                  <text x={p.x} y={p.y - 12} textAnchor="middle" className="text-[9px] fill-neutral-700 dark:fill-zinc-400 font-semibold font-mono">
                    ${(p.val / 1000).toFixed(0)}k
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Custom Bar Chart (Earnings by Event Type) */}
        <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-850 premium-shadow">
          <h2 className="text-lg font-heading font-semibold text-neutral-900 dark:text-zinc-50 mb-6">
            Revenue & Profit Contribution
          </h2>
          <div className="space-y-6">
            {Object.entries(typeFinancials).length === 0 ? (
              <div className="text-center text-sm text-neutral-450 dark:text-zinc-500 italic py-12">No reports processed. Add closure reports first.</div>
            ) : (
              Object.entries(typeFinancials).map(([type, stats]) => {
                const maxRevenue = Math.max(...Object.values(typeFinancials).map(v => v.revenue));
                const revWidth = maxRevenue > 0 ? (stats.revenue / maxRevenue) * 100 : 0;
                const profWidth = maxRevenue > 0 ? (stats.profit / maxRevenue) * 100 : 0;

                return (
                  <div key={type} className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-neutral-900 dark:text-zinc-150 uppercase tracking-wider">{type} Events</span>
                      <span className="text-neutral-500 dark:text-zinc-400">
                        Rev: <strong className="text-neutral-900 dark:text-white">${stats.revenue.toLocaleString()}</strong> &bull; Prof: <strong className="text-amber-500">${stats.profit.toLocaleString()}</strong>
                      </span>
                    </div>
                    
                    {/* Double progress bar */}
                    <div className="h-5 w-full bg-neutral-100 dark:bg-zinc-950 rounded-lg overflow-hidden relative border border-neutral-200/50 dark:border-zinc-850">
                      {/* Revenue Bar */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${revWidth}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-zinc-300 dark:bg-zinc-800/80 rounded-l"
                      />
                      {/* Overlay Profit Bar */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${profWidth}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="absolute top-0 bottom-0 left-0 bg-amber-500/80 rounded-l"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
export default Analytics;
