// controllers/moviedetailsController.js

// Get movie details with directors and genres
const getMovieDetail = (db) => (req, res) => {
    const { movieDetailsId } = req.body;
  
    const sql = `
      SELECT
        M.*,
        GROUP_CONCAT(DISTINCT MD.director SEPARATOR ', ') AS directors,
        GROUP_CONCAT(DISTINCT MG.genre SEPARATOR ', ') AS genres
      FROM
        movie M
      JOIN
        movie_directors MD ON M.id = MD.movie_id
      JOIN
        movie_genre MG ON M.id = MG.movie_id
      WHERE
        M.id = ?
      GROUP BY
        M.id
    `;
  
    db.query(sql, [movieDetailsId], (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  };
  
  // Get movie wise showtimes for a specific theatre
  const getMovieWiseShowtimes = (db) => (req, res) => {
    const { movieDetailsId, theatreId } = req.body;
  
    const sql = `
      SELECT
        S.id AS showtime_id,
        H.id AS hall_id,
        M.id AS movie_id,
        S.showtime_date,
        S.movie_start_time,
        S.show_type,
        S.price_per_seat
      FROM
        theatre T
      JOIN hall H ON T.id = H.theatre_id
      JOIN shown_in SI ON H.id = SI.hall_id
      JOIN showtimes S ON SI.showtime_id = S.id
      JOIN movie M ON SI.movie_id = M.id
      JOIN (
        SELECT DISTINCT showtime_date
        FROM showtimes
        ORDER BY showtime_date DESC
        LIMIT 4
      ) AS LatestDates ON S.showtime_date = LatestDates.showtime_date
      WHERE
        T.id = ? AND M.id = ?
      ORDER BY
        S.showtime_date ASC
    `;
  
    db.query(sql, [theatreId, movieDetailsId], (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  };
  
  // Get other movies excluding the specified movie
  const getOtherMovies = (db) => (req, res) => {
    const { movieDetailsId } = req.body;
  
    const sql = `
      SELECT
        m.id,
        m.name,
        m.image_path,
        m.rating,
        m.duration,
        m.release_date AS release_date,
        GROUP_CONCAT(g.genre SEPARATOR ', ') AS genres
      FROM
        movie m
      INNER JOIN movie_genre g ON m.id = g.movie_id
      GROUP BY
        m.id
      HAVING
        m.id != ?
    `;
  
    db.query(sql, [movieDetailsId], (err, data) => {
      if (err) return res.json(err);
      return res.status(200).json(data);
    });
  };
  
  module.exports = {
    getMovieDetail,
    getMovieWiseShowtimes,
    getOtherMovies,
  };
  