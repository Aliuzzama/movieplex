// controllers/homeController.js

// Latest Movies endpoint
const getLatestMovies = (db) => (req, res) => {
    const sql = `
      SELECT 
        m.id, m.name, m.image_path, m.rating, m.duration, 
        m.release_date AS release_date, 
        GROUP_CONCAT(g.genre SEPARATOR ', ') AS genres 
      FROM movie m 
      INNER JOIN movie_genre g ON m.id = g.movie_id 
      GROUP BY m.id 
      ORDER BY release_date DESC 
      LIMIT 6
    `;
  
    console.log("[INFO] Executing SQL Query:", sql);
  
    db.query(sql, (err, data) => {
      if (err) {
        console.error("[ERROR] SQL Query Failed:", err);
        return res.status(500).json({ error: "An error occurred while fetching data.", details: err });
      }
  
      console.log("[SUCCESS] Query executed successfully. Data:", data);
      return res.json(data);
    });
  };
  
  // Location Details endpoint
  const getLocationDetails = (db) => (req, res) => {
    const sql = "SELECT location_details FROM theatre";
  
    db.query(sql, (err, data) => {
      if (err) return res.json(err);
  
      return res.json(data);
    });
  };
  const getAllMovies = (db) => (req, res) => {
    const sql = `
      SELECT 
        m.id, m.name, m.image_path, m.rating, m.duration, 
        m.release_date AS release_date, 
        GROUP_CONCAT(g.genre SEPARATOR ', ') AS genres 
      FROM movie m 
      INNER JOIN movie_genre g ON m.id = g.movie_id 
      GROUP BY m.id 
      ORDER BY release_date DESC
    `;
  
    console.log("[INFO] Executing SQL Query:", sql);
  
    db.query(sql, (err, data) => {
      if (err) {
        console.error("[ERROR] SQL Query Failed:", err);
        return res.status(500).json({ error: "An error occurred while fetching movies.", details: err });
      }
  
      console.log("[SUCCESS] Query executed successfully. Data:", data);
      return res.json(data);
    });
  };
  
  // Location Features endpoint
  const getLocationFeatures = (db) => (req, res) => {
    const sql = "SELECT DISTINCT title, image_path, description FROM features";
  
    db.query(sql, (err, data) => {
      if (err) return res.json(err);
  
      return res.json(data);
    });
  };
  
  // Export all the functions
  module.exports = {
    getLatestMovies,
    getLocationDetails,
    getLocationFeatures,
    getAllMovies
  };
  