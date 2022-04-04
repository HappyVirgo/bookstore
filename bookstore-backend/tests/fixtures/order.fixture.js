const mongoose = require('mongoose');
const faker = require('faker');
const Order = require('../../src/models/order.model');

const orderOne = {
  _id: mongoose.Types.ObjectId(),
  client: faker.name.findName(),
  orderDate: '2020-05-12T16:18:04.793Z',
  quantity: 3,
};

const orderTwo = {
  _id: mongoose.Types.ObjectId(),
  client: faker.name.findName(),
  orderDate: '2021-11-26T16:18:04.793Z',
  quantity: 2,
};

const insertOrders = async (orders) => {
  await Order.insertMany(orders);
};

module.exports = {
  orderOne,
  orderTwo,
  insertOrders,
};
