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

const TURNSTILE_SECRET_KEY = import.meta.env.VITE_TURNSTILE_SECRET_TOKEN;

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
    if (!TURNSTILE_SECRET_KEY) {
      console.error("TURNSTILE_SECRET_KEY is not defined.");
      return new Response(JSON.stringify({ message: "Server configuration error: Turnstile secret key missing." }), { status: 500 });
    }

    const turnstileFormData = new URLSearchParams();
    turnstileFormData.append('secret', TURNSTILE_SECRET_KEY);
    turnstileFormData.append('response', turnstileToken);

    const turnstileResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: turnstileFormData,
    });

    const turnstileResult = await turnstileResponse.json() as TurnstileVerificationResult;

    if (!turnstileResult.success) {
      console.error("Turnstile verification failed:", turnstileResult['error-codes']);
      return new Response(JSON.stringify({ message: "Bot verification failed.", errors: turnstileResult['error-codes'] }), { status: 403 });
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
      const errorData = await userinfoResponse.json();
      console.error("Google user info error:", userinfoResponse.status, errorData);
      return new Response(JSON.stringify({ message: "Authentication failed. Invalid or expired Google login.", details: errorData }), { status: 401 });
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
      try {
          const bloggerError = JSON.parse(errorText);
          return new Response(JSON.stringify({ message: bloggerError.error?.message || "Failed to post comment to Blogger.", details: bloggerError }), { status: bloggerResponse.status });
      } catch (e) {
          return new Response(JSON.stringify({ message: `Blogger API error: ${bloggerResponse.status} - ${errorText}` }), { status: bloggerResponse.status });
      }
    }

    const newComment = await bloggerResponse.json();
    return new Response(JSON.stringify({ message: "Comment posted successfully!", comment: newComment }), { status: 200 });

  } catch (error) {
    console.error("Error posting comment to Blogger:", error);
    return new Response(JSON.stringify({ message: "Failed to post comment. Please try again." }), { status: 500 });
  }
};
