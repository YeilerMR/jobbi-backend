const serviceService = require('./service.service');

exports.createService = async (req, res) => {
  try {
    const userId = req.user.id_user;
    const serviceData = req.body;

    const createdService = await serviceService.createService(userId, serviceData);

    res.status(201).json({
      success: true,
      message: "Service created successfully.",
      data: createdService
    });
  } catch (err) {
    console.error(err);
    res.status(403).json({
      success: false,
      message: err.message || "Failed to create service"
    });
  }
};

exports.getServicesByBranch = async (req, res) => {
  try {
    const userId = req.user.id_user;
    const branchId = req.params.branchId;

    const services = await serviceService.getServicesByBranch(userId, branchId);

    res.json({ success: true, data: services });
  } catch (err) {
    res.status(403).json({ success: false, message: err.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const userId = req.user.id_user;
    const id_service = req.params.id;
    const data = req.body;

    await serviceService.updateService(userId, id_service, data);

    res.json({ success: true, message: 'Service updated.' });
  } catch (err) {
    res.status(403).json({ success: false, message: err.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const userId = req.user.id_user;
    const id_service = req.params.id;

    await serviceService.deleteService(userId, id_service);

    res.json({ success: true, message: 'Service deleted.' });
  } catch (err) {
    res.status(403).json({ success: false, message: err.message });
  }
};

exports.getServicesByUser = async (req, res) => {
  const userId = req.user.id_user;
  const userRole = req.user.id_rol;

  if (!userId) {
    res.status(403).json({
      succes: false,
      message: "Session is expired. Please login and try again."
    });
    return;
  }

  if (userRole !== 1) {
    res.status(403).json({
      succes: false,
      message: "Access denied. Invalid user role type."
    });
    return;
  }

  const services = await serviceService.getServicesByUser(userId);

  res.status(200).json({
    success: true,
    data: services
  });
}