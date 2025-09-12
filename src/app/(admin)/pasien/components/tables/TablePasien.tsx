"use client";

import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import moment from "moment";
import Button from "@/components/ui/button/Button";

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
    master_kamar: { nama: string };
}

interface TablePasienProps {
    pasien: Pasien[];
    handlePulang: (id: number) => void;
    handleEdit: (id: number) => void;
    handleDelete: (id: number) => void;
}

export default function TablePasien({ pasien, handlePulang, handleEdit, handleDelete }: TablePasienProps) {
    return (
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
                            Action
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
                                {moment(new Date(p.tgl_masuk)).format("DD MMMM YYYY HH:mm")}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                {moment(new Date(p.tgl_lahir)).format("DD MMMM YYYY")}
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
                            <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                                <div className="grid grid-cols-2 gap-2 py-3">
                                    <div className="col-span-2">
                                        <Button size="xs" className="bg-green-500 hover:bg-green-600 text-white" onClick={() => handlePulang(p.id)}>
                                            Pulang
                                        </Button>
                                    </div>
                                    <Button size="xs" className="bg-yellow-500 hover:bg-yellow-600 text-white" onClick={() => handleEdit(p.id)}>
                                        Edit
                                    </Button>
                                    <Button size="xs" className="bg-red-500 hover:bg-red-900 text-white" onClick={() => handleDelete(p.id)}>
                                        Delete
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}