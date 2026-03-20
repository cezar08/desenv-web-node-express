export async function up({ queryInterface }) {
  const now = new Date();

  await queryInterface.bulkInsert('Users', [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@email.com',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 2,
      name: 'Maria Souza',
      email: 'maria@email.com',
      createdAt: now,
      updatedAt: now,
    },
  ]);

  await queryInterface.bulkInsert('Posts', [
    {
      id: 1,
      title: 'Bem-vindo ao Sequelize',
      body: 'Exemplo de persistência usando Sequelize + SQLite.',
      userId: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 2,
      title: 'Associação 1->N',
      body: 'Um usuário pode ter vários posts.',
      userId: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 3,
      title: 'N->1 com belongsTo',
      body: 'Cada post pertence a um usuário (autor).',
      userId: 2,
      createdAt: now,
      updatedAt: now,
    },
  ]);
}

