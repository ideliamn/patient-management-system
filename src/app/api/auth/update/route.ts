import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const { id_auth, email, password } = await req.json();

        if (!id_auth) {
            return NextResponse.json({ message: "id_auth is required" }, { status: 400 });
        }

        const { error } = await supabase.auth.admin.updateUserById(id_auth, {
            email,
            password,
        });

        if (error) {
            return NextResponse.json({ message: error.message }, { status: 400 });
        }

        return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
