"use client"

import LoadingPartial from "@/components/common/LoadingPartial";
import Badge from "@/components/ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, CheckCircleIcon, GroupIcon, UserCircleIcon } from "@/icons";
import { useEffect, useState } from "react";

export default function KPICard() {
    const [loading, setLoading] = useState(true);
    const [dataKpi, setDataKpi] = useState({
        totalPasien: 0,
        pasienMasuk: 0,
        pasienPulang: 0,
        bor: 0
    });

    const getKpi = async () => {
        const now = new Date();
        const today = now.toISOString().split("T")[0];
        const kpi = await fetch("/api/dashboard/kpi", {
            method: "POST",
            body: JSON.stringify({
                date: today
            })
        })
        const kpiResult = await kpi.json()
        setDataKpi({
            totalPasien: kpiResult?.totalPasien,
            pasienMasuk: kpiResult?.pasienMasuk,
            pasienPulang: kpiResult?.pasienPulang,
            bor: kpiResult?.bor
        })
    }

    useEffect(() => {
        setLoading(true)
        getKpi()
    }, [])

    useEffect(() => {
        if (dataKpi?.totalPasien > 0) {
            setLoading(false)
        }
    }, [dataKpi])

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Card Total Pasien */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 relative">
                {loading && <LoadingPartial />}
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
                </div>

                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Total Pasien
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            {dataKpi?.totalPasien}
                        </h4>
                    </div>
                    <Badge color="success">
                        <ArrowUpIcon />
                        11.01%
                    </Badge>
                </div>
            </div>

            {/* Card Pasien Masuk Hari Ini */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 relative">
                {loading && <LoadingPartial />}
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    <UserCircleIcon className="text-gray-800 size-6 dark:text-white/90" />
                </div>

                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Pasien Masuk Hari Ini
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            {dataKpi?.pasienMasuk}
                        </h4>
                    </div>
                    <Badge color="error">
                        <ArrowDownIcon />
                        3.25%
                    </Badge>
                </div>
            </div>

            {/* Card Pasien Pulang Hari Ini */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 relative">
                {loading && <LoadingPartial />}
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    <CheckCircleIcon className="text-gray-800 size-6 dark:text-white/90" />
                </div>

                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Pasien Pulang Hari Ini
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            {dataKpi?.pasienPulang}
                        </h4>
                    </div>
                    <Badge color="error">
                        <ArrowDownIcon />
                        3.25%
                    </Badge>
                </div>
            </div>

            {/* Bed Occupancy Rate */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 relative">
                {loading && <LoadingPartial />}
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
                </div>

                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Bed Occupancy Rate
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            {dataKpi?.bor}
                        </h4>
                    </div>
                    <Badge color="error">
                        <ArrowDownIcon />
                        3.25%
                    </Badge>
                </div>
            </div>
        </div>
    )
}