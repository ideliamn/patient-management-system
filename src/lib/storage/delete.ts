import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function deleteFileByUrl(url: string) {
    try {
        console.log("url: " + url)

        // ambil bagian setelah /object/public/
        const relativePath = url.split("/storage/v1/object/public/")[1];
        console.log("relativePath:", relativePath);

        const bucket = relativePath.split("/")[0];
        const path = relativePath.split("/").slice(1).join("/"); // sisanya jadi path
        console.log("bucket:", bucket);
        console.log("path:", path);

        const { data, error } = await supabase.storage
            .from(bucket)
            .remove([path]);

        if (error) {
            console.error("Gagal hapus file:", error.message);
            return false;
        }

        console.log("File berhasil dihapus: ", data);
        return true;
    } catch (err) {
        console.error("Error parsing URL:", err);
        return false;
    }
}
