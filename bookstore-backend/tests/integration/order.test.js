const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Order } = require('../../src/models');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { orderOne, orderTwo, insertOrders } = require('../fixtures/order.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Order routes', () => {
  describe('POST /v1/orders', () => {
    let newOrder;

    beforeEach(() => {
      newOrder = {
        client: faker.name.findName(),
        orderDate: '2021-10-26T16:18:04.793Z',
        quantity: 2,
      };
    });

    test('should return 201 and successfully create new order if data is ok', async () => {
      await insertUsers([admin]);

      const res = await request(app)
        .post('/v1/orders')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newOrder)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        client: newOrder.client,
        orderDate: newOrder.orderDate,
        quantity: newOrder.quantity,
      });

      const dbOrder = await Order.findById(res.body.id);
      expect(dbOrder).toBeDefined();
      expect(dbOrder).toMatchObject({
        client: newOrder.client,
        orderDate: new Date(newOrder.orderDate),
        quantity: newOrder.quantity,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/orders').send(newOrder).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if logged in user is not admin', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/v1/orders')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newOrder)
        .expect(httpStatus.FORBIDDEN);
    });

    describe('GET /v1/orders', () => {
      test('should return 200 and apply the default query options', async () => {
        await insertUsers([userOne]);
        await insertOrders([orderOne, orderTwo]);

        const res = await request(app)
          .get('/v1/orders')
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
          id: orderOne._id.toHexString(),
          client: orderOne.client,
          orderDate: orderOne.orderDate,
          quantity: orderOne.quantity,
        });
      });

      test('should return 401 if access token is missing', async () => {
        await insertOrders([orderOne, orderTwo]);

        await request(app).get('/v1/orders').send().expect(httpStatus.UNAUTHORIZED);
      });

      test('should correctly apply filter on client field', async () => {
        await insertUsers([admin]);
        await insertOrders([orderOne, orderTwo]);

        const res = await request(app)
          .get('/v1/orders')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .query({ client: orderOne.client })
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
        expect(res.body.results[0].id).toBe(orderOne._id.toHexString());
      });

      test('should correctly apply filter on orderDate field', async () => {
        await insertUsers([admin]);
        await insertOrders([orderOne, orderTwo]);

        const res = await request(app)
          .get('/v1/orders')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .query({ orderDate: orderOne.orderDate })
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
        expect(res.body.results[0].id).toBe(orderOne._id.toHexString());
      });

      test('should correctly apply filter on quantity field', async () => {
        await insertUsers([admin]);
        await insertOrders([orderOne, orderTwo]);

        const res = await request(app)
          .get('/v1/orders')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .query({ quantity: orderOne.quantity })
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
        expect(res.body.results[0].id).toBe(orderOne._id.toHexString());
      });

      test('should limit returned array if limit param is specified', async () => {
        await insertUsers([admin]);
        await insertOrders([orderOne, orderTwo]);

        const res = await request(app)
          .get('/v1/orders')
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
        expect(res.body.results[0].id).toBe(orderOne._id.toHexString());
      });

      test('should return the correct page if page and limit params are specified', async () => {
        await insertUsers([admin]);
        await insertOrders([orderOne, orderTwo]);

        const res = await request(app)
          .get('/v1/orders')
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
        expect(res.body.results[0].id).toBe(orderTwo._id.toHexString());
      });
    });

    describe('GET /v1/orders/:orderId', () => {
      test('should return 200 and the order object if data is ok', async () => {
        await insertUsers([userOne]);
        await insertOrders([orderOne]);

        const res = await request(app)
          .get(`/v1/orders/${orderOne._id}`)
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .send()
          .expect(httpStatus.OK);

        expect(res.body).toEqual({
          id: orderOne._id.toHexString(),
          client: orderOne.client,
          orderDate: orderOne.orderDate,
          quantity: orderOne.quantity,
        });
      });

      test('should return 401 error if access token is missing', async () => {
        await insertOrders([orderOne]);

        await request(app).get(`/v1/orders/${orderOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
      });

      test('should return 400 error if inventoryId is not a valid mongo id', async () => {
        await insertUsers([admin]);
        await insertOrders([orderOne]);

        await request(app)
          .get('/v1/orders/invalidId')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send()
          .expect(httpStatus.BAD_REQUEST);
      });

      test('should return 404 error if order is not found', async () => {
        await insertUsers([admin]);
        await insertOrders([orderOne]);

        await request(app)
          .get(`/v1/orders/${orderTwo._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send()
          .expect(httpStatus.NOT_FOUND);
      });
    });

    describe('DELETE /v1/orders/:orderId', () => {
      test('should return 204 if data is ok', async () => {
        await insertUsers([admin]);
        await insertOrders([orderOne]);

        await request(app)
          .delete(`/v1/orders/${orderOne._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send()
          .expect(httpStatus.NO_CONTENT);

        const dbOrder = await Order.findById(orderOne._id);
        expect(dbOrder).toBeNull();
      });

      test('should return 401 error if access token is missing', async () => {
        await insertOrders([orderOne]);

        await request(app).delete(`/v1/orders/${orderOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
      });

      test('should return 403 error if non-admin user is trying to delete order', async () => {
        await insertUsers([userOne]);
        await insertOrders([orderOne]);

        await request(app)
          .delete(`/v1/orders/${orderOne._id}`)
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .send()
          .expect(httpStatus.FORBIDDEN);
      });

      test('should return 204 if admin is trying to delete order', async () => {
        await insertUsers([admin]);
        await insertOrders([orderOne]);

        await request(app)
          .delete(`/v1/orders/${orderOne._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send()
          .expect(httpStatus.NO_CONTENT);
      });

      test('should return 400 error if invalidId is not a valid mongo id', async () => {
        await insertUsers([admin]);

        await request(app)
          .delete('/v1/orders/invalidId')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send()
          .expect(httpStatus.BAD_REQUEST);
      });

      test('should return 404 error if order is not found', async () => {
        await insertUsers([admin]);

        await request(app)
          .delete(`/v1/orders/${orderOne._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send()
          .expect(httpStatus.NOT_FOUND);
      });
    });

    describe('PATCH /v1/orders/:orderId', () => {
      test('should return 200 and successfully update order if data is ok', async () => {
        await insertUsers([admin]);
        await insertOrders([orderOne]);
        const updateBody = {
          client: faker.name.findName(),
          orderDate: '2021-05-12T16:18:04.793Z',
          quantity: 1,
        };

        const res = await request(app)
          .patch(`/v1/orders/${orderOne._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(updateBody)
          .expect(httpStatus.OK);

        expect(res.body).toEqual({
          id: orderOne._id.toHexString(),
          client: updateBody.client,
          orderDate: updateBody.orderDate,
          quantity: updateBody.quantity,
        });

        const dbOrder = await Order.findById(orderOne._id);
        expect(dbOrder).toBeDefined();
        expect(dbOrder).toMatchObject({
          client: updateBody.client,
          orderDate: new Date(updateBody.orderDate),
          quantity: updateBody.quantity,
        });
      });

      test('should return 401 error if access token is missing', async () => {
        await insertOrders([orderOne]);
        const updateBody = { client: faker.name.findName() };

        await request(app).patch(`/v1/orders/${orderOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
      });

      test('should return 404 if admin is updating order that is not found', async () => {
        await insertUsers([admin]);
        const updateBody = { client: faker.name.findName() };

        await request(app)
          .patch(`/v1/orders/${orderOne._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(updateBody)
          .expect(httpStatus.NOT_FOUND);
      });

      test('should return 400 error if orderId is not a valid mongo id', async () => {
        await insertUsers([admin]);
        const updateBody = { client: faker.name.findName() };

        await request(app)
          .patch(`/v1/orders/invalidId`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(updateBody)
          .expect(httpStatus.BAD_REQUEST);
      });
    });
  });
});
