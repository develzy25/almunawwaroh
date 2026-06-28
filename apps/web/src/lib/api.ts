const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

class ApiClient {
  private async request(path: string, options: RequestInit = {}) {
    const url = `${API_URL}${path}`;
    const headers = new Headers(options.headers);
    if (!(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Kirim cookie otentikasi HttpOnly
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error((errorData as { error?: string })?.error || `API Request gagal dengan kode ${response.status}`);
    }

    return response.json();
  }

  // GET helper
  async get(path: string) {
    return this.request(path, { method: 'GET' });
  }

  // POST helper
  async post(path: string, data: unknown) {
    return this.request(path, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  // PUT helper
  async put(path: string, data: unknown) {
    return this.request(path, {
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  // DELETE helper
  async delete(path: string) {
    return this.request(path, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
export { API_URL };
