const mysql = require('mysql2/promise');
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

async function applyMissingIndexes() {
  let connection;
  
  try {
    console.log('🔗 Conectando ao banco de dados...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conectado com sucesso!');

    // List of indexes to create
    const indexes = [
      // Questions table indexes
      { table: 'questions', name: 'idx_questions_type', columns: 'type' },
      { table: 'questions', name: 'idx_questions_set_type', columns: 'set_id, type' },
      { table: 'questions', name: 'idx_questions_created_at', columns: 'created_at' },
      
      // Question options table indexes
      { table: 'question_options', name: 'idx_options_question_id', columns: 'question_id' },
      { table: 'question_options', name: 'idx_options_is_correct', columns: 'is_correct' },
      { table: 'question_options', name: 'idx_options_question_correct', columns: 'question_id, is_correct' },
      
      // User progress table indexes
      { table: 'user_progress', name: 'idx_progress_user_id', columns: 'user_id' },
      { table: 'user_progress', name: 'idx_progress_set_id', columns: 'set_id' },
      { table: 'user_progress', name: 'idx_progress_question_id', columns: 'question_id' },
      { table: 'user_progress', name: 'idx_progress_user_set', columns: 'user_id, set_id' },
      { table: 'user_progress', name: 'idx_progress_user_question', columns: 'user_id, question_id' },
      { table: 'user_progress', name: 'idx_progress_created_at', columns: 'created_at' },
      
      // Study sets table indexes
      { table: 'study_sets', name: 'idx_sets_created_at', columns: 'created_at' },
      { table: 'study_sets', name: 'idx_sets_title', columns: 'title' }
    ];

    console.log(`📊 Aplicando ${indexes.length} índices adicionais...`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const index of indexes) {
      try {
        const sql = `CREATE INDEX IF NOT EXISTS ${index.name} ON ${index.table} (${index.columns})`;
        await connection.execute(sql);
        successCount++;
        console.log(`✅ Criado: ${index.name} em ${index.table}`);
      } catch (error) {
        if (error.code === 'ER_DUP_KEYNAME') {
          console.log(`⚠️  Já existe: ${index.name} em ${index.table}`);
          skipCount++;
        } else {
          console.error(`❌ Erro em ${index.name}: ${error.message}`);
          errorCount++;
        }
      }
    }

    console.log('\n📈 Resultado:');
    console.log(`✅ Criados: ${successCount}`);
    console.log(`⚠️  Já existiam: ${skipCount}`);
    console.log(`❌ Erros: ${errorCount}`);

    // Test performance with a large query
    console.log('\n⚡ Testando performance com consulta otimizada...');
    
    try {
      const startTime = Date.now();
      
      // Test the main study session query
      const [result] = await connection.execute(`
        SELECT 
          s.id as set_id,
          s.title as set_title,
          s.description as set_description,
          q.id as question_id,
          q.type as question_type,
          q.stem as question_stem,
          q.explanation as question_explanation,
          q.select_count as question_select_count,
          qo.id as option_id,
          qo.text as option_text,
          qo.is_correct as option_is_correct
        FROM study_sets s
        INNER JOIN questions q ON s.id = q.set_id
        LEFT JOIN question_options qo ON q.id = qo.question_id
        WHERE s.id = (SELECT id FROM study_sets LIMIT 1)
        ORDER BY q.id, qo.id
        LIMIT 100
      `);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log(`✅ Consulta otimizada executada em ${duration}ms`);
      console.log(`📊 Retornados ${result.length} registros`);
      
      if (duration < 100) {
        console.log('🚀 Performance excelente! (< 100ms)');
      } else if (duration < 500) {
        console.log('✅ Performance boa (< 500ms)');
      } else {
        console.log('⚠️  Performance pode ser melhorada (> 500ms)');
      }
      
    } catch (error) {
      console.log(`⚠️  Erro ao testar consulta: ${error.message}`);
    }

    // Show final index status
    console.log('\n🔍 Status final dos índices:');
    
    const tables = ['questions', 'question_options', 'user_progress', 'study_sets'];
    
    for (const table of tables) {
      try {
        const [indexes] = await connection.execute(`SHOW INDEX FROM ${table}`);
        const indexCount = indexes.length;
        console.log(`📋 ${table}: ${indexCount} índices`);
      } catch (error) {
        console.log(`⚠️  Erro ao verificar ${table}: ${error.message}`);
      }
    }

    console.log('\n🎉 Otimização completa!');
    console.log('\n💡 Próximos passos:');
    console.log('   1. Teste a aplicação com as 300 questões');
    console.log('   2. Monitore o tempo de carregamento');
    console.log('   3. Use EXPLAIN para analisar consultas lentas');
    console.log('   4. Considere paginação se necessário');

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
applyMissingIndexes();
