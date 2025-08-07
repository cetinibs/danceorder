import { AppError } from './errorHandler';

export const api = {
  async get(url: string) {
    const res = await fetch(url);
    if (!res.ok) throw new AppError(await res.text(), res.status);
    return res.json();
  },

  async post(url: string, data: any) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new AppError(await res.text(), res.status);
    return res.json();
  },

  // Diğer metodlar...
}; 