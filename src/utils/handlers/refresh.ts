import type { Env } from '../types';
import { handleGetPosts } from './posts';
import { handleGetLabels } from './labels';
import { handleGetPages } from './pages';

export async function handleRefresh(key: string, env: Env): Promise<Response> {
  if (key === 'posts') return handleGetPosts(env);
  if (key === 'labels') return handleGetLabels(env);
  if (key === 'pages') return handleGetPages(env);

  return new Response('Invalid key', { status: 400 });
}
