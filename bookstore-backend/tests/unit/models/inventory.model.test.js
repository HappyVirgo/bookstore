const faker = require('faker');
const { Inventory } = require('../../../src/models');

describe('Inventory model', () => {
  describe('Inventory validation', () => {
    let newInventory;
    beforeEach(() => {
      newInventory = {
        author: faker.name.findName(),
        title: 'First Inventory',
        numberOfCopies: 3,
      };
    });

    test('should correctly validate a valid inventory', async () => {
      await expect(new Inventory(newInventory).validate()).resolves.toBeUndefined();
    });
  });
});
