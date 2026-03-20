export async function up({ queryInterface }) {
  const now = new Date();

  await queryInterface.bulkInsert('Users', [
    {
      id: 3,
      name: 'Cezar',
      email: 'cezar@email.com',
      createdAt: now,
      updatedAt: now,
    },
  
  ]);
}

