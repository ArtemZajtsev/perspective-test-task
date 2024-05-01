import request from 'supertest';
import app from '../../src/index';
import { usersPrefix } from '../../src/router';

import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../../src/model/User';
import { clearDb, closeTestDb, connectTestDb, createUsers } from '../db';

const agent = request.agent(app);

describe('POST /users', () => {
    let testDb: MongoMemoryServer;

    beforeAll(async () => {
        testDb = await connectTestDb();
    });

    afterAll(async () => {
        await closeTestDb(testDb);
    });

    afterEach(async () => {
        await clearDb();
    });

    it('creates user successfully', async () => {
        const res = await agent.post(usersPrefix).send({ name: 'test', email: 'test@test.com' });

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(
            expect.objectContaining({
                name: 'test',
                email: 'test@test.com',
            }),
        );
    });

    it('throws when creating duplicate email', async () => {
        const testUser = new User({ name: 'test', email: 'test@test.com' });

        await createUsers([testUser]);

        const res = await agent
            .post(usersPrefix)
            .send({ name: testUser.name, email: testUser.email });

        expect(res.statusCode).toBe(409);
        expect(res.body).toEqual({
            error: 'This email already exist',
        });
    });

    it('user has creation date', async () => {
        const res = await agent.post(usersPrefix).send({ name: 'test', email: 'test@test.com' });

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(
            expect.objectContaining({
                createdAt: expect.any(String),
            }),
        );
    });
});
