import postgres from 'postgres'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Cargar variables de entorno desde .env.local
dotenv.config({ path: '.env.local' })

async function runSeed() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    console.error('❌ Error: DATABASE_URL no encontrada en .env.local')
    console.log('Añade DATABASE_URL a .env.local con el formato:')
    console.log('DATABASE_URL=postgres://postgres:[TU_PASSWORD]@db.[TU_PROJECT_ID].supabase.co:5432/postgres')
    process.exit(1)
  }

  const sql = postgres(connectionString)

  try {
    console.log('🌱 Leyendo supabase/seed.sql...')
    const seedSql = fs.readFileSync(path.join(process.cwd(), 'supabase', 'seed.sql'), 'utf8')

    console.log('🚀 Ejecutando seed en la base de datos remota...')
    // Ejecutamos el SQL. postgres-js permite ejecutar strings raw usando sql.unsafe
    await sql.unsafe(seedSql)

    console.log('✅ Base de datos sembrada correctamente.')
  } catch (error) {
    console.error('❌ Error al ejecutar el seed:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

runSeed()
