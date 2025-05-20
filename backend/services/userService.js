const User = require('../models/User');

async function findByEmail(email) {
    return await User.findOne({ where: { email } });
}

async function createUser(data) {
    return await User.create(data);
}

async function updateUser(id, data) {
    return await User.update(data, { where: { id } });
}

module.exports = { findByEmail, createUser, updateUser };