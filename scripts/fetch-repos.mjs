// scripts/fetch-repos.mjs
import fs from 'fs';
import fetch from 'node-fetch';
import dotenv from 'dotenv';// Load environment variables from .env file

dotenv.config(); // Initialize dotenv

const username = process.env.GH_USERNAME; // Replace with your GitHub username

const includedRepoNames  = [
  'HackRF-One-for-Windows',
  'MorphURL',
  'PetCam',
  'CafedentialApp',
  'WhisperTranscriber',
  'PDF_Shield',
  'picoCTF_writeup',
  'CoffeeBeanCart',
  'E-Course'
]

const includedRepoSet = new Set(includedRepoNames);

console.log(`Uesrname: ${username}`);

const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {});

if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
const data = await res.json();

console.log(`Fetched ${data.length} repositories for user ${username}.`);

// Chain .filter() and .map() to process the data
const filteredRepos = data
  .filter(repo => {
    // First, filter to keep only the repos you want
    return includedRepoSet.has(repo.name) && !repo.fork;
  })
  .map(repo => {
    // Second, transform each filtered repo into a smaller object
    return {
      id: repo.id,
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      updated_at: repo.updated_at,
      language: repo.language,
    };
  });

console.log(`Saving ${filteredRepos.length} filtered repositories.`);


fs.writeFileSync('public/repos.json', JSON.stringify(filteredRepos, null, 2));
