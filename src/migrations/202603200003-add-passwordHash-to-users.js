export async function up({ queryInterface, Sequelize }) {
  await queryInterface.addColumn('Users', 'passwordHash', {
    type: Sequelize.STRING(255),
    allowNull: false,
    defaultValue: '',
  });
}

export async function down({ queryInterface }) {
  await queryInterface.removeColumn('Users', 'passwordHash');
}

