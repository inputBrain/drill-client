const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export class CustomHttpClient {
  async fetch(url: RequestInfo, init?: RequestInit): Promise<Response> {
    const fullUrl = typeof url === 'string' && !url.startsWith('http')
      ? `${API_BASE_URL}${url}`
      : url;

    const timestamp = new Date().toISOString();
    const method = init?.method || 'GET';
    const urlString = typeof fullUrl === 'string' ? fullUrl : fullUrl.url;

    console.log(`[${timestamp}] ${method} ${urlString}`, init?.body ? { body: init.body } : '');

    const response = await fetch(fullUrl, init);
    return response;
  }
}

export const httpClient = new CustomHttpClient();
