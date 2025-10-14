import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not found');
  }

  const sql = neon(process.env.DATABASE_URL);

  console.log('🚀 Running migrations...\n');

  try {
    // Migration 1: Add country field
    console.log('📝 Adding country field to therapies table...');
    const migration1 = readFileSync(join(process.cwd(), 'migrations/add_country_field.sql'), 'utf-8');
    const commands1 = migration1.split(';').filter(cmd => cmd.trim());
    for (const command of commands1) {
      if (command.trim()) {
        await sql(command);
      }
    }
    console.log('✅ Country field added successfully\n');

    // Migration 2: Add Mexican providers
    console.log('📝 Adding Mexican providers...');
    const migration2 = readFileSync(join(process.cwd(), 'migrations/add_mexican_providers.sql'), 'utf-8');
    const commands2 = migration2.split(';').filter(cmd => cmd.trim());
    for (const command of commands2) {
      if (command.trim() && !command.trim().startsWith('--')) {
        await sql(command);
      }
    }
    console.log('✅ Mexican providers added successfully\n');

    console.log('🎉 All migrations completed!');
    console.log('\n📊 Summary:');
    console.log('   - Country field added to therapies table');
    console.log('   - 48 Mexican providers added');
    console.log('\n🌐 You can now switch between Peru 🇵🇪 and Mexico 🇲🇽 in the app!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

runMigrations().catch(console.error);
