import api from './userApi';
import type {
  DataSource,
  DataSourceListResponse,
  DataSourceUpdate,
  DataPreviewResponse,
  AIQueryRequest,
  AIQueryResponse,
  QueryHistoryResponse,
  AIQuery,
  ChartGenerationRequest,
  ChartGenerationResponse,
  InsightGenerationRequest,
  InsightGenerationResponse,
} from '../types';

// Data Source API
export const dataSourceApi = {
  // Upload CSV file
  uploadCSV: async (file: File, name?: string): Promise<DataSource> => {
    const formData = new FormData();
    formData.append('file', file);
    if (name) {
      formData.append('name', name);
    }
    
    const { data } = await api.post<DataSource>('/data/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  // Get all data sources
  getDataSources: async (
    skip: number = 0,
    limit: number = 20,
    sourceType?: string
  ): Promise<DataSourceListResponse> => {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });
    if (sourceType) {
      params.append('source_type', sourceType);
    }
    
    const { data } = await api.get<DataSourceListResponse>(`/data/sources?${params}`);
    return data;
  },

  // Get data source by ID
  getDataSource: async (id: number): Promise<DataSource> => {
    const { data } = await api.get<DataSource>(`/data/source/${id}`);
    return data;
  },

  // Update data source
  updateDataSource: async (id: number, updates: DataSourceUpdate): Promise<DataSource> => {
    const { data } = await api.patch<DataSource>(`/data/source/${id}`, updates);
    return data;
  },

  // Preview data source
  previewDataSource: async (
    id: number,
    limit: number = 100,
    offset: number = 0
  ): Promise<DataPreviewResponse> => {
    const { data } = await api.get<DataPreviewResponse>(
      `/data/source/${id}/preview?limit=${limit}&offset=${offset}`
    );
    return data;
  },

  // Delete data source
  deleteDataSource: async (id: number): Promise<void> => {
    await api.delete(`/data/source/${id}`);
  },
};

// AI Query API
export const aiQueryApi = {
  // Execute AI query
  executeQuery: async (request: AIQueryRequest): Promise<AIQueryResponse> => {
    const { data } = await api.post<AIQueryResponse>('/ai/query', request);
    return data;
  },

  // Get query history
  getQueryHistory: async (
    skip: number = 0,
    limit: number = 20,
    dataSourceId?: number
  ): Promise<QueryHistoryResponse> => {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });
    if (dataSourceId) {
      params.append('data_source_id', dataSourceId.toString());
    }
    
    const { data } = await api.get<QueryHistoryResponse>(`/ai/queries?${params}`);
    return data;
  },

  // Get query detail
  getQuery: async (id: number): Promise<AIQuery> => {
    const { data } = await api.get<AIQuery>(`/ai/query/${id}`);
    return data;
  },

  // Rerun query
  rerunQuery: async (id: number): Promise<AIQueryResponse> => {
    const { data } = await api.post<AIQueryResponse>(`/ai/query/${id}/rerun`);
    return data;
  },

  // Delete query
  deleteQuery: async (id: number): Promise<void> => {
    await api.delete(`/ai/query/${id}`);
  },
};

// Chart Generation API
export const chartApi = {
  // Generate chart from query
  generateChart: async (request: ChartGenerationRequest): Promise<ChartGenerationResponse> => {
    const { data } = await api.post<ChartGenerationResponse>('/ai/chart', request);
    return data;
  },
};

// Insight Generation API
export const insightApi = {
  // Generate insights from query
  generateInsight: async (request: InsightGenerationRequest): Promise<InsightGenerationResponse> => {
    const { data } = await api.post<InsightGenerationResponse>('/ai/insight', request);
    return data;
  },
};

