
"use client";

import { useEffect } from "react";
import { testConnection } from "@/app/lib/supabase/test-connection";

export default function TestSupabasePage() {
  useEffect(() => {
    testConnection();
  }, []);

  return <main>Verificando conexão com o Supabase...</main>;
}
