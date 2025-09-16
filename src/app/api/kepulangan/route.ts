import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
    const { data, error } = await supabase.from("pasien").select("*, master_kamar(nama), pasien_kepulangan(*), pasien_dokumen(*)");

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const tanggalWaktuPulang = `${body.tgl_pulang} ${body.waktu_pulang}`;

        const insertKepulangan = {
            pasien_id: body.pasien_id,
            nama_penerima: body.nama_penerima,
            kontak_penerima: body.kontak_penerima,
            tanggal_kepulangan: tanggalWaktuPulang,
            created_by: body.createdBy
        }

        const { data, error } = await supabase
            .from("pasien_kepulangan")
            .insert([insertKepulangan])
            .select();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (body.dokumen.length > 0) {
            const insertDokumen = body.dokumen.map((id: number) => ({
                dokumen_id: id,
                pasien_id: body.pasien_id,
                created_by: body.createdBy
            }));

            const { data: dokumenData, error: dokumenError } = await supabase
                .from("pasien_dokumen")
                .insert(insertDokumen)
                .select();

            if (dokumenError) {
                return NextResponse.json({ error: dokumenError.message }, { status: 500 });
            }
        }

        return NextResponse.json(data, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();

        const tanggalWaktuPulang = `${body.tgl_pulang} ${body.waktu_pulang}`;

        const updateKepulangan = {
            pasien_id: body.pasien_id,
            nama_penerima: body.nama_penerima,
            kontak_penerima: body.kontak_penerima,
            tanggal_kepulangan: tanggalWaktuPulang,
            created_by: body.createdBy
        }

        const { data, error } = await supabase
            .from("pasien_kepulangan")
            .update(updateKepulangan)
            .eq("id", body.id)
            .select();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const { data: dokumenData, error: dokumenError } = await supabase.from("pasien_dokumen").delete().eq("pasien_id", body.pasien_id).select();

        if (dokumenError) {
            return NextResponse.json({ error: dokumenError.message }, { status: 500 });
        }

        if (body.dokumen.length > 0) {
            const insertDokumen = body.dokumen.map((id: number) => ({
                dokumen_id: id,
                pasien_id: body.pasien_id,
                created_by: body.createdBy
            }));

            const { data: dokumenData, error: dokumenError } = await supabase
                .from("pasien_dokumen")
                .insert(insertDokumen)
                .select();

            if (dokumenError) {
                return NextResponse.json({ error: dokumenError.message }, { status: 500 });
            }
        }

        return NextResponse.json(data, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}


