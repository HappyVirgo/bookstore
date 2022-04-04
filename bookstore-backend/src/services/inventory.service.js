const httpStatus = require('http-status');
const { Inventory } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create an inventory
 * @param {Object} inventoryBody
 * @returns {Promise<Inventory>}
 */
const createInventory = async (inventoryBody) => {
  if (await Inventory.isTitleTaken(inventoryBody.title)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Title already taken');
  }
  return Inventory.create(inventoryBody);
};

/**
 * Query for inventories
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryInventories = async (filter, options) => {
  const inventories = await Inventory.paginate(filter, options);
  return inventories;
};

/**
 * Get inventory by id
 * @param {ObjectId} id
 * @returns {Promise<Inventory>}
 */
const getInventoryById = async (id) => {
  return Inventory.findById(id);
};

/**
 * Get inventory by title
 * @param {string} title
 * @returns {Promise<Inventory>}
 */
const getInventoryByTitle = async (title) => {
  return Inventory.findOne({ title });
};

/**
 * Update inventory by id
 * @param {ObjectId} inventoryId
 * @param {Object} updateBody
 * @returns {Promise<Inventory>}
 */
const updateInventoryById = async (inventoryId, updateBody) => {
  const inventory = await getInventoryById(inventoryId);
  if (!inventory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Inventory not found');
  }
  if (updateBody.title && (await Inventory.isTitleTaken(updateBody.title, inventoryId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Title already taken');
  }
  Object.assign(inventory, updateBody);
  await inventory.save();
  return inventory;
};

/**
 * Delete inventory by id
 * @param {ObjectId} inventoryId
 * @returns {Promise<Inventory>}
 */
const deleteInventoryById = async (inventoryId) => {
  const inventory = await getInventoryById(inventoryId);
  if (!inventory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Inventory not found');
  }
  await inventory.remove();
  return inventory;
};

module.exports = {
  createInventory,
  queryInventories,
  getInventoryById,
  getInventoryByTitle,
  updateInventoryById,
  deleteInventoryById,
};
