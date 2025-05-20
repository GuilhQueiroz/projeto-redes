const Comment = require('../models/Comment');

async function getCommentsByPost(postId) {
    return await Comment.findAll({ where: { postId, parentId: null } });
}

async function getReplies(parentId) {
    return await Comment.findAll({ where: { parentId } });
}

async function createComment(data) {
    return await Comment.create(data);
}

module.exports = { getCommentsByPost, getReplies, createComment };