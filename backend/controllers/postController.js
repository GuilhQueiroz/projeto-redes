const postService = require('../services/postService');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.getAllPosts = async (req, res, next) => {
    try {
        // req.user pode ser undefined se não estiver autenticado
        const userId = req.user ? req.user.id : null;
        const posts = await postService.getAllPosts(userId);
        res.json(posts);
    } catch (err) { next(err); }
};

exports.getPostById = async (req, res, next) => {
    try {
        const userId = req.user ? req.user.id : null;
        const post = await postService.getPostById(req.params.id, userId);
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
        const postId = req.params.id;
        // Remove todos os comentários do post
        await Comment.destroy({ where: { postId } });
        // Remove o post
        await Post.destroy({ where: { id: postId } });
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

exports.votePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const { type } = req.body; // 'up' ou 'down'
        res.json({ message: 'Voto registrado!' });
    } catch (err) {
        next(err);
    }
};