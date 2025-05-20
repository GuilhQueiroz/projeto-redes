const commentService = require('../services/commentService');

exports.getCommentsByPost = async (req, res, next) => {
    try {
        const comments = await commentService.getCommentsByPost(req.params.postId);
        res.json(comments);
    } catch (err) { next(err); }
};

exports.createComment = async (req, res, next) => {
    try {
        const data = { ...req.body, userId: req.user.id, postId: req.params.postId };
        const comment = await commentService.createComment(data);
        res.status(201).json(comment);
    } catch (err) { next(err); }
};

exports.replyToComment = async (req, res, next) => {
    try {
        const data = { ...req.body, userId: req.user.id, parentId: req.params.commentId };
        const reply = await commentService.createComment(data);
        res.status(201).json(reply);
    } catch (err) { next(err); }
};