const coreModule = require('../../../core'); 
const AnalyticsRepository = require('../repositories/AnalyticsRepository');
const BookingEventTranslator = require('../../application/acl/BookingEventTranslator');

const analyticsRepo = new AnalyticsRepository();

class AnalyticsSubscriber {
  static init() {
    coreModule.eventBus.on('BookingCreated', async (payload) => {
      try {
        console.log('[Analytics] Отримано подію BookingCreated. Пропускаємо через ACL...');

        const ticketSale = BookingEventTranslator.translate(payload);

        await analyticsRepo.saveSale(ticketSale.movieTitle, ticketSale.price);
        
        console.log(`[Analytics] Успішно записано статистику: ${ticketSale.movieTitle} - ${ticketSale.price} грн`);
      } catch (error) {
        console.error('[Analytics] Помилка при збереженні статистики:', error.message);
      }
    });
  }
}

module.exports = AnalyticsSubscriber;