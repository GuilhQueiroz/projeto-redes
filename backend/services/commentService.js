const Comment = require('../models/Comment');
const User = require('../models/User');

async function getCommentsByPost(postId) {
    return await Comment.findAll({
        where: { postId },
        order: [['createdAt', 'ASC']],
        include: [{ model: User, as: 'author', attributes: ['id', 'name', 'avatar'] }]
    });
}

async function getReplies(parentId) {
    return await Comment.findAll({ where: { parentId } });
}

async function createComment(data) {
    return await Comment.create(data);
}

module.exports = { getCommentsByPost, getReplies, createComment };