# ERD Documentation (PostgreSQL-Compatible)

The Entity-Relationship Diagram (ERD) for the Coin Control project outlines the relationships between the following entities, optimized for PostgreSQL:

## Entities and Attributes

### Users
// Stores user account info and their current budget balance
- `user_id` (SERIAL, Primary Key) // Unique ID for each user
- `username` (VARCHAR(50), Unique, NOT NULL) // User's login name
- `password_hash` (VARCHAR(255), NOT NULL) // Hashed password for security
- `current_balance` (NUMERIC(15,2)) // Current available funds after income/deductions

### Recurring_Bills
// Tracks recurring expenses like rent or subscriptions
- `bill_id` (SERIAL, Primary Key) // Unique ID for each bill
- `user_id` (INTEGER, Foreign Key → Users(user_id), NOT NULL) // Links to the user who owns this bill
- `name` (VARCHAR(100), NOT NULL) // Bill name (e.g., "Rent")
- `amount` (NUMERIC(15,2), NOT NULL) // Cost of the bill
- `due_date` (DATE, NOT NULL) // Next due date
- `frequency` (VARCHAR(20), NOT NULL) // How often it recurs (e.g., "monthly")
- `is_active` (BOOLEAN, DEFAULT true) // Whether the bill is still active

### Income
// Records user income sources for budget planning
- `income_id` (SERIAL, Primary Key) // Unique ID for each income source
- `user_id` (INTEGER, Foreign Key → Users(user_id), NOT NULL) // Links to the user receiving income
- `amount` (NUMERIC(15,2), NOT NULL) // Income amount
- `frequency` (VARCHAR(20), NOT NULL) // How often it’s received (e.g., "bi-weekly")
- `last_payment_date_1` (DATE, NOT NULL) // One of the last two payment dates
- `last_payment_date_2` (DATE, NOT NULL) // The other of the last two payment dates
- `next_payment_date` (DATE, NOT NULL) // Predicted next payment date

### Transactions
// Logs all money movements (income, bills, savings) for tracking
- `transaction_id` (SERIAL, Primary Key) // Unique ID for each transaction
- `user_id` (INTEGER, Foreign Key → Users(user_id), NOT NULL) // Links to the user
- `amount` (NUMERIC(15,2), NOT NULL) // Positive for income, negative for spending
- `description` (VARCHAR(255)) // Details (e.g., "Paycheck", "Rent payment")
- `category` (VARCHAR(50), NOT NULL) // Type (e.g., "bills", "income", "savings")
- `transaction_date` (DATE, NOT NULL) // Date of the transaction

### Savings_Goals
// Manages user savings goals and automatic deductions
- `goal_id` (SERIAL, Primary Key) // Unique ID for each savings goal
- `user_id` (INTEGER, Foreign Key → Users(user_id), NOT NULL) // Links to the user
- `goal_name` (VARCHAR(100), NOT NULL) // Goal name (e.g., "Car Fund")
- `target_amount` (NUMERIC(15,2), NOT NULL) // Total amount to save
- `saved_amount` (NUMERIC(15,2), DEFAULT 0) // Amount saved so far
- `save_type` (VARCHAR(20), NOT NULL) // "percentage" or "fixed"
- `save_value` (NUMERIC(15,2), NOT NULL) // Percentage (e.g., 10.00) or fixed amount

### Badges
// Defines badges users can earn for achievements
- `badge_id` (SERIAL, Primary Key) // Unique ID for each badge
- `name` (VARCHAR(50), NOT NULL) // Badge name (e.g., "Avid Saver (Bronze)")
- `description` (VARCHAR(255)) // What it represents (e.g., "Hit a savings target")
- `image_url` (VARCHAR(255)) // URL to badge icon for display

### Challenges
// Specifies challenges tied to badges with goals to meet
- `challenge_id` (SERIAL, Primary Key) // Unique ID for each challenge
- `badge_id` (INTEGER, Foreign Key → Badges(badge_id), NOT NULL) // Links to the badge earned
- `name` (VARCHAR(100), NOT NULL) // Challenge name (e.g., "Save $100 Once")
- `description` (VARCHAR(255)) // Details (e.g., "Save $100 toward any goal")
- `target_value` (NUMERIC(15,2), NOT NULL) // Goal value (e.g., 100 for $100)
- `metric` (VARCHAR(50), NOT NULL) // What’s measured (e.g., "total_savings")
- `frequency` (VARCHAR(20), NOT NULL) // How often (e.g., "once", "3_times")

### User_Challenges
// Tracks user progress toward earning badges
- `user_challenge_id` (SERIAL, Primary Key) // Unique ID for each user-challenge pair
- `user_id` (INTEGER, Foreign Key → Users(user_id), NOT NULL) // Links to the user
- `challenge_id` (INTEGER, Foreign Key → Challenges(challenge_id), NOT NULL) // Links to the challenge
- `progress_value` (NUMERIC(15,2), DEFAULT 0) // Progress toward the target
- `is_completed` (BOOLEAN, DEFAULT false) // Whether the challenge is done
- `completed_date` (DATE) // Date completed, null if not yet earned

## Relationships
- **Users 1:N Recurring_Bills**
- **Users 1:N Income**
- **Users 1:N Transactions**
- **Users 1:N Savings_Goals**
- **Users N:M Challenges (via User_Challenges)**
- **Badges 1:N Challenges**