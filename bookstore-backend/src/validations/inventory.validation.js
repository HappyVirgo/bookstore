const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createInventory = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    numberOfCopies: Joi.number().integer().required(),
    author: Joi.string().required(),
  }),
};

const getInventories = {
  query: Joi.object().keys({
    author: Joi.string(),
    numberOfCopies: Joi.number().integer(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getInventory = {
  params: Joi.object().keys({
    inventoryId: Joi.string().custom(objectId),
  }),
};

const updateInventory = {
  params: Joi.object().keys({
    inventoryId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      author: Joi.string(),
      title: Joi.string(),
      numberOfCopies: Joi.number().integer(),
    })
    .min(1),
};

const deleteInventory = {
  params: Joi.object().keys({
    inventoryId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createInventory,
  getInventories,
  getInventory,
  updateInventory,
  deleteInventory,
};
