const Post = require('../models/Post');
const User = require('../models/User');

async function getAllPosts() {
    return await Post.findAll({
        include: [{
            model: User,
            as: 'author', // ou o alias usado na associação
            attributes: ['name', 'avatar']
        }],
        order: [['createdAt', 'DESC']]
    });
}

async function getPostById(id) {
    return await Post.findByPk(id, {
        include: [{
            model: User,
            as: 'author',
            attributes: ['name', 'avatar']
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

module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost };