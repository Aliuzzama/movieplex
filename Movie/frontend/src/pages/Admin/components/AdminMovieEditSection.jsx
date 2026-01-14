import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { adminEditErrorToast, adminEditToast } from "../../../toasts/toast";
import "./edit.css"; 

export const AdminMovieEditSection = () => {
  const { signedPerson } = useSelector((store) => store.authentication);

  const [movies, setMovies] = useState([]); 
  const [selectedMovie, setSelectedMovie] = useState("");
  const [movieDetails, setMovieDetails] = useState({
    name: "",
    rating: "",
    duration: "",
    directors: "",
    genres: "",
    language: "",
    release_date: "",
    synopsis: "",
    top_cast: "",
    image_path: "",
  });
  
  const [adminMovieDropDown, setAdminMovieDropDown] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async () => {
    console.log("FETCHING MOVIES");
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/allMovies`);
      if (response.data) {
        setMovies(response.data);
      }
    } catch (err) {
      console.error("Error fetching movies:", err);
      adminEditErrorToast("Failed to load movies.");
    }
  };

  const toggleAdminSection = () => {
    setAdminMovieDropDown((prevState) => {
      if (!prevState) {
        fetchMovies();
      }
      return !prevState; 
    });
  };

  // Fetch movie details when a movie is selected
  const handleMovieSelect = async (movieId) => {
    setSelectedMovie(movieId);
    if (movieId) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/movieDetail`, {
          movieDetailsId: movieId,
        });
  
        if (response.data) {
          console.log('ALL data: ', response.data[0]);
  
          const {
            name,
            rating,
            duration,
            directors,
            genres,
            language,
            release_date,
            synopsis,
            top_cast,
            image_path,
          } = response.data[0];
  
          setMovieDetails({
            name: name || "",
            rating: rating || "",
            duration: duration || "",
            directors: directors || "",
            genres: genres || "",
            language: language || "",
            release_date: release_date ? release_date.split("T")[0] : "",
            synopsis: synopsis || "",
            top_cast: top_cast || "",
            image_path: image_path || "",
          }); 
        }
      } catch (err) {
        console.error("Error fetching movie details:", err);
        adminEditErrorToast("Failed to load movie details.");
      }
    } else {
      setMovieDetails({
        name: "",
        rating: "",
        duration: "",
        directors: "",
        genres: "",
        language: "",
        release_date: "",
        synopsis: "",
        top_cast: "",
        image_path: "",
      }); 
    }
  };
  

  const handleEditMovie = async (e) => {
    e.preventDefault();

    if (!selectedMovie) {
      adminEditErrorToast("Please select a movie to edit.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/adminMovieEdit`,
        {
          email: signedPerson.email,
          password: signedPerson.password,
          movieId: selectedMovie,
          movieDetails,
        }
      );

      if (response.data.message === "Movie updated successfully!") {
        adminEditToast();
      } else {
        adminEditErrorToast();
      }

      
      setSelectedMovie("");
      setMovieDetails({ name: "", rating: "", duration: "", directors: "", genres: "" }); // Clear the form
      toggleAdminSection(); 
    } catch (err) {
      console.error(err);
      adminEditErrorToast();
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-admin-movie-edit container">
      <div className="form-heading-container">
        <h2 className="form-admin-heading">Edit a Movie</h2>
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
     <form className="movie-edit-form" onSubmit={handleEditMovie}>
     <div className="movie-edit-section">
       <p className="movie-edit-label">Select Movie to Edit:</p>
       <select
         name="movieName"
         value={selectedMovie}
         onChange={(e) => handleMovieSelect(e.target.value)}
         className="movie-edit-dropdown"
       >
         <option value="">Select a movie</option>
         {movies.map((movie) => (
           <option key={movie.id} value={movie.id}>
             {movie.name}
           </option>
         ))}
       </select>
     </div>
   
     <div className="movie-edit-section">
       <label className="movie-edit-label">Name:</label>
       <input
         type="text"
         value={movieDetails.name}
         onChange={(e) => setMovieDetails({ ...movieDetails, name: e.target.value })}
         required
         className="movie-edit-input"
       />
     </div>
   
     <div className="movie-edit-section">
       <label className="movie-edit-label">Rating:</label>
       <input
         type="number"
         value={movieDetails.rating}
         onChange={(e) => setMovieDetails({ ...movieDetails, rating: e.target.value })}
         required
         step="0.1"
         min="0"
         max="10"
         className="movie-edit-input"
       />
     </div>
   
     <div className="movie-edit-section">
       <label className="movie-edit-label">Duration (minutes):</label>
       <input
         type="text"
         value={movieDetails.duration}
         onChange={(e) => setMovieDetails({ ...movieDetails, duration: e.target.value })}
         required
         className="movie-edit-input"
       />
     </div>
   
     <div className="movie-edit-section">
       <label className="movie-edit-label">Directors:</label>
       <input
         type="text"
         value={movieDetails.directors}
         onChange={(e) => setMovieDetails({ ...movieDetails, directors: e.target.value })}
         required
         className="movie-edit-input"
       />
     </div>
   
     <div className="movie-edit-section">
       <label className="movie-edit-label">Genres:</label>
       <input
         type="text"
         value={movieDetails.genres}
         onChange={(e) => setMovieDetails({ ...movieDetails, genres: e.target.value })}
         required
         className="movie-edit-input"
       />
     </div>
   
     <div className="movie-edit-section">
       <label className="movie-edit-label">Language:</label>
       <input
         type="text"
         value={movieDetails.language}
         onChange={(e) => setMovieDetails({ ...movieDetails, language: e.target.value })}
         required
         className="movie-edit-input"
       />
     </div>
   
     <div className="movie-edit-section">
       <label className="movie-edit-label">Release Date:</label>
       <input
         type="date"
         value={movieDetails.release_date}
         onChange={(e) => setMovieDetails({ ...movieDetails, release_date: e.target.value })}
         required
         className="movie-edit-input"
       />
     </div>
   
     <div className="movie-edit-section">
       <label className="movie-edit-label">Synopsis:</label>
       <textarea
         value={movieDetails.synopsis}
         onChange={(e) => setMovieDetails({ ...movieDetails, synopsis: e.target.value })}
         required
         className="movie-edit-input movie-edit-textarea"
       ></textarea>
     </div>
   
     <div className="movie-edit-section">
       <label className="movie-edit-label">Top Cast:</label>
       <input
         type="text"
         value={movieDetails.top_cast}
         onChange={(e) => setMovieDetails({ ...movieDetails, top_cast: e.target.value })}
         required
         className="movie-edit-input"
       />
     </div>
   
     <div className="movie-edit-section">
       <label className="movie-edit-label">Image Path:</label>
       <input
         type="text"
         value={movieDetails.image_path}
         onChange={(e) => setMovieDetails({ ...movieDetails, image_path: e.target.value })}
         required
         className="movie-edit-input"
       />
     </div>
   
     <button
       type="submit"
       className={`movie-edit-button ${loading ? "movie-edit-button-disabled" : ""}`}
       disabled={loading}
     >
       {loading ? "Updating..." : "UPDATE"}
     </button>
   </form>
   
    
      )}
    </section>
  );
};
