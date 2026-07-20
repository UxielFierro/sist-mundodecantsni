import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.SUPABASE_STORAGE_BUCKET || "product-images";

function getClient() {
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
}

export async function uploadImage(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string | null> {
  if (typeof window === "undefined" && !supabaseUrl) {
    return null;
  }

  const supabase = getClient();
  if (!supabase) return null;

  const { error } = await supabase.storage.from(bucket).upload(filename, buffer, {
    contentType,
    upsert: true,
  });

  if (error) {
    console.error("Supabase storage upload error:", error);
    return null;
  }

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filename);
  return urlData?.publicUrl ?? null;
}

export async function deleteImage(filename: string): Promise<boolean> {
  const supabase = getClient();
  if (!supabase) return false;

  const { error } = await supabase.storage.from(bucket).remove([filename]);
  return !error;
}

export function isStorageConfigured(): boolean {
  return !!supabaseUrl && !!supabaseKey;
}
