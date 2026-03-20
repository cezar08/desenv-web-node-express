import { User } from './user.model.js';
import { Post } from './post.model.js';

let initialized = false;

export function initModels() {
  if (initialized) return;
  initialized = true;

  // 1 -> N: um usuário pode ter vários posts
  User.hasMany(Post, { as: 'posts', foreignKey: 'userId' });

  // N -> 1: um post pertence a um usuário
  Post.belongsTo(User, { as: 'author', foreignKey: 'userId' });
}

export { User, Post };

