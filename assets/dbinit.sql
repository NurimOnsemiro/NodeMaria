CREATE TABLE IF NOT EXISTS `user_account` (
	`idx` INT(11) NOT NULL AUTO_INCREMENT,
	`user_id` VARCHAR(64) NOT NULL,
	`user_password` VARCHAR(64) NOT NULL,
	`ins_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`mod_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`idx`),
	UNIQUE INDEX `user_id` (`user_id`)
)
ENGINE=InnoDB
;
INSERT IGNORE INTO user_account (user_id, user_password) VALUES ('admin', 'p@ssw0rd');
INSERT IGNORE INTO user_account (user_id, user_password) VALUES ('blue', 'p@ssw0rd');
INSERT IGNORE INTO user_account (user_id, user_password) VALUES ('red', 'p@ssw0rd');