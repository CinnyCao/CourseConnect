CREATE TABLE IF NOT EXISTS `enrolledUsers` (
  `eu_id` int(11) NOT NULL AUTO_INCREMENT,
  `u_id` int(11) NOT NULL,
  `c_id` int(11) DEFAULT NULL,
  `class` varchar(160) NOT NULL,
  PRIMARY KEY (`eu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `enrolledUsers` (eu_id, u_id, c_id, class) VALUES (1, 6, 1, "CSCC01");