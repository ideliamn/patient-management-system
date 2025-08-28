// lib/validations/registerSchema.ts
import { z } from "zod";

export const registerSchema = z.object({
    nip: z.string().min(1, "NIP wajib diisi"),
    nama: z.string().min(1, "Nama wajib diisi"),
    jabatan: z.string().min(1, "Jabatan wajib diisi"),
    email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    avatar: z
        .any()
        .refine((file) => file instanceof File && file.type === "image/jpeg", {
            message: "Foto profil harus berupa JPG",
        }),
});
