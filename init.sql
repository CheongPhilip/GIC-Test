CREATE DATABASE IF NOT EXISTS gic;
CREATE DATABASE IF NOT EXISTS test;

USE gic;

-- Create databases if they do not exist
CREATE DATABASE IF NOT EXISTS gic;
CREATE DATABASE IF NOT EXISTS test;

-- Switch to the 'gic' database
USE gic;

-- Create 'employees' table if it does not exist
CREATE TABLE IF NOT EXISTS `employees` (
  `id` varchar(255) NOT NULL,
  `name` varchar(10) NOT NULL,
  `email_address` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `gender` enum('male', 'female') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employees_email_address` (`email_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create 'cafes' table if it does not exist
CREATE TABLE IF NOT EXISTS `cafes` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `location` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cafes_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `cafe_employee` (
  `employee_id` varchar(255) NOT NULL,
  `cafe_id` varchar(255) NOT NULL,
  `start_date` datetime NOT NULL,
  PRIMARY KEY (`employee_id`),
  KEY `cafe_employee_cafe_id` (`cafe_id`),
  CONSTRAINT `cafe_employee_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cafe_employee_ibfk_2` FOREIGN KEY (`cafe_id`) REFERENCES `cafes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;