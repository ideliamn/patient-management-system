import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const date = body.date;

        const { data: dataTotalPasien, error: errorTotalPasien } = await supabase
            .from('vw_count_total_pasien')
            .select('*')

        if (errorTotalPasien) {
            return NextResponse.json({ error: errorTotalPasien.message }, { status: 500 });
        }

        const { data: dataBor, error: errorBor } = await supabase
            .rpc("fn_get_bor", {
                tanggal_input: date
            })

        if (errorBor) {
            return NextResponse.json({ error: errorBor.message }, { status: 500 });
        }

        const { data: dataCountPasienMasuk, error: errorCountPasienMasuk } = await supabase
            .rpc("fn_count_pasien_masuk", {
                tanggal_input: date
            })

        if (errorCountPasienMasuk) {
            return NextResponse.json({ error: errorCountPasienMasuk.message }, { status: 500 });
        }

        const { data: dataCountPasienPulang, error: errorCountPasienPulang } = await supabase
            .rpc("fn_count_pasien_pulang", {
                tanggal_input: date
            })

        if (errorCountPasienPulang) {
            return NextResponse.json({ error: errorCountPasienPulang.message }, { status: 500 });
        }

        const response = {
            totalPasien: dataTotalPasien[0]?.count ?? 0,
            pasienMasuk: dataCountPasienMasuk[0]?.total ?? 0,
            pasienPulang: dataCountPasienPulang[0]?.total ?? 0,
            bor: dataBor[0]?.bor_percentage
        }

        return NextResponse.json(response);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}


