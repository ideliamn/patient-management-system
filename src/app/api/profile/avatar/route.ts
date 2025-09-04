import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { deleteFileByUrl } from "@/lib/storage/delete";
import { dateTimeNow } from "@/lib/helpers/dateTimeNow";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const id = formData.get("id") as string;
        const avatar = formData.get("avatar") as File | null;
        const nip = formData.get("nip") as string;

        if (!id) {
            return NextResponse.json(
                { error: "id is required" },
                { status: 400 }
            );
        }

        let avatarUrl: string | null = null;

        if (avatar) {
            const buffer = Buffer.from(await avatar.arrayBuffer());
            const uuid = uuidv4();
            const filename = `${id}-${uuid}`;

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

            // delete existing avatar
            const { data: oldAvatar, error: oldAvatarError } = await supabase.from("profiles").select('image_url').eq("id", id).single();
            if (oldAvatar?.image_url) {
                console.log("avatar lama ada:", oldAvatar.image_url);
                await deleteFileByUrl(oldAvatar.image_url);
            } else {
                console.log("avatar lama gak ada")
            }
        }

        const paramUpdate = {
            image_url: avatarUrl,
            updated_by: nip,
            updated_at: dateTimeNow(),
        }

        console.log("param update: " + JSON.stringify(paramUpdate))

        const { data, error } = await supabase
            .from("profiles")
            .update(paramUpdate)
            .eq("id", id)
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
