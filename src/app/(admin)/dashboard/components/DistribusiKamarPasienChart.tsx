"use client";
import React, { useEffect, useState } from "react";

import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
import LoadingPartial from "@/components/common/LoadingPartial";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

export default function DistribusiKamarPasienChart() {
    const [loading, setLoading] = useState(false);
    const [series, setSeries] = useState([]);
    const [labels, setLabels] = useState([]);

    type DistribusiChartData = {
        nama_kamar: string;
        jumlah_pasien: number;
    };

    const getDistribusiChart = async () => {
        const distribusiChart = await fetch("/api/dashboard/chart/distribusi_pasien_kamar", {
            method: "GET",
        })
        const distribusiChartResult = await distribusiChart.json()
        const jumlahPasien = distribusiChartResult.map((item: DistribusiChartData) => item.jumlah_pasien)
        setSeries(jumlahPasien);
        const namaKamar = distribusiChartResult.map((item: DistribusiChartData) => item.nama_kamar)
        setLabels(namaKamar);
    }

    useEffect(() => {
        setLoading(true);
        getDistribusiChart();
    }, [])

    useEffect(() => {
        if (series?.length > 0 && labels?.length > 0) {
            setLoading(false);
        }
    }, [series, labels])

    const options: ApexOptions = {
        legend: {
            show: true, // Hide legend
            position: "bottom",
            horizontalAlign: "left",
            labels: {
                colors: "#ffffff", // ⬅️ warna font legend
            },
        },
        // colors: ["blue-30"], // Define line colors
        chart: {
            fontFamily: "Outfit, sans-serif",
            height: 310,
            type: "pie", // Set the chart type to 'line'
            toolbar: {
                show: false, // Hide chart toolbar
            },
            foreColor: "#ffffff"
        },
        dataLabels: {
            enabled: true, // Disable data labels
            formatter: (val: number) => `${val.toFixed(1)}%`,
            style: {
                colors: ["#ffffff"], // ⬅️ warna font di label persentase
            },
        },
        labels: labels
    };

    return (
        <div className="max-w-full overflow-x-auto custom-scrollbar relative">
            {loading && <LoadingPartial />}
            <div id="chartEight">
                <ReactApexChart
                    options={options}
                    series={series}
                    type="pie"
                    height={310}
                />
            </div>
        </div>
    );
}
