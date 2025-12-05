import React, { useState, useEffect } from 'react';
import { ChartRenderer } from './ChartRenderer';
import type { DataSource, ColumnInfo, ChartConfig } from '../../../types';

interface ChartBuilderProps {
  dataSources: DataSource[];
  onCreateChart: (config: ChartConfig) => void;
}

interface DataPreview {
  columns: ColumnInfo[];
  rows: any[];
}

type AggregationType = 'sum' | 'count' | 'avg' | 'min' | 'max' | 'none';

export const ChartBuilder: React.FC<ChartBuilderProps> = ({ dataSources, onCreateChart }) => {
  const [selectedDataSource, setSelectedDataSource] = useState<number | null>(null);
  const [dataPreview, setDataPreview] = useState<DataPreview | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState<string>('');
  
  // Chart configuration
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'doughnut'>('bar');
  const [xAxisColumn, setXAxisColumn] = useState<string>('');
  const [yAxisColumn, setYAxisColumn] = useState<string>('');
  const [aggregation, setAggregation] = useState<AggregationType>('sum');
  const [chartTitle, setChartTitle] = useState('');
  
  // Chart preview
  const [previewConfig, setPreviewConfig] = useState<ChartConfig | null>(null);
  
  // AI Suggestion
  const [isGettingAISuggestion, setIsGettingAISuggestion] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');

  const isConfigValid = selectedDataSource && xAxisColumn && yAxisColumn && dataPreview;

  const chartTypes = [
    { value: 'bar', label: 'Bar Chart', icon: '📊', description: 'Compare values across categories' },
    { value: 'line', label: 'Line Chart', icon: '📈', description: 'Show trends over time' },
    { value: 'area', label: 'Area Chart', icon: '🏔️', description: 'Visualize cumulative data' },
    { value: 'pie', label: 'Pie Chart', icon: '🥧', description: 'Show proportions of a whole' },
    { value: 'doughnut', label: 'Doughnut Chart', icon: '🍩', description: 'Modern pie chart variant' },
    { value: 'scatter', label: 'Scatter Plot', icon: '⚡', description: 'Show correlation between two variables' },
  ];

  // Load data preview when data source changes
  useEffect(() => {
    if (selectedDataSource) {
      loadDataPreview(selectedDataSource);
    } else {
      setDataPreview(null);
      setPreviewConfig(null);
      setXAxisColumn('');
      setYAxisColumn('');
    }
  }, [selectedDataSource]);

  // Generate preview when configuration changes
  useEffect(() => {
    if (dataPreview && xAxisColumn && yAxisColumn) {
      generatePreview();
    }
  }, [chartType, xAxisColumn, yAxisColumn, chartTitle, dataPreview, aggregation]);

  const loadDataPreview = async (dataSourceId: number) => {
    setIsLoadingPreview(true);
    setPreviewError('');
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${import.meta.env.VITE_API_BASE_PATH || '/api'}/data/source/${dataSourceId}/preview?limit=500`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to load preview');
      }
      
      const data = await response.json();
      setDataPreview(data);
      
      // Auto-select first string column for X-axis and first numeric column for Y-axis
      const stringColumns = data.columns.filter((col: ColumnInfo) => 
        col.dtype.includes('object') || col.dtype.includes('str')
      );
      const numericColumns = data.columns.filter((col: ColumnInfo) => 
        col.dtype.includes('int') || col.dtype.includes('float') || col.dtype.includes('number')
      );
      
      if (stringColumns.length > 0 && numericColumns.length > 0) {
        setXAxisColumn(stringColumns[0].name);
        setYAxisColumn(numericColumns[0].name);
      } else if (data.columns.length >= 2) {
        setXAxisColumn(data.columns[0].name);
        setYAxisColumn(data.columns[1].name);
      }
    } catch (error: any) {
      console.error('Failed to load data preview:', error);
      setPreviewError(error.message || 'Failed to load data preview');
      setDataPreview(null);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const aggregateData = (labels: string[], values: number[]) => {
    // Group data by label and apply aggregation
    const groupedData: Map<string, number[]> = new Map();
    
    labels.forEach((label, idx) => {
      const existing = groupedData.get(label) || [];
      existing.push(values[idx]);
      groupedData.set(label, existing);
    });
    
    const aggregatedLabels: string[] = [];
    const aggregatedValues: number[] = [];
    
    groupedData.forEach((vals, label) => {
      aggregatedLabels.push(label);
      
      switch (aggregation) {
        case 'sum':
          aggregatedValues.push(vals.reduce((a, b) => a + b, 0));
          break;
        case 'count':
          aggregatedValues.push(vals.length);
          break;
        case 'avg':
          aggregatedValues.push(vals.reduce((a, b) => a + b, 0) / vals.length);
          break;
        case 'min':
          aggregatedValues.push(Math.min(...vals));
          break;
        case 'max':
          aggregatedValues.push(Math.max(...vals));
          break;
        case 'none':
        default:
          aggregatedValues.push(vals[vals.length - 1]); // Take last value
      }
    });
    
    return { labels: aggregatedLabels, values: aggregatedValues };
  };

  const generatePreview = () => {
    if (!dataPreview || !xAxisColumn || !yAxisColumn) return;

    // Extract labels and values from data
    const rawLabels: string[] = [];
    const rawValues: number[] = [];

    dataPreview.rows.forEach((row) => {
      const label = String(row[xAxisColumn] ?? '');
      const value = parseFloat(row[yAxisColumn]) || 0;
      rawLabels.push(label);
      rawValues.push(value);
    });

    // Apply aggregation
    const { labels, values } = aggregateData(rawLabels, rawValues);
    
    // Limit to top 20 for readability
    const limitedLabels = labels.slice(0, 20);
    const limitedValues = values.slice(0, 20);

    // Create chart config
    const config: ChartConfig = {
      type: chartType,
      title: chartTitle || `${aggregation !== 'none' ? aggregation.toUpperCase() + ' of ' : ''}${yAxisColumn} by ${xAxisColumn}`,
      labels: limitedLabels,
      datasets: [
        {
          label: yAxisColumn,
          data: limitedValues,
        },
      ],
    };

    setPreviewConfig(config);
  };

  const handleCreateChart = () => {
    if (previewConfig) {
      onCreateChart(previewConfig);
    }
  };

  const handleAISuggestion = () => {
    if (!dataPreview || !xAxisColumn || !yAxisColumn) return;
    
    setIsGettingAISuggestion(true);
    
    // Analyze data characteristics
    const xValues = dataPreview.rows.map(row => row[xAxisColumn]);
    const yValues = dataPreview.rows.map(row => parseFloat(row[yAxisColumn]) || 0);
    
    const isXNumeric = xValues.every(v => !isNaN(parseFloat(v)));
    const isSorted = xValues.every((v, i, arr) => i === 0 || v >= arr[i - 1]);
    const hasNegative = yValues.some(v => v < 0);
    const dataPoints = xValues.length;
    
    // Generate suggestion based on data characteristics
    let suggestedType: any = 'bar';
    let reason = '';
    
    if (dataPoints <= 6) {
      suggestedType = 'pie';
      reason = `With only ${dataPoints} categories, a pie chart effectively shows the proportion of each part to the whole.`;
    } else if (isXNumeric && isSorted) {
      suggestedType = 'line';
      reason = 'Your data appears to be time-series or sequential. A line chart is perfect for showing trends over time.';
    } else if (hasNegative) {
      suggestedType = 'bar';
      reason = 'Your data includes negative values. A bar chart handles positive and negative values well.';
    } else if (dataPoints > 20) {
      suggestedType = 'area';
      reason = `With ${dataPoints} data points, an area chart provides a clear view of the overall trend and magnitude.`;
    } else {
      suggestedType = 'bar';
      reason = 'A bar chart is versatile and works well for comparing values across categories.';
    }
    
    setChartType(suggestedType);
    setAiSuggestion(reason);
    
    setTimeout(() => {
      setIsGettingAISuggestion(false);
    }, 800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      {/* Left Configuration Panel */}
      <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-bold text-gray-900 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Chart Configuration
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* 1. Data Source */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              1. Data Source
            </label>
            {dataSources.length === 0 ? (
              <div className="text-center py-4 text-sm text-gray-500 bg-gray-50 rounded-lg border border-gray-100 border-dashed">
                No data sources. Upload one first.
              </div>
            ) : (
              <select
                value={selectedDataSource || ''}
                onChange={(e) => setSelectedDataSource(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
              >
                <option value="">Select dataset...</option>
                {dataSources.map((ds) => (
                  <option key={ds.id} value={ds.id}>
                    {ds.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 2. Chart Type */}
          {selectedDataSource && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  2. Chart Type
                </label>
                {xAxisColumn && yAxisColumn && (
                  <button
                    onClick={handleAISuggestion}
                    disabled={isGettingAISuggestion}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center"
                  >
                    {isGettingAISuggestion ? 'Analyzing...' : '✨ AI Suggest'}
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {chartTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => {
                      setChartType(type.value as any);
                      setAiSuggestion('');
                    }}
                    className={`
                      flex flex-col items-center justify-center p-2 rounded-lg border transition-all
                      ${chartType === type.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700 ring-1 ring-primary-500'
                        : 'border-gray-200 hover:border-primary-200 hover:bg-gray-50 text-gray-600'}
                    `}
                    title={type.description}
                  >
                    <span className="text-xl mb-1">{type.icon}</span>
                    <span className="text-[10px] font-medium">{type.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
              
              {aiSuggestion && (
                <div className="mt-3 p-3 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-lg">
                  <div className="flex items-start">
                    <span className="text-lg mr-2">✨</span>
                    <p className="text-xs text-violet-800 leading-relaxed">{aiSuggestion}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {isLoadingPreview && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading data...</p>
            </div>
          )}

          {/* Error State */}
          {previewError && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-sm text-red-600">{previewError}</p>
            </div>
          )}

          {/* 3. Encodings */}
          {selectedDataSource && dataPreview && !isLoadingPreview && (
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                3. Data Mapping
              </label>
              
              {/* Data Info */}
              <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 text-xs text-gray-600">
                <span className="font-medium">{dataPreview.rows.length}</span> rows, 
                <span className="font-medium ml-1">{dataPreview.columns.length}</span> columns
              </div>
              
              {/* X-Axis */}
              <div>
                <span className="text-xs font-medium text-gray-700 mb-1 block">
                  {chartType === 'pie' || chartType === 'doughnut' ? 'Category (Labels)' : 'X-Axis (Dimension)'}
                </span>
                <select
                  value={xAxisColumn}
                  onChange={(e) => setXAxisColumn(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                >
                  <option value="">Select column...</option>
                  {dataPreview.columns.map((col) => (
                    <option key={col.name} value={col.name}>
                      {col.name} ({col.dtype})
                    </option>
                  ))}
                </select>
              </div>

              {/* Y-Axis */}
              <div>
                <span className="text-xs font-medium text-gray-700 mb-1 block">
                  {chartType === 'pie' || chartType === 'doughnut' ? 'Value (Size)' : 'Y-Axis (Measure)'}
                </span>
                <select
                  value={yAxisColumn}
                  onChange={(e) => setYAxisColumn(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                >
                  <option value="">Select column...</option>
                  {dataPreview.columns.map((col) => (
                    <option key={col.name} value={col.name}>
                      {col.name} ({col.dtype})
                    </option>
                  ))}
                </select>
              </div>

              {/* Aggregation */}
              <div>
                <span className="text-xs font-medium text-gray-700 mb-1 block">Aggregation</span>
                <select
                  value={aggregation}
                  onChange={(e) => setAggregation(e.target.value as AggregationType)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                >
                  <option value="sum">Sum</option>
                  <option value="count">Count</option>
                  <option value="avg">Average</option>
                  <option value="min">Minimum</option>
                  <option value="max">Maximum</option>
                  <option value="none">None (raw values)</option>
                </select>
                <p className="mt-1 text-xs text-gray-400">
                  How to combine values for each category
                </p>
              </div>

              {/* Title */}
              <div>
                <span className="text-xs font-medium text-gray-700 mb-1 block">Chart Title</span>
                <input
                  type="text"
                  value={chartTitle}
                  onChange={(e) => setChartTitle(e.target.value)}
                  placeholder="Auto-generated title"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleCreateChart}
            disabled={!isConfigValid}
            className="w-full py-2.5 px-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-600/20 transition-all active:scale-[0.98]"
          >
            Create Chart
          </button>
        </div>
      </div>

      {/* Right Preview Panel */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="font-bold text-gray-900">Live Preview</h2>
          {previewConfig && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
              Ready to Create
            </span>
          )}
        </div>
        
        <div className="flex-1 p-6 flex items-center justify-center bg-gray-50/30 relative">
          {/* Grid Background */}
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.5 }}></div>
          
          {previewConfig ? (
            <div className="w-full h-full relative z-10">
              <ChartRenderer
                config={previewConfig}
                description="Preview Mode"
              />
            </div>
          ) : (
            <div className="text-center relative z-10 max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Visualization Canvas</h3>
              <p className="mt-2 text-sm text-gray-500">
                Configure your data source and chart settings on the left to generate a preview here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

