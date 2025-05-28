const commentService = require('../services/commentService');

exports.getCommentsByPost = async (req, res, next) => {
    try {
        const userId = req.user ? req.user.id : null;
        const comments = await commentService.getCommentsByPost(req.params.postId, userId);
        res.json(comments);
    } catch (err) { next(err); }
};

exports.createComment = async (req, res, next) => {
    try {
        const data = { ...req.body, userId: req.user.id, postId: req.params.postId };
        const comment = await commentService.createComment(data);
        // Busque novamente incluindo o autor
        const commentWithAuthor = await comment.reload({
            include: [{ model: require('../models/User'), as: 'author', attributes: ['id', 'name', 'avatar'] }]
        });
        res.status(201).json(commentWithAuthor);
    } catch (err) { next(err); }
};

exports.replyToComment = async (req, res, next) => {
    try {
        const data = { ...req.body, userId: req.user.id, parentId: req.params.commentId };
        const reply = await commentService.createComment(data);
        const replyWithAuthor = await reply.reload({
            include: [{ model: require('../models/User'), as: 'author', attributes: ['id', 'name', 'avatar'] }]
        });
        res.status(201).json(replyWithAuthor);
    } catch (err) { next(err); }
};