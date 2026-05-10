-- =============================================================
-- AetherFlow Inventory Management System
-- SQL Database Schema - Sprint 1 (T-102)
-- Author: Nathan Nied (Logic Architect)
-- =============================================================

-- -------------------------------------------------------------
-- TABLE: roles
-- Defines user roles for RBAC (Role-Based Access Control)
-- Supports: Warehouse Manager, System Administrator
-- -------------------------------------------------------------
CREATE TABLE roles (
    role_id     INT PRIMARY KEY AUTO_INCREMENT,
    role_name   VARCHAR(50) NOT NULL UNIQUE,   -- e.g. 'Warehouse Manager', 'System Administrator'
    description TEXT
);

-- Seed default roles
INSERT INTO roles (role_name, description) VALUES
    ('System Administrator', 'Full system access including audit logs and user management'),
    ('Warehouse Manager', 'Can manage inventory, view alerts, and update stock');

-- -------------------------------------------------------------
-- TABLE: users
-- Stores user credentials and role assignments
-- Supports: Login, Token Validation, User Management
-- -------------------------------------------------------------
CREATE TABLE users (
    user_id        INT PRIMARY KEY AUTO_INCREMENT,
    username       VARCHAR(100) NOT NULL UNIQUE,
    email          VARCHAR(150) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,          -- bcrypt hashed password
    role_id        INT NOT NULL,
    is_active      BOOLEAN DEFAULT TRUE,
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- -------------------------------------------------------------
-- TABLE: auth_tokens
-- Stores JWT refresh tokens for session management
-- Supports: Token Validation, Secure Login
-- -------------------------------------------------------------
CREATE TABLE auth_tokens (
    token_id    INT PRIMARY KEY AUTO_INCREMENT,
    user_id     INT NOT NULL,
    token_hash  VARCHAR(512) NOT NULL,             -- hashed JWT refresh token
    issued_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at  DATETIME NOT NULL,
    is_revoked  BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- -------------------------------------------------------------
-- TABLE: suppliers
-- Stores supplier/vendor information
-- Supports: Supplier List, Add Supplier
-- -------------------------------------------------------------
CREATE TABLE suppliers (
    supplier_id   INT PRIMARY KEY AUTO_INCREMENT,
    supplier_name VARCHAR(150) NOT NULL,
    contact_name  VARCHAR(100),
    email         VARCHAR(150),
    phone         VARCHAR(30),
    address       TEXT,
    is_active     BOOLEAN DEFAULT TRUE,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------
-- TABLE: inventory_items
-- Core inventory catalog
-- Supports: Inventory Catalog, Add Item, Edit Item, Low-Stock Alerts
-- -------------------------------------------------------------
CREATE TABLE inventory_items (
    item_id          INT PRIMARY KEY AUTO_INCREMENT,
    sku              VARCHAR(100) NOT NULL UNIQUE,  -- Stock Keeping Unit identifier
    item_name        VARCHAR(200) NOT NULL,
    description      TEXT,
    category         VARCHAR(100),
    quantity_on_hand INT NOT NULL DEFAULT 0,
    reorder_threshold INT NOT NULL DEFAULT 10,       -- triggers low-stock alert below this
    unit_price       DECIMAL(10, 2),
    supplier_id      INT,
    is_active        BOOLEAN DEFAULT TRUE,
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
);

-- -------------------------------------------------------------
-- TABLE: procurement_history
-- Records all purchase/restocking transactions with suppliers
-- Supports: Procurement History
-- -------------------------------------------------------------
CREATE TABLE procurement_history (
    procurement_id   INT PRIMARY KEY AUTO_INCREMENT,
    item_id          INT NOT NULL,
    supplier_id      INT NOT NULL,
    quantity_ordered INT NOT NULL,
    unit_cost        DECIMAL(10, 2),
    order_date       DATETIME DEFAULT CURRENT_TIMESTAMP,
    received_date    DATETIME,
    status           ENUM('Pending', 'Received', 'Cancelled') DEFAULT 'Pending',
    notes            TEXT,
    FOREIGN KEY (item_id) REFERENCES inventory_items(item_id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
);

-- -------------------------------------------------------------
-- TABLE: low_stock_alerts
-- Tracks alerts triggered when items fall below reorder threshold
-- Supports: Low-Stock Alerts, Threshold Settings, Alert List
-- -------------------------------------------------------------
CREATE TABLE low_stock_alerts (
    alert_id       INT PRIMARY KEY AUTO_INCREMENT,
    item_id        INT NOT NULL,
    triggered_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    quantity_at_trigger INT NOT NULL,              -- quantity when alert fired
    threshold_at_trigger INT NOT NULL,             -- threshold value at time of alert
    is_resolved    BOOLEAN DEFAULT FALSE,
    resolved_at    DATETIME,
    FOREIGN KEY (item_id) REFERENCES inventory_items(item_id)
);

-- -------------------------------------------------------------
-- TABLE: notification_rules
-- Configures how and who receives low-stock alert notifications
-- Supports: Notification Rules
-- -------------------------------------------------------------
CREATE TABLE notification_rules (
    rule_id        INT PRIMARY KEY AUTO_INCREMENT,
    user_id        INT NOT NULL,                   -- who gets notified
    item_id        INT,                            -- NULL = applies to all items
    notify_method  ENUM('Email', 'In-App', 'Both') DEFAULT 'In-App',
    is_active      BOOLEAN DEFAULT TRUE,
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (item_id) REFERENCES inventory_items(item_id)
);

-- -------------------------------------------------------------
-- TABLE: audit_logs
-- Immutable log of all system events for compliance and review
-- Supports: Audit Logs, User Activity, Timestamped Events, Filter Controls
-- -------------------------------------------------------------
CREATE TABLE audit_logs (
    log_id      INT PRIMARY KEY AUTO_INCREMENT,
    user_id     INT,                               -- NULL if system-generated event
    action      VARCHAR(100) NOT NULL,             -- e.g. 'LOGIN', 'UPDATE_STOCK', 'ADD_ITEM'
    target_type VARCHAR(50),                       -- e.g. 'inventory_items', 'users'
    target_id   INT,                               -- ID of the affected record
    details     TEXT,                              -- JSON or plain text description
    ip_address  VARCHAR(45),                       -- IPv4 or IPv6
    logged_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- =============================================================
-- INDEXES for query performance
-- =============================================================
CREATE INDEX idx_inventory_sku       ON inventory_items(sku);
CREATE INDEX idx_inventory_supplier  ON inventory_items(supplier_id);
CREATE INDEX idx_alerts_item         ON low_stock_alerts(item_id);
CREATE INDEX idx_audit_user          ON audit_logs(user_id);
CREATE INDEX idx_audit_logged_at     ON audit_logs(logged_at);
CREATE INDEX idx_tokens_user         ON auth_tokens(user_id);
CREATE INDEX idx_procurement_item    ON procurement_history(item_id);
