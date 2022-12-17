-- Set global mysql timezone of local machine to IST

SET GLOBAL time_zone=`+05:30`;

-- Create DB schema

CREATE SCHEMA `classroom` DEFAULT CHARACTER SET utf8mb4 ;

-- users Table Creation

CREATE TABLE
    `classroom`.`users` (
        `id` INT NOT NULL AUTO_INCREMENT,
        `email` VARCHAR(100) NOT NULL UNIQUE,
        `password` VARCHAR(200) NOT NULL,
        `isStudent` TINYINT NOT NULL DEFAULT 0,
        `assignmentIds` JSON DEFAULT null,
        PRIMARY KEY (`id`),
        UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE
    );

-- userSession Table Creation

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

-- assignments Table Creation

CREATE TABLE
    `classroom`.`assignments` (
        `id` INT NOT NULL AUTO_INCREMENT,
        `description` VARCHAR(200) DEFAULT NULL,
        `tutorId` INT NOT NULL,
        `publishedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `deadline` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`)
    );

-- submissions table creation

CREATE TABLE
    `classroom`.`submissions` (
        `id` int NOT NULL AUTO_INCREMENT,
        `assignmentId` int NOT NULL,
        `studentId` int NOT NULL,
        `remark` VARCHAR(1000) DEFAULT NULL,
        `submissionDate` datetime DEFAULT CURRENT_TIMESTAMP,
        `status` enum('PENDING', 'SUBMITTED') NOT NULL DEFAULT 'PENDING',
        `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;