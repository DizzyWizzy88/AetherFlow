-- AetherFlow Database Schema
-- Nathan Nied - Sprint 1 (T-102)
-- designing the tables we need for the inventory system


-- roles table first since users references it
-- just two roles for now, admin and warehouse manager
CREATE TABLE roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- adding the default roles we talked about
INSERT INTO roles (role_name, description) VALUES
    ('System Administrator', 'full access to everything'),
    ('Warehouse Manager', 'can manage inventory and view alerts');


-- users table for login system
-- password_hash stores the bcrypt hash not the actual password
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);


-- storing refresh tokens here so we can revoke them if needed
-- not 100% sure on the token_hash length yet might need to adjust
CREATE TABLE auth_tokens (
    token_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token_hash VARCHAR(512) NOT NULL,
    issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);


-- main inventory table
-- sku has to be unique so we dont get duplicate items
-- reorder_threshold is what triggers the low stock alert (default 10 units)
CREATE TABLE inventory_items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    sku VARCHAR(100) NOT NULL UNIQUE,
    item_name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    quantity_on_hand INT NOT NULL DEFAULT 0,
    reorder_threshold INT DEFAULT 10,
    unit_price DECIMAL(10, 2),
    supplier_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
);


-- suppliers table
-- keeping it simple for now, can add more fields later if needed
CREATE TABLE suppliers (
    supplier_id INT PRIMARY KEY AUTO_INCREMENT,
    supplier_name VARCHAR(150) NOT NULL,
    contact_name VARCHAR(100),
    email VARCHAR(150),
    phone VARCHAR(30),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- tracks all the orders we place with suppliers
-- status uses enum so only valid values can be entered
CREATE TABLE procurement_history (
    procurement_id INT PRIMARY KEY AUTO_INCREMENT,
    item_id INT NOT NULL,
    supplier_id INT NOT NULL,
    quantity_ordered INT NOT NULL,
    unit_cost DECIMAL(10, 2),
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    received_date DATETIME,
    status ENUM('Pending', 'Received', 'Cancelled') DEFAULT 'Pending',
    notes TEXT,
    FOREIGN KEY (item_id) REFERENCES inventory_items(item_id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
);


-- low stock alerts get logged here when quantity drops below threshold
CREATE TABLE low_stock_alerts (
    alert_id INT PRIMARY KEY AUTO_INCREMENT,
    item_id INT NOT NULL,
    triggered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    quantity_at_trigger INT NOT NULL,
    threshold_at_trigger INT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at DATETIME,
    FOREIGN KEY (item_id) REFERENCES inventory_items(item_id)
);


-- who gets notified and how when a low stock alert fires
CREATE TABLE notification_rules (
    rule_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    item_id INT,
    notify_method ENUM('Email', 'In-App', 'Both') DEFAULT 'In-App',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (item_id) REFERENCES inventory_items(item_id)
);


-- audit log for tracking every action in the system
-- user_id can be null if its a system generated event
-- this is how admins can see whats been changed and by who
CREATE TABLE audit_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id INT,
    details TEXT,
    ip_address VARCHAR(45),
    logged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);


-- indexes to speed up the queries we'll be running most often
CREATE INDEX idx_sku ON inventory_items(sku);
CREATE INDEX idx_alerts ON low_stock_alerts(item_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_time ON audit_logs(logged_at);
