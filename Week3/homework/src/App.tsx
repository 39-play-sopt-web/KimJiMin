import './App.css';
import { useLayoutEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import MovieDetail from './MovieDetail';
import { useMovieList, ratingFilters } from './hooks/useMovieList';
import FilterButton from './components/FilterButton';

function MovieList({ isMovieList }: { isMovieList: boolean }) {
  const {
    movies,
    rating,
    loading,
    hasMore,
    error,
    bottomRef,
    changeRating,
  } = useMovieList(isMovieList);

  const saveScrollPosition = () => {
    sessionStorage.setItem(
      'movieScrollPosition',
      String(window.scrollY)
    );
  };

  return (
    <main>
      <h1>영화 둘러보기</h1>

      <div className="rating-filter">
        {ratingFilters.map((filter) => (
          <FilterButton
            key={filter.key}
            $isActive={rating === filter.key}
            onClick={() => changeRating(filter.key)}
          >
            {filter.label}
          </FilterButton>
        ))}
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
                <p className="movie-release-date">
                  {movie.release_date}
                </p>
                <p>{movie.overview}</p>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {error && (
        <p>영화 데이터를 가져오지 못했습니다.</p>
      )}

      <div ref={bottomRef} style={{ height: '20px' }} />

      {loading && <p>영화를 불러오는 중...</p>}

      {!loading && !error && !hasMore && (
        <p>모든 영화를 불러왔습니다.</p>
      )}
    </main>
  );
}

function App() {
  const location = useLocation();
  const isMovieList = location.pathname === '/';

  useLayoutEffect(() => {
    if (isMovieList) {
      const savedPosition = Number(
        sessionStorage.getItem('movieScrollPosition') || 0
      );

      // 목록 화면이 다시 보일 때 스크롤 복원
      requestAnimationFrame(() => {
        window.scrollTo(0, savedPosition);
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [isMovieList]);

  return (
    <>
      <header className="site-header">
        <div className="site-logo">
          SOPT <span>MOVIE</span>
        </div>
      </header>

      {/* 목록 컴포넌트를 유지해 기존 영화 목록 상태 보존!!! */}
      <div style={{ display: isMovieList ? 'block' : 'none' }}>
        <MovieList isMovieList={isMovieList} />
      </div>

      <Routes>
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </>
  );
}

export default App;