"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import ComponentCard from "../common/ComponentCard";
import { ChevronDownIcon, EyeIcon, EyeCloseIcon, TimeIcon } from "@/icons";
import { options } from "@fullcalendar/core/preact.js";
import DatePicker from "../form/date-picker";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Select from "../form/Select";
import Modals from "@/app/(admin)/(ui-elements)/modals/page";
import DefaultModal from "../example/ModalExample/DefaultModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import MultiSelect from "../form/MultiSelect";

// Define the TypeScript interface for the table rows
interface Product {
  id: number; // Unique identifier for each product
  name: string; // Product name
  variants: string; // Number of variants (e.g., "1 Variant", "2 Variants")
  category: string; // Category of the product
  price: string; // Price of the product (as a string with currency symbol)
  // status: string; // Status of the product
  image: string; // URL or path to the product image
  status: "Delivered" | "Pending" | "Canceled"; // Status of the product
}

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
  master_kamar: {nama: string;}
}

interface Kamar {
  id: number;
  nama: string;
}

export default function RecentOrders() {
  const [pasien, setPasien] = useState<Pasien[]>([]);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const closeModalAdd = () => { setOpenModalAdd(false) };
  const [openModalSuccess, setOpenModalSuccess] = useState(false);
  const closeModalSuccess = () => { setOpenModalSuccess(false) };
  const [openModalFailed, setOpenModalFailed] = useState(false);
  const closeModalFailed = () => { setOpenModalFailed(false) };
  const [kamar, setKamar] = useState("");
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSelectKamar = (value: string) => {
    console.log("Selected value kamar:", value);
    setKamar(value);
  };
  const handleSave = async () => {
    console.log("Saving changes...");
    console.log("formData: ", formData)
    const res = await fetch("/api/pasien", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setOpenModalSuccess(true)
    } else {

    }
    closeModalAdd();
  };

  useEffect(() => {
    const fetchData = async () => {
      // get pasien
      const getPasien = await fetch("/api/pasien");
      const dataPasien = await getPasien.json();
      setPasien(dataPasien);
      console.log("data pasien setelah setPasien: ",pasien)

      // get kamar
      const getKamar = await fetch("/api/kamar");
      const dataKamar: Kamar[] = await getKamar.json();
      const formattedOptions = dataKamar.map((k) => ({
        value: String(k.id), // bisa id atau kode unik
        label: k.nama,       // apa yang ditampilkan di dropdown
      }));
      setOptions(formattedOptions);
    };
    fetchData();
  }, []);
  
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
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
            <path d="M11.2502 6C11.2502 5.58579 11.586 5.25 12.0002 5.25C12.4145 5.25 12.7502 5.58579 12.7502 6V11.2502H18.0007C18.4149 11.2502 18.7507 11.586 18.7507 12.0002C18.7507 12.4145 18.4149 12.7502 18.0007 12.7502H12.7502V18.0007C12.7502 18.4149 12.4145 18.7507 12.0002 18.7507C11.586 18.7507 11.2502 18.4149 11.2502 18.0007V12.7502H6C5.58579 12.7502 5.25 12.4145 5.25 12.0002C5.25 11.586 5.58579 11.2502 6 11.2502H11.2502V6Z" fill="#343C54"/>
            </svg>
            Tambahkan
          </button>
          {/* Modal Form Add */}
          {openModalAdd && (
            <Modal isOpen={openModalAdd} onClose={closeModalAdd} className="max-w-[1200px] p-5 lg:p-10">
              <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
                Tambahkan
              </h4>
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-2 py-3">
                <div className="space-y-6">
                  <Label>Nomor Rekam Medis</Label>
                  <Input name="no_rekam_medis" type="text" placeholder="Nomor Rekam Medis"  onChange={handleChange}/>
                </div>
                <div className="space-y-6">
                  <Label>Nama</Label>
                  <Input name="nama" type="text"  placeholder="Nama"  onChange={handleChange}/>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-2 py-3">
                <div className="space-y-6">
                  <Label>Tanggal Masuk</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div> 
                      <DatePicker id="tgl-masuk-datepicker" placeholder="Tanggal Masuk" onChange={(dates, currentDateString) => setFormData((prev) => ({ ...prev, tgl_masuk: currentDateString })) } />
                    </div>
                    <div className="relative">
                      <Input name="waktu_masuk" type="time" id="tm"  onChange={handleChange}/>
                      <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                        <TimeIcon />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <Label>Tanggal Lahir</Label>
                  <div>
                    <DatePicker id="tgl-lahir-datepicker" placeholder="Tanggal Lahir" onChange={(dates, currentDateString) => setFormData((prev) => ({ ...prev, tgl_lahir: currentDateString })) }/>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-2 py-3">
                <div className="space-y-6">
                  <Label>Nama DPJP</Label>
                  <Input name="dpjp" type="text" placeholder="Nama DPJP"  onChange={handleChange}/>
                </div>
                <div className="space-y-6">
                  <Label>Nama PPJA</Label>
                  <Input name="ppja" type="text" placeholder="Nama PPJA"  onChange={handleChange}/>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-2 py-3">
                <div className="space-y-6">
                  <Label>Kamar</Label>
                  <div className="relative">
                    <Select options={options} placeholder="Kamar" className="dark:bg-dark-900" onChange={(val: string) => setFormData((prev) => ({ ...prev, kamar_id: val }))}/>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end w-full gap-3 mt-8">
                <Button size="sm" variant="outline" onClick={closeModalAdd}>
                  Batal
                </Button>
                <Button size="sm" onClick={handleSave}>
                  Simpan
                </Button>
              </div>
            </Modal>
          )}
          {/* Modal Success */}
          { openModalSuccess && (
            <Modal isOpen={openModalSuccess} onClose={closeModalSuccess} showCloseButton={false} className="max-w-[600px] p-5 lg:p-10">
            <div className="text-center">
              <div className="relative flex items-center justify-center z-1 mb-7">
                <svg
                  className="fill-success-50 dark:fill-success-500/15"
                  width="90"
                  height="90"
                  viewBox="0 0 90 90"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M34.364 6.85053C38.6205 -2.28351 51.3795 -2.28351 55.636 6.85053C58.0129 11.951 63.5594 14.6722 68.9556 13.3853C78.6192 11.0807 86.5743 21.2433 82.2185 30.3287C79.7862 35.402 81.1561 41.5165 85.5082 45.0122C93.3019 51.2725 90.4628 63.9451 80.7747 66.1403C75.3648 67.3661 71.5265 72.2695 71.5572 77.9156C71.6123 88.0265 60.1169 93.6664 52.3918 87.3184C48.0781 83.7737 41.9219 83.7737 37.6082 87.3184C29.8831 93.6664 18.3877 88.0266 18.4428 77.9156C18.4735 72.2695 14.6352 67.3661 9.22531 66.1403C-0.462787 63.9451 -3.30193 51.2725 4.49185 45.0122C8.84391 41.5165 10.2138 35.402 7.78151 30.3287C3.42572 21.2433 11.3808 11.0807 21.0444 13.3853C26.4406 14.6722 31.9871 11.951 34.364 6.85053Z"
                    fill=""
                    fillOpacity=""
                  />
                </svg>

                <span className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                  <svg
                    className="fill-success-600 dark:fill-success-500"
                    width="38"
                    height="38"
                    viewBox="0 0 38 38"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.9375 19.0004C5.9375 11.7854 11.7864 5.93652 19.0014 5.93652C26.2164 5.93652 32.0653 11.7854 32.0653 19.0004C32.0653 26.2154 26.2164 32.0643 19.0014 32.0643C11.7864 32.0643 5.9375 26.2154 5.9375 19.0004ZM19.0014 2.93652C10.1296 2.93652 2.9375 10.1286 2.9375 19.0004C2.9375 27.8723 10.1296 35.0643 19.0014 35.0643C27.8733 35.0643 35.0653 27.8723 35.0653 19.0004C35.0653 10.1286 27.8733 2.93652 19.0014 2.93652ZM24.7855 17.0575C25.3713 16.4717 25.3713 15.522 24.7855 14.9362C24.1997 14.3504 23.25 14.3504 22.6642 14.9362L17.7177 19.8827L15.3387 17.5037C14.7529 16.9179 13.8031 16.9179 13.2173 17.5037C12.6316 18.0894 12.6316 19.0392 13.2173 19.625L16.657 23.0647C16.9383 23.346 17.3199 23.504 17.7177 23.504C18.1155 23.504 18.4971 23.346 18.7784 23.0647L24.7855 17.0575Z"
                      fill=""
                    />
                  </svg>
                </span>
              </div>
              <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
                Berhasil menambahkan pasien
              </h4>
              {/* <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                Lorem ipsum dolor sit amet consectetur. Feugiat ipsum libero tempor
                felis risus nisi non. Quisque eu ut tempor curabitur.
              </p> */}

              <div className="flex items-center justify-center w-full gap-3 mt-7">
                <button
                  type="button"
                  className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-success-500 shadow-theme-xs hover:bg-success-600 sm:w-auto"
                >
                  Tutup
                </button>
              </div>
            </div>
          </Modal>
          )}
          {/* Modal Failed */}
          { openModalFailed && (
            <Modal isOpen={openModalFailed} onClose={closeModalFailed} className="max-w-[600px] p-5 lg:p-10">
              <div className="text-center">
                <div className="relative flex items-center justify-center z-1 mb-7">
                  <svg
                    className="fill-error-50 dark:fill-error-500/15"
                    width="90"
                    height="90"
                    viewBox="0 0 90 90"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M34.364 6.85053C38.6205 -2.28351 51.3795 -2.28351 55.636 6.85053C58.0129 11.951 63.5594 14.6722 68.9556 13.3853C78.6192 11.0807 86.5743 21.2433 82.2185 30.3287C79.7862 35.402 81.1561 41.5165 85.5082 45.0122C93.3019 51.2725 90.4628 63.9451 80.7747 66.1403C75.3648 67.3661 71.5265 72.2695 71.5572 77.9156C71.6123 88.0265 60.1169 93.6664 52.3918 87.3184C48.0781 83.7737 41.9219 83.7737 37.6082 87.3184C29.8831 93.6664 18.3877 88.0266 18.4428 77.9156C18.4735 72.2695 14.6352 67.3661 9.22531 66.1403C-0.462787 63.9451 -3.30193 51.2725 4.49185 45.0122C8.84391 41.5165 10.2138 35.402 7.78151 30.3287C3.42572 21.2433 11.3808 11.0807 21.0444 13.3853C26.4406 14.6722 31.9871 11.951 34.364 6.85053Z"
                      fill=""
                      fillOpacity=""
                    />
                  </svg>
      
                  <span className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                    <svg
                      className="fill-error-600 dark:fill-error-500"
                      width="38"
                      height="38"
                      viewBox="0 0 38 38"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.62684 11.7496C9.04105 11.1638 9.04105 10.2141 9.62684 9.6283C10.2126 9.04252 11.1624 9.04252 11.7482 9.6283L18.9985 16.8786L26.2485 9.62851C26.8343 9.04273 27.7841 9.04273 28.3699 9.62851C28.9556 10.2143 28.9556 11.164 28.3699 11.7498L21.1198 18.9999L28.3699 26.25C28.9556 26.8358 28.9556 27.7855 28.3699 28.3713C27.7841 28.9571 26.8343 28.9571 26.2485 28.3713L18.9985 21.1212L11.7482 28.3715C11.1624 28.9573 10.2126 28.9573 9.62684 28.3715C9.04105 27.7857 9.04105 26.836 9.62684 26.2502L16.8771 18.9999L9.62684 11.7496Z"
                        fill=""
                      />
                    </svg>
                  </span>
                </div>
      
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
                  Gagal menambahkan pasien
                </h4>
                {/* <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                  Lorem ipsum dolor sit amet consectetur. Feugiat ipsum libero tempor
                  felis risus nisi non. Quisque eu ut tempor curabitur.
                </p> */}
      
                <div className="flex items-center justify-center w-full gap-3 mt-7">
                  <button
                    type="button"
                    className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-error-500 shadow-theme-xs hover:bg-error-600 sm:w-auto"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </Modal>
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

          <TableBody>
            {pasien.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.no_rekam_medis}</TableCell>
                <TableCell>{p.nama}</TableCell>
                <TableCell>
                  {moment(new Date(p.tgl_masuk)).format("DD-MM-YYYY HH:mm")}
                </TableCell>
                <TableCell>
                  {moment(new Date(p.tgl_lahir)).format("DD-MM-YYYY")}
                </TableCell>
                <TableCell>{p.dpjp}</TableCell>
                <TableCell>{p.ppja}</TableCell>
                <TableCell>{p.master_kamar.nama}</TableCell>
                <TableCell>
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
