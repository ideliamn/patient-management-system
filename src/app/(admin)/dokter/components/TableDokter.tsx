"use client";

import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import Pagination from "@/components/tables/Pagination";

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

interface TableDokterProps {
    dokter: Dokter[];
    handleEdit: (id: number) => void;
    handleDelete: (id: number) => void;
}

export default function TableDokter({ dokter, handleEdit, handleDelete }: TableDokterProps) {
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
                            Kode
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
                            Spesialisasi
                        </TableCell>
                        <TableCell
                            isHeader
                            className="py-3 font-medium text-gray-500 text-center text-theme-lg dark:text-gray-400"
                        >
                            No SIP
                        </TableCell>
                        <TableCell
                            isHeader
                            className="py-3 font-medium text-gray-500 text-center text-theme-lg dark:text-gray-400"
                        >
                            No STR
                        </TableCell>
                        <TableCell
                            isHeader
                            className="py-3 font-medium text-gray-500 text-center text-theme-lg dark:text-gray-400"
                        >
                            Status
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
                    {dokter.map((p) => (
                        <TableRow key={p.id}>
                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                {p.kode}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                {p.nama}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                {p.master_spesialisasi.nama}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                {p.no_sip}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                {p.no_str}
                            </TableCell>
                            <TableCell className={
                                p.status == 1
                                    ? "px-4 py-3 text-start text-theme-sm text-green-500 dark:text-green-400"
                                    : "px-4 py-3 text-start text-theme-sm text-red-500 dark:text-red-400"
                            }>
                                {p.status == 1 ? "Aktif" : "Non Aktif"}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                                <div className="grid grid-cols-2 gap-2 py-3">
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
        </div >
    )
}