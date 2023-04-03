DROP TABLE IF EXISTS `dev`.`sample`;

CREATE TABLE `dev`.`sample` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `company` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `phone` varchar(45) NOT NULL,
  `zonecode` varchar(5) NOT NULL,
  `address` varchar(100) NOT NULL,
  `road_address` varchar(100) NOT NULL,
  `detail_address` varchar(45) DEFAULT NULL,
  `gender` enum('M','F') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;


INSERT INTO `dev`.`sample`
(`id`, `name`, `company`, `email`, `phone`, `zonecode`, `address`, `road_address`, `detail_address`, `gender`)
VALUES
(1, '유재석', 'M-Ent', 'ryu@gmail.com', '010-0000-0001', '13494', '(13494) 경기 성남시 분당구 판교역로 235, 1층', '경기 성남시 분당구 판교역로 235', '1층', 'M'),
(2, '김종국', 'M-Ent', 'kim@gmail.com', '010-0000-0002', '13494', '(13494) 경기 성남시 분당구 판교역로 235, 2층', '경기 성남시 분당구 판교역로 235', '2층', 'M'),
(3, '송지효', 'M-Ent', 'song@gmail.com', '010-0000-0003', '13494', '(13494) 경기 성남시 분당구 판교역로 235, 3층', '경기 성남시 분당구 판교역로 235', '3층', 'M'),
(4, '양세찬', 'M-Ent', 'yang@gmail.com', '010-0000-0004', '13494', '(13494) 경기 성남시 분당구 판교역로 235, 4층', '경기 성남시 분당구 판교역로 235', '4층', 'M')