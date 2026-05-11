const coreModule = require('../../../core'); 
const AnalyticsRepository = require('../repositories/AnalyticsRepository');

const analyticsRepo = new AnalyticsRepository();

class AnalyticsSubscriber {
  static init() {
    coreModule.eventBus.on('BookingCreated', async (payload) => {
      try {
        console.log('[Analytics] Отримано подію BookingCreated. Переклад даних (ACL)...');

        const movieTitle = payload.movieTitle || 'Месники: Завершення'; 
        const price = payload.price || 150.00;

        await analyticsRepo.saveSale(movieTitle, price);
        
        console.log(`[Analytics] Успішно записано статистику продажу: ${movieTitle} - ${price} грн`);
      } catch (error) {
        console.error('[Analytics] Помилка при збереженні статистики:', error.message);
      }
    });
  }
}

module.exports = AnalyticsSubscriber;