import { useEffect, useState } from "react";
import { Alert, Button, Container, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi, endpoints } from "../configs/Apis";
import MySpinner from "../layout/MySpinner";

const UserDelete = () => {
    const { state } = useLocation();
    const [user, setUser] = useState(state)
    const [appointmentData, setAppointmentData] = useState(null)
    const [doctorData, setDoctorData] = useState(null)
    const [error, setError] = useState(false)
    useEffect(() => {
        const fetchInfoRelatedUser = async () => {
            try {
                const appointment = await authApi().get(`${endpoints["appointment"]}/detail/${user.id}`);
                const doctor = await authApi().get(`http://localhost:8080/api/doctors/${user.id}`);
                console.log(doctor.data)
                setAppointmentData(appointment.data)
                setDoctorData(doctor.data)
            } catch (error) {
                console.log(error);
                return [];
            }
        };
        fetchInfoRelatedUser()
    }, [])

    const appointmentField = [
        { key: "id", label: "Mã" },
        { key: "user", label: "Bệnh nhân", customValue: (a) => `${a.user.firstName} ${a.user.lastName}` },
        { key: "reason", label: "Lý do" },
        { key: "date", label: "Ngày khám" },
        { key: "isConfirm", label: "Xác nhận" },
        { key: "isPaid", label: "Xác nhận thanh toán" },
        {
            key: "registerUser", label: "Người đăng ký",
            customValue: (a) => `${a.registerUser ? `${a.registerUser.firstName} ${a.registerUser.lastName}` : ''}`
        },
        { key: "doctor", label: "Bác sỹ khám", customValue: (a) => `${a.doctor.user.firstName} ${a.doctor.user.lastName}` },
    ];

    const nav = useNavigate()
    const handleSubmit = async () => {
        setError(false)
        const confirmed = window.confirm("Bạn có chắc chắn muốn xóa người dùng này?");
        if (confirmed) {
            try {
                const res = await authApi().delete(`${endpoints["user"]}/${user.id}`);
                if (res.status === 204) {
                    nav("/management")
                }
            } catch (error) {
                console.log(error)
                setError(true)
            }
        }
    }


    return (
        <Container>
            <h4 className="mt-3 text-center">Xóa người dùng {user.firstName} {user.lastName}</h4>
            <h5 className="mt-3 text-left">Các thông tin liên quan sẽ bị xóa: </h5>
            <Table bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th colSpan={8} style={{ textAlign: "center" }} class="table-primary"><h5>Lịch khám</h5></th>
                    </tr>
                    <tr>
                        {appointmentField.map((field) => (
                            <th key={field.key}>{field.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <>
                        {!appointmentData && <MySpinner />}
                        {appointmentData && appointmentData.map((a) => (
                            <tr key={a.id}>
                                {appointmentField.map((field) => (
                                    <td key={field.key}>
                                        {field.customValue ? field.customValue(a) : a[field.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </>
                </tbody>
            </Table>
            {doctorData && (
                <Table bordered hover className="mt-3">
                    <thead>
                        <tr>
                            <th colSpan={8} style={{ textAlign: "center" }} class="table-primary"><h5>Bác sỹ</h5></th>
                        </tr>
                        <tr>
                            <th>Mã</th>
                            <th>Bác sỹ</th>
                            <th>Ngày sinh</th>
                            <th>Địa chỉ</th>
                            <th>Email</th>
                            <th>Khoa</th>
                        </tr>
                    </thead>
                    <tbody>
                        <>
                            <tr>
                                <td>{doctorData.id}</td>
                                <td>{doctorData.user.firstName} {doctorData.user.lastName}</td>
                                <td>{doctorData.user.birthday}</td>
                                <td>{doctorData.user.address}</td>
                                <td>{doctorData.user.email}</td>
                                <td>{doctorData.department.name}</td>
                            </tr>
                        </>
                    </tbody>
                </Table>
            )}
            <div class="form-floating mb-3" style={{ marginLeft: "10px" }}>
                <Button variant="danger" onClick={handleSubmit}>
                    Xóa
                </Button>
            </div>
            {error && (
                <Alert variant="danger" className="text-center">
                    <Alert.Heading>Lỗi hệ thống....</Alert.Heading>
                </Alert>
            )}
        </Container >
    );
}
export default UserDelete