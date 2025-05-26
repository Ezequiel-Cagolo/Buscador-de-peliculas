import { useRef, useState, useMemo, useCallback } from "react";
import { searchMovies } from "../services/movies";

export const useMovies = ({ search, sort }) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    //el error no se usa 
    const [, setError] = useState(null);
    const previousSearch = useRef(search);

    const getMovies = useCallback(async ({ search }) => {
        if (search === previousSearch.current) return;
        //cuando search es ""
        
        try {
            setLoading(true);
            setError(null);
            previousSearch.current = search;
            const newMovies = await searchMovies({ search });
            setMovies(newMovies);
        }
        catch (e) {
            setError(e.message);
        }
        finally {
            setLoading(false);
        }
    }, [])

    const sortedMovies = useMemo(() => {
            if (!movies) return;
        return sort
            ? [...movies].sort((a, b) => a.title.localeCompare(b.title))
            : movies;
    } ,[movies, sort])

    return { movies: sortedMovies, loading, getMovies };
}