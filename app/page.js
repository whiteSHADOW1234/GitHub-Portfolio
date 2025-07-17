"use client";

import { useEffect, useState } from 'react';
import RepoCard from './components/RepoCard';
import './globals.css';

export default function Home() {
  const [repos, setRepos] = useState([]);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("stars");
  const [languageFilter, setLanguageFilter] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [username, setUsername] = useState(null);

  const availableTags  = [
    'security',
    'hardware',
    'software',
    'web',
    'mobile',
    'machine-learning',
  ];

  useEffect(() => {
    fetch(`repos.json`)
      .then(res => res.json())
      .then(data => {
        setRepos(data);
        // Derive username from the first repo URL
        const match = data[0]?.html_url.match(/github\.com\/([^/]+)/);
        if (match) setUsername(match[1]);
      });
  }, []);

  // Filter repos based on query, language, and activeTag
  const filtered = repos
    .filter(repo =>
      (!languageFilter || repo.language === languageFilter) &&
      (!activeTag || repo.topics?.includes(activeTag)) &&
      repo.name.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => {
      if (sortKey === 'stars') return b.stargazers_count - a.stargazers_count;
      if (sortKey === 'updated') return new Date(b.updated_at) - new Date(a.updated_at);
      return a.name.localeCompare(b.name);
    });

  const languages = [...new Set(repos.map(r => r.language).filter(Boolean))];
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const topRepo = repos.reduce((top, r) => (r.stargazers_count > (top?.stargazers_count || 0) ? r : top), null);
  const lastActivity = repos
    .slice()
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0]?.updated_at;

  return (
    <main className="p-4 max-w-5xl mx-auto">
      <header className="py-6 text-center">
        <h1 className="text-3xl font-bold">
          {username ? `${username}'s Portfolio` : 'Loading Portfolio...'}
        </h1>
        {username && (
          <div className="text-sm mt-1">
            Total Stars: {totalStars} | Top Repo: {topRepo?.name} | Last Activity:{' '}
            {lastActivity && new Date(lastActivity).toLocaleDateString()}
          </div>
        )}
      </header>

      {/* Self introduction section */}
      <section className="mb-2 text-center mx-auto max-w-xl">
        <p className="text-lg">
          Hi, I&rsquo;m a developer who enjoys exploring new technologies, and solving real-world problems.
          I&rsquo;m particularly interested in fields like{' '}
        </p>
      </section>

      {/* Tag filter section */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {availableTags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(prev => (prev === tag ? '' : tag))}
            className={`px-3 py-1 rounded-full border ${
              activeTag === tag
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Show active tag label if selected */}
      {/* {activeTag && (
        <div className="text-center mb-4 text-blue-600 font-medium">
          Showing projects tagged with <span className="underline">#{activeTag}</span>
        </div>
      )} */}

      {/* Search, sort, and language filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          className="border p-1 rounded flex-1 min-w-[150px]"
          placeholder="Search repos..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <select
          onChange={e => setSortKey(e.target.value)}
          value={sortKey}
          className="border p-1 rounded"
        >
          <option value="stars">Sort by Stars</option>
          <option value="updated">Sort by Updated</option>
          <option value="name">Sort by Name</option>
        </select>
        <select
          onChange={e => setLanguageFilter(e.target.value)}
          value={languageFilter}
          className="border p-1 rounded"
        >
          <option value="">All Languages</option>
          {languages.map(lang => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      {/* Repository cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(repo => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </main>
  );
}
