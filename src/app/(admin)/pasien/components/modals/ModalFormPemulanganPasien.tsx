"use client";

import DatePicker from "@/components/form/date-picker";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { TimeIcon } from "@/icons";
import { useEffect, useState } from "react";

interface FormDataPulangType {
    id?: number;
    nama_pasien?: string;
    pasien_id?: number;
    nama_penerima?: string;
    kontak_penerima?: string;
    tgl_pulang?: string;
    waktu_pulang?: string;
    dokumen?: number[];
    createdBy?: string;
    updatedBy?: string;
}

interface ModalFormPemulanganPasienProps {
    isOpen: boolean;
    onClose: () => void;
    handleInsert: (data: FormDataPulangType) => void;
    handleUpdate: (data: FormDataPulangType) => void;
    initialData?: FormDataPulangType | null;
    optionsDokumen: { label: string; value: string }[];
}

export default function ModalFormPemulanganPasien({
    isOpen,
    onClose,
    handleInsert,
    handleUpdate,
    initialData,
    optionsDokumen,
}: ModalFormPemulanganPasienProps) {
    const [formDataPulang, setFormDataPulang] = useState<FormDataPulangType>({
        id: 0,
        nama_pasien: "",
        pasien_id: 0,
        nama_penerima: "",
        kontak_penerima: "",
        tgl_pulang: "",
        waktu_pulang: "",
        dokumen: [],
        createdBy: "",
        updatedBy: ""
    });

    const [selectedDokumen, setSelectedDokumen] = useState<string[]>([]);

    useEffect(() => {
        console.log("initialData: " + JSON.stringify(initialData))
        if (initialData) {
            console.log("initialdata pemulangan: " + JSON.stringify(initialData))
            setFormDataPulang(initialData);

            if (initialData.dokumen) {
                setSelectedDokumen(initialData.dokumen.map((d) => d.toString()));
            }
        } else {
            const now = new Date();
            const today = now.toISOString().split("T")[0];
            const timeNow = now.toTimeString().slice(0, 5);

            setFormDataPulang({
                id: 0,
                nama_pasien: "",
                pasien_id: 0,
                nama_penerima: "",
                kontak_penerima: "",
                tgl_pulang: today,
                waktu_pulang: timeNow,
                dokumen: [],
            });
            setSelectedDokumen([]);
        }
    }, [initialData, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormDataPulang((prev) => ({ ...prev, [name]: name === "nama_penerima" ? value.toUpperCase() : value }));
    };

    const handleClickSaveUpdate = () => {
        const finalData = {
            ...formDataPulang,
            dokumen: selectedDokumen.map((d) => Number(d))
        };

        initialData && initialData.id !== 0
            ? handleUpdate(finalData)
            : handleInsert(finalData);

        onClose();
    }

    const handleDokumenChange = (id: string, checked: boolean) => {
        setSelectedDokumen((prev) =>
            checked ? [...prev, id] : prev.filter((item) => item !== id)
        );
    };

    console.log("formdata pulang: " + JSON.stringify(formDataPulang))


    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[1200px] p-5 lg:p-10 transition-all duration-300">
            <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
                Pemulangan Pasien
            </h4>
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2 py-3">
                <div className="space-y-6">
                    <Label>Nama Pasien</Label>
                    <Input name="nama_pasien" type="text" placeholder="Nama Pasien" onChange={handleChange} defaultValue={formDataPulang.nama_pasien} className={"uppercase"} disabled={true} />
                </div>
                <div className="space-y-6">
                    <Label>Nama Penerima</Label>
                    <Input name="nama_penerima" type="text" placeholder="Nama Penerima" onChange={handleChange} defaultValue={formDataPulang.nama_penerima} className={"uppercase"} />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2 py-3">
                <div className="space-y-6">
                    <Label>Kontak Penerima</Label>
                    <Input name="kontak_penerima" type="text" placeholder="Kontak Penerima" defaultValue={formDataPulang.kontak_penerima} onChange={handleChange} />
                </div>
                <div className="space-y-6">
                    <Label>Tanggal Kepulangan</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <DatePicker id="tgl-pulang-datepicker" placeholder="Tanggal Pulang" defaultDate={formDataPulang.tgl_pulang} onChange={(dates, currentDateString) => setFormDataPulang((prev) => ({ ...prev, tgl_pulang: currentDateString }))} />
                        </div>
                        <div className="relative">
                            <Input name="waktu_pulang" defaultValue={formDataPulang.waktu_pulang} type="time" id="tm" onChange={handleChange} />
                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <TimeIcon />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2 py-3">
                <div className="space-y-6">
                    <Label>Dokumen</Label>
                    <div className="relative">
                        <div className="space-y-2">
                            {optionsDokumen.map((doc) => (
                                <Checkbox
                                    key={doc.value}
                                    label={doc.label}
                                    checked={selectedDokumen.includes(doc.value)}
                                    onChange={(checked) => handleDokumenChange(doc.value, checked)}
                                />
                            ))}
                        </div>

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