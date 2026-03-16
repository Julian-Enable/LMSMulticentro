import request from 'supertest';
import app from '../index';

describe('Category Endpoints', () => {
  describe('GET /api/categories', () => {
    it('should return 200 and an array of categories', async () => {
      const res = await request(app).get('/api/categories');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should return 404 for non-existent category', async () => {
      const res = await request(app).get('/api/categories/non-existent-id');
      expect([404, 400]).toContain(res.statusCode);
    });
  });

  describe('POST /api/categories (unauthenticated)', () => {
    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .post('/api/categories')
        .send({ name: 'Test Category' });
      expect(res.statusCode).toBe(401);
    });
  });
});
