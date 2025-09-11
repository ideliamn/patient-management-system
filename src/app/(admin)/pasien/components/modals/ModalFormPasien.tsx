"use client";

import DatePicker from "@/components/form/date-picker";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import SearchableSelect, { SelectOption } from "@/components/ui/select/SearchableSelect";
import { TimeIcon } from "@/icons";
import { useEffect, useState } from "react";

interface FormDataType {
    id?: number;
    no_rekam_medis: string;
    nama: string;
    tgl_masuk?: string;
    waktu_masuk?: string;
    tgl_lahir?: string;
    dpjp?: string;
    ppja?: string;
    kamar_id?: string;
}

interface ModalFormPasienProps {
    isOpen: boolean;
    onClose: () => void;
    handleInsert: (data: FormDataType) => void;
    handleUpdate: (data: FormDataType) => void;
    initialData?: FormDataType | null;
    options: { label: string; value: string }[];
}

export default function ModalFormPasien({
    isOpen,
    onClose,
    handleInsert,
    handleUpdate,
    initialData,
    options,
}: ModalFormPasienProps) {
    const [formData, setFormData] = useState<FormDataType>({
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

    useEffect(() => {
        if (initialData && initialData.id !== 0) {
            setFormData(initialData);
        } else {
            const now = new Date();
            const today = now.toISOString().split("T")[0];
            const timeNow = now.toTimeString().slice(0, 5);

            setFormData({
                id: 0,
                no_rekam_medis: "",
                nama: "",
                tgl_masuk: today,
                waktu_masuk: timeNow,
                tgl_lahir: "",
                dpjp: "",
                ppja: "",
                kamar_id: "",
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: name === "nama" ? value.toUpperCase() : value }));
    };

    const handleClickSaveUpdate = () => {
        initialData && initialData.id !== 0 ? handleUpdate(formData) : handleInsert(formData)
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[1200px] p-5 lg:p-10 transition-all duration-300">
            <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
                {initialData ? "Edit Data" : "Tambahkan"}
            </h4>
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2 py-3">
                <div className="space-y-6">
                    <Label>Nomor Rekam Medis</Label>
                    <Input name="no_rekam_medis" type="text" placeholder="Nomor Rekam Medis" onChange={handleChange} defaultValue={formData.no_rekam_medis} />
                </div>
                <div className="space-y-6">
                    <Label>Nama</Label>
                    <Input name="nama" type="text" placeholder="Nama" onChange={handleChange} defaultValue={formData.nama} className={"uppercase"} />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2 py-3">
                <div className="space-y-6">
                    <Label>Tanggal Masuk</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <DatePicker id="tgl-masuk-datepicker" placeholder="Tanggal Masuk" defaultDate={formData.tgl_masuk} onChange={(dates, currentDateString) => setFormData((prev) => ({ ...prev, tgl_masuk: currentDateString }))} />
                        </div>
                        <div className="relative">
                            <Input name="waktu_masuk" defaultValue={formData.waktu_masuk} type="time" id="tm" onChange={handleChange} />
                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <TimeIcon />
                            </span>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <Label>Tanggal Lahir</Label>
                    <div>
                        <DatePicker id="tgl-lahir-datepicker" placeholder="Tanggal Lahir" defaultDate={formData.tgl_lahir}
                            // onChange={(dates, currentDateString) => setFormData((prev) => ({ ...prev, tgl_lahir: currentDateString }))}
                            onChange={(_, currentDateString) => setFormData((prev) => ({ ...prev, tgl_lahir: currentDateString }))}
                        />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2 py-3">
                <div className="space-y-6">
                    <Label>Nama DPJP</Label>
                    <Input name="dpjp" type="text" placeholder="Nama DPJP" defaultValue={formData.dpjp} onChange={handleChange} />
                </div>
                <div className="space-y-6">
                    <Label>Nama PPJA</Label>
                    <Input name="ppja" type="text" placeholder="Nama PPJA" defaultValue={formData.ppja} onChange={handleChange} />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2 py-3">
                <div className="space-y-6">
                    <Label>Kamar</Label>
                    <div className="relative">
                        {/* <Select options={options} placeholder="Kamar" className="dark:bg-dark-900" value={formData.kamar_id}
                            onChange={(val: string) => setFormData((prev) => ({ ...prev, kamar_id: val }))}
                        /> */}
                        <SearchableSelect
                            className="dark:bg-dark-900"
                            options={options}
                            placeholder="Pilih kamar"
                            value={options.find((opt) => opt.value === formData.kamar_id) || null}
                            onChange={(opt: SelectOption | null) =>
                                setFormData((prev) => ({ ...prev, kamar_id: opt?.value || "" }))
                            }
                        />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-end w-full gap-3 mt-8">
                <Button size="sm" variant="outline" onClick={onClose}>
                    Batal
                </Button>
                <Button size="sm" onClick={handleClickSaveUpdate}>
                    {initialData && initialData.id !== 0 ? "Update" : "Simpan"}
                </Button>
            </div>
        </Modal>
    )
}