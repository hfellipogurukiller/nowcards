const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || '45.90.123.13',
  user: process.env.DB_USER || 'c1user_nowcards',
  password: process.env.DB_PASSWORD || 'K_6Tu4kfVf',
  database: process.env.DB_NAME || 'c1db_nowcards',
  port: parseInt(process.env.DB_PORT || '3306'),
};

async function setupDatabase() {
  let connection;
  
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected successfully!');
    
    // Read and execute create tables script
    console.log('Creating tables...');
    const createTablesSQL = fs.readFileSync(
      path.join(__dirname, '01-create-tables.sql'), 
      'utf8'
    );
    
    // Split by semicolon and execute each statement
    const statements = createTablesSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
        console.log('✓ Executed:', statement.substring(0, 50) + '...');
      }
    }
    
    // Read and execute seed data script
    console.log('Inserting demo data...');
    const seedDataSQL = fs.readFileSync(
      path.join(__dirname, '02-seed-demo-data.sql'), 
      'utf8'
    );
    
    const seedStatements = seedDataSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    for (const statement of seedStatements) {
      if (statement.trim()) {
        await connection.execute(statement);
        console.log('✓ Executed:', statement.substring(0, 50) + '...');
      }
    }
    
    console.log('✅ Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Run the setup
setupDatabase();
