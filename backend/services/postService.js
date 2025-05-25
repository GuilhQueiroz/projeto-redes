const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const { Sequelize } = require('sequelize');

async function getAllPosts() {
    const posts = await Post.findAll({
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
            { association: 'author', attributes: ['id', 'name'] }
        ],
        order: [['createdAt', 'DESC']]
    });
    return posts;
}

async function getPostById(id) {
    return await Post.findByPk(id, {
        include: [{
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'avatar']
        }]
    });
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