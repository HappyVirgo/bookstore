const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Inventory } = require('../../src/models');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { inventoryOne, inventoryTwo, insertInventories } = require('../fixtures/inventory.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Inventory routes', () => {
  describe('POST /v1/inventories', () => {
    let newInventory;

    beforeEach(() => {
      newInventory = {
        author: faker.name.findName(),
        title: 'Inventory',
        numberOfCopies: 10,
      };
    });

    test('should return 201 and successfully create new inventory if data is ok', async () => {
      await insertUsers([admin]);

      const res = await request(app)
        .post('/v1/inventories')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newInventory)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        author: newInventory.author,
        title: newInventory.title,
        numberOfCopies: newInventory.numberOfCopies,
      });

      const dbInventory = await Inventory.findById(res.body.id);
      expect(dbInventory).toBeDefined();
      expect(dbInventory).toMatchObject({
        author: newInventory.author,
        title: newInventory.title,
        numberOfCopies: newInventory.numberOfCopies,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/inventories').send(newInventory).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if logged in user is not admin', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/v1/inventories')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newInventory)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if title is already used', async () => {
      await insertUsers([admin]);
      await insertInventories([inventoryOne]);
      newInventory.title = inventoryOne.title;

      await request(app)
        .post('/v1/inventories')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newInventory)
        .expect(httpStatus.BAD_REQUEST);
    });

    describe('GET /v1/inventories', () => {
      test('should return 200 and apply the default query options', async () => {
        await insertUsers([userOne]);
        await insertInventories([inventoryOne, inventoryTwo]);

        const res = await request(app)
          .get('/v1/inventories')
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .send()
          .expect(httpStatus.OK);

        expect(res.body).toEqual({
          results: expect.any(Array),
          page: 1,
          limit: 10,
          totalPages: 1,
          totalResults: 2,
        });
        expect(res.body.results).toHaveLength(2);
        expect(res.body.results[0]).toEqual({
          id: inventoryOne._id.toHexString(),
          author: inventoryOne.author,
          title: inventoryOne.title,
          numberOfCopies: inventoryOne.numberOfCopies,
        });
      });

      test('should return 401 if access token is missing', async () => {
        await insertInventories([inventoryOne, inventoryTwo]);

        await request(app).get('/v1/inventories').send().expect(httpStatus.UNAUTHORIZED);
      });

      test('should correctly apply filter on author field', async () => {
        await insertUsers([admin]);
        await insertInventories([inventoryOne, inventoryTwo]);

        const res = await request(app)
          .get('/v1/inventories')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .query({ author: inventoryOne.author })
          .send()
          .expect(httpStatus.OK);

        expect(res.body).toEqual({
          results: expect.any(Array),
          page: 1,
          limit: 10,
          totalPages: 1,
          totalResults: 1,
        });
        expect(res.body.results).toHaveLength(1);
        expect(res.body.results[0].id).toBe(inventoryOne._id.toHexString());
      });

      test('should correctly apply filter on numberOfCopies field', async () => {
        await insertUsers([admin]);
        await insertInventories([inventoryOne, inventoryTwo]);

        const res = await request(app)
          .get('/v1/inventories')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .query({ numberOfCopies: inventoryOne.numberOfCopies })
          .send()
          .expect(httpStatus.OK);

        expect(res.body).toEqual({
          results: expect.any(Array),
          page: 1,
          limit: 10,
          totalPages: 1,
          totalResults: 1,
        });
        expect(res.body.results).toHaveLength(1);
        expect(res.body.results[0].id).toBe(inventoryOne._id.toHexString());
      });

      test('should correctly sort the returned array if descending sort param is specified', async () => {
        await insertUsers([admin]);
        await insertInventories([inventoryOne, inventoryTwo]);

        const res = await request(app)
          .get('/v1/inventories')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .query({ sortBy: 'title:desc' })
          .send()
          .expect(httpStatus.OK);

        expect(res.body).toEqual({
          results: expect.any(Array),
          page: 1,
          limit: 10,
          totalPages: 1,
          totalResults: 2,
        });
        expect(res.body.results).toHaveLength(2);
        expect(res.body.results[0].id).toBe(inventoryTwo._id.toHexString());
        expect(res.body.results[1].id).toBe(inventoryOne._id.toHexString());
      });

      test('should correctly sort the returned array if ascending sort param is specified', async () => {
        await insertUsers([admin]);
        await insertInventories([inventoryOne, inventoryTwo]);

        const res = await request(app)
          .get('/v1/inventories')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .query({ sortBy: 'title:asc' })
          .send()
          .expect(httpStatus.OK);

        expect(res.body).toEqual({
          results: expect.any(Array),
          page: 1,
          limit: 10,
          totalPages: 1,
          totalResults: 2,
        });
        expect(res.body.results).toHaveLength(2);
        expect(res.body.results[0].id).toBe(inventoryOne._id.toHexString());
        expect(res.body.results[1].id).toBe(inventoryTwo._id.toHexString());
      });

      test('should limit returned array if limit param is specified', async () => {
        await insertUsers([admin]);
        await insertInventories([inventoryOne, inventoryTwo]);

        const res = await request(app)
          .get('/v1/inventories')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .query({ limit: 1 })
          .send()
          .expect(httpStatus.OK);

        expect(res.body).toEqual({
          results: expect.any(Array),
          page: 1,
          limit: 1,
          totalPages: 2,
          totalResults: 2,
        });
        expect(res.body.results).toHaveLength(1);
        expect(res.body.results[0].id).toBe(inventoryOne._id.toHexString());
      });

      test('should return the correct page if page and limit params are specified', async () => {
        await insertUsers([admin]);
        await insertInventories([inventoryOne, inventoryTwo]);

        const res = await request(app)
          .get('/v1/inventories')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .query({ page: 2, limit: 1 })
          .send()
          .expect(httpStatus.OK);

        expect(res.body).toEqual({
          results: expect.any(Array),
          page: 2,
          limit: 1,
          totalPages: 2,
          totalResults: 2,
        });
        expect(res.body.results).toHaveLength(1);
        expect(res.body.results[0].id).toBe(inventoryTwo._id.toHexString());
      });
    });

    describe('GET /v1/inventories/:inventoryId', () => {
      test('should return 200 and the inventory object if data is ok', async () => {
        await insertUsers([userOne]);
        await insertInventories([inventoryOne]);

        const res = await request(app)
          .get(`/v1/inventories/${inventoryOne._id}`)
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .send()
          .expect(httpStatus.OK);

        expect(res.body).toEqual({
          id: inventoryOne._id.toHexString(),
          author: inventoryOne.author,
          title: inventoryOne.title,
          numberOfCopies: inventoryOne.numberOfCopies,
        });
      });

      test('should return 401 error if access token is missing', async () => {
        await insertInventories([inventoryOne]);

        await request(app).get(`/v1/inventories/${inventoryOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
      });

      test('should return 400 error if inventoryId is not a valid mongo id', async () => {
        await insertUsers([admin]);
        await insertInventories([inventoryOne]);

        await request(app)
          .get('/v1/inventories/invalidId')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send()
          .expect(httpStatus.BAD_REQUEST);
      });

      test('should return 404 error if inventory is not found', async () => {
        await insertUsers([admin]);
        await insertInventories([inventoryOne]);

        await request(app)
          .get(`/v1/inventories/${inventoryTwo._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send()
          .expect(httpStatus.NOT_FOUND);
      });
    });

    describe('DELETE /v1/inventories/:inventoryId', () => {
      test('should return 204 if data is ok', async () => {
        await insertUsers([admin]);
        await insertInventories([inventoryOne]);

        await request(app)
          .delete(`/v1/inventories/${inventoryOne._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send()
          .expect(httpStatus.NO_CONTENT);

        const dbInventory = await Inventory.findById(inventoryOne._id);
        expect(dbInventory).toBeNull();
      });

      test('should return 401 error if access token is missing', async () => {
        await insertInventories([inventoryOne]);

        await request(app).delete(`/v1/inventories/${inventoryOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
      });

      test('should return 403 error if non-admin user is trying to delete inventory', async () => {
        await insertUsers([userOne]);
        await insertInventories([inventoryOne]);

        await request(app)
          .delete(`/v1/inventories/${inventoryOne._id}`)
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .send()
          .expect(httpStatus.FORBIDDEN);
      });

      test('should return 204 if admin is trying to delete inventory', async () => {
        await insertUsers([admin]);
        await insertInventories([inventoryOne]);

        await request(app)
          .delete(`/v1/inventories/${inventoryOne._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send()
          .expect(httpStatus.NO_CONTENT);
      });

      test('should return 400 error if invalidId is not a valid mongo id', async () => {
        await insertUsers([admin]);

        await request(app)
          .delete('/v1/inventories/invalidId')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send()
          .expect(httpStatus.BAD_REQUEST);
      });

      test('should return 404 error if inventory is not found', async () => {
        await insertUsers([admin]);

        await request(app)
          .delete(`/v1/inventories/${inventoryOne._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send()
          .expect(httpStatus.NOT_FOUND);
      });
    });

    describe('PATCH /v1/inventories/:inventoryId', () => {
      test('should return 200 and successfully update inventory if data is ok', async () => {
        await insertUsers([admin]);
        await insertInventories([inventoryOne]);
        const updateBody = {
          author: faker.name.findName(),
          title: 'New Inventory',
          numberOfCopies: 1,
        };

        const res = await request(app)
          .patch(`/v1/inventories/${inventoryOne._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(updateBody)
          .expect(httpStatus.OK);

        expect(res.body).toEqual({
          id: inventoryOne._id.toHexString(),
          author: updateBody.author,
          title: updateBody.title,
          numberOfCopies: updateBody.numberOfCopies,
        });

        const dbInventory = await Inventory.findById(inventoryOne._id);
        expect(dbInventory).toBeDefined();
        expect(dbInventory).toMatchObject({
          author: updateBody.author,
          title: updateBody.title,
          numberOfCopies: updateBody.numberOfCopies,
        });
      });

      test('should return 401 error if access token is missing', async () => {
        await insertInventories([inventoryOne]);
        const updateBody = { author: faker.name.findName() };

        await request(app).patch(`/v1/inventories/${inventoryOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
      });

      test('should return 404 if admin is updating inventory that is not found', async () => {
        await insertUsers([admin]);
        const updateBody = { author: faker.name.findName() };

        await request(app)
          .patch(`/v1/inventories/${inventoryOne._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(updateBody)
          .expect(httpStatus.NOT_FOUND);
      });

      test('should return 400 error if inventoryId is not a valid mongo id', async () => {
        await insertUsers([admin]);
        const updateBody = { author: faker.name.findName() };

        await request(app)
          .patch(`/v1/inventories/invalidId`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(updateBody)
          .expect(httpStatus.BAD_REQUEST);
      });

      test('should return 400 if title is already taken', async () => {
        await insertUsers([admin]);
        await insertInventories([inventoryOne, inventoryTwo]);
        const updateBody = { title: inventoryTwo.title };

        await request(app)
          .patch(`/v1/inventories/${inventoryOne._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(updateBody)
          .expect(httpStatus.BAD_REQUEST);
      });

      test('should not return 400 if title is my title', async () => {
        await insertUsers([admin]);
        await insertInventories([inventoryOne]);
        const updateBody = { title: inventoryOne.title };

        await request(app)
          .patch(`/v1/inventories/${inventoryOne._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(updateBody)
          .expect(httpStatus.OK);
      });
    });
  });
});
