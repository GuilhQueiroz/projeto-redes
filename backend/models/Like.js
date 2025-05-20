const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

const Like = sequelize.define('Like', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    commentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    value: {
        type: DataTypes.INTEGER, // 1 para like, -1 para dislike
        allowNull: false,
    }
}, {});

// Relacionamentos
Like.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Like.belongsTo(Post, { foreignKey: 'postId', as: 'post' });
Like.belongsTo(Comment, { foreignKey: 'commentId', as: 'comment' });

// (Opcional) Para acessar likes a partir de User, Post, Comment:
User.hasMany(Like, { foreignKey: 'userId', as: 'likes' });
Post.hasMany(Like, { foreignKey: 'postId', as: 'likes' });
Comment.hasMany(Like, { foreignKey: 'commentId', as: 'likes' });

module.exports = Like;