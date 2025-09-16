"use client";

import Loading from "@/components/common/Loading";
import ModalFailed from "@/components/modals/ModalFailed";
import ModalSuccess from "@/components/modals/ModalSuccess";
import { useState, useEffect } from "react";
import ModalFormPasien from "./components/modals/ModalFormPasien";
import TablePasien from "./components/tables/TablePasien";
import ModalWarning from "@/components/modals/ModalWarning";
import ModalFormPemulanganPasien from "./components/modals/ModalFormPemulanganPasien";
import { useProfile } from "@/context/ProfileContext";

interface Pasien {
  id: number;
  no_rekam_medis: string;
  nama: string;
  tgl_masuk: string;
  tgl_lahir: string;
  dpjp: string;
  ppja: string;
  kamar: string;
  status: "draft" | "completed";
  master_kamar: { nama: string; };
  pasien_kepulangan: { id: number };
}

interface Kamar {
  id: number;
  nama: string;
}

interface Dokumen {
  id: number;
  nama: string;
}

export default function Pasien() {
  const { profile } = useProfile();
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [pasien, setPasien] = useState<Pasien[]>([]);
  const [openModalSuccess, setOpenModalSuccess] = useState(false);
  const closeModalSuccess = () => { setOpenModalSuccess(false) };
  const [successMessage, setSuccessMessage] = useState("");
  const [openModalFailed, setOpenModalFailed] = useState(false);
  const closeModalFailed = () => { setOpenModalFailed(false) };
  const [failedMessage, setFailedMessage] = useState("");
  const [openModalWarning, setOpenModalWarning] = useState(false);
  const closeModalWarning = () => { setOpenModalWarning(false) };
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [dokumenOptions, setDokumenOptions] = useState<{ value: string; label: string }[]>([]);
  const [formDataPulang, setFormDataPulang] = useState({
    id: 0,
    nama_pasien: "",
    pasien_id: 0,
    nama_penerima: "",
    kontak_penerima: "",
    tgl_pulang: "",
    waktu_pulang: "",
    dokumen: [],
    createdBy: profile?.nip,
    updatedBy: profile?.nip
  });

  const [openModalAdd, setOpenModalAdd] = useState(false);
  const closeModalAdd = () => {
    console.log("close modal add")
    setFormData({
      id: 0,
      no_rekam_medis: "",
      nama: "",
      tgl_masuk: "",
      waktu_masuk: "",
      tgl_lahir: "",
      dpjp: "",
      ppja: "",
      kamar_id: "",
    })
    console.log("form data, " + JSON.stringify(formData))
    setOpenModalAdd(false)
  };

  const [openModalPemulangan, setOpenModalPemulangan] = useState(false);
  const closeModalPemulangan = () => {
    console.log("close modal add")
    setFormDataPulang({
      id: 0,
      nama_pasien: "",
      pasien_id: 0,
      nama_penerima: "",
      kontak_penerima: "",
      tgl_pulang: "",
      waktu_pulang: "",
      dokumen: [],
      createdBy: profile?.nip,
      updatedBy: profile?.nip
    })
    setOpenModalPemulangan(false)
  };

  const [formData, setFormData] = useState({
    id: 0,
    no_rekam_medis: "",
    nama: "",
    tgl_masuk: "",
    waktu_masuk: "",
    tgl_lahir: "",
    dpjp: "",
    ppja: "",
    kamar_id: "",
  });

  const refreshTabelPasien = () => {
    setLoading(true);

    const fetchData = async () => {
      try {
        // get pasien
        const getPasien = await fetch("/api/pasien");
        const dataPasien = await getPasien.json();
        setPasien(dataPasien);

        // get kamar
        const getKamar = await fetch("/api/kamar");
        const dataKamar: Kamar[] = await getKamar.json();
        const formattedOptions = dataKamar.map((k) => ({
          value: String(k.id),
          label: k.nama,
        }));
        setOptions(formattedOptions);

        // get dokumen
        const getDokumen = await fetch("/api/dokumen");
        const dataDokumen: Dokumen[] = await getDokumen.json();
        const formattedDokumenOptions = dataDokumen.map((k) => ({
          value: String(k.id),
          label: k.nama,
        }));
        setDokumenOptions(formattedDokumenOptions);
      } catch (err) {
        console.error("Error fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }

  const saveInsert = async (formData: any) => {
    setLoading(true);
    console.log("formData: ", formData)
    const res = await fetch("/api/pasien", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setSuccessMessage("Sukses menambahkan pasien");
      setLoading(false);
      setOpenModalSuccess(true);
    } else {
      setFailedMessage("Gagal menambahkan pasien");
      setOpenModalFailed(true);
    }
    closeModalAdd();
    refreshTabelPasien();
  };

  const handlePulang = async (id: number) => {
    setLoading(true)
    const res = await fetch(`/api/pasien/${id}`);
    const data = await res.json();
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const timeNow = now.toTimeString().slice(0, 5);
    setFormDataPulang({
      id: data.pasien_kepulangan !== null ? data.pasien_kepulangan.id : 0,
      nama_pasien: data.nama,
      pasien_id: data.id,
      nama_penerima: data.pasien_kepulangan !== null ? data.pasien_kepulangan.nama_penerima : "",
      kontak_penerima: data.pasien_kepulangan !== null ? data.pasien_kepulangan.kontak_penerima : "",
      tgl_pulang: data.pasien_kepulangan !== null ? data.pasien_kepulangan.tanggal_kepulangan.split("T")[0] : today,
      waktu_pulang: data.pasien_kepulangan !== null ? data.pasien_kepulangan.tanggal_kepulangan.split("T")[1].slice(0, 5) : timeNow,
      dokumen: data.pasien_dokumen.length > 0 ? data.pasien_dokumen.map((d: any) => d.dokumen_id) : [],
      createdBy: data.pasien_kepulangan !== null ? data.pasien_kepulangan.created_by : profile?.nip,
      updatedBy: profile?.nip,
    });
    setOpenModalPemulangan(true);
    setLoading(false)
  }

  const handleEdit = async (id: number) => {
    setLoading(true)
    const res = await fetch(`/api/pasien/${id}`);
    const data = await res.json();
    const tanggalMasuk = data.tgl_masuk.split("T")[0];
    const waktuMasuk = data.tgl_masuk.split("T")[1].slice(0, 5);
    setFormData({
      id: data.id,
      no_rekam_medis: data.no_rekam_medis,
      nama: data.nama,
      tgl_masuk: tanggalMasuk,
      waktu_masuk: waktuMasuk,
      tgl_lahir: data.tgl_lahir,
      dpjp: data.dpjp,
      ppja: data.ppja,
      kamar_id: String(data.kamar_id),
    });
    setOpenModalAdd(true);
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    setDeleteId(id);
    setOpenModalWarning(true);
  }

  const saveUpdate = async (formData: any) => {
    setLoading(true);
    const res = await fetch("/api/pasien", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setSuccessMessage("Sukses memperbarui data pasien");
      setLoading(false);
      setOpenModalSuccess(true);
    } else {
      setFailedMessage("Gagal memperbarui pasien");
      setOpenModalFailed(true);
    }
    closeModalAdd();
    refreshTabelPasien();
  };

  const saveDelete = async () => {
    console.log("save delete")
    if (deleteId) {
      console.log("delete id", deleteId)
      setLoading(true);
      const res = await fetch(`/api/pasien/${deleteId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSuccessMessage("Sukses mengahapus pasien");
        setLoading(false);
        setOpenModalSuccess(true);
      } else {
        setFailedMessage("Gagal menghapus pasien");
        setOpenModalFailed(true);
      }
      closeModalAdd();
      refreshTabelPasien();
    }
    else {
      console.log("gak ada delete id")
    }
  };

  const saveInsertPulang = async (formDataPulang: any) => {
    // setLoading(true);
    console.log("INSERT PULANG formDataPulang: ", formDataPulang)
    setLoading(true);
    console.log("formDataPulang: ", formDataPulang)
    const res = await fetch("/api/kepulangan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formDataPulang),
    });
    if (res.ok) {
      setSuccessMessage("Sukses pemulangan pasien");
      setLoading(false);
      setOpenModalSuccess(true);
    } else {
      setFailedMessage("Gagal pemulangan pasien");
      setOpenModalFailed(true);
    }
    closeModalPemulangan();
    refreshTabelPasien();
  };

  const saveUpdatePulang = async (formDataPulang: any) => {
    // setLoading(true);
    console.log("UPDATE PULANG formDataPulang: ", formDataPulang)
    setLoading(true);
    const res = await fetch("/api/kepulangan", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formDataPulang),
    });
    if (res.ok) {
      setSuccessMessage("Sukses memperbarui pemulangan pasien");
      setLoading(false);
      setOpenModalSuccess(true);
    } else {
      setFailedMessage("Gagal memperbarui pemulangan pasien");
      setOpenModalFailed(true);
    }
    closeModalPemulangan();
    refreshTabelPasien();
  };

  useEffect(() => {
    refreshTabelPasien();
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      {loading && <Loading />}
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Daftar Pasien
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200" onClick={() => setOpenModalAdd(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0 0 0)">
              <path d="M11.2502 6C11.2502 5.58579 11.586 5.25 12.0002 5.25C12.4145 5.25 12.7502 5.58579 12.7502 6V11.2502H18.0007C18.4149 11.2502 18.7507 11.586 18.7507 12.0002C18.7507 12.4145 18.4149 12.7502 18.0007 12.7502H12.7502V18.0007C12.7502 18.4149 12.4145 18.7507 12.0002 18.7507C11.586 18.7507 11.2502 18.4149 11.2502 18.0007V12.7502H6C5.58579 12.7502 5.25 12.4145 5.25 12.0002C5.25 11.586 5.58579 11.2502 6 11.2502H11.2502V6Z" fill="#343C54" />
            </svg>
            Tambahkan
          </button>
          {/* Modal Form Pasien */}
          {openModalPemulangan && (
            <ModalFormPemulanganPasien
              isOpen={openModalPemulangan}
              onClose={closeModalPemulangan}
              handleInsert={saveInsertPulang}
              handleUpdate={saveUpdatePulang}
              optionsDokumen={dokumenOptions}
              initialData={formDataPulang}
            />
          )}
          {/* Modal Form Pemulangan Pasien */}
          {openModalAdd && (
            <ModalFormPasien
              isOpen={openModalAdd}
              onClose={closeModalAdd}
              handleInsert={saveInsert}
              handleUpdate={saveUpdate}
              options={options}
              initialData={formData}
            />
          )}
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
          {/* Modal Warning */}
          {openModalWarning && (
            <ModalWarning
              isOpen={openModalWarning}
              onClose={closeModalWarning}
              title="Apakah anda yakin?"
              message="Ingin menghapus pasien?"
              yesButtonText="Ya"
              noButtonText="Tidak"
              handleYes={() => deleteId && saveDelete()}
              handleNo={closeModalWarning}
            />
          )}
        </div>
      </div>
      {/* Table Pasien */}
      {loading && <Loading />}
      <TablePasien
        pasien={pasien}
        handlePulang={(id: number) => handlePulang(id)}
        handleEdit={(id: number) => handleEdit(id)}
        handleDelete={(id: number) => handleDelete(id)}
      />
    </div>
  );
}
