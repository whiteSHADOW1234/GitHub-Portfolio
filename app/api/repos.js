export async function GET() {
  const data = require('GitHub-Portfolio/repos.json');
  return Response.json(data);
}