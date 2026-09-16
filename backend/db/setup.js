require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
    try {
        // Connect to MySQL server without specifying a database initially
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            multipleStatements: true // Allow executing multiple statements from the schema file
        });

        console.log('Connected to MySQL server.');

        // Read the schema.sql file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running schema setup...');
        // Execute the schema statements
        await connection.query(schema);

        console.log('Database and tables created successfully!');
        
        // Close the connection
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error setting up the database:', error);
        process.exit(1);
    }
}

setupDatabase();
