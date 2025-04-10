// Load environment variables from .env file
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.development') });
const { execSync } = require('child_process');

// Define the path to the SQL files in your schema directory
const schemaDir = path.resolve(__dirname, './schema');


// DEBUG
console.log('PGUSER:', process.env.PGUSER);
console.log('PGDATABASE:', process.env.PGDATABASE);
console.log('PGPORT:', process.env.PGPORT);

// Read the user and database from the environment variables
const user = process.env.PGUSER;
const database = process.env.PGDATABASE;
const port = process.env.PGPORT || '5432'; // Default to 5432 if not set


// Ensure that the environment variables are set
if (!user || !database) {
  console.error('ERROR: PGUSER or PGDATABASE environment variable is not set.');
  process.exit(1);
}

console.log(`Running setup for user ${user} on database ${database}`);

// Function to execute psql command for each SQL file in the schema folder
const runSqlFiles = () => {
  const fs = require('fs');

  // Read all the SQL files in the schema directory
  const files = fs.readdirSync(schemaDir).filter(file => file.endsWith('.sql'));

  // Loop through each file and execute it with psql
  files.forEach((file) => {
    const filePath = path.join(schemaDir, file);
    console.log(`Running ${filePath}`);
    try {
      execSync(`psql -U ${user} -d ${database} -f ${filePath} -p ${port}`, { stdio: 'inherit' });
    } catch (error) {
      console.error(`Error running ${file}: ${error.message}`);
    }
  });
};

// Run the SQL files
runSqlFiles();
