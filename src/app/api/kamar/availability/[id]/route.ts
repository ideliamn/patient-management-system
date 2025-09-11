import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  const { count: countPasien, error: errorPasien } = await supabase.from("pasien").select('*', { count: "exact", head: true }).eq("kamar_id", id);
  if (errorPasien) {
    return NextResponse.json({ error: errorPasien.message }, { status: 500 });
  }

  const { data: dataKamar, error: errorKamar } = await supabase.from("master_kamar").select("*").eq("id", id).single();
  if (errorKamar) {
    return NextResponse.json({ error: errorKamar.message }, { status: 500 });
  }

  const jumlahPasien = countPasien ?? 0;
  const kapasitasKamar = dataKamar.kapasitas;
  const ketersediaan = kapasitasKamar - jumlahPasien
  const resData = {
    id_kamar: dataKamar.id,
    nama_kamar: dataKamar.nama,
    kapasitas_kamar: kapasitasKamar,
    jumlah_pasien: jumlahPasien,
    ketersediaan: ketersediaan
  }

  return NextResponse.json(resData);
}

