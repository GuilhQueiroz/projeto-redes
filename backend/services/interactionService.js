const Like = require('../models/Like');

async function toggleLikePost(userId, postId) {
    const existing = await Like.findOne({ where: { userId, postId } });
    if (existing) {
        await existing.destroy();
        const likesCount = await Like.count({ where: { postId } });
        return { liked: false, likesCount };
    }
    await Like.create({ userId, postId, value: 1 });
    const likesCount = await Like.count({ where: { postId } });
    return { liked: true, likesCount };
}

async function likeComment(userId, commentId) {
    const existing = await Like.findOne({ where: { userId, commentId } });
    if (existing) {
        await existing.destroy();
        const likesCount = await Like.count({ where: { commentId } });
        return { liked: false, likesCount };
    }
    await Like.create({ userId, commentId, value: 1 });
    const likesCount = await Like.count({ where: { commentId } });
    return { liked: true, likesCount };
}

module.exports = { 
    toggleLikePost,
    likeComment // <-- exporte a função!
};