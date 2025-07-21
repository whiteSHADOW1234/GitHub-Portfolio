// scripts/fetch-repos.mjs
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const username = process.env.GH_USERNAME;

const includedRepoNames = [
  'HackRF-One-for-Windows',
  'MorphURL',
  'PetCam',
  'CafedentialApp',
  'WhisperTranscriber',
  'PDF_Shield',
  'picoCTF_writeup',
  'CoffeeBeanCart',
  'E-Course'
];

const includedRepoSet = new Set(includedRepoNames);

console.log(`Fetching repositories for user: ${username}`);
const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
const allRepos = await res.json();

console.log(`Fetched ${allRepos.length} repositories.`);

const totalStars = allRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

const filteredRepos = allRepos
  .filter(repo => includedRepoSet.has(repo.name) && !repo.fork)
  .map(repo => ({
    id: repo.id,
    name: repo.name,
    description: repo.description,
    html_url: repo.html_url,
    stargazers_count: repo.stargazers_count,
    forks_count: repo.forks_count,
    updated_at: repo.updated_at,
    language: repo.language,
    topics: repo.topics || [],
  }));

console.log(`Saving ${filteredRepos.length} filtered repos and total stars: ${totalStars}`);

fs.writeFileSync(
  path.join(process.cwd(), 'public', 'repos.json'),
  JSON.stringify({ repos: filteredRepos, totalStars }, null, 2)
);
