-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql-jobbi.alwaysdata.net
-- Generation Time: Oct 12, 2025 at 09:32 PM
-- Server version: 10.11.14-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jobbi_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `BookAppointment`
--

CREATE TABLE `BookAppointment` (
  `id_book_appointment` int(11) NOT NULL,
  `id_client` int(11) NOT NULL,
  `id_branch` int(11) NOT NULL,
  `id_employee` int(11) NOT NULL,
  `id_service` int(11) NOT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `state_appointment` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Branch`
--

CREATE TABLE `Branch` (
  `id_branch` int(11) NOT NULL,
  `id_business` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `state_branch` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Branch`
--

INSERT INTO `Branch` (`id_branch`, `id_business`, `name`, `location`, `phone`, `email`, `state_branch`) VALUES
(2, 2, 'Tech Garage', 'Main Street 123', '555-9999', 'garage@tech.com', 1),
(3, 3, 'Jobbi Job', 'Main Street 789', '555-9999', 'jobbi@tech.com', 1),
(4, 4, 'Orlando\'s Jobbi', 'Main Street 789', '555-9999', 'orlandojobbi@tech.com', 1),
(5, 5, 'Orlando\'s Jobbi', 'Main Street 789', '555-9999', 'orlandojobbi@tech.com', 0),
(6, 6, 'Negocio 1', 'Guápiles', '89898989', 'dan1@gmail.com', 1),
(7, 7, 'Negocio 1', 'Guápiles', '89898989', 'dan1@gmail.com', 1),
(8, 8, 'Si pa', 'Hola', '64646464', 'Gahsgs@gmail.com', 1),
(9, 9, 'Hoajj', 'Jdhd', '31545454', 'Gsgsgw@gmail.com', 1),
(10, 10, 'Hshd', 'Hsydh', '946454', 'Gsgdhdhd@gmail.com', 1),
(11, 11, 'Gshd', 'Bdbdd', '87845454', 'G@gmail.com', 1),
(12, 12, 'Jobbi Tech', 'Puerto Viejo, Heredia.', '84838684', 'jobbitech@gmail.com', 1),
(13, 13, 'El Yugo', 'Cruce Guapiles', '86862451', 'yugoinfo@gmail.com', 1);

-- --------------------------------------------------------

--
-- Table structure for table `Business`
--

CREATE TABLE `Business` (
  `id_business` int(11) NOT NULL,
  `id_user_admin` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `state_business` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Business`
--

INSERT INTO `Business` (`id_business`, `id_user_admin`, `name`, `location`, `phone`, `email`, `state_business`) VALUES
(2, 7, 'Tech Garage', 'Main Street 123', '555-9999', 'garage@tech.com', 1),
(3, 7, 'Jobbi Job', 'Main Street 789', '555-9999', 'jobbi@tech.com', 1),
(4, 7, 'Orlando\'s Jobbi', 'Main Street 789', '555-9999', 'orlandojobbi@tech.com', 1),
(5, 8, 'Orlando\'s Jobbi', 'Main Street 789', '555-9999', 'orlandojobbi@tech.com', 0),
(6, 8, 'Negocio 1', 'Guápiles', '89898989', 'dan1@gmail.com', 1),
(7, 8, 'Negocio 1', 'Guápiles', '89898989', 'dan1@gmail.com', 1),
(8, 8, 'Si pa', 'Hola', '64646464', 'Gahsgs@gmail.com', 1),
(9, 8, 'Hoajj', 'Jdhd', '31545454', 'Gsgsgw@gmail.com', 1),
(10, 8, 'Hshd', 'Hsydh', '946454', 'Gsgdhdhd@gmail.com', 1),
(11, 8, 'Gshd', 'Bdbdd', '87845454', 'G@gmail.com', 1),
(12, 15, 'Jobbi Tech', 'Puerto Viejo, Heredia.', '84838684', 'jobbitech@gmail.com', 1),
(13, 15, 'Verduleria La Finca', 'Cruce Río Frio', '86862451', 'lafinca@gmail.com', 1);

-- --------------------------------------------------------

--
-- Table structure for table `CharacteristicsPlans`
--

CREATE TABLE `CharacteristicsPlans` (
  `id_characteristics` int(11) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ClientPoints`
--

CREATE TABLE `ClientPoints` (
  `id_client_points` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `total_points` int(11) DEFAULT 0,
  `redeemed_points` int(11) DEFAULT 0,
  `last_update` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Employee`
--

CREATE TABLE `Employee` (
  `id_employee` int(11) NOT NULL,
  `id_branch` int(11) DEFAULT NULL,
  `id_user` int(11) NOT NULL,
  `availability` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Gifts`
--

CREATE TABLE `Gifts` (
  `id_gift` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `for_role` int(11) DEFAULT NULL,
  `min_points` int(11) DEFAULT NULL,
  `min_rating` double DEFAULT NULL,
  `reward_type` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Message`
--

CREATE TABLE `Message` (
  `id_message` int(11) NOT NULL,
  `id_sender` int(11) NOT NULL,
  `id_receiver` int(11) NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `shipping_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `PlanCharacteristics`
--

CREATE TABLE `PlanCharacteristics` (
  `id_plan` int(11) NOT NULL,
  `id_characteristics` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `PlansSubscription`
--

CREATE TABLE `PlansSubscription` (
  `id_plans_subscription` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Review`
--

CREATE TABLE `Review` (
  `id_review` int(11) NOT NULL,
  `id_book_appointment` int(11) NOT NULL,
  `id_client` int(11) NOT NULL,
  `id_employee` int(11) NOT NULL,
  `qualification` int(11) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `review_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Rol`
--

CREATE TABLE `Rol` (
  `id_rol` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Rol`
--

INSERT INTO `Rol` (`id_rol`, `name`) VALUES
(1, 'admin'),
(2, 'client'),
(3, 'employee');

-- --------------------------------------------------------

--
-- Table structure for table `Rol_Plans`
--

CREATE TABLE `Rol_Plans` (
  `id_rol` int(11) NOT NULL,
  `id_plan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Service`
--

CREATE TABLE `Service` (
  `id_service` int(11) NOT NULL,
  `id_branch` int(11) NOT NULL,
  `id_specialty` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `state_service` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Service`
--

INSERT INTO `Service` (`id_service`, `id_branch`, `id_specialty`, `name`, `description`, `price`, `duration`, `state_service`) VALUES
(1, 2, 3, 'Premium Haircut', 'Includes styling', 35, 45, 0),
(2, 2, 3, 'Haircut', 'Basic haircut service', 20, 30, 1),
(3, 2, 3, 'Premium Haircut', 'Premium haircut service', 20, 30, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Specialty`
--

CREATE TABLE `Specialty` (
  `id_specialty` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Specialty`
--

INSERT INTO `Specialty` (`id_specialty`, `name`) VALUES
(1, 'Barber'),
(2, 'Nails'),
(3, 'Stylish');

-- --------------------------------------------------------

--
-- Table structure for table `SpecialtyEmployee`
--

CREATE TABLE `SpecialtyEmployee` (
  `id_specialty_employee` int(11) NOT NULL,
  `id_employee` int(11) NOT NULL,
  `id_specialty` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Subscriptions`
--

CREATE TABLE `Subscriptions` (
  `id_suscriptions` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_plan` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `state_suscription` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `id_user` int(11) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `state_user` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`id_user`, `id_rol`, `name`, `last_name`, `email`, `phone`, `password`, `state_user`) VALUES
(5, 2, 'María', 'García', 'maria.garcia@example.com', '60012345', '$2b$10$fpacgqz9rLLdXn1bJAymo.PR3QzmgWw8fh.OIwtMPfdhDCqTxXOFS', 1),
(6, 2, 'María', 'García', 'mariaaaaa.garcia@example.com', '60012345', '$2b$10$SnAr0CBheHqsnWiRRHqsy.XsgS44li/k6Lv3kcCELvjSHiZTCE2Bi', 1),
(7, 1, 'Jeycob', 'García', 'jeycobbarrientosgarcia@gmail.com', '84838684', '$2b$10$Wccjzf.xHELOf2rLFxW6beA97yTvhWbUe.rf7LLjgOdgqLgTN2S4u', 1),
(8, 1, 'Daniel', 'Briones', 'danielbrionesvargas@gmail.com', '88882222', '$2b$10$RbUfs.KRKDB.i2rGGKEH2e50xUT9BxrxT5srtJ0aMjLOLcJ8LryTy', 1),
(9, 2, 'Yeiler', 'Montes', 'yeiler@gmail.com', '78675635', '$2b$10$GD3dX4VjQrtYK9jbAXasJOJrMGaUc4EKImmjWLD3P5Y67wFjaQl26', 1),
(10, 2, 'Test', 'LastTest', 'test2@gmail.com', '12345654', '$2b$10$1OVYahFsX3jBvPfjVHR5Ku9OI59Fgp43JUB2HdBPQ6ATY9bhaMD/C', 1),
(11, 2, 'Test2', 'Test2', 'testtest@gmail.com', '34562748', '$2b$10$kOyr4FbpzY1daytzEr9Z8eum6Pz4GNVq/JnSvtI3UKCK.c/xgX7b6', 1),
(12, 2, 'Josue', 'Porras', 'josue@gmail.com', '82726272', '$2b$10$8yRopoMaeIJLV307LDsg1.S1yWMWjFNUJix0diw/AbB4lFXAa.VGS', 1),
(13, 2, 'Josue', 'Porras', 'josue1@gmail.com', '82726272', '$2b$10$ocAH3XgYfNQ7MdhnIzLUHev6vO8s1u0WM64mGu4cAxJ.d4GRX2uX6', 1),
(14, 2, 'H', 'Bshd', 'f@gmail.com', '72726363', '$2b$10$9ZVI5M4eJZ2TR2raRZ1bRucNqh16KJMk1PGGlgAy3duGOwxAmHDuK', 1),
(15, 1, 'Jobbi', 'Test', 'jobbitest@gmail.com', '84838684', '$2b$10$3dYXPat84pQ03eEJej373e1B9eyF4i5xNPb3N5lbp1iRk8kyO4Ur.', 1);

-- --------------------------------------------------------

--
-- Table structure for table `User_Gift`
--

CREATE TABLE `User_Gift` (
  `id_user_gift` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_gift` int(11) NOT NULL,
  `gift_date` datetime DEFAULT NULL,
  `redeemed` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `BookAppointment`
--
ALTER TABLE `BookAppointment`
  ADD PRIMARY KEY (`id_book_appointment`);

--
-- Indexes for table `Branch`
--
ALTER TABLE `Branch`
  ADD PRIMARY KEY (`id_branch`),
  ADD KEY `id_business` (`id_business`);

--
-- Indexes for table `Business`
--
ALTER TABLE `Business`
  ADD PRIMARY KEY (`id_business`),
  ADD KEY `id_user_admin` (`id_user_admin`);

--
-- Indexes for table `CharacteristicsPlans`
--
ALTER TABLE `CharacteristicsPlans`
  ADD PRIMARY KEY (`id_characteristics`);

--
-- Indexes for table `ClientPoints`
--
ALTER TABLE `ClientPoints`
  ADD PRIMARY KEY (`id_client_points`);

--
-- Indexes for table `Employee`
--
ALTER TABLE `Employee`
  ADD PRIMARY KEY (`id_employee`),
  ADD KEY `id_branch` (`id_branch`);

--
-- Indexes for table `Gifts`
--
ALTER TABLE `Gifts`
  ADD PRIMARY KEY (`id_gift`);

--
-- Indexes for table `Message`
--
ALTER TABLE `Message`
  ADD PRIMARY KEY (`id_message`);

--
-- Indexes for table `PlansSubscription`
--
ALTER TABLE `PlansSubscription`
  ADD PRIMARY KEY (`id_plans_subscription`);

--
-- Indexes for table `Review`
--
ALTER TABLE `Review`
  ADD PRIMARY KEY (`id_review`);

--
-- Indexes for table `Rol`
--
ALTER TABLE `Rol`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indexes for table `Service`
--
ALTER TABLE `Service`
  ADD PRIMARY KEY (`id_service`);

--
-- Indexes for table `Specialty`
--
ALTER TABLE `Specialty`
  ADD PRIMARY KEY (`id_specialty`);

--
-- Indexes for table `SpecialtyEmployee`
--
ALTER TABLE `SpecialtyEmployee`
  ADD PRIMARY KEY (`id_specialty_employee`);

--
-- Indexes for table `Subscriptions`
--
ALTER TABLE `Subscriptions`
  ADD PRIMARY KEY (`id_suscriptions`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `id_rol` (`id_rol`);

--
-- Indexes for table `User_Gift`
--
ALTER TABLE `User_Gift`
  ADD PRIMARY KEY (`id_user_gift`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `BookAppointment`
--
ALTER TABLE `BookAppointment`
  MODIFY `id_book_appointment` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Branch`
--
ALTER TABLE `Branch`
  MODIFY `id_branch` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `Business`
--
ALTER TABLE `Business`
  MODIFY `id_business` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `CharacteristicsPlans`
--
ALTER TABLE `CharacteristicsPlans`
  MODIFY `id_characteristics` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ClientPoints`
--
ALTER TABLE `ClientPoints`
  MODIFY `id_client_points` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Employee`
--
ALTER TABLE `Employee`
  MODIFY `id_employee` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Gifts`
--
ALTER TABLE `Gifts`
  MODIFY `id_gift` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Message`
--
ALTER TABLE `Message`
  MODIFY `id_message` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PlansSubscription`
--
ALTER TABLE `PlansSubscription`
  MODIFY `id_plans_subscription` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Review`
--
ALTER TABLE `Review`
  MODIFY `id_review` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Rol`
--
ALTER TABLE `Rol`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Service`
--
ALTER TABLE `Service`
  MODIFY `id_service` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Specialty`
--
ALTER TABLE `Specialty`
  MODIFY `id_specialty` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `SpecialtyEmployee`
--
ALTER TABLE `SpecialtyEmployee`
  MODIFY `id_specialty_employee` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Subscriptions`
--
ALTER TABLE `Subscriptions`
  MODIFY `id_suscriptions` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `User_Gift`
--
ALTER TABLE `User_Gift`
  MODIFY `id_user_gift` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Branch`
--
ALTER TABLE `Branch`
  ADD CONSTRAINT `Branch_ibfk_1` FOREIGN KEY (`id_business`) REFERENCES `Business` (`id_business`);

--
-- Constraints for table `Business`
--
ALTER TABLE `Business`
  ADD CONSTRAINT `Business_ibfk_1` FOREIGN KEY (`id_user_admin`) REFERENCES `User` (`id_user`);

--
-- Constraints for table `Employee`
--
ALTER TABLE `Employee`
  ADD CONSTRAINT `Employee_ibfk_1` FOREIGN KEY (`id_branch`) REFERENCES `Branch` (`id_branch`);

--
-- Constraints for table `User`
--
ALTER TABLE `User`
  ADD CONSTRAINT `User_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `Rol` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
