const faker = require('faker');
const { Order } = require('../../../src/models');

describe('Order model', () => {
  describe('Order validation', () => {
    let newOrder;
    beforeEach(() => {
      newOrder = {
        client: faker.name.findName(),
        orderDate: '2020-05-12T16:18:04.793Z',
        quantity: 3,
      };
    });

    test('should correctly validate a valid order', async () => {
      await expect(new Order(newOrder).validate()).resolves.toBeUndefined();
    });
  });
});
