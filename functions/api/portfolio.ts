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
      if (data && typeof data === 'object') {
        return new Response(
          JSON.stringify({
            ...data,
            bound: true,
            status: 'ok'
          }),
          { headers: corsHeaders }
        );
      }
      return new Response(
        JSON.stringify({
          projects: null,
          bound: true,
          status: 'empty'
        }),
        { headers: corsHeaders }
      );
    }
  } catch (e: any) {
    console.error('KV Read Error:', e);
    return new Response(
      JSON.stringify({
        projects: null,
        bound: true,
        status: 'error',
        error: String(e)
      }),
      { status: 500, headers: corsHeaders }
    );
  }

  return new Response(
    JSON.stringify({
      projects: null,
      bound: false,
      status: 'unbound',
      message: 'PORTFOLIO_KV binding not configured in Cloudflare Pages'
    }),
    { status: 200, headers: corsHeaders }
  );
};

export const onRequestPost = async (context: { env: Env; request: Request }) => {
  try {
    if (!context.env.PORTFOLIO_KV) {
      return new Response(
        JSON.stringify({
          success: false,
          bound: false,
          status: 'unbound',
          message: 'PORTFOLIO_KV binding not configured yet in Cloudflare Pages'
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    const body = await context.request.json();
    await context.env.PORTFOLIO_KV.put('portfolio_data', JSON.stringify(body));

    return new Response(
      JSON.stringify({
        success: true,
        bound: true,
        status: 'saved',
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (e: any) {
    console.error('KV Write Error:', e);
    return new Response(
      JSON.stringify({
        success: false,
        bound: true,
        status: 'error',
        error: String(e)
      }),
      { status: 500, headers: corsHeaders }
    );
  }
};

