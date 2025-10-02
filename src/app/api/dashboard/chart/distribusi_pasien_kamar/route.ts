import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
    try {
        const { data: dataChart, error: errorChart } = await supabase
            .from("vw_distribusi_pasien_kamar")
            .select("*")

        if (errorChart) {
            return NextResponse.json({ error: errorChart.message }, { status: 500 });
        }

        const response = dataChart

        return NextResponse.json(response);
    }
    catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}