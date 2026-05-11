const AnalyticsRepository = require('../../infrastructure/repositories/AnalyticsRepository');
const analyticsRepo = new AnalyticsRepository();

const getStats = async (req, res) => {
  try {
    const stats = await analyticsRepo.getSalesStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ error: 'Помилка при отриманні аналітики' });
  }
};

module.exports = { getStats };