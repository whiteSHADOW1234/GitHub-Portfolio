"use client";
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import RepoCard from './components/RepoCard';
import './globals.css';

export default function Home() {
  const [repos, setRepos] = useState([]);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("stars");
  const [languageFilter, setLanguageFilter] = useState("");
  const username = process.env.NEXT_PUBLIC_GH_USERNAME;
  // const pathname = usePathname();

  useEffect(() => {
    // const base = pathname.startsWith('/') ? '/GitHub-Portfolio/' : '';
    fetch(`GitHub-Portfolio/repos.json`)
      .then(res => res.json())
      .then(setRepos);
  }, []);

  const filtered = repos
    .filter(repo =>
      (!languageFilter || repo.language === languageFilter) &&
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
  const lastActivity = repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0]?.updated_at;

  return (
    <main className="p-4 max-w-5xl mx-auto">
      <header className="py-10 mb-4 text-center">
        <h1 className="text-3xl font-bold ">{username}&rsquo;s Portfolio</h1>
        <div className="text-sm">Total Stars: {totalStars} | Top Repo: {topRepo?.name} | Last Activity: {new Date(lastActivity).toLocaleDateString()}</div>
      </header>
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          className="border p-1 rounded"
          placeholder="Search repos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select onChange={(e) => setSortKey(e.target.value)} value={sortKey} className="border p-1 rounded">
          <option value="stars">Sort by Stars</option>
          <option value="updated">Sort by Updated</option>
          <option value="name">Sort by Name</option>
        </select>
        <select onChange={(e) => setLanguageFilter(e.target.value)} value={languageFilter} className="border p-1 rounded">
          <option value="">All Languages</option>
          {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(repo => <RepoCard key={repo.id} repo={repo} />)}
      </div>
    </main>
  );
}