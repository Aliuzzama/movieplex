import { useEffect, useState } from "react";
import { CollectionCard } from "../../../components/CollectionCard";
import axios from "axios";
import HashLoader from "react-spinners/HashLoader";

export const HomeCollection = () => {
  const override = {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  };

  const [movieData, setMovieData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("[INFO] HomeCollection Component Mounted");
    console.log("[INFO] VITE_API_URL:", import.meta.env.VITE_API_URL);

    const fetchData = async () => {
      console.log("[INFO] Fetching data from API...");

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/latestMovies`
        );
        console.log("[SUCCESS] API Response:", response.data);
        setMovieData(response.data);
      } catch (err) {
        console.error("[ERROR] Failed to fetch data:", err);
      } finally {
        setLoading(false);
        console.log("[INFO] Loading state set to false");
      }
    };

    fetchData();
  }, []);

  console.log("[INFO] movieData State:", movieData);

  const latestMoviesCards = movieData.map((latestMovie) => {
    console.log("[INFO] Generating card for movie:", latestMovie.name);
    return <CollectionCard key={latestMovie.id} {...latestMovie} />;
  });

  const latestMovieCardsDouble = movieData.map((latestMovie) => {
    console.log("[INFO] Generating duplicate card for movie:", latestMovie.name);
    return <CollectionCard key={latestMovie.id + 6} {...latestMovie} />;
  });

  return (
    <section className="section-home-collection" id="nowShowing">
      <div className="home-collection-heading-container">
        <h1 className="heading-secondary heading-collection">
          Now Playing &rarr;
        </h1>
      </div>

      {loading && (
        <>
          <HashLoader cssOverride={override} color="#eb3656" />
          {console.log("[INFO] Loader displayed")}
        </>
      )}
      {!loading && (
        <>
          {console.log("[INFO] Rendering movie cards")}
          <div className="home-collection-container">
            <div className="home-collection-inner">{latestMoviesCards}</div>
            <div className="home-collection-inner">{latestMovieCardsDouble}</div>
          </div>
        </>
      )}
    </section>
  );
};
