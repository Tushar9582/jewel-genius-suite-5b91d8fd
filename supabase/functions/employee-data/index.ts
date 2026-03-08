import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FIREBASE_DB_URL = "https://jewellery-1f0be-default-rtdb.firebaseio.com";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { path, action, data, id } = await req.json();

    if (!path) {
      return new Response(JSON.stringify({ error: "path is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // READ: get all items or single item
    if (!action || action === "getAll") {
      const url = id
        ? `${FIREBASE_DB_URL}/${path}/${id}.json`
        : `${FIREBASE_DB_URL}/${path}.json`;
      const res = await fetch(url);
      const raw = await res.json();

      if (!raw) {
        return new Response(JSON.stringify([]), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (id) {
        return new Response(JSON.stringify({ id, ...raw }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const items = Object.entries(raw).map(([key, val]: [string, any]) => ({
        id: key,
        ...val,
      }));

      return new Response(JSON.stringify(items), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // WRITE: add item
    if (action === "add") {
      const res = await fetch(`${FIREBASE_DB_URL}/${path}.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      });
      const result = await res.json();
      return new Response(JSON.stringify({ id: result.name }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // UPDATE: update item
    if (action === "update" && id) {
      await fetch(`${FIREBASE_DB_URL}/${path}/${id}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          updated_at: new Date().toISOString(),
        }),
      });
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
