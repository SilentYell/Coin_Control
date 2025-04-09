# ERD Documentation (PostgreSQL-Compatible)

The Entity-Relationship Diagram (ERD) for the Coin Control project outlines the relationships between the following entities, optimized for PostgreSQL:

## Entities and Attributes

### Users
- `user_id` (SERIAL, Primary Key)
- `username` (VARCHAR(50), Unique, NOT NULL)
- `password_hash` (VARCHAR(255), NOT NULL)
- `current_balance` (NUMERIC(15,2))

### Recurring_Bills
- `bill_id` (SERIAL, Primary Key)
- `user_id` (INTEGER, Foreign Key → Users(user_id), NOT NULL)
- `name` (VARCHAR(100), NOT NULL)
- `amount` (NUMERIC(15,2), NOT NULL)
- `due_date` (DATE, NOT NULL)
- `frequency` (VARCHAR(20), NOT NULL)
- `is_active` (BOOLEAN, DEFAULT true)

### Income
- `income_id` (SERIAL, Primary Key)
- `user_id` (INTEGER, Foreign Key → Users(user_id), NOT NULL)
- `amount` (NUMERIC(15,2), NOT NULL)
- `frequency` (VARCHAR(20), NOT NULL)
- `last_payment_date_1` (DATE, NOT NULL)
- `last_payment_date_2` (DATE, NOT NULL)
- `next_payment_date` (DATE, NOT NULL)

### Transactions
- `transaction_id` (SERIAL, Primary Key)
- `user_id` (INTEGER, Foreign Key → Users(user_id), NOT NULL)
- `amount` (NUMERIC(15,2), NOT NULL)
- `description` (VARCHAR(255))
- `category` (VARCHAR(50), NOT NULL)
- `transaction_date` (DATE, NOT NULL)

### Savings_Goals
- `goal_id` (SERIAL, Primary Key)
- `user_id` (INTEGER, Foreign Key → Users(user_id), NOT NULL)
- `goal_name` (VARCHAR(100), NOT NULL)
- `target_amount` (NUMERIC(15,2), NOT NULL)
- `saved_amount` (NUMERIC(15,2), DEFAULT 0)
- `save_type` (VARCHAR(20), NOT NULL)
- `save_value` (NUMERIC(15,2), NOT NULL)

### Badges
- `badge_id` (SERIAL, Primary Key)
- `name` (VARCHAR(50), NOT NULL)
- `description` (VARCHAR(255))
- `image_url` (VARCHAR(255))

### Challenges
- `challenge_id` (SERIAL, Primary Key)
- `badge_id` (INTEGER, Foreign Key → Badges(badge_id), NOT NULL)
- `name` (VARCHAR(100), NOT NULL)
- `description` (VARCHAR(255))
- `target_value` (NUMERIC(15,2), NOT NULL)
- `metric` (VARCHAR(50), NOT NULL)
- `frequency` (VARCHAR(20), NOT NULL)

### User_Challenges
- `user_challenge_id` (SERIAL, Primary Key)
- `user_id` (INTEGER, Foreign Key → Users(user_id), NOT NULL)
- `challenge_id` (INTEGER, Foreign Key → Challenges(challenge_id), NOT NULL)
- `progress_value` (NUMERIC(15,2), DEFAULT 0)
- `is_completed` (BOOLEAN, DEFAULT false)
- `completed_date` (DATE)

## Relationships
- **Users 1:N Recurring_Bills**
- **Users 1:N Income**
- **Users 1:N Transactions**
- **Users 1:N Savings_Goals**
- **Users N:M Challenges (via User_Challenges)**
- **Badges 1:N Challenges**