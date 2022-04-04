const mongoose = require('mongoose');
const faker = require('faker');
const Inventory = require('../../src/models/inventory.model');

const inventoryOne = {
  _id: mongoose.Types.ObjectId(),
  author: faker.name.findName(),
  title: 'First Inventory',
  numberOfCopies: 3,
};

const inventoryTwo = {
  _id: mongoose.Types.ObjectId(),
  author: faker.name.findName(),
  title: 'Second Inventory',
  numberOfCopies: 2,
};

const insertInventories = async (inventories) => {
  await Inventory.insertMany(inventories);
};

module.exports = {
  inventoryOne,
  inventoryTwo,
  insertInventories,
};
