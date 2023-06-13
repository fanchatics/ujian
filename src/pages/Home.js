import React, { useEffect, useState, useRef } from 'react';
import '../App.css';
import MovieBox from '../MovieBox';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Nav, Form, FormControl, Button, Carousel } from 'react-bootstrap';

const API_URL = "https://api.themoviedb.org/3/discover/movie";
const API_IMG = "https://image.tmdb.org/t/p/w500/";
const API_KEY = "9c37e727bcf771c5aae268e8767844cd";
const PAGE_SIZE = 20; // Number of movies per page

function Home() {
  const [movies, setMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filterByRating, setFilterByRating] = useState(false);
  const [filterByLatest, setFilterByLatest] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [sortByName, setSortByName] = useState(false);

  const horizontalScrollRef = useRef(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        let url = `${API_URL}?api_key=${API_KEY}&with_original_language=id&region=ID&primary_release_year=2022&page=${currentPage}`;

        if (filterByRating) {
          url += "&sort_by=vote_average.desc";
        } else if (filterByLatest) {
          url += "&sort_by=release_date.desc";
        } else if (sortByName) {
          url += "&sort_by=original_title.asc";
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }

        const data = await response.json();
        const sortedMovies = data.results.sort((a, b) =>
          a.title.localeCompare(b.title, 'id', { numeric: true })
        );
        setMovies(sortedMovies);
        setTotalPages(data.total_pages);

        // Set the latestMovies state with the first 5 movies from the results
        setLatestMovies(sortedMovies.slice(0, 5));
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovies();
  }, [currentPage, filterByRating, filterByLatest, sortByName]);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const url = `${API_URL}?api_key=${API_KEY}&with_original_language=id&region=ID&sort_by=popularity.desc&page=1`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch popular movies');
        }

        const data = await response.json();
        setPopularMovies(data.results.slice(0, 10)); // Set popularMovies state with the first 10 popular movies
      } catch (error) {
        console.error(error);
      }
    };

    fetchPopularMovies();
  }, []);

  const searchMovie = async (e) => {
    e.preventDefault();
    console.log('Searching...');
    try {
      let url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&include_adult=false&region=ID&language=id&query=${query}`;

      if (sortByName) {
        url += "&sort_by=original_title.asc";
      }

      const res = await fetch(url);
      const data = await res.json();

      // Filter out movies that don't meet the criteria
      const filteredMovies = data.results.filter((movie) => {
        const { title, original_language } = movie;
        const lowerCaseTitle = title.toLowerCase();
        const isIndonesian = original_language === 'id';
        const forbiddenWords = ['sex', 'porn', 'explicit']; // Add more forbidden words if needed

        // Check if the title is in Indonesian and does not contain forbidden words
        return isIndonesian && !forbiddenWords.some((word) =>
          lowerCaseTitle.includes(word)
        );
      });

      setMovies(filteredMovies);
      setTotalPages(1); // Set total pages to 1 for search results
      setCurrentPage(1); // Reset current page to 1 for search results
    } catch (e) {
      console.log(e);
    }
  };

  const changeHandler = (e) => {
    const inputValue = e.target.value;
    setQuery(inputValue);

    if (inputValue === '') {
      // Reset to the initial state when the input is empty
      setMovies([]);
      setTotalPages(0);
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    const updateContainerWidth = () => {
      if (horizontalScrollRef.current) {
        setContainerWidth(horizontalScrollRef.current.offsetWidth);
      }
    };

    const handleScroll = () => {
      if (horizontalScrollRef.current) {
        setScrollPosition(horizontalScrollRef.current.scrollLeft);
      }
    };

    window.addEventListener("resize", updateContainerWidth);
    window.addEventListener("scroll", handleScroll);
    updateContainerWidth();

    return () => {
      window.removeEventListener("resize", updateContainerWidth);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const toggleFilterByRating = () => {
    setFilterByRating((prevValue) => !prevValue);
    setFilterByLatest(false); // Reset filterByLatest to false when toggling filterByRating
  };

  const toggleFilterByLatest = () => {
    setFilterByLatest((prevValue) => !prevValue);
    setFilterByRating(false); // Reset filterByRating to false when toggling filterByLatest
  };

  const toggleSortByName = () => {
    setSortByName((prevValue) => !prevValue);
  };

  return (
    <>
      <Navbar bg="dark" expand="lg" variant="dark" className="sticky-navbar">
        <Container fluid>
          <Navbar.Brand href="/home">MoviesZone</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-3" style={{ maxHeight: '100px' }} navbarScroll></Nav>
            <Navbar.Brand href="/home">Dashboard</Navbar.Brand>
            <Navbar.Brand href="/about">About Us</Navbar.Brand>
            <Form className="d-flex" onSubmit={searchMovie}>
              <FormControl
                type="search"
                placeholder="Movie Search"
                className="me-2"
                aria-label="search"
                name="query"
                value={query}
                onChange={changeHandler}
              />
              <Button variant="secondary" type="submit">
                Search
              </Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="container">
        <Carousel className="carousel-container">
          {latestMovies.map((movie) => (
            <Carousel.Item key={movie.id}>
              <img className="carousel-image" src={API_IMG + movie.poster_path} alt={movie.title} />
              <Carousel.Caption>
                <h2>{movie.title}</h2>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
        <h2 className="section-title" style={{ margin: '20px 0', fontWeight: 'bold' }}>
          Popular
        </h2>

        <div className="horizontal-scroll" id="style-2" ref={horizontalScrollRef}>
          {popularMovies.map((movie) => (
            <div key={movie.id} className="popular-movie-card">
              <img variant="top" src={API_IMG + movie.poster_path} alt={movie.title} />
              <div className="card-body">
                <h6 className="card-title">{movie.title}</h6>
                <p className="card-text">Rating: {movie.vote_average}</p> {/* Display the rating */}
              </div>
            </div>
          ))}
        </div>

        <div className="filter-section" style={{ margin: '20px 0', fontWeight: 'bold' }}>
          <Form.Check
            type="switch"
            id="filterRatingSwitch"
            label="Filter by Highest Rating"
            checked={filterByRating}
            onChange={toggleFilterByRating}
          />
          <Form.Check
            type="switch"
            id="filterLatestSwitch"
            label="Filter by Latest Release"
            checked={filterByLatest}
            onChange={toggleFilterByLatest}
          />
          <Form.Check
            type="switch"
            id="sortByNameSwitch"
            label="Sort by Name"
            checked={sortByName}
            onChange={toggleSortByName}
          />
        </div>

        <div className="pagination">
          <Button variant="secondary" onClick={prevPage} disabled={scrollPosition >= horizontalScrollRef.current?.scrollWidth + containerWidth}>
            Previous
          </Button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="secondary"
            onClick={nextPage}
            disabled={scrollPosition >= horizontalScrollRef.current?.scrollWidth - containerWidth}
          >
            Next
          </Button>
        </div>

        <div className="grid">
          {movies.map((movieReq) => (
            <MovieBox key={movieReq.id} {...movieReq} />
          ))}
        </div>

        <div className="pagination">
          <Button variant="secondary" onClick={prevPage} disabled={scrollPosition >= horizontalScrollRef.current?.scrollWidth + containerWidth}>
            Previous
          </Button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="secondary"
            onClick={nextPage}
            disabled={scrollPosition >= horizontalScrollRef.current?.scrollWidth - containerWidth}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}

export default Home;