const eventBus = require('./EventBus');
const WelcomeEmailService = require('../services/WelcomeEmailService');

const emailService = new WelcomeEmailService();

eventBus.on('UserRegisteredEvent', async (event) => {
  console.log(`[EventBus] Зловлено подію UserRegisteredEvent для юзера ${event.userId}`);
  
  try {
    await emailService.sendWelcomeEmail(event.email);
  } catch (error) {
    console.error(`[EventBus] Помилка відправки листа для ${event.email}:`, error);
  }
});

module.exports = {
  init: () => console.log('[EventBus] WelcomeEmailSubscriber успішно ініціалізовано.')
};