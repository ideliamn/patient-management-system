import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
    try {
        const { data: dataDokumenKepulangan, error: errorDokumenKepulangan } = await supabase
            .from("vw_los_average")
            .select("*")

        if (errorDokumenKepulangan) {
            return NextResponse.json({ error: errorDokumenKepulangan.message }, { status: 500 });
        }

        const response = dataDokumenKepulangan

        return NextResponse.json(response);
    }
    catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}