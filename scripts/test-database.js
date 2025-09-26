const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || '45.90.123.13',
  user: process.env.DB_USER || 'c1user_nowcards',
  password: process.env.DB_PASSWORD || 'K_6Tu4kfVf',
  database: process.env.DB_NAME || 'c1db_nowcards',
  port: parseInt(process.env.DB_PORT || '3306'),
};

async function testDatabase() {
  let connection;
  
  try {
    console.log('🔌 Testing database connection...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected successfully!');
    
    // Test 1: Check if tables exist
    console.log('\n📋 Checking tables...');
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'study_sets'"
    );
    console.log('✓ study_sets table exists:', tables.length > 0);
    
    const [questionsTable] = await connection.execute(
      "SHOW TABLES LIKE 'questions'"
    );
    console.log('✓ questions table exists:', questionsTable.length > 0);
    
    const [optionsTable] = await connection.execute(
      "SHOW TABLES LIKE 'question_options'"
    );
    console.log('✓ question_options table exists:', optionsTable.length > 0);
    
    const [progressTable] = await connection.execute(
      "SHOW TABLES LIKE 'user_progress'"
    );
    console.log('✓ user_progress table exists:', progressTable.length > 0);
    
    // Test 2: Check data
    console.log('\n📊 Checking data...');
    const [sets] = await connection.execute('SELECT COUNT(*) as count FROM study_sets');
    console.log('✓ Study sets count:', sets[0].count);
    
    const [questions] = await connection.execute('SELECT COUNT(*) as count FROM questions');
    console.log('✓ Questions count:', questions[0].count);
    
    const [options] = await connection.execute('SELECT COUNT(*) as count FROM question_options');
    console.log('✓ Options count:', options[0].count);
    
    // Test 3: Sample data
    console.log('\n🔍 Sample data:');
    const [sampleSet] = await connection.execute(
      'SELECT id, title, description FROM study_sets LIMIT 1'
    );
    if (sampleSet.length > 0) {
      console.log('✓ Sample set:', sampleSet[0]);
    }
    
    const [sampleQuestion] = await connection.execute(
      'SELECT q.id, q.stem, q.type FROM questions q LIMIT 1'
    );
    if (sampleQuestion.length > 0) {
      console.log('✓ Sample question:', sampleQuestion[0]);
    }
    
    console.log('\n🎉 Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed.');
    }
  }
}

// Run the test
testDatabase();
