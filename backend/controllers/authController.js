const userService = require('../services/userService');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');

exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const existing = await userService.findByEmail(email);
        if (existing) return res.status(400).json({ error: 'Email já cadastrado' });

        const hashed = await hashPassword(password);
        const user = await userService.createUser({ name, email, password: hashed });
        res.status(201).json({ id: user.id, name: user.name, email: user.email });
    } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userService.findByEmail(email);
        if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });

        const valid = await comparePassword(password, user.password);
        if (!valid) return res.status(400).json({ error: 'Senha inválida' });

        const token = generateToken({ id: user.id, email: user.email });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) { next(err); }
};

exports.logout = (req, res) => {
    // Para JWT, geralmente só remove do frontend
    res.json({ message: 'Logout efetuado' });
};