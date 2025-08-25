"use client";

import Loading from "@/components/common/Loading";
import DatePicker from "@/components/form/date-picker";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import ModalFailed from "@/components/modals/ModalFailed";
import ModalSuccess from "@/components/modals/ModalSuccess";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { TimeIcon } from "@/icons";
import moment from "moment";
import { useState, useEffect } from "react";
import ModalFormPasien from "./components/modals/ModalFormPasien";

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
  master_kamar: { nama: string; }
}

interface Kamar {
  id: number;
  nama: string;
}

export default function Pasien() {
  const [loading, setLoading] = useState(true);
  const [pasien, setPasien] = useState<Pasien[]>([]);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const closeModalAdd = () => { setOpenModalAdd(false) };
  const [openModalSuccess, setOpenModalSuccess] = useState(false);
  const closeModalSuccess = () => { setOpenModalSuccess(false) };
  const [openModalFailed, setOpenModalFailed] = useState(false);
  const closeModalFailed = () => { setOpenModalFailed(false) };
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [formData, setFormData] = useState({
    no_rekam_medis: "",
    nama: "",
    tgl_masuk: "",
    waktu_masuk: "",
    tgl_lahir: "",
    dpjp: "",
    ppja: "",
    kamar_id: "",
  });

  const handleSave = async (formData: any) => {
    // setLoading(true);
    // console.log("formData: ", formData)
    // const res = await fetch("/api/pasien", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(formData),
    // });
    // if (res.ok) {
    //   setLoading(false);
    setOpenModalSuccess(true);
    // } else {
    //   setOpenModalFailed(true);
    // }
    closeModalAdd();
  };

  useEffect(() => {
    setLoading(true);

    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const time = now.toTimeString().slice(0, 5);
    setFormData((prev) => ({
      ...prev,
      tgl_masuk: today,
      waktu_masuk: time,
    }));

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
      } catch (err) {
        console.error("Error fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
          {/* Modal Form Add */}
          {openModalAdd && (
            <ModalFormPasien
              isOpen={openModalAdd}
              onClose={closeModalAdd}
              onSave={handleSave}
              options={options}
            />
          )}
          {/* Modal Success */}
          {openModalSuccess && (
            <ModalSuccess
              isOpen={openModalSuccess}
              onClose={closeModalSuccess}
              message="Berhasil menambahkan pasien"
            />
          )}
          {/* Modal Failed */}
          {openModalFailed && (
            <ModalFailed
              isOpen={openModalFailed}
              onClose={closeModalFailed}
              message="Gagal menambahkan pasien"
            />
          )}
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-center text-theme-lg dark:text-gray-400"
              >
                Nomor Rekam Medis
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-center text-theme-lg dark:text-gray-400"
              >
                Nama
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-center text-theme-lg dark:text-gray-400"
              >
                Tanggal Masuk
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-center text-theme-lg dark:text-gray-400"
              >
                Tanggal Lahir
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-center text-theme-lg dark:text-gray-400"
              >
                Nama DPJP
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-center text-theme-lg dark:text-gray-400"
              >
                Nama PPJA
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-center text-theme-lg dark:text-gray-400"
              >
                Kamar
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-center text-theme-lg dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {pasien.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {p.no_rekam_medis}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {p.nama}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {moment(new Date(p.tgl_masuk)).format("DD-MM-YYYY HH:mm")}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {moment(new Date(p.tgl_lahir)).format("DD-MM-YYYY")}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {p.dpjp}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {p.ppja}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {p.master_kamar.nama}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      p.status === "draft"
                        ? "warning"
                        : p.status === "completed"
                          ? "success"
                          : "error"
                    }
                  >
                    {p.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
