const Comment = require('../models/Comment');
const Like = require('../models/Like');
const User = require('../models/User');

async function getCommentsByPost(postId, userId = null) {
    const comments = await Comment.findAll({
        where: { postId },
        order: [['createdAt', 'ASC']],
        include: [
            { model: User, as: 'author', attributes: ['id', 'name', 'avatar'] },
            { model: Like, as: 'likes', attributes: ['userId'] }
        ]
    });

    return comments.map(comment => {
        const c = comment.toJSON();
        c.likesCount = c.likes.length;
        c.likedByUser = userId
            ? c.likes.some(like => like.userId === userId)
            : false;
        delete c.likes;
        return c;
    });
}

async function getReplies(parentId) {
    return await Comment.findAll({ where: { parentId } });
}

async function createComment(data) {
    return await Comment.create(data);
}

module.exports = { getCommentsByPost, getReplies, createComment };