import request from 'supertest';
import app from '../../src/index';

const agent = request.agent(app);

describe('random url', () => {
    it.only('returns path not found', async () => {
        const res = await agent.get('/somerandompath');

        expect(res.statusCode).toBe(404);
        expect(res.text).toBe('path not found');
    });
});
