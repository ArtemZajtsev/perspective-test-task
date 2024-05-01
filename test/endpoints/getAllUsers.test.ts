import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../../src';
import User from '../../src/model/User';
import { usersPrefix } from '../../src/router';
import { closeTestDb, connectTestDb, createUsers } from '../db';

const agent = request.agent(app);

describe('GET /users', () => {
    let testDb: MongoMemoryServer;

    beforeAll(async () => {
        testDb = await connectTestDb();

        await createUsers([
            new User({ name: 'name1', email: 'name1@pew.com' }),
            new User({ name: 'name2', email: 'name2@pew.com' }),
            new User({ name: 'name3', email: 'name3@pew.com' }),
        ]);

        // second batch to have different createdAt time
        await createUsers([
            new User({ name: 'name4', email: 'name4@pew.com' }),
            new User({ name: 'name5', email: 'name5@pew.com' }),
            new User({ name: 'name6', email: 'name6@pew.com' }),
        ]);
    });

    afterAll(async () => {
        await closeTestDb(testDb);
    });

    it('returns all users, default order asc, default skip 0, default limit 20', async () => {
        const res = await agent.get(usersPrefix);

        expect(res.statusCode).toBe(200);
        expect(res.body.pagination).toEqual({
            skip: 0,
            limit: 20,
            totalRecords: 6,
            recordsLeft: 0,
        });
        expect(res.body.users.length).toBe(6);
        expect(res.body.users[0]).toEqual(
            expect.objectContaining({
                name: 'name1',
                email: 'name1@pew.com',
            }),
        );
        expect(Date.parse(res.body.users[0].createdAt)).toBeLessThan(
            Date.parse(res.body.users[res.body.users.length - 1].createdAt),
        );
    });

    describe('sorted response', () => {
        it('returns users sorted asc with query param ?created=ascending', async () => {
            const res = await agent.get(usersPrefix).query({ created: 'ascending' });

            expect(res.statusCode).toBe(200);
            expect(Date.parse(res.body.users[0].createdAt)).toBeLessThan(
                Date.parse(res.body.users[res.body.users.length - 1].createdAt),
            );
        });

        it('returns users sorted desc with query param ?created=desc', async () => {
            const res = await agent.get(usersPrefix).query({ created: 'desc' });

            expect(res.statusCode).toBe(200);
            expect(Date.parse(res.body.users[0].createdAt)).toBeGreaterThan(
                Date.parse(res.body.users[res.body.users.length - 1].createdAt),
            );
        });
    });

    describe('pagination', () => {
        it('skip query param skips records', async () => {
            const res = await agent.get(usersPrefix).query({ skip: 5 });

            expect(res.statusCode).toBe(200);
            expect(res.body.pagination).toEqual({
                skip: 5,
                limit: 20,
                totalRecords: 6,
                recordsLeft: 0,
            });
            expect(res.body.users.length).toBe(1);
        });

        it('limit query param limits returned records', async () => {
            const res = await agent.get(usersPrefix).query({ limit: 2 });

            expect(res.statusCode).toBe(200);
            expect(res.body.pagination).toEqual({
                skip: 0,
                limit: 2,
                totalRecords: 6,
                recordsLeft: 4,
            });
            expect(res.body.users.length).toBe(2);
        });

        it('returns correct pagination metadata based on query params', async () => {
            const res = await agent.get(usersPrefix).query({ skip: 2, limit: 3 });

            expect(res.statusCode).toBe(200);
            expect(res.body.pagination).toEqual({
                skip: 2,
                limit: 3,
                totalRecords: 6,
                recordsLeft: 1,
            });
            expect(res.body.users.length).toBe(3);
        });
    });

    describe('input validation', () => {
        it('fails with incorrect created query param', async () => {
            const res = await agent.get(usersPrefix).query({ created: 'ascccc' });

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({
                error: '"created" must be one of [asc, desc, ascending, descending]',
            });
        });

        it('fails if skip query param is not a number', async () => {
            const res = await agent.get(usersPrefix).query({ skip: '123not-a-number123' });

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({
                error: '"skip" must be a number',
            });
        });

        it('fails if skip query param is less than 0', async () => {
            const res = await agent.get(usersPrefix).query({ skip: -69 });

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({
                error: '"skip" must be greater than or equal to 0',
            });
        });

        it('fails if limit query param is not a number', async () => {
            const res = await agent.get(usersPrefix).query({ limit: '123not-a-number123' });

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({
                error: '"limit" must be a number',
            });
        });

        it('fails if limit query param is less than 0', async () => {
            const res = await agent.get(usersPrefix).query({ limit: -69 });

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({
                error: '"limit" must be greater than or equal to 0',
            });
        });
    });
});
