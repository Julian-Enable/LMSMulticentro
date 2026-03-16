import request from 'supertest';
import app from '../index';

describe('Video Endpoints', () => {
  describe('GET /api/videos', () => {
    it('should return 200 and an array of videos', async () => {
      const res = await request(app).get('/api/videos');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/videos/:id', () => {
    it('should return 404 for non-existent video', async () => {
      const res = await request(app).get('/api/videos/non-existent-id');
      expect([404, 400]).toContain(res.statusCode);
    });
  });

  describe('POST /api/videos (unauthenticated)', () => {
    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .post('/api/videos')
        .send({ title: 'Test Video', externalId: 'abc123', platform: 'YOUTUBE', categoryId: 'test' });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('DELETE /api/videos/:id (unauthenticated)', () => {
    it('should return 401 when not authenticated', async () => {
      const res = await request(app).delete('/api/videos/some-id');
      expect(res.statusCode).toBe(401);
    });
  });
});
