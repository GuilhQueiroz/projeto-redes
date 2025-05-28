const Post = require('./Post');
const Comment = require('./Comment');
const User = require('./User');
const Like = require('./Like');

// Associações principais:
Post.hasMany(Comment, { as: 'comments', foreignKey: 'postId' });
Comment.belongsTo(Post, { foreignKey: 'postId' });