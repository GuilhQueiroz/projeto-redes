const User = require('../models/User');
const { comparePassword } = require('../utils/hash');

async function authenticate(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) return null;
    const valid = await comparePassword(password, user.password);
    return valid ? user : null;
}

module.exports = { authenticate };