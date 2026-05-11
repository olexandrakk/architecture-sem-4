const pool = require('../../../../infrastructure/config/db');

class AnalyticsRepository {
  async saveSale(movieTitle, price) {
    const query = 'INSERT INTO analytics_sales (movie_title, price) VALUES ($1, $2) RETURNING *';
    const values = [movieTitle, price];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  async getSalesStats() {
    const query = `
      SELECT movie_title, COUNT(*) as tickets_sold, SUM(price) as total_revenue
      FROM analytics_sales
      GROUP BY movie_title
      ORDER BY total_revenue DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = AnalyticsRepository;