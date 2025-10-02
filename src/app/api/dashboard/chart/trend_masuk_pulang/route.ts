import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { data: dataTrendMasukPulang, error: errorTrendMasukPulang } = await supabase
            .rpc("fn_trend_masuk_pulang", {
                tanggal_input: body.date,
                interval_days: body.interval
            })

        if (errorTrendMasukPulang) {
            return NextResponse.json({ error: errorTrendMasukPulang.message }, { status: 500 });
        }

        const response = dataTrendMasukPulang

        return NextResponse.json(response);
    }
    catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}