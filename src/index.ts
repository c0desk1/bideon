import type { Env } from './lib/types';
import type { ExecutionContext } from '@cloudflare/workers-types';
import { handleAuthLogin } from './utils/handlers/authLogin';
import { handleGoogleAuthCallback, handleGithubAuthCallback } from './utils/handlers/authCallback';
import { handleGetPosts } from './utils/handlers/posts';
import { handleGetPostById } from './utils/handlers/postID';
import { handleGetLabels } from './utils/handlers/labels';
import { handleGetPages } from './utils/handlers/pages';
import { handleRefresh } from './utils/handlers/refresh';


export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // == LOGIN ==
    if (path === '/auth/login') {
      return await handleAuthLogin(env);
    }

    // == CALLBACK ==
    if (path === '/auth/google/callback') {
      return handleGoogleAuthCallback(request, env);
    }

    if (path === '/auth/github/callback') {
      return handleGithubAuthCallback(request, env);
    }

    // == /posts ==
    if (url.pathname === "/posts") {
      return handleGetPosts(env);
    }

    // == /post/:id ==
    if (path.startsWith('/post/')) {
      const postId = path.split('/post/')[1];
      if (!postId) return new Response("Missing post ID", { status: 400 });
      return handleGetPostById(env, postId);
    }    

    // == /labels ==
    if (url.pathname === '/labels') {
      return handleGetLabels(env);
    }    

     // == /pages ==
     if (url.pathname === '/pages') {
      return handleGetPages(env);
    }


    // == /refresh ==
    if (path.startsWith('/refresh/')) {
      const key = path.split('/refresh/')[1];
      return handleRefresh(key, env);
    }
    
    return new Response('Not Found', { status: 404 });
  }
};
