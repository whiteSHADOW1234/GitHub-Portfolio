export async function GET() {
  const data = require('../../repos.json');
  return Response.json(data);
}