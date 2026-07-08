// Database: ApsaraDB RDS Serverless (MySQL)
// Hosted on Alibaba Cloud, region: ap-southeast-1 (Singapore)
// Backend compute: Alibaba Cloud Function Compute (Web Function)
import { PrismaClient } from '@prisma/client'

let dbUrl = process.env.DATABASE_URL || '';
if (dbUrl.startsWith('"') && dbUrl.endsWith('"')) dbUrl = dbUrl.slice(1, -1);
if (dbUrl.startsWith("'") && dbUrl.endsWith("'")) dbUrl = dbUrl.slice(1, -1);

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: dbUrl
      }
    }
  })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
