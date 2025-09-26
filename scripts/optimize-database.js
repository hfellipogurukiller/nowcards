const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const dbConfig = {
  host: process.env.DB_HOST || '45.90.123.13',
  user: process.env.DB_USER || 'c1user_nowcards',
  password: process.env.DB_PASSWORD || 'K_6Tu4kfVf',
  database: process.env.DB_NAME || 'c1db_nowcards',
  port: parseInt(process.env.DB_PORT || '3306')
};

async function optimizeDatabase() {
  let connection;
  
  try {
    console.log('🔗 Conectando ao banco de dados...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conectado com sucesso!');

    // Read the optimization script
    const scriptPath = path.join(__dirname, '04-optimize-database-indexes.sql');
    const script = fs.readFileSync(scriptPath, 'utf8');
    
    // Split script into individual statements
    const statements = script
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📊 Executando ${statements.length} otimizações...`);

    let successCount = 0;
    let errorCount = 0;

    for (const statement of statements) {
      try {
        await connection.execute(statement);
        successCount++;
        console.log(`✅ Executado: ${statement.substring(0, 50)}...`);
      } catch (error) {
        if (error.code === 'ER_DUP_KEYNAME') {
          console.log(`⚠️  Índice já existe: ${statement.substring(0, 50)}...`);
          successCount++; // Count as success since index already exists
        } else {
          console.error(`❌ Erro: ${error.message}`);
          errorCount++;
        }
      }
    }

    console.log('\n📈 Resultado da otimização:');
    console.log(`✅ Sucessos: ${successCount}`);
    console.log(`❌ Erros: ${errorCount}`);

    // Check current indexes
    console.log('\n🔍 Verificando índices criados...');
    
    const tables = ['questions', 'question_options', 'user_progress', 'study_sets'];
    
    for (const table of tables) {
      try {
        const [indexes] = await connection.execute(`SHOW INDEX FROM ${table}`);
        console.log(`\n📋 Índices em ${table}:`);
        indexes.forEach(idx => {
          console.log(`  - ${idx.Key_name} (${idx.Column_name})`);
        });
      } catch (error) {
        console.log(`⚠️  Não foi possível verificar índices de ${table}: ${error.message}`);
      }
    }

    // Test query performance
    console.log('\n⚡ Testando performance das consultas...');
    
    try {
      const startTime = Date.now();
      const [sets] = await connection.execute(`
        SELECT s.id, s.title, s.description, COUNT(q.id) as questionCount
        FROM study_sets s
        LEFT JOIN questions q ON s.id = q.set_id
        GROUP BY s.id, s.title, s.description
        HAVING questionCount > 0
        ORDER BY s.title
      `);
      const endTime = Date.now();
      
      console.log(`✅ Consulta de sets executada em ${endTime - startTime}ms`);
      console.log(`📊 Encontrados ${sets.length} sets com questões`);
    } catch (error) {
      console.log(`⚠️  Erro ao testar consulta: ${error.message}`);
    }

    console.log('\n🎉 Otimização concluída!');
    console.log('\n💡 Dicas para melhor performance:');
    console.log('   - Use LIMIT nas consultas quando possível');
    console.log('   - Evite SELECT * em tabelas grandes');
    console.log('   - Use WHERE clauses com campos indexados');
    console.log('   - Monitore performance com EXPLAIN');

  } catch (error) {
    console.error('❌ Erro durante otimização:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexão fechada.');
    }
  }
}

// Run optimization
optimizeDatabase();
