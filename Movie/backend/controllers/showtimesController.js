// controllers/showtimesController.js

// Get all theatres
const getTheatres = (db) => (req, res) => {
    const sql = "SELECT id, name, location FROM theatre";
  
    db.query(sql, (err, data) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ error: "An error occurred while fetching data." });
      }
      return res.json(data);
    });
  };
  
  // Get showtimes for a specific theatre and genre
  const getShowtimes = (db) => (req, res) => {
    const theatreName = req.body.theatreName;
    const userGenre = req.body.userGenre;
  
    const sql1 = `
      SELECT M.id, M.name AS movie_name, M.image_path, S.showtime_date, 
             S.movie_start_time, S.show_type, MG.genre 
      FROM theatre T 
      JOIN hall H ON T.id = H.theatre_id 
      JOIN shown_in SI ON H.id = SI.hall_id 
      JOIN showtimes S ON SI.showtime_id = S.id 
      JOIN movie M ON SI.movie_id = M.id 
      JOIN movie_genre MG ON MG.movie_id = M.id 
      JOIN (SELECT DISTINCT showtime_date FROM showtimes ORDER BY showtime_date DESC LIMIT 4) AS LatestDates 
      ON S.showtime_date = LatestDates.showtime_date 
      WHERE T.name = ? AND MG.genre = ? 
      ORDER BY S.showtime_date ASC
    `;
  
    const sql2 = `
      SELECT M.id, M.name AS movie_name, M.image_path, S.showtime_date, 
             S.movie_start_time, S.show_type, MG.genre 
      FROM theatre T 
      JOIN hall H ON T.id = H.theatre_id 
      JOIN shown_in SI ON H.id = SI.hall_id 
      JOIN showtimes S ON SI.showtime_id = S.id 
      JOIN movie M ON SI.movie_id = M.id 
      JOIN movie_genre MG ON MG.movie_id = M.id 
      JOIN (SELECT DISTINCT showtime_date FROM showtimes ORDER BY showtime_date DESC LIMIT 4) AS LatestDates 
      ON S.showtime_date = LatestDates.showtime_date 
      WHERE T.name = ? 
      ORDER BY S.showtime_date ASC
    `;
  
    if (userGenre === "All") {
      db.query(sql2, [theatreName], (err, data) => {
        if (err) {
          console.error("Database query error:", err);
          return res.status(500).json({ error: "An error occurred while fetching data." });
        }
        return res.json(data);
      });
    } else {
      db.query(sql1, [theatreName, userGenre], (err, data) => {
        if (err) {
          console.error("Database query error:", err);
          return res.status(500).json({ error: "An error occurred while fetching data." });
        }
        return res.json(data);
      });
    }
  };
  
  // Get distinct genres
  const getGenres = (db) => (req, res) => {
    const sql = "SELECT DISTINCT genre FROM movie_genre";
  
    db.query(sql, (err, data) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ error: "An error occurred while fetching data." });
      }
      return res.json(data);
    });
  };
  
  module.exports = {
    getTheatres,
    getShowtimes,
    getGenres
  };
  