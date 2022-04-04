const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const inventoryValidation = require('../../validations/inventory.validation');
const inventoryController = require('../../controllers/inventory.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageInventories'), validate(inventoryValidation.createInventory), inventoryController.createInventory)
  .get(auth('getInventories'), validate(inventoryValidation.getInventories), inventoryController.getInventories);

router
  .route('/:inventoryId')
  .get(auth('getInventories'), validate(inventoryValidation.getInventory), inventoryController.getInventory)
  .patch(auth('manageInventories'), validate(inventoryValidation.updateInventory), inventoryController.updateInventory)
  .delete(auth('manageInventories'), validate(inventoryValidation.deleteInventory), inventoryController.deleteInventory);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Inventories
 *   description: Inventory management and retrieval
 */

/**
 * @swagger
 * /inventories:
 *   post:
 *     summary: Create an inventory
 *     description: Only admins can create other inventories.
 *     tags: [Inventories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - numberOfCopies
 *             properties:
 *               author:
 *                 type: string
 *               title:
 *                 type: string
 *                 description: must be unique
 *               numberOfCopies:
 *                  type: number
 *             example:
 *               author: Michale Jordan
 *               title: first inventory
 *               numberOfCopies: 3
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Inventory'
 *       "400":
 *         $ref: '#/components/responses/DuplicateTitle'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all inventories
 *     description: Logged in users can retrieve all inventories.
 *     tags: [Inventories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Author of inventory
 *       - in: query
 *         name: numberOfCopies
 *         schema:
 *           type: number
 *         description: number of copies inventory
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. title:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of inventories
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Inventory'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /inventories/{id}:
 *   get:
 *     summary: Get an inventory
 *     description: Logged in users can fetch inventories information.
 *     tags: [Inventories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Inventory id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Inventory'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update an inventory
 *     description: Logged in inventories can only update their own information. Only admins can update other inventories.
 *     tags: [Inventories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Inventory id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                author:
 *                  type: string
 *                title:
 *                  type: string
 *                numberOfCopies:
 *                  type: number
 *             example:
 *               author: Michel Jorndan
 *               title: First Inventory
 *               numberOfCopies: 3
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Inventory'
 *       "400":
 *         $ref: '#/components/responses/DuplicateTitle'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete an inventory
 *     description: Logged in users can delete only themselves. Only admins can delete other inventories.
 *     tags: [Inventories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Inventory id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
