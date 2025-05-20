const postService = require('../services/postService');

exports.getAllPosts = async (req, res, next) => {
    try {
        const posts = await postService.getAllPosts();
        res.json(posts);
    } catch (err) { next(err); }
};

exports.getPostById = async (req, res, next) => {
    try {
        const post = await postService.getPostById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post não encontrado' });
        res.json(post);
    } catch (err) { next(err); }
};

exports.createPost = async (req, res, next) => {
    try {
        const data = { ...req.body, userId: req.user.id };
        const post = await postService.createPost(data);
        res.status(201).json(post);
    } catch (err) { next(err); }
};

exports.updatePost = async (req, res, next) => {
    try {
        await postService.updatePost(req.params.id, req.body);
        res.json({ message: 'Post atualizado' });
    } catch (err) { next(err); }
};

exports.deletePost = async (req, res, next) => {
    try {
        await postService.deletePost(req.params.id);
        res.json({ message: 'Post excluído' });
    } catch (err) { next(err); }
};

exports.votePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const { type } = req.body; // 'up' ou 'down'
        // Implemente a lógica de voto aqui (exemplo simples):
        // await postService.vote(postId, req.user.id, type);
        res.json({ message: 'Voto registrado!' });
    } catch (err) {
        next(err);
    }
};