import React, { useEffect, useState } from "react";
import { Container, Form, NavDropdown, Row, Col } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import MySpinner from "../layout/MySpinner";
import ChartPatient from "./ChartPatient";
import ChartRevenue from "./ChartRevenue";
import { authApi, endpoints } from "../configs/Apis";

const Statistic = () => {
    const statsMap = [
        { id: 1, title: 'Thống kê số lượng bệnh nhân', endpoints: endpoints["statsPatientVisits"] },
        { id: 2, title: 'Thống kê doanh thu', endpoints: endpoints["statsRevenue"] },
    ];

    const [chartData, setChartData] = useState([]);
    const [isVisible, setVisible] = useState(false);
    const [selectedStats, setSelectedStats] = useState(statsMap[0]);

    const [paramsTime, setParamsTime] = useState({
        month: 0,
        quarter: 0,
        year: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setVisible(true)
                const res = await authApi().get(`${selectedStats.endpoints}?year=${paramsTime.year}&month=${paramsTime.month}&quarter=${paramsTime.quarter}`)
                console.log(res.data)
                setVisible(false)
                setChartData(res.data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchData()
    }, [paramsTime, selectedStats])



    const handleSelect = (value) => {
        switch (value) {
            case "month": {
                setParamsTime({
                    month: 1,
                    quarter: 0,
                    year: paramsTime.year || moment().format("YYYY"),
                });
                break
            }
            case "quarter": {
                setParamsTime({
                    month: 0,
                    quarter: 1,
                    year: paramsTime.year || moment().format("YYYY"),
                });
                break
            }
            case "year": {
                setParamsTime({
                    month: 0,
                    quarter: 0,
                    year: 0,
                });
                break
            }
            default:
                break
        }
    }


    const renderStats = () => {
        switch (selectedStats.id) {
            case 1:
                return (
                    <ChartPatient
                        data={chartData}
                        title="Số lượng bệnh nhân"
                        month={paramsTime.month}
                        quarter={paramsTime.quarter}
                    />
                );
            case 2:
                return (
                    <ChartRevenue
                        data={chartData}
                        title="Doanh thu"
                        month={paramsTime.month}
                        quarter={paramsTime.quarter}
                    />
                );
            default:
                return null;
        }
    };

    const nav = () => {
        return (
            <Container>
                <NavDropdown title={selectedStats.title} id="nav-dropdown" className="mt-3 xs">
                    {statsMap.map((stat) => (
                        <NavDropdown.Item
                            key={stat.id}
                            eventKey={`4.${stat.id}`}
                            onClick={() => setSelectedStats(stat)}
                        >
                            {stat.title}
                        </NavDropdown.Item>
                    ))}
                </NavDropdown>
                <h4 style={{ textAlign: "center", margin: "20px 0 20px 0" }} >{selectedStats.title}</h4>
            </Container>
        );
    };

    return (
        <>
            {nav()}
            <Row className="d-flex justify-content-center mt-3">
                <Col xs={"auto"} md={"auto"} className="my-2">
                    <Form.Select
                        onChange={(evt) => handleSelect(evt.target.value)}
                        value={paramsTime.filterType}
                        style={{ width: "auto" }}
                    >
                        <option value="month">Xem theo tháng</option>
                        <option value="quarter">Xem theo quý</option>
                        <option value="year">Xem theo năm</option>
                    </Form.Select>
                </Col>
                <Col xs={"auto"} md={"auto"} className="my-2">
                    <Form.Control
                        placeholder="Năm...."
                        onChange={(evt) =>
                            setParamsTime({
                                ...paramsTime,
                                year: evt.target.value !== "" ? evt.target.value : 0,
                            })
                        }
                        type="number"
                        min={2000}
                        max={2099}
                        value={paramsTime.year !== "0" && paramsTime.year}
                        style={{ width: "auto" }}
                    />
                </Col>
            </Row>
            {isVisible && <MySpinner />}
            {renderStats()}
        </>
    );
};

export default Statistic;
