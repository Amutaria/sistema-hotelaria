
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function proxy(request) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";

    const redirectResponse = NextResponse.redirect(url);

    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });

    return redirectResponse;
  }

  const { data: perfilUsuario, error: erroPerfil } = await supabase
    .from("perfis")
    .select("perfil")
    .eq("user_id", data.claims.sub)
    .maybeSingle();

  if (erroPerfil || !perfilUsuario) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("erro", "perfil");

    const redirectResponse = NextResponse.redirect(url);

    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });

    return redirectResponse;
  }

  const perfil = perfilUsuario.perfil;

  const caminhosPermitidosColaborador = [
    "/reservas",
    "/hospedes",
    "/quartos",
    "/financeiro",
    "/suporte",
  ];

  const acessoPermitido =
    perfil === "admin" ||
    caminhosPermitidosColaborador.some(
      (caminho) =>
        request.nextUrl.pathname === caminho ||
        request.nextUrl.pathname.startsWith(caminho + "/")
    );

  if (!acessoPermitido) {
    const url = request.nextUrl.clone();
    url.pathname = "/suporte";
    url.search = "";

    const redirectResponse = NextResponse.redirect(url);

    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });

    return redirectResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/configuracoes/:path*",
    "/dashboard/:path*",
    "/disponibilidade/:path*",
    "/financeiro/:path*",
    "/hospedes/:path*",
    "/quartos/:path*",
    "/relatorios/:path*",
    "/reservas/:path*",
    "/suporte/:path*",
  ],
};
