"use client";
import React, { useEffect, useState } from "react";

import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
import LoadingPartial from "@/components/common/LoadingPartial";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

export default function DokumenKepulanganChart() {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [series, setSeries] = useState<{ name: string; data: number[] }[]>([]);

    type DokumenKepulanganData = {
        nama_dokumen: string;
        jumlah: number;
    };

    const getDokumenKepulanganChart = async () => {
        const dokumenKepulangan = await fetch("/api/dashboard/chart/dokumen_kepulangan", {
            method: "GET"
        })
        const dokumenKepulanganResult = await dokumenKepulangan.json()
        const x_axis = dokumenKepulanganResult.map((item: DokumenKepulanganData) => item.nama_dokumen)
        setCategories(x_axis)
        setSeries([
            {
                name: 'Jumlah',
                data: dokumenKepulanganResult.map((item: DokumenKepulanganData) => item.jumlah)
            }
        ])
    }

    useEffect(() => {
        setLoading(true);
        getDokumenKepulanganChart();
    }, [])

    useEffect(() => {
        if (series[0]?.data?.length > 0 && categories?.length > 0) {
            setLoading(false);
        }
    }, [series, categories])

    const options: ApexOptions = {
        colors: ["#465fff"],
        chart: {
            fontFamily: "Outfit, sans-serif",
            type: "bar",
            height: 180,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "50%",
                borderRadius: 3,
                borderRadiusApplication: "end",
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 4,
            colors: ["transparent"],
        },
        xaxis: {
            categories: categories,
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            // labels: {
            //     rotate: 0, // ⬅️ bikin teks horizontal normal
            //     style: {
            //         colors: "#ffffff",
            //         fontSize: "9px",
            //     },
            // },
        },
        legend: {
            // show: true,
            position: "top",
            // horizontalAlign: "center",
            fontFamily: "Outfit",
        },
        yaxis: {
            title: {
                text: undefined,
            },
        },
        grid: {
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        fill: {
            opacity: 1,
        },

        tooltip: {
            x: {
                show: false,
            },
            y: {
                formatter: (val: number) => `${val}`,
            },
        },
    };
    // const series = [
    //     {
    //         name: "Sales",
    //         data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
    //     },
    // ];
    return (
        <div className="max-w-full overflow-x-auto custom-scrollbar relative">
            {loading && <LoadingPartial />}
            <div id="chartOne">
                <ReactApexChart
                    options={options}
                    series={series}
                    type="bar"
                    height={330}
                />
            </div>
        </div>
    );
}
