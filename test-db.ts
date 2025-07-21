import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    // Test the connection
    await prisma.$connect()
    console.log('✅ Successfully connected to database')

    // Try to get a count of users
    const userCount = await prisma.user.count()
    console.log(`✅ Successfully queried database. Found ${userCount} users.`)

    // Try to get a count of properties
    const propertyCount = await prisma.property.count()
    console.log(`✅ Successfully queried properties. Found ${propertyCount} properties.`)

    // Try to get a count of agents
    const agentCount = await prisma.agent.count()
    console.log(`✅ Successfully queried agents. Found ${agentCount} agents.`)

  } catch (error) {
    console.error('❌ Error testing database connection:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection() 