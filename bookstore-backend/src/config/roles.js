const allRoles = {
  user: ['getInventories', 'getOrders'],
  admin: ['getUsers', 'getInventories', 'getOrders', 'manageUsers', 'manageInventories', 'manageOrders'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
