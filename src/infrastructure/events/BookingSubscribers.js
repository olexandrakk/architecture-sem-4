const eventBus = require('./EventBus');
const NotificationService = require('../services/NotificationService');

const notificationService = new NotificationService();

eventBus.on('BookingCreated', async (payload) => {
  console.log(`[EventBus] Отримано подію BookingCreated. Запускаємо фонову відправку...`);
  try {
    await notificationService.sendTicketConfirmation(
      payload.email, 
      payload.bookingId, 
      payload.movieTitle
    );
  } catch (error) {
    console.error(`[EventSubscriber] Помилка при обробці: ${error.message}`);
  }
});