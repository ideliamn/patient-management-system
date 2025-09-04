import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { dateTimeNow } from "@/lib/helpers/dateTimeNow";

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

export async function PUT(req: Request) {
    try {
        const { id, nip, nama, jabatan } = await req.json();

        if (!id) {
            return NextResponse.json({ error: "id is required" }, { status: 400 });
        }

        const paramUpdate: {
            nama?: string;
            jabatan?: string;
            updated_by?: string;
            updated_at?: string;
        } = {};

        if (nama && nama.trim() !== "") {
            paramUpdate.nama = nama.trim();
        }

        if (jabatan && jabatan.trim() !== "") {
            paramUpdate.jabatan = jabatan;
        }

        paramUpdate.updated_by = nip;
        paramUpdate.updated_at = dateTimeNow();

        if (Object.keys(paramUpdate).length === 0) {
            return NextResponse.json(
                { message: "No fields to update" },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from("profiles")
            .update(paramUpdate)
            .eq("id", id);

        if (error) {
            return NextResponse.json({ error: "Gagal update profil: " + error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Berhasil update profil" }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}