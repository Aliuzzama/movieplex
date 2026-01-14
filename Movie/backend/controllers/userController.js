// controllers/userController.js

// Handle user registration
const registerUser = (db) => (req, res) => {
    const { email, firstName, lastName, password, phoneNumber } = req.body;
  
    const sql = `
      INSERT INTO person (email, first_name, last_name, password, phone_number, person_type)
      VALUES (?, ?, ?, ?, ?, 'Customer')
    `;
  
    db.query(sql, [email, firstName, lastName, password, phoneNumber], (err, data) => {
      if (err) {
        return res.status(500).json({ message: "Sorry, Please try again!" });
      }
      return res.status(200).json({ message: "Congratulations! We created your account" });
    });
  };
  
  // Handle user login
  const loginUser = (db) => (req, res) => {
    const { email, password } = req.body;
  
    const sql = `SELECT email, first_name, person_type, password FROM person WHERE email=? AND password=?`;
  
    db.query(sql, [email, password], (err, data) => {
      if (err) return res.json(err);
  
      if (data.length === 0) {
        return res.status(404).json({ message: "Sorry, User not found!" });
      }
  
      return res.json(data);
    });
  };
  
  // Get customer profile
  const getCustomerProfile = (db) => (req, res) => {
    const { email, password } = req.body;
  
    const sql = `SELECT * FROM person WHERE email=? AND password=?`;
  
    db.query(sql, [email, password], (err, data) => {
      if (err) return res.json(err);
  
      return res.json(data);
    });
  };
  
  // Get customer purchase history
  const getCustomerPurchases = (db) => (req, res) => {
    const { email } = req.body;
  
    const sql = `
      SELECT
        P.email AS customer_email,
        PA.id AS payment_id,
        GROUP_CONCAT(B.id SEPARATOR ', ') AS ticket_ids,  -- Changed T to B
        GROUP_CONCAT(ST.name SEPARATOR ', ') AS seat_numbers,
        TH.name AS theatre_name,
        H.name AS hall_name,
        M.name AS movie_name,
        B.movie_id as movie_id,  -- Changed T to B
        M.image_path AS movie_image,
        S.movie_start_time AS movie_start_time,
        S.show_type AS show_type,
        S.showtime_date AS showtime_date,
        PA.amount AS ticket_price,
        B.purchase_date AS purchase_date  -- Changed T to B
      FROM person P
      JOIN payment PA ON P.email = PA.customer_email
      JOIN booking B ON PA.id = B.payment_id  -- Changed T to B
      JOIN showtimes S ON B.showtimes_id = S.id
      JOIN movie M ON B.movie_id = M.id
      JOIN hall H ON B.hall_id = H.id
      JOIN theatre TH ON H.theatre_id = TH.id
      JOIN seat ST ON B.seat_id = ST.id
      WHERE P.email = ?
      GROUP BY PA.id 
      ORDER BY payment_id DESC
    `;

  
    db.query(sql, [email], (err, data) => {
      if (err) return res.json(err);
  
      return res.json(data);
    });
  };
  
  module.exports = {
    registerUser,
    loginUser,
    getCustomerProfile,
    getCustomerPurchases,
  };
  