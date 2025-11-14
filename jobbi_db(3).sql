-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql-jobbi.alwaysdata.net
-- Generation Time: Nov 13, 2025 at 06:00 AM
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
  `state_appointment` int(11) DEFAULT NULL,
  `appointment_end` time NOT NULL,
  `google_event_id` varchar(128) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `timezone` varchar(64) DEFAULT 'America/Costa_Rica',
  `recurrence` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`recurrence`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `BookAppointment`
--

INSERT INTO `BookAppointment` (`id_book_appointment`, `id_client`, `id_branch`, `id_employee`, `id_service`, `appointment_date`, `appointment_time`, `state_appointment`, `appointment_end`, `google_event_id`, `title`, `description`, `timezone`, `recurrence`) VALUES
(1, 16, 5, 1, 2, '2025-10-21', '11:30:00', 3, '00:00:00', NULL, NULL, NULL, 'America/Costa_Rica', NULL),
(2, 7, 5, 9, 12, '2025-10-21', '11:30:00', 4, '00:00:00', NULL, NULL, NULL, 'America/Costa_Rica', NULL),
(3, 7, 5, 13, 12, '2025-10-20', '10:30:00', 0, '00:00:00', NULL, NULL, NULL, 'America/Costa_Rica', NULL),
(4, 2, 5, 9, 12, '2025-11-07', '09:00:00', NULL, '09:30:00', NULL, 'Haircut Appointment', NULL, 'America/Costa_Rica', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `booked_events`
--

CREATE TABLE `booked_events` (
  `id` int(11) NOT NULL,
  `id_employee` int(11) NOT NULL,
  `id_branch` int(11) NOT NULL,
  `id_client` int(11) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `start` datetime NOT NULL,
  `end` datetime NOT NULL,
  `type` enum('client','break','other') DEFAULT 'other',
  `recurrence` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`recurrence`)),
  `google_event_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booked_events`
--

INSERT INTO `booked_events` (`id`, `id_employee`, `id_branch`, `id_client`, `title`, `start`, `end`, `type`, `recurrence`, `google_event_id`) VALUES
(2, 9, 0, 0, 'Cita de prueba 2', '2025-10-15 09:00:00', '2025-10-15 10:00:00', 'client', '{\"frequency\":\"WEEKLY\",\"daysOfWeek\":[1]}', '1s90hg1h4rkvplm1tomq185gi8'),
(3, 9, 5, 7, 'Cita de prueba 3', '2025-12-15 09:00:00', '2025-12-15 10:00:00', 'client', '{\"frequency\":\"WEEKLY\",\"daysOfWeek\":[1]}', 'b1al63qgegvj1p2g6t9q8gqt2g');

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
(28, 5, 'De Jeycob', 'La ubi', '44444444', 'elsegundo@gmail.com', 1),
(29, 21, 'Creando un negocio uptade', 'Desde acá del admin', '55446611', 'business@gmail.com', 1);

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
(19, 16, 'Negocio 2', 'la ubicación actualizada', '44556622', 'negocio2@gmail.com', 1),
(20, 17, 'negocio 3', 'ubicacion del negocio 3', '45698741', 'negocio3@gmail.com', 1),
(21, 16, 'Creando un negocio', 'Desde acá del admin', '55446611', 'business@gmail.com', 1);

-- --------------------------------------------------------

--
-- Table structure for table `calendar_config`
--

