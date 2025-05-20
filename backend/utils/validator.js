function isEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password) {
    // Exemplo: pelo menos 6 caracteres
    return typeof password === 'string' && password.length >= 6;
}

module.exports = { isEmail, isStrongPassword };