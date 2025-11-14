-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql-jobbi.alwaysdata.net
-- Generation Time: Nov 02, 2025 at 04:23 AM
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
CREATE DATABASE IF NOT EXISTS `jobbi_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `jobbi_db`;

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
  `state_appointment` int(11) DEFAULT NULL,
  `appointment_end` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `BookAppointment`
--

INSERT INTO `BookAppointment` (`id_book_appointment`, `id_client`, `id_branch`, `id_employee`, `id_service`, `appointment_date`, `appointment_time`, `state_appointment`, `appointment_end`) VALUES
(1, 16, 5, 1, 2, '2025-10-21', '11:30:00', 3, '00:00:00'),
(2, 7, 5, 9, 12, '2025-10-21', '11:30:00', 4, '00:00:00'),
(3, 7, 5, 13, 12, '2025-10-20', '10:30:00', 0, '00:00:00');

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
(5, 5, 'Orlando\'s Jobbi actu', 'Main Street 789', '555-9999', 'orlandojobbi@tech.com', 1),
(26, 19, 'branch 2', 'ubicacion del branch', '45787545', 'branch2@gmail.com', 1),
(27, 20, 'branch 3', 'ubicacion del branch 3', '12365478', 'branch3@gmail.com', 1),
(28, 5, 'De Jeycob', 'La ubi', '44444444', 'elsegundo@gmail.com', 1);

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
(5, 7, 'Orlando\'s Jobbi', 'Main Street 789', '555-9999', 'orlandojobbi@tech.com', 1),
(19, 16, 'Negocio 2', 'la ubicación', '44556699', 'negocio2@gmail.com', 1),
(20, 17, 'negocio 3', 'ubicacion del negocio 3', '45698741', 'negocio3@gmail.com', 1);

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

--
-- Dumping data for table `ClientPoints`
--

INSERT INTO `ClientPoints` (`id_client_points`, `id_user`, `total_points`, `redeemed_points`, `last_update`) VALUES
(1, 7, 1000, 3700, '2025-10-24 08:30:30'),
(2, 15, 200, 4300, '2025-10-25 01:04:29'),
(3, 17, 500, 50, '2025-10-23 04:51:13');

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

--
-- Dumping data for table `Employee`
--

INSERT INTO `Employee` (`id_employee`, `id_branch`, `id_user`, `availability`) VALUES
(9, 5, 17, 1),
(12, 5, 7, 1),
(13, 5, 23, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Gifts`
--

