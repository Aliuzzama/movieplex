const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 7000;
const app = express();
const { getLatestMovies, getLocationDetails, getLocationFeatures,getAllMovies } = require('./controllers/homeController');
const { getTheatres, getShowtimes, getGenres } = require("./controllers/showtimesController");
const {
  getShowtimeDates,
  getUniqueMovies,
  getHalls,
  getSeats,
  processPayment,
  purchaseTicket,
  getRecentPurchase
} = require("./controllers/paymentController");
const {
  registerUser,
  loginUser,
  getCustomerProfile,
  getCustomerPurchases,
} = require("./controllers/userController");
const {
  getMovieDetail,
  getMovieWiseShowtimes,
  getOtherMovies,
} = require("./controllers/moviedetailsController");
const {
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
} = require("./controllers/adminController");
app.use(
  cors({
    origin: '*', // Allows all origins
    methods: '*', // Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
  })
);


app.use(express.json());

let db;

const configuration = {

  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

console.log("CONFIGURATION: ", configuration)

// Manually setting connection
function handleDisconnect() {
  db = mysql.createConnection(configuration);

  db.connect(function (err) {
    if (err) {
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log("connection is successful");
    }
  });
  db.on("error", function (err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}
handleDisconnect();

app.get("/", (req, res) => {
  return res.json("Hello Backend Side");
});

// /////
// HOME
// /////
app.get("/latestMovies", getLatestMovies(db));
app.get("/locationDetails", getLocationDetails(db));
app.get("/locationFeatures", getLocationFeatures(db));
app.get("/allMovies", getAllMovies(db));

// /////////
// SHOWTIMES
// /////////
app.get("/theatres", getTheatres(db));
app.post("/showtimes", getShowtimes(db));
app.get("/genres", getGenres(db));


// /////////////
// PAYMENT PAGE
// /////////////
app.post("/showtimesDates", getShowtimeDates(db));
app.post("/uniqueMovies", getUniqueMovies(db));
app.post("/halls", getHalls(db));
app.post("/seats", getSeats(db));
app.post("/payment", processPayment(db));
app.post("/purchaseTicket", purchaseTicket(db));
app.post("/recentPurchase", getRecentPurchase(db));

// ////////
// USER
// ////////

app.post("/registration", registerUser(db));
app.post("/login", loginUser(db));
app.post("/customerProfile", getCustomerProfile(db));
app.post("/customerPurchases", getCustomerPurchases(db));

// /////////////////
// MOVIEDETAILS PAGE
// /////////////////

app.post("/movieDetail", getMovieDetail(db));
app.post("/movieWiseShowtime", getMovieWiseShowtimes(db));
app.post("/otherMovies", getOtherMovies(db));




// /////
// ADMIN
// /////

app.get("/totalTickets", getTotalTickets(db));
app.get("/totalPayment", getTotalPayment(db));
app.get("/totalCustomers", getTotalCustomers(db));
app.get("/totalTicketPerMovie", getTotalTicketsPerMovie(db));
app.post("/adminMovieAdd", addMovie(db));
app.post("/genreInsert", insertGenre(db));
app.post("/directorInsert", insertDirector(db));
app.get("/lastShowDate", getLastShowDate(db));
app.post("/showdateAdd", addShowDate(db));
app.post('/shownInUpdate', updateShownIn(db));
app.get('/adminLatestShowDates', getAdminLatestShowDates(db));
app.post('/adminShowtimes', getAdminShowtimes(db));
app.post('/movieReplaceFrom', movieReplaceFrom(db));
app.post('/movieReplaceTo', movieReplaceTo(db));
app.post('/movieSwap', movieSwap(db));
app.delete('/adminMovieDelete', deleteMovie(db));
app.put('/adminMovieEdit', editMovie(db));
app.listen(port, () => {
  console.log(`AshoDekhi backend running on ${port}`);
});
