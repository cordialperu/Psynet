import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, 'data.db'));

console.log('📊 Publicaciones por categoría y país:\n');

const countries = ['PE', 'MX'];
const categories = ['ceremonias', 'terapias', 'microdosis', 'medicina', 'eventos', 'productos'];

countries.forEach(country => {
  console.log(`\n🏳️  ${country === 'PE' ? 'PERÚ' : 'MÉXICO'}`);
  console.log('─'.repeat(50));
  
  categories.forEach(category => {
    const approved = db.prepare('SELECT COUNT(*) as count FROM offerings WHERE country = ? AND offeringType = ? AND status = "approved"').get(country, category);
    const pending = db.prepare('SELECT COUNT(*) as count FROM offerings WHERE country = ? AND offeringType = ? AND status = "pending"').get(country, category);
    
    console.log(`  ${category.padEnd(15)} → Aprobadas: ${approved.count}, Pendientes: ${pending.count}`);
  });
});

db.close();
