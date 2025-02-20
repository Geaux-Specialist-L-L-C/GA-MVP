// Additional visualization components to add to your existing code

// Detailed Trend Analysis Component
const TrendAnalysis = ({ data, isLoading }) => {
  if (!data) return null;
  
  return (
    <Card title="Detailed Trend Analysis" isLoading={isLoading}>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" domain={[0, 1]} />
          <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="performance"
            fill="#8884d8"
            stroke="#8884d8"
            fillOpacity={0.3}
            isAnimationActive={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="percentile"
            stroke="#ff7300"
            isAnimationActive={false}
          />
          <Bar
            yAxisId="left"
            dataKey="improvement"
            fill="#82ca9d"
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
};

// Learning Path Progress Component
const LearningPathProgress = ({ data, isLoading }) => {
  return (
    <Card title="Learning Path Progress" isLoading={isLoading}>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid />
          <XAxis 
            type="number" 
            dataKey="difficulty" 
            name="Difficulty Level"
            domain={[0, 1]} 
          />
          <YAxis 
            type="number" 
            dataKey="mastery" 
            name="Mastery Level"
            domain={[0, 1]} 
          />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter 
            name="Skills" 
            data={data} 
            fill="#8884d8"
            isAnimationActive={false}
          >
            {data?.map((entry, index) => (
              <Cell 
                key={index}
                fill={entry.status === 'mastered' ? '#82ca9d' : 
                      entry.status === 'in-progress' ? '#ffc658' : '#ff7300'}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  );
};

// Skill Correlation Heatmap
const SkillCorrelationHeatmap = ({ data, isLoading }) => {
  const formatData = (data) => {
    if (!data) return [];
    return data.map(row => ({
      ...row,
      value: parseFloat(row.correlation)
    }));
  };

  return (
    <Card title="Skill Correlations" isLoading={isLoading}>
      <div className="h-72">
        {data && (
          <div className="grid grid-cols-10 gap-1 h-full">
            {formatData(data).map((cell, index) => (
              <div
                key={index}
                className="relative"
                style={{
                  backgroundColor: `rgba(36, 92, 223, ${cell.value})`,
                  cursor: 'pointer'
                }}
                title={`${cell.skill1} → ${cell.skill2}: ${(cell.value * 100).toFixed(1)}%`}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

// Interactive Filter Panel
const FilterPanel = ({ 
  selectedDomain, 
  timeRange, 
  onDomainChange, 
  onTimeRangeChange,
  availableDomains,
  isLoading 
}) => (
  <div className="bg-white rounded-lg shadow-md p-4 mb-6">
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Domain
        </label>
        <select
          className="w-full px-4 py-2 border rounded-md bg-white disabled:bg-gray-100"
          value={selectedDomain}
          onChange={onDomainChange}
          disabled={isLoading}
        >
          <option value="all">All Domains</option>
          {availableDomains?.map(domain => (
            <option key={domain.id} value={domain.id}>
              {domain.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Time Range
        </label>
        <select
          className="w-full px-4 py-2 border rounded-md bg-white disabled:bg-gray-100"
          value={timeRange}
          onChange={onTimeRangeChange}
          disabled={isLoading}
        >
          <option value="1m">Last Month</option>
          <option value="3m">Last 3 Months</option>
          <option value="6m">Last 6 Months</option>
          <option value="1y">Last Year</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>
      
      {timeRange === 'custom' && (
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Custom Range
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              className="flex-1 px-4 py-2 border rounded-md"
              disabled={isLoading}
            />
            <input
              type="date"
              className="flex-1 px-4 py-2 border rounded-md"
              disabled={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  </div>
);

// Advanced Stats Panel
const AdvancedStats = ({ stats, isLoading }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    {stats?.map((stat, index) => (
      <div key={index} className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-500">{stat.label}</h4>
          {stat.trend && (
            <span className={`text-sm ${
              parseFloat(stat.trend) > 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {parseFloat(stat.trend) > 0 ? '↑' : '↓'} 
              {Math.abs(parseFloat(stat.trend)).toFixed(1)}%
            </span>
          )}
        </div>
        <p className="mt-2 text-2xl font-semibold">
          {typeof stat.value === 'number' ? stat.value.toFixed(1) : stat.value}
          {stat.unit && <span className="text-sm text-gray-500 ml-1">{stat.unit}</span>}
        </p>
        {stat.subtext && (
          <p className="mt-1 text-sm text-gray-500">{stat.subtext}</p>
        )}
      </div>
    ))}
  </div>
);

// Export these components to use in your main dashboard
export {
  TrendAnalysis,
  LearningPathProgress,
  SkillCorrelationHeatmap,
  FilterPanel,
  AdvancedStats
};
