import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { Alert } from 'react-bootstrap';
import moment from 'moment';
import MySpinner from '../layout/MySpinner';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend);

const ChartRevenue = ({ data, month, quarter }) => {
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
            return Array.from({ length: 12 }, (_, i) => formatDate(i + 1));
        if (quarter > 0)
            return Array.from({ length: 4 }, (_, i) => formatDate(i + 1));
        else
            return data.map((value) => formatDate(value[0]))
    };

    const labels = getLabels();

    const dataMap = new Map(data.map(([day, value]) => [formatDate(day), value]));

    const monthlyRevenues = labels.map((label) => {
        const value = dataMap.has(label) ? dataMap.get(label) : 0;

        return value;
    });

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Doanh thu',
                data: monthlyRevenues,
                type: 'bar', // Use bar chart for revenue
                backgroundColor: "rgba(75, 192, 192, 1)",
                borderColor: "rgba(75, 192, 192, 1)",
                yAxisID: 'revenue-y-axis', // Assign this dataset to the left y-axis
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            x: {
                ticks: {
                    maxRotation: 0,
                    minRotation: 0,
                    autoSkip: true,
                },
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
                <Bar data={chartData} options={options} />
            )}
        </div>
    );
};

export default ChartRevenue;
