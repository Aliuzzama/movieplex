// controllers/adminController.js
// Helper function to check if the user is an Admin
const checkAdmin = (db, email, password) => {
    const sql = `SELECT * FROM person WHERE email = ? AND password = ? AND person_type = 'Admin'`;
    return new Promise((resolve, reject) => {
      db.query(sql, [email, password], (err, data) => {
        if (err) return reject(err);
        if (data.length === 0) return reject({ message: "Sorry, You are not Admin!" });
        resolve();
      });
    });
  };
// Get total tickets
const getTotalTickets = (db) => (req, res) => {
    const sql = `SELECT COUNT(*) AS total_tickets FROM booking`;
  
    db.query(sql, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  };
  
  // Get total payment
  const getTotalPayment = (db) => (req, res) => {
    const sql = `SELECT sum(amount) AS total_amount FROM payment`;
  
    db.query(sql, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  };
  
  // Get total customers
  const getTotalCustomers = (db) => (req, res) => {
    const sql = `SELECT COUNT(*) AS total_customers FROM person WHERE person_type='Customer'`;
  
    db.query(sql, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  };
  
  // Get total tickets per movie
  const getTotalTicketsPerMovie = (db) => (req, res) => {
    const sql = `SELECT M.name, T.movie_id, COUNT(*) AS tickets_per_movie 
                 FROM booking T 
                 JOIN movie M ON T.movie_id = M.id 
                 GROUP BY movie_id`;
  
    db.query(sql, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  };
  
  // Admin Movie Add
  const addMovie = (db) => (req, res) => {
    const { email, password, name, image_path, language, synopsis, rating, duration, top_cast, release_date } = req.body;
  
    const adminCheckSql = `SELECT * FROM person WHERE email = ? AND password = ? AND person_type = 'Admin'`;
    const movieInsertSql = `INSERT INTO movie (name, image_path, language, synopsis, rating, duration, top_cast, release_date) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const lastInsertIdSql = `SELECT LAST_INSERT_ID() AS last_id`;
  
    db.query(adminCheckSql, [email, password], (err, data) => {
      if (err) return res.json(err);
  
      if (data.length === 0) {
        return res.status(404).json({ message: "Sorry, You are not Admin!" });
      }
  
      db.query(movieInsertSql, [name, image_path, language, synopsis, rating, duration, top_cast, release_date], (err1, data1) => {
        if (err1) return res.json(err1);
  
        db.query(lastInsertIdSql, (err2, data2) => {
          if (err2) return res.json(err2);
          return res.json(data2);
        });
      });
    });
  };
  const editMovie = (db) => (req, res) => {
    console.log(req.body);
    const {
      email,
      password,
      movieId,
      movieDetails
    } = req.body;
  
    // Destructure the fields from movieDetails
    const {
      name,
      image_path,
      language,
      synopsis,
      rating,
      duration,
      top_cast,
      release_date
    } = movieDetails;
  
    console.log("NAME: ", name);
  
    const adminCheckSql = `SELECT * FROM person WHERE email = ? AND password = ? AND person_type = 'Admin'`;
  
    db.query(adminCheckSql, [email, password], (err, data) => {
      if (err) return res.json(err);
  
      if (data.length === 0) {
        return res.status(404).json({ message: "Sorry, You are not Admin!" });
      }
  
      // Build the update query dynamically based on the fields provided
      const updates = [];
      const params = [];
  
      if (name) {
        updates.push("name = ?");
        params.push(name);
      }
      if (image_path) {
        updates.push("image_path = ?");
        params.push(image_path);
      }
      if (language) {
        updates.push("language = ?");
        params.push(language);
      }
      if (synopsis) {
        updates.push("synopsis = ?");
        params.push(synopsis);
      }
      if (rating) {
        updates.push("rating = ?");
        params.push(rating);
      }
      if (duration) {
        updates.push("duration = ?");
        params.push(duration);
      }
      if (top_cast) {
        updates.push("top_cast = ?");
        params.push(top_cast);
      }
      if (release_date) {
        updates.push("release_date = ?");
        params.push(release_date);
      }
  
      // Only update if there are fields to change
      if (updates.length === 0) {
        return res.status(400).json({ message: "No fields to update!" });
      }
  
      const movieUpdateSql = `
        UPDATE movie 
        SET ${updates.join(", ")}
        WHERE id = ?
      `;
      params.push(movieId);
  
      db.query(movieUpdateSql, params, (err1, data1) => {
        if (err1) return res.json(err1);
  
        if (data1.affectedRows === 0) {
          return res.status(404).json({ message: "Movie not found or no changes made!" });
        }
  
        return res.json({ message: "Movie updated successfully!" });
      });
    });
  };
  
  

  const deleteMovie = (db) => (req, res) => {
    const { email, password, movieId } = req.body;

    const adminCheckSql = `SELECT * FROM person WHERE email = ? AND password = ? AND person_type = 'Admin'`;
    const movieDeleteSql = `DELETE FROM movie WHERE id = ?`;

    db.query(adminCheckSql, [email, password], (err, data) => {
      if (err) return res.json(err);

      if (data.length === 0) {
        return res.status(404).json({ message: "Sorry, You are not Admin!" });
      }

      // Proceed to delete the movie if admin is verified
      db.query(movieDeleteSql, [movieId], (err1, data1) => {
        if (err1) return res.json(err1);

        if (data1.affectedRows === 0) {
          return res.status(404).json({ message: "Movie not found!" });
        }

        return res.json({ message: "Movie deleted successfully!" });
      });
    });
};

  
  // Genre Insert
  const insertGenre = (db) => (req, res) => {
    const { email, password, movieId, genre } = req.body;
    const adminCheckSql = `SELECT * FROM person WHERE email = ? AND password = ? AND person_type = 'Admin'`;
    const genreInsertSql = `INSERT INTO movie_genre (movie_id, genre) VALUES (?, ?)`;
  
    db.query(adminCheckSql, [email, password], (err, data) => {
      if (err) return res.json(err);
  
      if (data.length === 0) {
        return res.status(404).json({ message: "Sorry, You are not Admin!" });
      }
  
      db.query(genreInsertSql, [movieId, genre], (err1, data1) => {
        if (err1) return res.json(err1);
        return res.json(data1);
      });
    });
  };
  
  // Director Insert
  const insertDirector = (db) => (req, res) => {
    const { email, password, movieId, director } = req.body;
    const adminCheckSql = `SELECT * FROM person WHERE email = ? AND password = ? AND person_type = 'Admin'`;
    const directorInsertSql = `INSERT INTO movie_directors (movie_id, director) VALUES (?, ?)`;
  
    db.query(adminCheckSql, [email, password], (err, data) => {
      if (err) return res.json(err);
  
      if (data.length === 0) {
        return res.status(404).json({ message: "Sorry, You are not Admin!" });
      }
  
      db.query(directorInsertSql, [movieId, director], (err1, data1) => {
        if (err1) return res.json(err1);
        return res.json(data1);
      });
    });
  };
  
  // Get last show date
  const getLastShowDate = (db) => (req, res) => {
    const sql = `SELECT max(showtime_date) AS lastDate FROM showtimes`;
  
    db.query(sql, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  };
  
  // Add show date
  const addShowDate = (db) => (req, res) => {
    const { email, password, selectedShowDate } = req.body;
  
    const adminCheckSql = `SELECT * FROM person WHERE email = ? AND password = ? AND person_type = 'Admin'`;
    const showDateInsertSql = `INSERT INTO showtimes (movie_start_time, show_type, showtime_date, price_per_seat) 
                               VALUES ('11:00 am', '2D', ?, 350), ('2:30 pm', '3D', ?, 450), ('6:00 pm', '3D', ?, 450)`;
    const lastInsertIdSql = `SELECT LAST_INSERT_ID() AS last_id`;
  
    db.query(adminCheckSql, [email, password], (err, data) => {
      if (err) return res.json(err);
  
      if (data.length === 0) {
        return res.status(404).json({ message: "Sorry, You are not Admin!" });
      }
  
      db.query(showDateInsertSql, [selectedShowDate, selectedShowDate, selectedShowDate], (err1, data1) => {
        if (err1) return res.json(err1);
  
        db.query(lastInsertIdSql, (err2, data2) => {
          if (err2) return res.json(err2);
          return res.json(data2);
        });
      });
    });
  };
  
  
  // Update Showtime Information
  const updateShownIn = (db) => (req, res) => {
    const { email, password, showtimeId } = req.body;
  
    let showIdArr = [];
    for (let i = 1; i <= 24; i++) {
      if (i % 8 === 0) {
        showIdArr.push(showtimeId);
        showtimeId += 1;
      } else {
        showIdArr.push(showtimeId);
      }
    }
  
    const sql = `
      INSERT INTO shown_in(movie_id, showtime_id, hall_id)
      VALUES
      (1, ?, 1), (5, ?, 2), (3, ?, 3), (4, ?, 4),
      (1, ?, 5), (5, ?, 6), (3, ?, 7), (4, ?, 8),
      (5, ?, 1), (6, ?, 2), (1, ?, 3), (2, ?, 4),
      (5, ?, 5), (6, ?, 6), (1, ?, 7), (2, ?, 8),
      (5, ?, 1), (6, ?, 2), (1, ?, 3), (2, ?, 4),
      (4, ?, 5), (6, ?, 6), (1, ?, 7), (2, ?, 8)
    `;
  
    checkAdmin(db, email, password)
      .then(() => {
        db.query(sql, showIdArr, (err, data) => {
          if (err) return res.json(err);
          return res.json(data);
        });
      })
      .catch((err) => {
        return res.status(404).json(err);
      });
  };
  
  // Get latest show dates
  const getAdminLatestShowDates = (db) => (req, res) => {
    const sql = `
      SELECT DISTINCT s.showtime_date
      FROM showtimes s
      JOIN (
          SELECT DISTINCT showtime_date
          FROM showtimes
          ORDER BY showtime_date DESC
          LIMIT 4
      ) latest_dates
      ON s.showtime_date = latest_dates.showtime_date
      ORDER BY s.showtime_date ASC
    `;
  
    db.query(sql, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  };
  
  // Get showtimes for a specific date
  const getAdminShowtimes = (db) => (req, res) => {
    const { email, password, selectedShowDate } = req.body;
  
    const sql = `SELECT id, movie_start_time, show_type FROM showtimes WHERE showtime_date = ?`;
  
    checkAdmin(db, email, password)
      .then(() => {
        db.query(sql, [selectedShowDate], (err, data) => {
          if (err) return res.json(err);
          return res.json(data);
        });
      })
      .catch((err) => {
        return res.status(404).json(err);
      });
  };
  
  // Get movies available to replace from a specific showtime
  const movieReplaceFrom = (db) => (req, res) => {
    const { email, password, selectedShowtime } = req.body;
  
    const sql = `
      SELECT DISTINCT M.name, Sh.movie_id 
      FROM shown_in Sh 
      JOIN movie M ON Sh.movie_id = M.id 
      WHERE Sh.showtime_id = ?
    `;
  
    checkAdmin(db, email, password)
      .then(() => {
        db.query(sql, [selectedShowtime], (err, data) => {
          if (err) return res.json(err);
          return res.json(data);
        });
      })
      .catch((err) => {
        return res.status(404).json(err);
      });
  };
  
  // Get movies available to replace to a specific showtime
  const movieReplaceTo = (db) => (req, res) => {
    const { email, password, selectedShowtime } = req.body;
  
    const sql = `
      SELECT name, id 
      FROM movie 
      WHERE id NOT IN (
        SELECT DISTINCT M.id 
        FROM shown_in Sh 
        JOIN movie M ON Sh.movie_id = M.id 
        WHERE Sh.showtime_id = ?
      )
    `;
  
    checkAdmin(db, email, password)
      .then(() => {
        db.query(sql, [selectedShowtime], (err, data) => {
          if (err) return res.json(err);
          return res.json(data);
        });
      })
      .catch((err) => {
        return res.status(404).json(err);
      });
  };
  
  // Swap a movie for another in a specific showtime
  const movieSwap = (db) => (req, res) => {
    const { email, password, selectedAlt, selectedShowtime, selectedReplace } = req.body;
  
    const sql = `UPDATE shown_in SET movie_id = ? WHERE showtime_id = ? AND movie_id = ?`;
  
    checkAdmin(db, email, password)
      .then(() => {
        db.query(sql, [selectedAlt, selectedShowtime, selectedReplace], (err, data) => {
          if (err) return res.json(err);
          return res.json(data);
        });
      })
      .catch((err) => {
        return res.status(404).json(err);
      });
  };
  

  
  
  module.exports = {
    getTotalTickets,
    getTotalPayment,
    getTotalCustomers,
    getTotalTicketsPerMovie,
    addMovie,
    insertGenre,
    insertDirector,
    getLastShowDate,
    addShowDate,
    updateShownIn,
    getAdminLatestShowDates,
    getAdminShowtimes,
    movieReplaceFrom,
    movieReplaceTo,
    movieSwap,
    deleteMovie,
    editMovie
  };
  