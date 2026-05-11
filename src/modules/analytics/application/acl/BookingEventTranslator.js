const TicketSale = require('../../domain/TicketSale');

class BookingEventTranslator {
  static translate(externalPayload) {
    const title = externalPayload.movieTitle || 'Невідомий фільм';
    const price = externalPayload.price || 150.00;
    
    return new TicketSale(title, price);
  }
}

module.exports = BookingEventTranslator;