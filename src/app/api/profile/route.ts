import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const idAuth = searchParams.get("idAuth");

    if (!idAuth) {
        return NextResponse.json({ error: "idAuth required" }, { status: 400 });
    }

    console.log("idAuth", idAuth)
    const { data, error } = await supabase.from("profiles").select('*').eq("id_auth", idAuth).single();
    console.log("error, " + JSON.stringify(error))
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
}

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const { data, error } = await supabase.from("profiles").delete().eq("id", id).single();
    console.log("error, " + error)
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
}