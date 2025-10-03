"use client";

import Loading from "@/components/common/Loading";
import ModalFailed from "@/components/modals/ModalFailed";
import ModalSuccess from "@/components/modals/ModalSuccess";
import { useState, useEffect } from "react";
import ModalWarning from "@/components/modals/ModalWarning";
import { useProfile } from "@/context/ProfileContext";
import TableDokter from "./components/TableDokter";
import Pagination from "@/components/tables/Pagination";
import SelectPagination from "@/components/form/SelectPagination";

interface Dokter {
    id: number;
    kode: string;
    nama: string;
    master_spesialisasi: { nama: string };
    no_sip: string;
    no_str: string;
    jenis_kelamin: string;
    no_hp: string;
    email: string;
    status: number;
    image_url: string;
}

interface Spesialisasi {
    id: number;
    nama: string;
}

export default function Dokter() {
    const { profile } = useProfile();
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalPage, setTotalPage] = useState(10);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [dokter, setDokter] = useState<Dokter[]>([]);
    const [openModalSuccess, setOpenModalSuccess] = useState(false);
    const closeModalSuccess = () => { setOpenModalSuccess(false) };
    const [successMessage, setSuccessMessage] = useState("");
    const [openModalFailed, setOpenModalFailed] = useState(false);
    const closeModalFailed = () => { setOpenModalFailed(false) };
    const [failedMessage, setFailedMessage] = useState("");
    const [openModalWarning, setOpenModalWarning] = useState(false);
    const closeModalWarning = () => { setOpenModalWarning(false) };
    const [spOptions, setSpOptions] = useState<{ value: string; label: string }[]>([]);
    const [formData, setFormData] = useState({
        id: 0,
        kode: "",
        nama: "",
        spesialisasi_id: 0,
        no_sip: "",
        no_str: "",
        jenis_kelamin: "",
        no_hp: "",
        email: "",
        status: 0,
        image_url: "",
        created_by: profile?.nip,
        updated_by: profile?.nip
    });
    const [openModalAdd, setOpenModalAdd] = useState(false);
    const closeModalAdd = () => {
        console.log("close modal add")
        setFormData({
            id: 0,
            kode: "",
            nama: "",
            spesialisasi_id: 0,
            no_sip: "",
            no_str: "",
            jenis_kelamin: "",
            no_hp: "",
            email: "",
            status: 0,
            image_url: "",
            created_by: profile?.nip,
            updated_by: profile?.nip
        })
        console.log("form data, " + JSON.stringify(formData))
        setOpenModalAdd(false)
    };

    const sizeOnChange = async (value: number) => {
        console.log("count per page: ", value)
        setSize(value)
        refreshTabelDokter()
    };

    const pageOnChange = async (value: number) => {
        console.log("current page: ", value)
        setPage(value)
        refreshTabelDokter()
    }

    const refreshTabelDokter = () => {
        setLoading(true);
        const fetchData = async () => {
            try {
                // get dokter
                const getDokter = await fetch(`/api/dokter?page=${page}&size=${size}`);
                const dataDokter = await getDokter.json();
                console.log("dataDokter: ", JSON.stringify(dataDokter))
                setDokter(dataDokter?.data);
                setTotalPage(dataDokter?.totalPage)
                // get spesialisasi
                const getSp = await fetch("/api/spesialisasi");
                const dataSp: Spesialisasi[] = await getSp.json();
                const formattedSpOptions = dataSp.map((k) => ({
                    value: String(k.id),
                    label: k.nama,
                }));
                setSpOptions(formattedSpOptions);
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
        const res = await fetch("/api/dokter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        if (res.ok) {
            setSuccessMessage("Sukses menambahkan dokter");
            setLoading(false);
            setOpenModalSuccess(true);
        } else {
            setFailedMessage("Gagal menambahkan dokter");
            setOpenModalFailed(true);
        }
        closeModalAdd();
        refreshTabelDokter();
    };

    const handleEdit = async (id: number) => {
        setLoading(true)
        const res = await fetch(`/api/dokter/${id}`);
        const data = await res.json();
        setFormData({
            id: 0,
            kode: data.kode,
            nama: data.nama,
            spesialisasi_id: data.spesialisasi_id,
            no_sip: data.no_sip,
            no_str: data.no_str,
            jenis_kelamin: data.jenis_kelamin,
            no_hp: data.no_hp,
            email: data.email,
            status: data.status,
            image_url: data.image_url,
            created_by: profile?.nip,
            updated_by: profile?.nip
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
        const res = await fetch("/api/dokter", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        if (res.ok) {
            setSuccessMessage("Sukses memperbarui data dokter");
            setLoading(false);
            setOpenModalSuccess(true);
        } else {
            setFailedMessage("Gagal memperbarui dokter");
            setOpenModalFailed(true);
        }
        closeModalAdd();
        refreshTabelDokter();
    };

    const saveDelete = async () => {
        console.log("save delete")
        if (deleteId) {
            console.log("delete id", deleteId)
            setLoading(true);
            const res = await fetch(`/api/dokter/${deleteId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setSuccessMessage("Sukses mengahapus dokter");
                setLoading(false);
                setOpenModalSuccess(true);
            } else {
                setFailedMessage("Gagal menghapus dokter");
                setOpenModalFailed(true);
            }
            closeModalAdd();
            refreshTabelDokter();
        }
        else {
            console.log("gak ada delete id")
        }
    };

    useEffect(() => {
        refreshTabelDokter();
    }, []);

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            {loading && <Loading />}
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Daftar Dokter
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
                    <SelectPagination
                        onChange={sizeOnChange}
                        value={size}
                    />
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
                            message="Ingin menghapus dokter?"
                            yesButtonText="Ya"
                            noButtonText="Tidak"
                            handleYes={() => deleteId && saveDelete()}
                            handleNo={closeModalWarning}
                        />
                    )}
                </div>
            </div>
            {/* Table Dokter */}
            <TableDokter
                dokter={dokter}
                handleEdit={(id: number) => handleEdit(id)}
                handleDelete={(id: number) => handleDelete(id)}
            />
            <div className="flex justify-center mt-4">
                <Pagination
                    currentPage={1}
                    totalPages={10}
                    onPageChange={pageOnChange}
                />
            </div>
        </div>
    );
}
