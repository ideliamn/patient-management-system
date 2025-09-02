"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import FileInput from "../form/input/FileInput";
import Loading from "../common/Loading";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import ModalSuccess from "../modals/ModalSuccess";
import ModalFailed from "../modals/ModalFailed";

export default function SignUpForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [openModalSuccess, setOpenModalSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [openModalFailed, setOpenModalFailed] = useState(false);
  const closeModalFailed = () => { setOpenModalFailed(false) };
  const [failedMessage, setFailedMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const closeModalSuccess = () => {
    router.push("/login")
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  console.log("error input form: " + JSON.stringify(errors))

  const onSubmit = async (data: any) => {
    console.log("data (RHF):", data);
    setLoading(true);

    const formData = new FormData();
    formData.append("nip", data.nip);
    formData.append("nama", data.nama);
    formData.append("jabatan", data.jabatan);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (data.avatar && data.avatar.length > 0) {
      formData.append("avatar", data.avatar[0]);
    }

    console.log("formData: " + JSON.stringify(formData))

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("Sukses mendaftarkan akun, silakan login.");
        setLoading(false);
        setOpenModalSuccess(true);
      } else {
        setFailedMessage("Gagal mendaftarkan akun. Error: " + data.message);
        setLoading(false);
        setOpenModalFailed(true);
      }
    } catch (err) {
      console.error(err);
      setFailedMessage("Gagal mendaftarkan akun. Error: " + err);
      setLoading(false);
      setOpenModalFailed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      {loading && <Loading />}
      <div className="flex flex-col justify-center flex-1 w-full max-w-3xl mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Daftarkan akun
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="py-3">
            <div className="sm:col-span-1">
              <Label>
                NIP <span className="text-error-500">*</span>
              </Label>
              <input
                type="text"
                id="nip"
                placeholder="NIP"
                className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm"
                {...register("nip")}
              />
              {/* <Input
                type="text"
                id="nip"
                placeholder="NIP"
                {...register("nip")}
              /> */}
              {/* {errors.nip && <p className="text-red-500">{errors.nip.message}</p>} */}
            </div>
          </div>
          <div className="py-3">
            <Label>
              Nama Lengkap <span className="text-error-500">*</span>
            </Label>
            <input
              type="text"
              id="nama"
              placeholder="Nama"
              className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm"
              {...register("nama")}
            />
            {/* <Input
              type="text"
              id="nama"
              placeholder="Nama"
              {...register("nama")}
            /> */}
            {/* {errors.nama && <p className="text-red-500">{errors.nama.message}</p>} */}
          </div>
          <div className="py-3">
            <Label>
              Jabatan <span className="text-error-500">*</span>
            </Label>
            <input
              type="text"
              id="jabatan"
              placeholder="Jabatan"
              className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm"
              {...register("jabatan")}
            />
            {/* <Input
              type="text"
              id="jabatan"
              placeholder="Jabatan"
              {...register("jabatan")}
            /> */}
            {/* {errors.jabatan && <p className="text-red-500">{errors.jabatan.message}</p>} */}
          </div>
          <div className="py-3">
            <Label>
              Foto Profil <span className="text-error-500">*</span>
            </Label>
            <input
              type="file"
              accept="image/*"
              className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm"
              {...register("avatar")}
            />
            {/* <FileInput
              accept="image/*"
              {...register("avatar")}
            /> */}
            {errors.avatar && <p className="text-red-500">Error upload gambar</p>}
          </div>
          <div className="py-3">
            <Label>
              E-mail <span className="text-error-500">*</span>
            </Label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm"
              {...register("email")}
            />
            {/* <Input
              type="email"
              id="email"
              placeholder="Email"
              {...register("email")}
            /> */}
            {/* {errors.email && <p className="text-red-500">{errors.email.message}</p>} */}
          </div>
          <div className="py-3">
            <Label>
              Password <span className="text-error-500">*</span>
            </Label>
            <div className="relative">
              {/* <Input
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
              /> */}
              <input
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm"
                {...register("password")}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showPassword ? (
                  <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                ) : (
                  <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                )}
              </span>
              {/* {errors.password && <p className="text-red-500">{errors.password.message}</p>} */}
            </div>
          </div>
          <div className="py-3">
            <button type="submit" className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
              Daftar
            </button>
          </div>
        </form>

        <div className="mt-5">
          <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
            Sudah punya akun?
            <Link
              href="/signin"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
      {/* Modal Success */}
      {openModalSuccess && (
        <ModalSuccess
          isOpen={openModalSuccess}
          onClose={closeModalSuccess}
          message={successMessage}
        />
      )}
      {/* Modal Failed */}
      {openModalFailed && (
        <ModalFailed
          isOpen={openModalFailed}
          onClose={closeModalFailed}
          message={failedMessage}
        />
      )}
    </div>
  );
}
