"use client";

import { useEffect, useState } from 'react';
import RepoCard from './components/RepoCard';
import './globals.css';

export default function Home() {
  const [repos, setRepos] = useState([]);
  const [totalStars, setTotalStars] = useState(0);
  const [username, setUsername] = useState(null);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("stars");
  const [languageFilter, setLanguageFilter] = useState("");
  const [activeTag, setActiveTag] = useState("");

  const availableTags = ['security','hardware','software','web','mobile','machine-learning'];

  useEffect(() => {
    fetch('repos.json')
      .then(res => {
        if (!res.ok) throw new Error(`Could not fetch repos: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setRepos(data.repos);
        setTotalStars(data.totalStars);
        const firstUrl = data.repos[0]?.html_url;
        const match = firstUrl?.match(/github\.com\/([^/]+)/);
        if (match) setUsername(match[1]);
      })
      .catch(console.error);
  }, []);

  const filtered = repos
    .filter(r =>
      (!languageFilter || r.language === languageFilter) &&
      (!activeTag || r.topics?.includes(activeTag)) &&
      r.name.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => {
      if (sortKey === 'stars') return b.stargazers_count - a.stargazers_count;
      if (sortKey === 'updated') return new Date(b.updated_at) - new Date(a.updated_at);
      return a.name.localeCompare(b.name);
    });

  const languages = [...new Set(repos.map(r => r.language).filter(Boolean))];
  const topRepo = repos.reduce((top, r) => (!top || r.stargazers_count > top.stargazers_count ? r : top), null);
  const lastActivity = repos.sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at))[0]?.updated_at;

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

      <section className="mb-2 text-center mx-auto max-w-lg">
        <p className="text-base text-gray-800">
          Hi, I&rsquo;m a developer who enjoys exploring new technologies, and solving real-world problems.
          I&rsquo;m particularly interested in fields like{' '}
        </p>
      </section>

      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {availableTags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(prev => (prev === tag ? '' : tag))}
            className={`px-3 py-1 rounded-full border ${
              activeTag === tag ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          className="border p-1 rounded flex-1 min-w-[150px]"
          placeholder=" Search repos..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <select onChange={e => setSortKey(e.target.value)} value={sortKey} className="border p-1 rounded">
          <option value="stars">Sort by Stars</option>
          <option value="updated">Sort by Updated</option>
          <option value="name">Sort by Name</option>
        </select>
        <select onChange={e => setLanguageFilter(e.target.value)} value={languageFilter} className="border p-1 rounded">
          <option value="">All Languages</option>
          {languages.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(repo => <RepoCard key={repo.id} repo={repo} />)}
      </div>
    </main>
  );
}
