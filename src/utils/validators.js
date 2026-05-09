const validateBookingData = (data, sessionStartTime) => {
  const errors = [];
  const { seat_number } = data;

  if (!seat_number || seat_number < 1 || seat_number > 100) {
    errors.push('Seat number must be between 1 and 100');
  }

  if (sessionStartTime) {
    const currentTime = new Date();
    const sessionTime = new Date(sessionStartTime);
    if (sessionTime <= currentTime) {
      errors.push('Cannot book a ticket for a session that has already started or passed');
    }
  }

  return errors;
};

module.exports = { validateBookingData };