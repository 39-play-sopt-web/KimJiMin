import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from './api';

interface Movie {
  id: number;
  title: string;
  original_title: string;
  original_language: string;
  release_date: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  runtime: number | null;
  status: string;
  budget: number;
  revenue: number;
  genres: { id: number; name: string }[];
  production_countries: { iso_3166_1: string; name: string }[];
  spoken_languages: { iso_639_1: string; name: string }[];
}

// 원어를 한국어로 자동 변환
function getLanguageName(code: string) {
  const languageNames = new Intl.DisplayNames(['ko'], {
    type: 'language',
  });

  return languageNames.of(code) || code;
}

// 언어 이름을 영어로 자동 변환
function getEnglishLanguageName(code: string) {
  const languageNames = new Intl.DisplayNames(['en'], {
    type: 'language',
  });

  return languageNames.of(code) || code;
}

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const getMovie = async () => {
      try {
        setIsError(false);
        setMovie(null);

        const response = await api.get<Movie>(`/movie/${id}`);

        setMovie(response.data);
      } catch (error) {
        console.error('영화 상세 정보를 가져오지 못했습니다.', error);
        setIsError(true);
      }
    };

    getMovie();
  }, [id]);

  if (isError) {
    return (
      <main className="movie-detail">
        <p>영화 정보를 불러오지 못했습니다.</p>
        <Link to="/">← 목록으로 돌아가기</Link>
      </main>
    );
  }

  if (!movie) {
    return <p>영화 정보를 불러오는 중...😴</p>;
  }

  return (
    <main className="movie-detail">
      <Link to="/">← 목록으로 돌아가기</Link>

      <section
        className="movie-header"
        style={{
          backgroundImage: movie.backdrop_path
            ? `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.85)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : 'none',
        }}
      >
        {movie.poster_path && (
          <img
            className="movie-poster"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={`${movie.title} 포스터`}
          />
        )}

        <div className="movie-header-info">
          <h1>{movie.title}</h1>

          <div className="movie-meta">
            <span className="movie-rating">
              <span className="rating-star">★</span>
              <span className="rating-number">
                {movie.vote_average.toFixed(1)}
              </span>
            </span>

            <span>{movie.release_date}</span>
            <span>
              {movie.runtime ? `${movie.runtime}분` : '정보 없음'}
            </span>
            <span>투표 {movie.vote_count.toLocaleString()}명</span>
          </div>

          <div className="movie-genres">
            {movie.genres.map((genre) => (
              <span key={genre.id}>{genre.name}</span>
            ))}
          </div>

          <p className="movie-status">상태: {movie.status}</p>
        </div>
      </section>

      <section className="movie-section">
        <h2>줄거리</h2>
        <p>{movie.overview || '등록된 줄거리가 없습니다.'}</p>
      </section>

      <section className="movie-section">
        <h2>기본 정보</h2>

        <div className="movie-details-grid">
          <div className="movie-detail-item">
            <span>원제</span>
            <p>{movie.original_title}</p>
          </div>

          <div className="movie-detail-item">
            <span>원어</span>
            <p>{getLanguageName(movie.original_language)}</p>
          </div>

          <div className="movie-detail-item">
            <span>제작 국가</span>
            <p>
              {movie.production_countries
                .map((country) => country.name)
                .join(', ') || '정보 없음'}
            </p>
          </div>

          <div className="movie-detail-item">
            <span>사용 언어</span>
            <p>
              {movie.spoken_languages
                .map((language) =>
                  getEnglishLanguageName(language.iso_639_1)
                )
                .join(', ') || '정보 없음'}
            </p>
          </div>

          <div className="movie-detail-item">
            <span>예산</span>
            <p>${movie.budget.toLocaleString()}</p>
          </div>

          <div className="movie-detail-item">
            <span>수익</span>
            <p>${movie.revenue.toLocaleString()}</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default MovieDetail;