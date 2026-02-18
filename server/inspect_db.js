const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const hash = 'r743zcvib886f44b8y5x2';
  console.log(`Searching for client with hash: ${hash}`);
  
  const client = await prisma.client.findUnique({
    where: { hash }
  });

  if (!client) {
    console.log("Client not found.");
  } else {
    console.log("Client Found:");
    console.log("ID:", client.id);
    console.log("Name:", client.name);
    console.log("Updated At:", client.updatedAt);
    console.log("--- DATA BLOB ---");
    console.log(client.data);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
