import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { email } from "zod";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
    const { data, error } = await supabase
        .from("master_spesialisasi")
        .select("*");

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const insertSp = {
            kode: body.kode,
            nama: body.nama,
            created_by: body.created_by
        }

        const { data, error } = await supabase
            .from("master_spesialisasi")
            .insert([insertSp])
            .select();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();

        const updateSp = {
            kode: body.kode,
            nama: body.nama,
            spesialisasi_id: body.spesialisasi_id,
            no_sip: body.no_sip,
            no_str: body.no_str,
            jenis_kelamin: body.jenis_kelamin,
            no_hp: body.no_hp,
            email: body.email,
            status: body.status,
            image_url: body.image_url
        }

        const { data, error } = await supabase
            .from("master_spesialisasi")
            .update(updateSp)
            .eq("id", body.id)
            .select();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}


