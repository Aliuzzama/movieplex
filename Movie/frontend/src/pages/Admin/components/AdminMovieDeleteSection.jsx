import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { adminDeleteErrorToast, adminDeleteToast } from "../../../toasts/toast";
import "./delete.css";

export const AdminMovieDeleteSection = () => {
  const { signedPerson } = useSelector((store) => store.authentication);

  const [movies, setMovies] = useState([]);  // Store the list of movies
  const [selectedMovie, setSelectedMovie] = useState("");  // Store selected movie
  const [adminMovieDropDown, setAdminMovieDropDown] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch the list of movies
  const fetchMovies = async () => {
    console.log("FETCHING MOVIES")
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/allMovies`);
      if (response.data) {
        setMovies(response.data);  // Update the movies state with the fetched movies
      }
    } catch (err) {
      console.error("Error fetching movies:", err);
      adminDeleteErrorToast("Failed to load movies.");
    }
  };

  const toggleAdminSection = () => {
    setAdminMovieDropDown((prevState) => {
      if (!prevState) {
        fetchMovies(); // Fetch movies when opening the dropdown
      }
      return !prevState; // Toggle the dropdown state
    });
  };

  const handleDeleteMovie = async (e) => {
    e.preventDefault();

    if (!selectedMovie) {
      adminDeleteErrorToast("Please select a movie to delete.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/adminMovieDelete`,
        {
          data: {
            email: signedPerson.email,
            password: signedPerson.password,
            movieId: selectedMovie,
          },
        }
      );

      console.log('Response data: ', response.data.message);
      if (response.data.message === "Movie deleted successfully!") {
        adminDeleteToast();
      } else {
        adminDeleteErrorToast();
      }

      // Reset state after deletion
      setSelectedMovie("");
      toggleAdminSection(); // Close the dropdown after deletion
    } catch (err) {
      console.error(err);
      adminDeleteErrorToast();
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-admin-movie-add container">
      <div className="form-heading-container">
        <h2 className="form-admin-heading">Delete a Movie</h2>
        <button className="btn-admin-arrow" onClick={toggleAdminSection}>
          {!adminMovieDropDown ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="admin-icon" viewBox="0 0 512 512">
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="48"
                d="M112 184l144 144 144-144"
              />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="admin-icon" viewBox="0 0 512 512">
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="48"
                d="M112 328l144-144 144 144"
              />
            </svg>
          )}
        </button>
      </div>

      {adminMovieDropDown && (
        <form className="form-movie-add" onSubmit={handleDeleteMovie}>
          <div>
            <p>Select Movie to Delete:</p>
            <select
              name="movieName"
              value={selectedMovie}
              onChange={(e) => setSelectedMovie(e.target.value)}
              className="modern-dropdown"
            >
              <option value="">Select a movie</option>
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className={`btn-admin ${loading ? "btn-disabled" : ""}`}
            disabled={loading}
          >
            {loading ? "Deleting..." : "DELETE"}
          </button>
        </form>
      )}
    </section>
  );
};
