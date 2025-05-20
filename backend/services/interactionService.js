const Like = require('../models/Like');

async function likePost(userId, postId, value) {
    // value: 1 (like), -1 (dislike)
    return await Like.upsert({ userId, postId, value });
}

async function likeComment(userId, commentId, value) {
    return await Like.upsert({ userId, commentId, value });
}

module.exports = { likePost, likeComment };