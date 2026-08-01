interface Env {
  PORTFOLIO_KV?: {
    get: (key: string, options?: { type: string }) => Promise<any>;
    put: (key: string, value: string) => Promise<void>;
  };
}

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export const onRequestOptions = async () => {
  return new Response(null, { headers: corsHeaders });
};

export const onRequestGet = async (context: { env: Env }) => {
  try {
    if (context.env.PORTFOLIO_KV) {
      const data = await context.env.PORTFOLIO_KV.get('portfolio_data', { type: 'json' });
      if (data) {
        return new Response(JSON.stringify(data), { headers: corsHeaders });
      }
    }
  } catch (e) {
    console.error('KV Read Error:', e);
  }

  return new Response(JSON.stringify({ projects: null, status: 'kv_empty_or_unbound' }), {
    headers: corsHeaders
  });
};

export const onRequestPost = async (context: { env: Env; request: Request }) => {
  try {
    const body = await context.request.json();
    if (context.env.PORTFOLIO_KV) {
      await context.env.PORTFOLIO_KV.put('portfolio_data', JSON.stringify(body));
      return new Response(JSON.stringify({ success: true, saved: true }), {
        headers: corsHeaders
      });
    }
    return new Response(JSON.stringify({ success: false, message: 'PORTFOLIO_KV binding not configured yet' }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ success: false, error: String(e) }), {
      status: 500,
      headers: corsHeaders
    });
  }
};
