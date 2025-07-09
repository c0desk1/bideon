// src/pages/api/submit-comment.ts

import type { APIRoute } from 'astro';

interface SubmitCommentRequestBody {
  content: string;
  postId: string;
  blogId: string;
  accessToken: string;
  turnstileToken: string;
}

interface TurnstileVerificationResult {
  success: boolean;
  'error-codes'?: string[];
  hostname?: string;

}

const TURNSTILE_SECRET_KEY = import.meta.env.VITE_TURNSTILE_SECRET_KEY;

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json") {
    return new Response(JSON.stringify({ message: "Content-Type must be application/json" }), { status: 400 });
  }

  const body = await request.json() as SubmitCommentRequestBody;
  const { content, postId, blogId, accessToken, turnstileToken } = body;

  if (!content || !postId || !blogId || !accessToken || !turnstileToken) {
    return new Response(JSON.stringify({ message: "Missing required fields." }), { status: 400 });
  }
  try {
    const turnstileResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: TURNSTILE_SECRET_KEY,
        response: turnstileToken,
      }),
    });
    const turnstileResult = await turnstileResponse.json() as TurnstileVerificationResult;

    if (!turnstileResult.success) {
      console.error("Turnstile verification failed:", turnstileResult['error-codes']);
      return new Response(JSON.stringify({ message: "Bot verification failed." }), { status: 403 });
    }
  } catch (error) {
    console.error("Error verifying Turnstile:", error);
    return new Response(JSON.stringify({ message: "Server error during bot verification." }), { status: 500 });
  }
  try {
    const userinfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    if (!userinfoResponse.ok) {
        throw new Error('Invalid Google Access Token.');
    }
} catch (error) {
    console.error("Access Token validation failed:", error);
    return new Response(JSON.stringify({ message: "Authentication failed. Please login again." }), { status: 401 });
}

try {
  const bloggerResponse = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content: content }),
  });

  if (!bloggerResponse.ok) {
    const errorText = await bloggerResponse.text();
    console.error("Error from Blogger API:", bloggerResponse.status, errorText);
    throw new Error(`Blogger API error: ${bloggerResponse.status} - ${errorText}`);
  }

  const newComment = await bloggerResponse.json();
  return new Response(JSON.stringify({ message: "Comment posted successfully!", comment: newComment }), { status: 200 });

} catch (error) {
  console.error("Error posting comment to Blogger:", error);
  return new Response(JSON.stringify({ message: "Failed to post comment. Please try again." }), { status: 500 });
}
};
