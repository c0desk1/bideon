import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const body = (await request.json()) as {
    title: string;
    content: string;
    tags?: string;
    status?: 'DRAFT' | 'LIVE';
  };

  const blogId = import.meta.env.VITE_BLOGGER_BLOG_ID!;
  const accessToken = import.meta.env.VITE_BLOGGER_API_KEY!;

  // validasi
  if (!body.title || !body.content) {
    return new Response(
      JSON.stringify({ error: 'Judul & konten wajib!' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const payload: any = {
    kind: 'blogger#post',
    title: body.title,
    content: body.content,
    labels: body.tags?.split(',').map((t) => t.trim()) ?? [],
    status: body.status ?? 'LIVE'
  };

  const res = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const raw = await res.json();

  if (!res.ok) {
    return new Response(JSON.stringify({ error: raw }), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const data = raw as { id: string };
  return new Response(JSON.stringify({ success: true, postId: data.id }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
