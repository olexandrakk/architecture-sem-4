const analyticsRoutes = require('./presentation/routes/analyticsRoutes');
const AnalyticsSubscriber = require('./infrastructure/events/AnalyticsSubscriber');

module.exports = {
  routes: {
    analytics: analyticsRoutes
  },
  initSubscribers: () => {
    AnalyticsSubscriber.init();
  }
};