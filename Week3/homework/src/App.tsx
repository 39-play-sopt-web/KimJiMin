import './App.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import MovieDetail from './MovieDetail';

interface Movie {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
}

interface MovieResponse {
  results: Movie[];
  total_pages: number;
}

function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [rating, setRating] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const saveScrollPosition = () => {sessionStorage.setItem('movieScrollPosition', String(window.scrollY));};
  const location = useLocation();
  const isMovieList = location.pathname === '/';

  let minRating: number | undefined;
  let maxRating: number | undefined;

  if (rating === '9') {
    minRating = 9;
  } else if (rating === '8') {
    minRating = 8;
    maxRating = 9;
  } else if (rating === '7') {
    minRating = 7;
    maxRating = 8;
  } else if (rating === '6') {
    minRating = 6;
    maxRating = 7;
  } else if (rating === 'under6') {
    maxRating = 6;
  }

  const changeRating = (newRating: string) => {
    setRating(newRating);
    setMovies([]);
    setPage(1);
    setHasMore(true);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const getMovies = async () => {
      setLoading(true);

      try {
        const response = await axios.get<MovieResponse>(
          `${import.meta.env.VITE_API_BASE_URL}/discover/movie`,
          {
            params: {
              api_key: import.meta.env.VITE_API_KEY,
              language: 'ko-KR',
              sort_by: 'popularity.desc',
              'vote_average.gte': minRating,
              'vote_average.lte': maxRating,
              page: page,
            },
          }
        );

        const filteredMovies = response.data.results.filter((movie) => {
          if (rating === '9') return movie.vote_average >= 9;
          if (rating === '8') return movie.vote_average >= 8 && movie.vote_average < 9;
          if (rating === '7') return movie.vote_average >= 7 && movie.vote_average < 8;
          if (rating === '6') return movie.vote_average >= 6 && movie.vote_average < 7;
          if (rating === 'under6') return movie.vote_average < 6;

          return true;
        });

        if (page === 1) {
          setMovies(filteredMovies);
        } else {
          setMovies((prevMovies) => [
            ...prevMovies,
            ...filteredMovies,
          ]);
        }

        setHasMore(page < response.data.total_pages);
      } catch (error) {
        console.error('영화 데이터를 가져오지 못했습니다.', error);
      } finally {
        setLoading(false);
      }
    };

    getMovies();
  }, [rating, page, minRating, maxRating]);

  useEffect(() => {
    if (!isMovieList) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [loading, hasMore, isMovieList]);

  return (
    <main>
      <h1>영화 둘러보기</h1>

      <div className="rating-filter">
        <button
          className={rating === 'all' ? 'active' : ''}
          onClick={() => changeRating('all')}
        >
          전체
        </button>

        <button
          className={rating === '9' ? 'active' : ''}
          onClick={() => changeRating('9')}
        >
          9점 이상
        </button>

        <button
          className={rating === '8' ? 'active' : ''}
          onClick={() => changeRating('8')}
        >
          8 ~ 9점
        </button>

        <button
          className={rating === '7' ? 'active' : ''}
          onClick={() => changeRating('7')}
        >
          7 ~ 8점
        </button>

        <button
          className={rating === '6' ? 'active' : ''}
          onClick={() => changeRating('6')}
        >
          6 ~ 7점
        </button>

        <button
          className={rating === 'under6' ? 'active' : ''}
          onClick={() => changeRating('under6')}
        >
          6점 미만
        </button>
      </div>

      <div className="movie-list">
        {movies.map((movie) => (
          <article className="movie-card" key={movie.id}>
            <Link
              to={`/movie/${movie.id}`}
              onClick={saveScrollPosition}
            >
              <div className="movie-poster-area">
                {movie.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={`${movie.title} 포스터`}
                  />
                )}

                <span className="movie-rating-badge">
                  <span className="rating-star">★</span>
                  <span className="rating-number">
                    {movie.vote_average.toFixed(1)}
                  </span>
                </span>
              </div>

              <div className="movie-info">
                <h2>{movie.title}</h2>
                <p className="movie-release-date">{movie.release_date}</p>
                <p>{movie.overview}</p>
              </div>
            </Link>
          </article>
        ))}
      </div>

      <div ref={bottomRef} style={{ height: '20px' }} />

      {loading && <p>영화를 불러오는 중...</p>}
      {!hasMore && <p>모든 영화를 불러왔습니다.</p>}
    </main>
  );
}

function App() {
  const location = useLocation();
  const scrollPosition = useRef(
    Number(sessionStorage.getItem('movieScrollPosition') || 0)
  );

  useEffect(() => {
    if (location.pathname === '/') {
      const savedPosition = Number(
        sessionStorage.getItem('movieScrollPosition') || 0
      );

      requestAnimationFrame(() => {
        window.scrollTo(0, savedPosition);
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <>
      <header className="site-header">
        <div className="site-logo">
          SOPT <span>MOVIE</span>
        </div>
      </header>

      <div
        style={{
          display: location.pathname === '/' ? 'block' : 'none',
        }}
      >
        <MovieList />
      </div>

      <Routes>
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </>
  );
}

export default App;