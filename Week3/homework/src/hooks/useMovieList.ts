
import { useEffect, useRef, useState } from 'react';
import { api } from '../api';

export interface Movie {
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

export const ratingFilters = [
  { key: 'all', label: '전체', min: undefined, max: undefined },
  { key: '9', label: '9점 이상', min: 9, max: undefined },
  { key: '8', label: '8 ~ 9점', min: 8, max: 8.999 },
  { key: '7', label: '7 ~ 8점', min: 7, max: 7.999 },
  { key: '6', label: '6 ~ 7점', min: 6, max: 6.999 },
  { key: 'under6', label: '6점 미만', min: undefined, max: 5.999 },
];

export function useMovieList(isMovieList: boolean) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [rating, setRating] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  const selectedFilter = ratingFilters.find(
    (filter) => filter.key === rating
  );

  const minRating = selectedFilter?.min;
  const maxRating = selectedFilter?.max;

  const changeRating = (newRating: string) => {
    if (newRating === rating) {
      return;
    }

    setRating(newRating);
    setMovies([]);
    setPage(1);
    setHasMore(true);
    setError(false);

    sessionStorage.setItem('movieScrollPosition', '0');
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    // 상세 페이지에서는 목록 API를 요청하지 않음
    if (!isMovieList) {
      return;
    }

    let cancelled = false;

    const getMovies = async () => {
      loadingRef.current = true;
      setLoading(true);
      setError(false);

      try {
        const response = await api.get<MovieResponse>('/discover/movie', {
          params: {
            sort_by: 'popularity.desc',
            'vote_average.gte': minRating,
            'vote_average.lte': maxRating,
            page,
          },
        });

        if (cancelled) {
          return;
        }

        if (page === 1) {
          setMovies(response.data.results);
        } else {
          // 이미 불러온 영화와 중복되는 영화 제외
          setMovies((prevMovies) => {
            const newMovies = response.data.results.filter(
              (movie) =>
                !prevMovies.some(
                  (prevMovie) => prevMovie.id === movie.id
                )
            );

            return [...prevMovies, ...newMovies];
          });
        }

        setHasMore(page < response.data.total_pages);
      } catch (err) {
        if (!cancelled) {
          console.error('영화 데이터를 가져오지 못했습니다.', err);
          setError(true);
        }
      } finally {
        if (!cancelled) {
          loadingRef.current = false;
          setLoading(false);
        }
      }
    };

    getMovies();

    return () => {
      cancelled = true;
    };
  }, [isMovieList, rating, page, minRating, maxRating]);

  useEffect(() => {
    if (!isMovieList || loading || !hasMore || error) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loadingRef.current
        ) {
          loadingRef.current = true;
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        rootMargin: '200px',
      }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isMovieList, loading, hasMore, error]);

  return {
    movies,
    rating,
    loading,
    hasMore,
    error,
    bottomRef,
    changeRating,
  };
}