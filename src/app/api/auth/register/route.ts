import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const nip = formData.get("nip") as string;
    const nama = formData.get("nama") as string;
    const jabatan = formData.get("jabatan") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const avatar = formData.get("avatar") as File | null;
    const createdBy = "system";

    if (!nip || !nama || !jabatan || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    let avatarUrl: string | null = null;

    if (avatar) {
      const buffer = Buffer.from(await avatar.arrayBuffer());
      const filename = `${authData.user.id}-${Date.now()}-${avatar.name}`;

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

    const { error: profileError } = await supabase.from("profiles").insert([
      {
        nip: nip,
        nama: nama,
        jabatan: jabatan,
        image_url: avatarUrl,
        id_auth: authData.user.id,
        created_by: createdBy
      },
    ]);

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "User registered successfully", user: authData.user },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
