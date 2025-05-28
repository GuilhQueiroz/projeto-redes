const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const { Sequelize } = require('sequelize');

async function getAllPosts(userId = null) {
    const posts = await Post.findAll({
        include: [
            { model: User, as: 'author', attributes: ['id', 'name', 'avatar'] },
            { model: Like, as: 'likes', attributes: ['userId'] },
            { model: Comment, as: 'comments', attributes: ['id', 'content'] }
        ],
        order: [['createdAt', 'DESC']]
    });

    return posts.map(post => {
        const postJson = post.toJSON();
        postJson.likesCount = postJson.likes.length;
        postJson.likedByUser = userId
            ? postJson.likes.some(like => like.userId === userId)
            : false;
        postJson.commentsCount = postJson.comments.length;
        delete postJson.likes;
        delete postJson.comments;
        return postJson;
    });
}

async function getPostById(id, userId = null) {
    const post = await Post.findByPk(id, {
        include: [
            { model: User, as: 'author', attributes: ['id', 'name', 'avatar'] },
            { model: Like, as: 'likes', attributes: ['userId'] },
            { model: Comment, as: 'comments', attributes: ['id', 'content'] }
        ]
    });
    if (!post) return null;
    const postJson = post.toJSON();
    postJson.likesCount = postJson.likes.length;
    postJson.likedByUser = userId
        ? postJson.likes.some(like => like.userId === userId)
        : false;
    postJson.commentsCount = postJson.comments.length;
    delete postJson.likes;
    delete postJson.comments;
    return postJson;
}

async function createPost(data) {
    return await Post.create(data);
}

async function updatePost(id, data) {
    return await Post.update(data, { where: { id } });
}

async function deletePost(id) {
    return await Post.destroy({ where: { id } });
}

async function getPostsByUser(userId) {
    return await Post.findAll({
        where: { userId },
        attributes: {
            include: [
                [
                    Sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM Comments AS comment
                        WHERE
                            comment.postId = Post.id
                            AND comment.parentId IS NULL
                    )`),
                    'commentCount'
                ]
            ]
        },
        include: [
            { association: 'author', attributes: ['id', 'name', 'avatar'] }
        ],
        order: [['createdAt', 'DESC']]
    });
}

module.exports = { 
    getAllPosts, 
    getPostById, 
    createPost, 
    updatePost, 
    deletePost,
    getPostsByUser 
};