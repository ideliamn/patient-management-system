import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { email } from "zod";
import { count } from "console";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    // ambil query params
    const pageParam = searchParams.get("page");
    const sizeParam = searchParams.get("size");

    const pageInt = pageParam ? parseInt(pageParam, 10) : 1;
    const sizeInt = sizeParam ? parseInt(sizeParam, 10) : 10;

    const page = isNaN(pageInt) || pageInt < 1 ? 1 : pageInt;
    const size = isNaN(sizeInt) || sizeInt < 1 ? 10 : sizeInt;

    const offset = (page - 1) * size;

    const { data, error, count } = await supabase
        .from("master_dokter")
        .select("*, master_spesialisasi(nama)", { count: "exact" })
        .order("nama", { ascending: true })
        .range(offset, offset + size - 1);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const totalData = count || 0
    const totalPage = Math.ceil(totalData / size)

    const response = {
        page: page,
        size: size,
        totalPage: totalPage,
        totalData: totalData,
        data: data
    }

    return NextResponse.json(response);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const insertDokter = {
            kode: body.kode,
            nama: body.nama,
            spesialisasi_id: body.spesialisasi_id,
            no_sip: body.no_sip,
            no_str: body.no_str,
            jenis_kelamin: body.jenis_kelamin,
            no_hp: body.no_hp,
            email: body.email,
            status: body.status,
            image_url: body.image_url,
            created_by: body.created_by
        }

        const { data, error } = await supabase
            .from("master_dokter")
            .insert([insertDokter])
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

        const updateDokter = {
            kode: body.kode,
            nama: body.nama,
            spesialisasi_id: body.spesialisasi_id,
            no_sip: body.no_sip,
            no_str: body.no_str,
            jenis_kelamin: body.jenis_kelamin,
            no_hp: body.no_hp,
            email: body.email,
            status: body.status,
            image_url: body.image_url,
            updated_by: body.updated_by
        }

        const { data, error } = await supabase
            .from("master_dokter")
            .update(updateDokter)
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


