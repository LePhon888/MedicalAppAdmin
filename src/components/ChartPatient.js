// BarChart.js
import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Alert } from 'react-bootstrap';
import moment from 'moment';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

const ChartPatient = ({ data, title, month, quarter }) => {

    console.log(945791, data)

    const formatDate = (num) => {
        if (month > 0)
            return `Tháng ${num}`;
        else if (quarter > 0)
            return `Quý ${num}`;
        else
            return `Năm ${num}`
    };

    const getLabels = () => {
        if (month > 0)
            return Array.from({ length: 12 }, (_, i) => formatDate(i + 1));
        if (quarter > 0)
            return Array.from({ length: 4 }, (_, i) => formatDate(i + 1));
        return data
            .filter(value => value.length === 2)
            .map(value => formatDate(value[0]));
    };

    const labels = getLabels();

    console.log(labels);

    const totalPatientsData = data.filter(value => value.length === 2);
    const detailedData = data.filter(value => value.length > 2);

    console.log(detailedData)

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Giờ cao điểm bệnh nhân',
                data: labels.map(label => {
                    const dataItem = detailedData.find(v => formatDate(v[0]) == label);
                    return dataItem ? dataItem[2] : 0;
                }),
                fill: true,
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                pointBackgroundColor: "rgba(255, 99, 132, 1)",
                pointRadius: 6,
            },
            {
                label: title,
                data: labels.map(label => {
                    const dataItem = totalPatientsData.find(v => formatDate(v[0]) == label);
                    return dataItem ? dataItem[1] : 0;
                }),
                fill: true,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                pointBackgroundColor: "rgba(75, 192, 192, 1)",
                pointRadius: 6,
            },
        ],
    };


    const customTooltip = {
        callbacks: {
            title: function (context) {
                if (context[0].datasetIndex === 0) {
                    const match = detailedData.find(value => formatDate(value[0]) === context[0].label);
                    if (match && match[1]) {
                        return `${formatDate(match[0])}, ${match[1]}`;
                    }
                }
                return context[0].label;
            },
        },
    };






    const options = {
        responsive: true,
        scales: {
            y: {
                min: 0,
                beginAtZero: true,
            },
        },
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: customTooltip, // Add the custom tooltip
        },
    };



    const noResult = () => {
        return (
            <Alert
                variant="danger"
                style={{
                    width: "100%",
                    height: "10vh",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Alert.Heading>Không có dữ liệu....</Alert.Heading>
            </Alert>
        );
    };

    return (
        <div style={{ display: 'flex', justifyContent: "center", height: 400 }} className="mt-3">
            {data.length === 0 ? (
                noResult()
            ) : (
                <Line data={chartData} options={options} />
            )}
        </div>
    );
};

export default ChartPatient;
