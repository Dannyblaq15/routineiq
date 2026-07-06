import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing connection to ApsaraDB RDS...');
  
  // 1. Create a test record
  const episode = await prisma.agentEpisode.create({
    data: {
      episodeType: 'system_test',
      title: 'Database Connection Test',
      summary: 'Testing connection to Alibaba Cloud RDS Serverless',
      agentId: 'system'
    }
  });
  console.log('✅ Successfully inserted record:', episode.id);

  // 2. Read it back
  const fetched = await prisma.agentEpisode.findUnique({
    where: { id: episode.id }
  });
  console.log('✅ Successfully read record:', fetched?.title);

  // 3. Clean up
  await prisma.agentEpisode.delete({
    where: { id: episode.id }
  });
  console.log('✅ Successfully deleted test record.');
}

main()
  .catch(e => {
    console.error('❌ Error testing database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
