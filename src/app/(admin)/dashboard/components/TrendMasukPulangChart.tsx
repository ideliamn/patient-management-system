"use client";
import React, { useEffect, useState } from "react";

import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
import LoadingPartial from "@/components/common/LoadingPartial";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

export default function TrendMasukPulangChart() {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [series, setSeries] = useState<{ name: string; data: number[] }[]>([]);

    type PasienTrendData = {
        tanggal: string;
        pasien_masuk: number;
        pasien_keluar: number;
    };

    const getTrendMasukPulangChart = async () => {
        const now = new Date();
        const today = now.toISOString().split("T")[0];
        const interval = 30;
        const trendMasukPulang = await fetch("/api/dashboard/chart/trend_masuk_pulang", {
            method: "POST",
            body: JSON.stringify({
                date: today,
                interval: 30
            })
        })
        const trendMasukPulangResult = await trendMasukPulang.json()
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' }
        const x_axis = trendMasukPulangResult.map((item: PasienTrendData) => {
            if (interval > 7) {
                const d = new Date(item.tanggal);
                const day = String(d.getDate());
                const month = String(d.getMonth() + 1);
                return `${day}/${month}`;
            }
            else {
                return new Date(item.tanggal).toLocaleDateString('id-ID', options)
            }
        });

        setCategories(x_axis)
        setSeries([
            {
                name: 'Masuk',
                data: trendMasukPulangResult.map((item: PasienTrendData) => item.pasien_masuk)
            },
            {
                name: 'Pulang',
                data: trendMasukPulangResult.map((item: PasienTrendData) => item.pasien_keluar)
            }
        ])
    }

    useEffect(() => {
        setLoading(true);
        getTrendMasukPulangChart();
    }, [])

    useEffect(() => {
        if (series[0]?.data?.length > 0 && categories?.length > 0) {
            setLoading(false);
        }
    }, [series, categories])

    const options: ApexOptions = {
        legend: {
            show: false, // Hide legend
            position: "top",
            horizontalAlign: "left",
        },
        colors: ["#465FFF", "#9CB9FF"], // Define line colors
        chart: {
            fontFamily: "Outfit, sans-serif",
            height: 310,
            type: "line", // Set the chart type to 'line'
            toolbar: {
                show: false, // Hide chart toolbar
            },
        },
        stroke: {
            curve: "smooth", // Define the line style (straight, smooth, or step)
            width: [2, 2], // Line width for each dataset
        },
        fill: {
            type: "gradient",
            gradient: {
                opacityFrom: 0.55,
                opacityTo: 0,
            },
        },
        markers: {
            size: 0, // Size of the marker points
            strokeColors: "#fff", // Marker border color
            strokeWidth: 2,
            hover: {
                size: 6, // Marker size on hover
            },
        },
        grid: {
            xaxis: {
                lines: {
                    show: false, // Hide grid lines on x-axis
                },
            },
            yaxis: {
                lines: {
                    show: true, // Show grid lines on y-axis
                },
            },
        },
        dataLabels: {
            enabled: false, // Disable data labels
        },
        tooltip: {
            enabled: true, // Enable tooltip
            x: {
                format: "dd MMM yyyy", // Format for x-axis tooltip
            },
        },
        xaxis: {
            type: "category", // Category-based x-axis
            categories: categories,
            axisBorder: {
                show: false, // Hide x-axis border
            },
            axisTicks: {
                show: false, // Hide x-axis ticks
            },
            tooltip: {
                enabled: false, // Disable tooltip for x-axis points
            },
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: "12px", // Adjust font size for y-axis labels
                    colors: ["#6B7280"], // Color of the labels
                },
            },
            title: {
                text: "", // Remove y-axis title
                style: {
                    fontSize: "0px",
                },
            },
        },
    };

    // const series = [
    //     {
    //         name: "Sales",
    //         data: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235],
    //     },
    //     {
    //         name: "Revenue",
    //         data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140],
    //     },
    // ];
    return (
        <div className="max-w-full overflow-x-auto custom-scrollbar relative">
            {loading && <LoadingPartial />}
            <div id="chartEight">
                <ReactApexChart
                    options={options}
                    series={series}
                    type="area"
                    height={310}
                />
            </div>
        </div>
    );
}
