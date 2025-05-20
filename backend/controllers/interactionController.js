const interactionService = require('../services/interactionService');

exports.likePost = async (req, res, next) => {
    try {
        const { value } = req.body; // 1 ou -1
        await interactionService.likePost(req.user.id, req.params.postId, value);
        res.json({ message: 'Interação registrada' });
    } catch (err) { next(err); }
};

exports.likeComment = async (req, res, next) => {
    try {
        const { value } = req.body; // 1 ou -1
        await interactionService.likeComment(req.user.id, req.params.commentId, value);
        res.json({ message: 'Interação registrada' });
    } catch (err) { next(err); }
};