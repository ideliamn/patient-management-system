import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const id_auth = formData.get("id_auth") as string;
        const avatar = formData.get("avatar") as File | null;
        const updatedBy = formData.get("nip") as string;

        if (!id_auth) {
            return NextResponse.json(
                { error: "id_auth is required" },
                { status: 400 }
            );
        }

        let avatarUrl: string | null = null;

        if (avatar) {
            const buffer = Buffer.from(await avatar.arrayBuffer());
            const uuid = uuidv4();
            const filename = `${id_auth}-${uuid}`;

            const { error: uploadError } = await supabase.storage
                .from("avatar")
                .upload(filename, buffer, {
                    contentType: avatar.type,
                });

            if (uploadError) {
                return NextResponse.json(
                    { error: uploadError.message },
                    { status: 400 }
                );
            }

            const {
                data: { publicUrl },
            } = supabase.storage.from("avatar").getPublicUrl(filename);

            avatarUrl = publicUrl;
        }

        const paramUpdate = {
            image_url: avatarUrl,
            updated_by: updatedBy
        }

        const { data, error } = await supabase
            .from("profiles")
            .update(paramUpdate)
            .eq("id_auth", id_auth)
            .select();

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Sukses update avatar" }, { status: 201 }
        );
    } catch (err) {
        return NextResponse.json({ error: "Error: " + err }, { status: 500 });
    }
}
