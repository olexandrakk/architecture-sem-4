class TicketSale {
  constructor(movieTitle, price) {
    this.movieTitle = movieTitle;
    this.price = price;
    this.recordedAt = new Date().toISOString();
  }
}

module.exports = TicketSale;