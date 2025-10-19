const service = require('./users.service');

exports.searchUsersByName = async (req, res) => {
  try {
    const { name } = req.query;
    const users = await service.searchUsersByName(name);
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
