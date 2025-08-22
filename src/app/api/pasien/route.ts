import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data, error } = await supabase.from("pasien").select("*, master_kamar(nama)");
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const tanggalWaktuMasuk = `${body.tgl_masuk} ${body.waktu_masuk}`;

    const insertPasien = {
      no_rekam_medis: body.no_rekam_medis,
      nama: body.nama,
      tgl_masuk: tanggalWaktuMasuk,
      tgl_lahir: body.tgl_lahir,
      dpjp: body.dpjp,
      ppja: body.ppja,
      kamar_id: body.kamar_id
    }

    const { data, error } = await supabase
      .from("pasien")
      .insert([insertPasien])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
