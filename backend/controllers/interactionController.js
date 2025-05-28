const interactionService = require('../services/interactionService');

exports.likePost = async (req, res, next) => {
    try {
        const result = await interactionService.toggleLikePost(req.user.id, req.params.postId);
        res.json(result); // { liked: true/false, likesCount: N }
    } catch (err) { next(err); }
};

exports.likeComment = async (req, res, next) => {
    try {
        const result = await interactionService.likeComment(req.user.id, req.params.commentId);
        res.json(result); // { liked: true/false, likesCount: N }
    } catch (err) { next(err); }
};