import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

export class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
      field: 'passwordHash',
    },
    role: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: 'visitante',
      validate: {
        isIn: [['admin', 'visitante']],
      },
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
    underscored: false,
    defaultScope: {
      attributes: { exclude: ['passwordHash'] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ['passwordHash'] },
      },
    },
  },
);

