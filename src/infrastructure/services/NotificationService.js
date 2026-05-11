class NotificationService {
  async sendTicketConfirmation(email, bookingId, movieTitle) {
    console.log(`[NotificationService] Починаю відправку листа для квитка #${bookingId}...`);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (Math.random() < 0.1) {
      console.error(`[NotificationService] ПОМИЛКА: Не вдалося відправити лист!`);
      throw new Error('Email server is down');
    }

    console.log(`[NotificationService] УСПІХ: Лист з квитком #${bookingId} відправлено на пошту ${email}.`);
  }
}

module.exports = NotificationService;