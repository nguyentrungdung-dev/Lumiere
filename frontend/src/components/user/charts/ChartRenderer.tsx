import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { ChartConfig } from '../../../types';

interface ChartRendererProps {
  config: ChartConfig;
  title?: string;
  description?: string;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export const ChartRenderer: React.FC<ChartRendererProps> = ({ config, title, description }) => {
  const renderChart = () => {
    const { type, labels, datasets } = config;

    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={labels.map((label: string, idx: number) => ({
              name: label,
              value: datasets[0].data[idx],
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3B82F6" name={datasets[0].label} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={labels.map((label: string, idx: number) => ({
              name: label,
              value: datasets[0].data[idx],
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                strokeWidth={2}
                name={datasets[0].label}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={labels.map((label: string, idx: number) => ({
              name: label,
              value: datasets[0].data[idx],
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.6}
                name={datasets[0].label}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
      case 'doughnut':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={labels.map((label: string, idx: number) => ({
                  name: label,
                  value: datasets[0].data[idx],
                }))}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={type === 'doughnut' ? 120 : 140}
                innerRadius={type === 'doughnut' ? 60 : 0}
                fill="#8884d8"
                dataKey="value"
              >
                {labels.map((_: string, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" name="X" />
              <YAxis dataKey="y" name="Y" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter
                name={datasets[0].label}
                data={datasets[0].data}
                fill="#3B82F6"
              />
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="flex items-center justify-center h-96 text-gray-500">
            Unsupported chart type: {type}
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {(title || config.title) && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title || config.title}</h3>
          {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
          {config.explanation && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">{config.explanation}</p>
            </div>
          )}
        </div>
      )}
      <div className="w-full">{renderChart()}</div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Chart Type:</span>
          <span className="font-medium text-gray-900 capitalize">{config.type}</span>
        </div>
      </div>
    </div>
  );
};

