const DetailedPrediction = ({ prediction }: { prediction: PredictionData }) => {
    const [seasonality, setSeasonality] = useState(null);
    const [anomalies, setAnomalies] = useState([]);
    const [historicalData, setHistoricalData] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
      const fetchDetailedData = async () => {
        try {
          // Fetch seasonality patterns
          const seasonalityResponse = await fetch(
            `/api/monitoring/seasonality/${prediction.metric}`,
            {
              headers: {
                'Authorization': `Bearer ${await user.getIdToken()}`
              }
            }
          );
          
          if (seasonalityResponse.ok) {
            const seasonalityData = await seasonalityResponse.json();
            setSeasonality(seasonalityData);
          }

          // Fetch anomalies
          const anomaliesResponse = await fetch(
            `/api/monitoring/anomalies/${prediction.metric}`,
            {
              headers: {
                'Authorization': `Bearer ${await user.getIdToken()}`
              }
            }
          );
          
          if (anomaliesResponse.ok) {
            const anomaliesData = await anomaliesResponse.json();
            setAnomalies(anomaliesData.anomalies);
          }

          // Fetch historical data
          const historicalResponse = await fetch(
            `/api/monitoring/historical/${prediction.metric}`,
            {
              headers: {
                'Authorization': `Bearer ${await user.getIdToken()}`
              }
            }
          );
          
          if (historicalResponse.ok) {
            const historicalData = await historicalResponse.json();
            setHistoricalData(historicalData.data);
          }
        } catch (err) {
          console.error('Error fetching detailed data:', err);
        }
      };

      fetchDetailedData();
    }, [prediction.metric, user]);

    const ForecastChart = () => (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Performance Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <AreaChart
              data={historicalData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(time) => format(new Date(time), 'HH:mm')}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(time) => format(new Date(time), 'HH:mm:ss')}
                formatter={(value) => `${value.toFixed(2)}%`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
                name="Actual"
              />
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.3}
                name="Predicted"
              />
              <Area
                type="monotone"
                dataKey="upper_bound"
                stroke="#ffc658"
                fill="#ffc658"
                fillOpacity={0.1}
                name="Upper Bound"
              />
              <Area
                type="monotone"
                dataKey="lower_bound"
                stroke="#ffc658"
                fill="#ffc658"
                fillOpacity={0.1}
                name="Lower Bound"
              />
            </AreaChart>
          </div>
        </CardContent>
      </Card>
    );

    const SeasonalityPatterns = () => (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Seasonality Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Daily Pattern</h4>
              <LineChart
                data={Object.entries(seasonality?.daily_pattern || {}).map(([hour, value]) => ({
                  hour: parseInt(hour),
                  value
                }))}
                height={200}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="hour"
                  tickFormatter={(hour) => `${hour}:00`}
                />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  name="Average Value"
                />
              </LineChart>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Weekly Pattern</h4>
              <LineChart
                data={Object.entries(seasonality?.weekly_pattern || {}).map(([day, value]) => ({
                  day: parseInt(day),
                  value
                }))}
                height={200}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  tickFormatter={(day) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]}
                />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#82ca9d"
                  name="Average Value"
                />
              </LineChart>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium">Peak Hour</h4>
              <p className="text-2xl font-bold mt-1">
                {seasonality?.peak_hour}:00
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="text-sm font-medium">Peak Day</h4>
              <p className="text-2xl font-bold mt-1">
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][seasonality?.peak_day]}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );

    const AnomalyDetection = () => (
      <Card className="mt-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Detected Anomalies</CardTitle>
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {anomalies.map((anomaly, index) => (
              <div
                key={index}
                className="p-4 bg-yellow-50 rounded-lg border border-yellow-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Anomaly Detected</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Value: {anomaly.value.toFixed(2)}%
                    </p>
                    <p className="text-sm text-gray-600">
                      Deviation: {anomaly.deviation.toFixed(2)} σ
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(new Date(anomaly.timestamp), 'MMM d, HH:mm:ss')}
                  </span>
                </div>
              </div>
            ))}
            {anomalies.length === 0 && (
              <div className="text-center p-4 text-gray-500">
                No anomalies detected
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );

    return (
      <div className="space-y-6">
        <ForecastChart />
        <SeasonalityPatterns />
        <AnomalyDetection />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Predictive Analytics</h1>
          <p className="text-gray-600">
            Performance forecasting and anomaly detection
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {predictions.map((prediction) => (
          <MetricCard
            key={prediction.metric}
            prediction={prediction}
          />
        ))}
      </div>

      {selectedMetric && (
        <DetailedPrediction
          prediction={predictions.find(p => p.metric === selectedMetric)!}
        />
      )}
    </div>
  );
};

export default PredictiveAnalytics;