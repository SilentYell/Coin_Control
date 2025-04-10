# Useful psql Commands

## General Commands
- **Start psql**:
  ```bash
  psql -U username -d database_name
  ```
  Replace `username` and `database_name` with your PostgreSQL user and database.

- **Exit psql**:
  ```sql
  \q
  ```

- **Switch to Another Database**:
  ```sql
  \c database_name
  ```

- **List All Databases**:
  ```sql
  \l
  ```

- **List All Roles (Users)**:
  ```sql
  \du
  ```

- **Show Current User**:
  ```sql
  SELECT current_user;
  ```

- **Show Current Database**:
  ```sql
  SELECT current_database();
  ```

## Table Management
- **List All Tables in the Current Database**:
  ```sql
  \dt
  ```

- **Describe a Table's Structure**:
  ```sql
  \d table_name
  ```

- **Create a Table**:
  ```sql
  CREATE TABLE table_name (
      column_name data_type constraints
  );
  ```

- **Drop a Table**:
  ```sql
  DROP TABLE table_name;
  ```

## Querying Data
- **Select Data from a Table**:
  ```sql
  SELECT * FROM table_name;
  ```

- **Insert Data into a Table**:
  ```sql
  INSERT INTO table_name (column1, column2) VALUES (value1, value2);
  ```

- **Update Data in a Table**:
  ```sql
  UPDATE table_name SET column_name = value WHERE condition;
  ```

- **Delete Data from a Table**:
  ```sql
  DELETE FROM table_name WHERE condition;
  ```

## Server Management
- **Start PostgreSQL Server**:
  ```bash
  sudo systemctl start postgresql
  ```

- **Stop PostgreSQL Server**:
  ```bash
  sudo systemctl stop postgresql
  ```

- **Restart PostgreSQL Server**:
  ```bash
  sudo systemctl restart postgresql
  ```

- **Check PostgreSQL Server Status**:
  ```bash
  sudo systemctl status postgresql
  ```

## Miscellaneous
- **Show All Running Queries**:
  ```sql
  SELECT * FROM pg_stat_activity;
  ```

- **Terminate a Query**:
  ```sql
  SELECT pg_terminate_backend(pid)
  FROM pg_stat_activity
  WHERE pid = process_id;
  ```