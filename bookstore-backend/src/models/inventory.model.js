const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const inventorySchema = mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    numberOfCopies: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
inventorySchema.plugin(toJSON);
inventorySchema.plugin(paginate);

/**
 * Check if title is taken
 * @param {string} title - The title of inventory
 * @param {ObjectId} [excludeInventoryId] - The id of the inventory to be excluded
 * @returns {Promise<boolean>}
 */
inventorySchema.statics.isTitleTaken = async function (title, excludeInventoryId) {
  const inventory = await this.findOne({ title, _id: { $ne: excludeInventoryId } });
  return !!inventory;
};

/**
 * @typedef Inventory
 */
const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
