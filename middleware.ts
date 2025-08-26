import { createClient } from '@/lib/supabaseServer';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = await createClient()
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session && req.nextUrl.pathname.startsWith("/pasien")) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    if (session && req.nextUrl.pathname.startsWith("/login")) {
        return NextResponse.redirect(new URL("/pasien", req.url))
    }

    return res
}

export const config = {
    matcher: ['/dashboard/:path*', '/login'],
};
