import { useEffect, useRef, useState } from 'react';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

interface Post {
  id: number;
  title: string;
}

const App = () => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch(`${BASE_URL}/posts?page=${page}`, {
          signal: abortControllerRef.current.signal,
        });
        const posts = (await response.json()) as Post[];
        setPosts((prevPosts) => [...prevPosts, ...posts]);
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('Aborted');
          return;
        }
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  return (
    <div>
      <h1>Data Fetching in React</h1>
      <button onClick={() => setPage(page + 1)}>Increase Page ({page})</button>
      {error && <div>Something went wrong</div>}
      {isLoading && <div>Loading...</div>}
      {!isLoading && !error && (
        <ul>
          {posts.map((post: Post) => {
            return <li key={Math.random()}>{post.title}</li>;
          })}
        </ul>
      )}
    </div>
  );
};

export default App;
