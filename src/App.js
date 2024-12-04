import React, { useState, useEffect } from 'react';
import './App.css';
const App = () => {
  const [repos, setRepos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchRepos = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          'https://api.github.com/search/repositories?q=created:>2024-07-05&sort=stars&order=desc&page=${currentPage}'
        );
        const data = await response.json();
        setRepos([...repos, ...data.items]);
        setHasMore(data.items.length > 0);
      } catch (error) {
        console.error('Error fetching repos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepos();
  }, [currentPage]);

  const loadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div className="container">
      <h1>Top Starred Github Repos (Last 10 Days)</h1>
      <ul>
        {repos.map((repo) => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              <h3>{repo.name}</h3>
            </a>
            <p>{repo.description}</p>
            <p>Stars: {repo.stargazers_count}</p>
            <div className="owner">
              <img src={repo.owner.avatar_url} alt={repo.owner.login} />
              <span>{repo.owner.login}</span>
            </div>
          </li>
        ))}
      </ul>
      {isLoading && <p>Loading more repos...</p>}
      {hasMore && (
        <button onClick={loadMore} disabled={isLoading}>
          Load More
        </button>
      )}
    </div>
  );
};

export default App;