const specialtysService = require('./specialtys.service');

exports.getAllSpecialtys = async (req, res) => {
  try {
    const specialtys = await specialtysService.getAllSpecialtys();
    res.status(200).json({ success: true, data: specialtys });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
