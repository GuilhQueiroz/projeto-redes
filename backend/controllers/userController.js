const userService = require('../services/userService');

exports.getProfile = async (req, res, next) => {
    try {
        const user = await userService.findByEmail(req.user.email);
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
        res.json({
            name: user.name,
            surname: user.surname,
            bio: user.bio,
            email: user.email,
            avatar: user.avatar
        });
    } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const data = req.body;
        if (req.file) data.avatar = req.file.filename;
        await userService.updateUser(req.user.id, data);
        res.json({ message: 'Perfil atualizado' });
    } catch (err) { next(err); }
};