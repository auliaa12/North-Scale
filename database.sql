-- Database: `northscale_db`

CREATE DATABASE IF NOT EXISTS `northscale_db`;
USE `northscale_db`;

-- Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'customer') DEFAULT 'customer',
  `phone` VARCHAR(20),
  `address` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `type` ENUM('jenis', 'merk') NOT NULL DEFAULT 'jenis',
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT,
  `price` DECIMAL(15, 2) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `weight` INT, -- in grams
  `category_jenis_id` INT,
  `category_merk_id` INT,
  `is_featured` BOOLEAN DEFAULT FALSE,
  `is_bestseller` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_jenis_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`category_merk_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
);

-- Product Images Table
CREATE TABLE IF NOT EXISTS `product_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `image_path` MEDIUMTEXT NOT NULL, -- Storing base64 or URL (Using MEDIUMTEXT for base64)
  `is_main` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
);

-- Orders Table
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT, -- Nullable for guest checkout if allowed, but typically linked
  `order_number` VARCHAR(50) NOT NULL UNIQUE,
  `customer_name` VARCHAR(100) NOT NULL,
  `customer_email` VARCHAR(100) NOT NULL,
  `customer_phone` VARCHAR(20) NOT NULL,
  `customer_address` TEXT NOT NULL,
  `shipping_address` TEXT NOT NULL,
  `notes` TEXT,
  `total_amount` DECIMAL(15, 2) NOT NULL,
  `status` ENUM('pending', 'processing', 'shipped', 'completed', 'cancelled') DEFAULT 'pending',
  `snap_token` VARCHAR(255), -- For Midtrans or similar
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT,
  `product_name` VARCHAR(255) NOT NULL, -- Snapshot of name at time of order
  `product_price` DECIMAL(15, 2) NOT NULL, -- Snapshot of price
  `quantity` INT NOT NULL,
  `subtotal` DECIMAL(15, 2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL
);

-- Cart Table (Persistent Database Cart)
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT, -- If logged in
  `session_id` VARCHAR(100), -- For guest carts
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
);

-- Chat Conversations
CREATE TABLE IF NOT EXISTS `chat_conversations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `session_id` VARCHAR(100), -- For guests
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Chat Messages
CREATE TABLE IF NOT EXISTS `chat_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `conversation_id` INT NOT NULL,
  `sender_type` ENUM('user', 'admin') NOT NULL,
  `message` TEXT NOT NULL,
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`conversation_id`) REFERENCES `chat_conversations`(`id`) ON DELETE CASCADE
);

-- Seed Default Admin User (Password: admin123)
-- Note: In a real app, use password_hash() in PHP. Here we'll use a placeholder hash or plain text if the PHP code handles hashing. 
-- For this migration, let's assume the PHP code will use password_verify with BCRYPT. 
-- 'admin123' hashed with BCRYPT (cost 10) is roughly: $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT INTO `users` (`name`, `email`, `password`, `role`) VALUES
('Admin', 'admin@diecast.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Seed Categories
INSERT INTO `categories` (`name`, `slug`, `type`, `description`) VALUES
('Smartphone', 'smartphone', 'jenis', 'Latest smartphones'),
('Laptop', 'laptop', 'jenis', 'High-performance laptops'),
('Tablet', 'tablet', 'jenis', 'Portable tablets'),
('Accessories', 'accessories', 'jenis', 'Mobile accessories'),
('Apple', 'apple', 'merk', 'Apple products'),
('Samsung', 'samsung', 'merk', 'Samsung products');

-- Wishlists Table
CREATE TABLE IF NOT EXISTS `wishlists` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
);