CREATE TABLE `calendar_config` (
  `id` int(11) NOT NULL,
  `id_employee` int(11) NOT NULL,
  `slot_duration_minutes` int(11) DEFAULT 30,
  `buffer_between_bookings_minutes` int(11) DEFAULT 15,
  `booking_window_days` int(11) DEFAULT 30,
  `min_booking_duration_slots` int(11) DEFAULT 1,
  `max_booking_duration_slots` int(11) DEFAULT 4
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `calendar_config`
--

INSERT INTO `calendar_config` (`id`, `id_employee`, `slot_duration_minutes`, `buffer_between_bookings_minutes`, `booking_window_days`, `min_booking_duration_slots`, `max_booking_duration_slots`) VALUES
(1, 9, 30, 15, 30, 1, 4);

-- --------------------------------------------------------

--
-- Table structure for table `CharacteristicsPlans`
--

CREATE TABLE `CharacteristicsPlans` (
  `id_characteristics` int(11) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `CharacteristicsPlans`
--

INSERT INTO `CharacteristicsPlans` (`id_characteristics`, `description`) VALUES
(1, 'Máximo 1 sucursal'),
(2, 'Máximo 5 empleados por sucursal'),
(3, 'Máximo 2 sucursales'),
(4, 'Máximo 10 empleados por sucursal'),
(5, 'Sucursales ilimitadas'),
(6, 'Empleados ilimitados'),
(7, 'Máximo 1 negocio');

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
(1, 7, 14400, 5300, '2025-11-11 02:26:07'),
(2, 15, 500, 8000, '2025-11-11 06:53:01'),
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
(9, 5, 16, 1),
(12, 5, 7, 1),
(13, 5, 23, 1);

-- --------------------------------------------------------

--
-- Table structure for table `exceptions`
--

CREATE TABLE `exceptions` (
  `id` int(11) NOT NULL,
  `id_employee` int(11) NOT NULL,
  `date` date NOT NULL,
  `type` enum('out_of_office','holiday','other') NOT NULL,
  `note` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exceptions`
--

INSERT INTO `exceptions` (`id`, `id_employee`, `date`, `type`, `note`) VALUES
(1, 9, '2025-12-25', 'holiday', 'Christmas');

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

--
-- Dumping data for table `PlanCharacteristics`
--

INSERT INTO `PlanCharacteristics` (`id_plan`, `id_characteristics`) VALUES
(1, 1),
(1, 2),
(1, 7),
(2, 3),
(2, 4),
(3, 5),
(3, 6);

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

--
-- Dumping data for table `PlansSubscription`
--

INSERT INTO `PlansSubscription` (`id_plans_subscription`, `name`, `description`, `price`, `duration`, `is_active`) VALUES
(1, 'Plan Gratuito', 'Plan básico gratuito con limitaciones', 0, 30, 1),
(2, 'Plan Profesional', 'Plan profesional con más capacidad', 15, 30, 1),
(3, 'Plan Empresarial', 'Plan ilimitado para grandes negocios', 40, 30, 1);

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

--
-- Dumping data for table `Rol_Plans`
--

INSERT INTO `Rol_Plans` (`id_rol`, `id_plan`) VALUES
(1, 1),
(1, 2),
(1, 3);

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

--
-- Dumping data for table `Subscriptions`
--

INSERT INTO `Subscriptions` (`id_suscriptions`, `id_user`, `id_plan`, `start_date`, `end_date`, `state_suscription`) VALUES
(1, 7, 1, '2025-11-12', '2026-11-12', 1);

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
(7, 2, 'Jeycob', 'García', 'jeycobbarrientosgarcia@gmail.com', '84838684', '$2b$10$Wccjzf.xHELOf2rLFxW6beA97yTvhWbUe.rf7LLjgOdgqLgTN2S4u', 1),
(8, 2, 'Daniel', 'Briones', 'danielbrionesvargas@gmail.com', '88882222', '$2b$10$RbUfs.KRKDB.i2rGGKEH2e50xUT9BxrxT5srtJ0aMjLOLcJ8LryTy', 1),
(9, 2, 'Yeiler', 'Montes', 'yeiler@gmail.com', '78675635', '$2b$10$GD3dX4VjQrtYK9jbAXasJOJrMGaUc4EKImmjWLD3P5Y67wFjaQl26', 1),
(15, 2, 'Jobbi', 'Test', 'jobbitest@gmail.com', '84838684', '$2b$10$3dYXPat84pQ03eEJej373e1B9eyF4i5xNPb3N5lbp1iRk8kyO4Ur.', 1),
(16, 1, 'Pruebas únicamente', 'Pruebas, la contra es Test123@', 'test@gmail.com', '84838684', '$2b$10$uNNGF6ITvp86hkG.fC4XV.2bShx8erNgcs9z5o5DX611HtdJdtLCm', 1),
(17, 1, 'Pruebas únicamente', 'Pruebas, la contra es Test123@', 'jason@gmail.com', '84838684', '$2b$10$nj04f6GcVNmIP4fFLlIzh.W5ytI2bcBn3pJ1cBx3Ix.X08GSU8rQS', 1),
(23, 1, 'jason', 'madrig', 'jasonmadrigal@gmail.com', '567856789', '$2b$10$Wccjzf.xHELOf2rLFxW6beA97yTvhWbUe.rf7LLjgOdgqLgTN2S4u', 1);

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
(13, 7, 2, '2025-10-24 08:30:30', 1, 0, 'ce544f4509f8111ce36d7b7b802f3b47', '2025-11-03 22:33:25', '2025-11-04 05:02:56', 0, NULL, 7),
(23, 15, 2, '2025-11-09 23:38:14', 1, 1, NULL, NULL, NULL, 0, NULL, NULL),
(24, 15, 3, '2025-11-11 01:11:20', 1, 1, NULL, NULL, NULL, 1, '2025-11-11 05:56:39', NULL),
(26, 7, 3, '2025-11-11 02:26:08', 1, 0, NULL, NULL, NULL, 1, '2025-11-11 02:36:13', NULL),
(29, 15, 2, '2025-11-11 06:07:58', 1, 1, NULL, NULL, NULL, 1, '2025-11-11 06:12:29', NULL),
(30, 15, 3, '2025-11-11 06:08:31', 0, 0, NULL, NULL, NULL, 1, '2025-11-11 06:09:48', NULL),
(31, 15, 2, '2025-11-11 06:53:01', 1, 1, NULL, NULL, NULL, 1, '2025-11-11 07:02:05', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `working_hours`
--

CREATE TABLE `working_hours` (
  `id` int(11) NOT NULL,
  `id_employee` int(11) NOT NULL,
  `day_of_week` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
  `time_ranges` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`time_ranges`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `working_hours`
--

INSERT INTO `working_hours` (`id`, `id_employee`, `day_of_week`, `time_ranges`) VALUES
(8, 9, 'Monday', '{\"available\": [\"09:00-17:00\"]}'),
(9, 9, 'Tuesday', '{\"available\": [\"09:00-17:00\"]}'),
(10, 9, 'Wednesday', '{\"available\": [\"09:00-17:00\"]}'),
(11, 9, 'Thursday', '{\"available\": [\"09:00-17:00\"]}'),
(12, 9, 'Friday', '{\"available\": [\"09:00-17:00\"]}');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `BookAppointment`
--
ALTER TABLE `BookAppointment`
  ADD PRIMARY KEY (`id_book_appointment`);

--
-- Indexes for table `booked_events`
--
ALTER TABLE `booked_events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_employee` (`id_employee`);

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
-- Indexes for table `calendar_config`
--
ALTER TABLE `calendar_config`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_employee` (`id_employee`);

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
-- Indexes for table `exceptions`
--
ALTER TABLE `exceptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_employee` (`id_employee`);

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
  ADD PRIMARY KEY (`id_suscriptions`),
  ADD KEY `idx_user_active_end` (`id_user`,`state_suscription`,`end_date`),
  ADD KEY `idx_plan_active` (`id_plan`,`state_suscription`),
  ADD KEY `idx_user_only` (`id_user`);

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
  ADD UNIQUE KEY `token` (`token`);

--
-- Indexes for table `working_hours`
--
ALTER TABLE `working_hours`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_employee` (`id_employee`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `BookAppointment`
--
ALTER TABLE `BookAppointment`
  MODIFY `id_book_appointment` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `booked_events`
--
ALTER TABLE `booked_events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Branch`
--
ALTER TABLE `Branch`
  MODIFY `id_branch` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `Business`
--
ALTER TABLE `Business`
  MODIFY `id_business` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `calendar_config`
--
ALTER TABLE `calendar_config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `CharacteristicsPlans`
--
ALTER TABLE `CharacteristicsPlans`
  MODIFY `id_characteristics` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `ClientPoints`
--
ALTER TABLE `ClientPoints`
  MODIFY `id_client_points` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Employee`
--
ALTER TABLE `Employee`
  MODIFY `id_employee` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `exceptions`
--
ALTER TABLE `exceptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
  MODIFY `id_plans_subscription` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  MODIFY `id_suscriptions` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `User_Gift`
--
ALTER TABLE `User_Gift`
  MODIFY `id_user_gift` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `working_hours`
--
ALTER TABLE `working_hours`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `booked_events`
--
ALTER TABLE `booked_events`
  ADD CONSTRAINT `booked_events_ibfk_1` FOREIGN KEY (`id_employee`) REFERENCES `Employee` (`id_employee`) ON DELETE CASCADE;

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
-- Constraints for table `calendar_config`
--
ALTER TABLE `calendar_config`
  ADD CONSTRAINT `calendar_config_ibfk_1` FOREIGN KEY (`id_employee`) REFERENCES `Employee` (`id_employee`) ON DELETE CASCADE;

--
-- Constraints for table `Employee`
--
ALTER TABLE `Employee`
  ADD CONSTRAINT `Employee_ibfk_1` FOREIGN KEY (`id_branch`) REFERENCES `Branch` (`id_branch`);

--
-- Constraints for table `exceptions`
--
ALTER TABLE `exceptions`
  ADD CONSTRAINT `exceptions_ibfk_1` FOREIGN KEY (`id_employee`) REFERENCES `Employee` (`id_employee`) ON DELETE CASCADE;

--
-- Constraints for table `User`
--
ALTER TABLE `User`
  ADD CONSTRAINT `User_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `Rol` (`id_rol`);

--
-- Constraints for table `working_hours`
--
ALTER TABLE `working_hours`
  ADD CONSTRAINT `working_hours_ibfk_1` FOREIGN KEY (`id_employee`) REFERENCES `Employee` (`id_employee`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
