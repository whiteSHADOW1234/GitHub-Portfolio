export default function RepoCard({ repo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border p-4 rounded shadow hover:shadow-md transition hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      <h2 className="font-semibold text-lg">{repo.name}</h2>
      <p className="text-sm text-gray-700 dark:text-gray-300">{repo.description}</p>
      <div className="text-xs text-gray-500 mt-2">
        ⭐ {repo.stargazers_count} | {repo.language || 'NONE'} | Forks: {repo.forks_count} | Updated: {new Date(repo.updated_at).toLocaleDateString()}
      </div>
    </a>
  );
}
