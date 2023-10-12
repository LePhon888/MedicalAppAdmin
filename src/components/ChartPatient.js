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

    console.log(data)

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
            return Array.from({ length: 12 }, (_, i) => {
                if (data.some(item => item[0] === i + 1)) {
                    // An item with the specified value exists in data
                    const item = data.find(item => item[0] === i + 1);
                    return [formatDate(item[0]), item[1]];
                } else {
                    return formatDate(i + 1);
                }
            });
        if (quarter > 0)
            return Array.from({ length: 4 }, (_, i) => {
                if (data.some(item => item[0] === i + 1)) {
                    // An item with the specified value exists in data
                    const item = data.find(item => item[0] === i + 1);
                    return [formatDate(item[0]), item[1]];
                } else {
                    return formatDate(i + 1);
                }
            });
        else
            return data.map(([day, hour]) => [formatDate(day), hour]);
    };


    const labels = getLabels();

    console.log(labels)

    const dataMap = new Map(data.map(([day, hour, value]) => [`${formatDate(day)}`, value]));

    const monthlyTotalPatients = labels.map((label) => {
        const value = dataMap.has(label[0]) ? dataMap.get(label[0]) : 0;
        return value;
    });

    console.log(888, monthlyTotalPatients)

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: title,
                data: monthlyTotalPatients,
                fill: true,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                pointBackgroundColor: "rgba(75, 192, 192, 1)",
                pointRadius: 6,
            },
        ],
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
