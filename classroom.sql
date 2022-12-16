CREATE SCHEMA `classroom` DEFAULT CHARACTER SET utf8mb4 ;

-- User Table Creation

CREATE TABLE
    `classroom`.`users` (
        `id` INT NOT NULL AUTO_INCREMENT,
        `email` VARCHAR(100) NOT NULL UNIQUE,
        `password` VARCHAR(200) NOT NULL,
        `isStudent` TINYINT NOT NULL DEFAULT 0,
        `assignmentId` INT NOT NULL DEFAULT 0,
        PRIMARY KEY (`id`),
        UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE
    );

-- UserSession Table Creation

CREATE TABLE
    `classroom`.`userSession` (
        `id` INT NOT NULL AUTO_INCREMENT,
        `sessionId` VARCHAR(100) NOT NULL UNIQUE,
        `userId` INT NOT NULL DEFAULT 0,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
        `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        UNIQUE INDEX `sessionId_UNIQUE_idx` (`sessionId` ASC) VISIBLE,
    );