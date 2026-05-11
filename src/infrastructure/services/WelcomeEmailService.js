class WelcomeEmailService {
  async sendWelcomeEmail(email) {
    console.log(`[WelcomeEmailService] Починаємо відправку листа на ${email}...`);
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`[WelcomeEmailService] Лист успішно відправлено на ${email}!`);
        resolve();
      }, 2000);
    });
  }
}

module.exports = WelcomeEmailService;