CREATE TABLE `Gifts` (
  `id_gift` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `discount` int(11) NOT NULL,
  `for_role` int(11) DEFAULT NULL,
  `min_points` int(11) DEFAULT NULL,
  `min_rating` double DEFAULT NULL,
  `reward_type` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Gifts`
--

INSERT INTO `Gifts` (`id_gift`, `name`, `description`, `discount`, `for_role`, `min_points`, `min_rating`, `reward_type`, `is_active`) VALUES
(1, 'Recompensa Destacado', 'Negocio aparece primero en búsquedas', 0, 1, 1000, 0, 'prioridad', 1),
(2, 'Descuento 10%', '10% en servicios seleccionados', 10, 2, 500, 0, 'descuento', 1),
(3, '15% Discount', '15% off your next service', 15, 2, 600, 0, 'descuento', 1);

-- --------------------------------------------------------

--
-- Table structure for table `Invitation`
--

CREATE TABLE `Invitation` (
  `id_invitation` int(11) NOT NULL,
  `id_client` int(11) NOT NULL,
  `id_branch` int(11) NOT NULL,
  `state_invitation` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Invitation`
--

INSERT INTO `Invitation` (`id_invitation`, `id_client`, `id_branch`, `state_invitation`) VALUES
(4, 16, 0, 1),
(5, 16, 5, 1),
(6, 16, 5, 1),
(7, 16, 5, 1);

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
(12, 5, 1, 'Corte de pelo clásico', 'Corte clásico para hombres', 150, 30, 1),
(13, 5, 2, 'Manicure corte', 'Manicure sencillo con esmalte', 200, 45, 1),
(14, 5, 1, 'Corte de pelo moderno', 'Corte moderno y estilizado', 180, 40, 1),
(15, 28, 3, 'Afeitado premium corte', 'Afeitado con toalla caliente', 220, 30, 1),
(16, 26, 2, 'Peinado para eventos corte', 'Peinado especial para eventos', 300, 60, 1),
(17, 26, 1, 'Corte infantil', 'Corte especial para niños', 100, 25, 1),
(18, 27, 3, 'Masaje corte relajante', 'Masaje de cuerpo completo', 400, 50, 1),
(19, 27, 2, 'Tratamiento facial corte', 'Limpieza y hidratación facial', 350, 45, 1),
(20, 27, 1, 'Barba estilizada corte', 'Perfilado y cuidado de barba', 120, 20, 1),
(21, 27, 3, 'Masaje deportivo corte', 'Masaje para aliviar músculos', 450, 55, 1);

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
(7, 3, 'Jeycob', 'García', 'jeycobbarrientosgarcia@gmail.com', '84838684', '$2b$10$Wccjzf.xHELOf2rLFxW6beA97yTvhWbUe.rf7LLjgOdgqLgTN2S4u', 1),
(8, 2, 'Daniel', 'Briones', 'danielbrionesvargas@gmail.com', '88882222', '$2b$10$RbUfs.KRKDB.i2rGGKEH2e50xUT9BxrxT5srtJ0aMjLOLcJ8LryTy', 1),
(9, 2, 'Yeiler', 'Montes', 'yeiler@gmail.com', '78675635', '$2b$10$GD3dX4VjQrtYK9jbAXasJOJrMGaUc4EKImmjWLD3P5Y67wFjaQl26', 1),
(15, 2, 'Jobbi', 'Test', 'jobbitest@gmail.com', '84838684', '$2b$10$3dYXPat84pQ03eEJej373e1B9eyF4i5xNPb3N5lbp1iRk8kyO4Ur.', 1),
(16, 1, 'Pruebas únicamente', 'Pruebas, la contra es Test123@', 'test@gmail.com', '84838684', '$2b$10$uNNGF6ITvp86hkG.fC4XV.2bShx8erNgcs9z5o5DX611HtdJdtLCm', 1),
(17, 1, 'Pruebas únicamente', 'Pruebas, la contra es Test123@', 'jason@gmail.com', '84838684', '$2b$10$nj04f6GcVNmIP4fFLlIzh.W5ytI2bcBn3pJ1cBx3Ix.X08GSU8rQS', 1),
(23, 3, 'jason', 'madrig', 'jasonmadrigal@gmail.com', '567856789', '$2b$10$Wccjzf.xHELOf2rLFxW6beA97yTvhWbUe.rf7LLjgOdgqLgTN2S4u', 1);

-- --------------------------------------------------------

--
-- Table structure for table `User_Gift`
--

CREATE TABLE `User_Gift` (
  `id_user_gift` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_gift` int(11) NOT NULL,
  `gift_date` datetime DEFAULT NULL,
  `redeemed` tinyint(1) DEFAULT NULL,
  `is_active` tinyint(4) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `token_expires_at` datetime DEFAULT NULL,
  `token_created_at` datetime DEFAULT NULL,
  `token_used` tinyint(1) DEFAULT 0,
  `token_used_at` datetime DEFAULT NULL,
  `token_generated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `User_Gift`
--

INSERT INTO `User_Gift` (`id_user_gift`, `id_user`, `id_gift`, `gift_date`, `redeemed`, `is_active`, `token`, `token_expires_at`, `token_created_at`, `token_used`, `token_used_at`, `token_generated_by`) VALUES
(1, 7, 1, '2025-10-23 04:28:26', 1, 1, NULL, NULL, NULL, 0, NULL, NULL),
(2, 17, 1, '2025-10-23 04:28:26', 1, 1, NULL, NULL, NULL, 0, NULL, NULL),
(13, 7, 2, '2025-10-24 08:30:30', 1, 0, NULL, NULL, NULL, 0, NULL, NULL);

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
-- Indexes for table `Invitation`
--
ALTER TABLE `Invitation`
  ADD PRIMARY KEY (`id_invitation`);

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
  ADD PRIMARY KEY (`id_user_gift`),
  ADD UNIQUE KEY `unique_user_gift` (`id_user`,`id_gift`),
  ADD UNIQUE KEY `token` (`token`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `BookAppointment`
--
ALTER TABLE `BookAppointment`
  MODIFY `id_book_appointment` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Branch`
--
ALTER TABLE `Branch`
  MODIFY `id_branch` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `Business`
--
ALTER TABLE `Business`
  MODIFY `id_business` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `CharacteristicsPlans`
--
ALTER TABLE `CharacteristicsPlans`
  MODIFY `id_characteristics` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ClientPoints`
--
ALTER TABLE `ClientPoints`
  MODIFY `id_client_points` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Employee`
--
ALTER TABLE `Employee`
  MODIFY `id_employee` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `Gifts`
--
ALTER TABLE `Gifts`
  MODIFY `id_gift` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Invitation`
--
ALTER TABLE `Invitation`
  MODIFY `id_invitation` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
  MODIFY `id_service` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

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
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `User_Gift`
--
ALTER TABLE `User_Gift`
  MODIFY `id_user_gift` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

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
