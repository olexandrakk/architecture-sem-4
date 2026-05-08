CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    duration_minutes INT NOT NULL CHECK (duration_minutes > 0)
);

CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    movie_id INT REFERENCES movies(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0)
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    session_id INT REFERENCES sessions(id) ON DELETE CASCADE,
    seat_number INT NOT NULL CHECK (seat_number > 0 AND seat_number <= 100),
    customer_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(session_id, seat_number)
);