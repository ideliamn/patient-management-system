"use client";
import React, { useRef, useState } from "react";
import { useModal } from "../../hooks/useModal";
import Button from "../ui/button/Button";
import Image from "next/image";
import { useProfile } from "@/context/ProfileContext";
import Loading from "../common/Loading";
import ModalSuccess from "../modals/ModalSuccess";
import ModalFailed from "../modals/ModalFailed";


export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { profile } = useProfile();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [openModalSuccess, setOpenModalSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [openModalFailed, setOpenModalFailed] = useState(false);
  const closeModalFailed = () => { setOpenModalFailed(false) };
  const [failedMessage, setFailedMessage] = useState("");

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    closeModal();
  };

  const closeModalSuccess = () => {
    window.location.reload();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      console.log("Selected avatar:", file);
    }
  };

  const handleSaveImage = async () => {
    setLoading(true);
    if (!selectedFile) {
      setLoading(false);
      return;
    }
    console.log("Saving new avatar:", selectedFile);
    const formData = new FormData();
    formData.append("avatar", selectedFile);
    if (profile?.id_auth) {
      formData.append("id_auth", profile.id_auth);
    }
    console.log("formData: " + JSON.stringify(formData))
    try {
      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMessage("Sukses update avatar");
        setLoading(false);
        setOpenModalSuccess(true);
      } else {
        setFailedMessage("Gagal update avatar. Error: " + data.message);
        setLoading(false);
        setOpenModalFailed(true);
      }
    } catch (err) {
      console.error(err);
      setFailedMessage("Gagal update avatar. Error: " + err);
      setLoading(false);
      setOpenModalFailed(true);
    } finally {
      setLoading(false);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      {loading && <Loading />}
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        <div className="flex flex-col items-center">
          <div className="relative w-30 h-30 group">
            <Image
              width={120}
              height={120}
              src={previewUrl || profile?.image_url || "/images/user/owner.jpg"}
              alt="user"
              className="object-cover w-30 h-30 rounded-full border border-gray-200 dark:border-gray-800"
            />
            {/* Overlay hover for edit */}
            <div
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white text-sm font-medium opacity-0 group-hover:opacity-100 cursor-pointer transition"
              onClick={() => fileInputRef.current?.click()}
            >
              Edit
            </div>
            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          {previewUrl && (
            <div className="flex justify-center mt-4">
              <Button size="xs" variant="outline" onClick={handleSaveImage}>Simpan</Button>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center xl:items-start text-center xl:text-left">
          <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
            {profile?.nama}
          </h4>
          <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {profile?.nip}
            </p>
            <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {profile?.jabatan}
            </p>
          </div>
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
