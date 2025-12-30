import { ApiClient } from './generated-api';
import { httpClient } from './api-wrapper';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const apiClient = new ApiClient(API_BASE_URL, httpClient);

export * from './generated-api';
