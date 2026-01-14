// controllers/paymentController.js

// Get the latest showtime dates for a specific theatre
const getShowtimeDates = (db) => (req, res) => {
    const theatreId = req.body.theatreId;
  
    console.log("Received request for theatreId:", theatreId);
  
    const sql = `
      SELECT subquery.showtime_date
      FROM (
        SELECT DISTINCT showtimes.showtime_date, showtimes.id  -- Include showtimes.id for ordering
        FROM showtimes
        JOIN shown_in ON showtimes.id = shown_in.showtime_id
        JOIN hall ON shown_in.hall_id = hall.id
        WHERE hall.theatre_id = ?
        ORDER BY showtimes.id DESC
        LIMIT 4
      ) AS subquery
      ORDER BY subquery.showtime_date ASC
    `;
  
    console.log("SQL Query:", sql);
  
    db.query(sql, [theatreId], (err, data) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.json(err);
      }
  
      console.log("Database response:", data);
      return res.json(data);
    });
  };
  
  // Get unique movies for a specific theatre and showtime date
  const getUniqueMovies = (db) => (req, res) => {
    const theatreId = req.body.theatreId;
    const showtimeDate = req.body.userDate;
  
    const sql = `
      SELECT DISTINCT M.id, M.duration, M.name AS movie_name, M.image_path
      FROM movie M
      JOIN shown_in SI ON M.id = SI.movie_id
      JOIN showtimes S ON SI.showtime_id = S.id
      JOIN hall H ON SI.hall_id = H.id
      WHERE H.theatre_id = ? AND S.showtime_date = ?
    `;
  
    db.query(sql, [theatreId, showtimeDate], (err, data) => {
      if (err) return res.json(err);
  
      return res.json(data);
    });
  };
  
  // Get halls for a specific theatre, showtime date, and movie
  const getHalls = (db) => (req, res) => {
    const theatreId = req.body.theatreId;
    const showtimeDate = req.body.userDate;
    const movieId = req.body.userMovieId;
  
    const sql = `
      SELECT H.id AS hall_id, H.name AS hall_name, SI.showtime_id, S.show_type, 
             S.movie_start_time, S.price_per_seat
      FROM hall H
      JOIN shown_in SI ON H.id = SI.hall_id
      JOIN showtimes S ON SI.showtime_id = S.id
      WHERE H.theatre_id = ? AND S.showtime_date = ? AND SI.movie_id = ?
    `;
  
    db.query(sql, [theatreId, showtimeDate, movieId], (err, data) => {
      if (err) return res.json(err);
  
      return res.json(data);
    });
  };
  
  // Get seats for a specific showtime, hall, and movie
  const getSeats = (db) => (req, res) => {
    const showtime_id = req.body.userShowtimeId;
    const hall_id = req.body.userHallId;
    const movie_id = req.body.userMovieId;
  
    const sql = `
      SELECT S.id AS seat_id, S.name AS seat_name,
             CASE WHEN T.id IS NULL THEN TRUE ELSE FALSE END AS booked_status
      FROM seat AS S
      JOIN hallwise_seat AS HS ON S.id = HS.seat_id
      JOIN shown_in AS SI ON HS.hall_id = SI.hall_id
      LEFT JOIN booking AS T ON
        T.seat_id = S.id AND
        T.showtimes_id = SI.showtime_id AND
        T.hall_id = SI.hall_id AND
        T.movie_id = SI.movie_id
      WHERE SI.showtime_id = ? AND SI.hall_id = ? AND SI.movie_id = ?
      ORDER BY S.id
    `;
  
    db.query(sql, [showtime_id, hall_id, movie_id], (err, data) => {
      if (err) return res.json(err);
  
      return res.json(data);
    });
  };
  
  // Handle payment processing
  const processPayment = (db) => (req, res) => {
    const amount = req.body.amount;
    const email = req.body.email;
    const paymentType = req.body.userPayMethod;
  
    const sql1 = "INSERT INTO payment(amount, method, customer_email) VALUES(?, ?, ?)";
    const sql2 = "SELECT LAST_INSERT_ID() as last_id";
  
    db.query(sql1, [amount, paymentType, email], (err1, data1) => {
      if (err1) return res.json(err1);
  
      db.query(sql2, (err2, data2) => {
        if (err2) return res.json(err2);
  
        return res.json(data2);
      });
    });
  };
  
  // Purchase ticket
  const purchaseTicket = (db) => (req, res) => {
    const price = req.body.price;
    const date = req.body.purchase_date;
    const payment_id = req.body.paymentID;
    const seat_id = req.body.seatId;
    const hall_id = req.body.userHallId;
    const movie_id = req.body.userMovieId;
    const showtime_id = req.body.userShowtimeId;
  
    const sql = `
      INSERT INTO booking (price, purchase_date, payment_id, seat_id, hall_id, movie_id, showtimes_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
  
    db.query(
      sql,
      [price, date, payment_id, seat_id, hall_id, movie_id, showtime_id],
      (err, data) => {
        if (err) return res.json(err);
  
        return res.json(data);
      }
    );
  };
  
  // Get recent purchase tickets
  const getRecentPurchase = (db) => (req, res) => {
    const payment_id = req.body.paymentID;
    const sql = "SELECT id FROM booking WHERE payment_id = ?";
  
    db.query(sql, [payment_id], (err, data) => {
      if (err) return res.json(err);
  
      return res.json(data);
    });
  };
  
  module.exports = {
    getShowtimeDates,
    getUniqueMovies,
    getHalls,
    getSeats,
    processPayment,
    purchaseTicket,
    getRecentPurchase,
  };
  