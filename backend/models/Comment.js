const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Post = require('./Post');

const Comment = sequelize.define('Comment', {
    content: { type: DataTypes.TEXT, allowNull: false },
    parentId: { type: DataTypes.INTEGER, allowNull: true }, // Para respostas
}, {});

Comment.belongsTo(User, { as: 'author', foreignKey: 'userId' });
Comment.belongsTo(Post, { foreignKey: 'postId' });
Comment.hasMany(Comment, { as: 'replies', foreignKey: 'parentId' });

module.exports = Comment;