"use client"
import TrendPasienMasukPulangChart from "./components/TrendMasukPulangChart";
import ComponentCard from "@/components/common/ComponentCard";
import KPICard from "./components/KPICard";
import DistribusiKamarPasienChart from "./components/DistribusiKamarPasienChart";
import DokumenKepulanganChart from "./components/DokumenKepulanganChart";
import AverageLOSChart from "./components/AverageLOSChart";

export default function Dashboard() {
    return (
        <div className="space-y-6">
            <KPICard />
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                <ComponentCard title="Trend Pasien Masuk & Pulang">
                    <TrendPasienMasukPulangChart />
                </ComponentCard>
                <ComponentCard title="Distribusi Kamar & Pasien">
                    <DistribusiKamarPasienChart />
                </ComponentCard>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                <ComponentCard title="Dokumen Kepulangan Pasien">
                    <DokumenKepulanganChart />
                </ComponentCard>
                <ComponentCard title="Average LOS (Length of Stay)">
                    <AverageLOSChart />
                </ComponentCard>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
            </div>
        </div>
    )
}