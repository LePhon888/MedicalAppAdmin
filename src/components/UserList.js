import { useEffect, useState } from "react"
import { authApi, endpoints } from "../configs/Apis"
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap"
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import UserDetail from "./UserDetail";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import MySpinner from "../layout/MySpinner";
const UserList = () => {

    const [userList, setUserList] = useState([])
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [kw, setKw] = useState('')
    const [isVisible, setVisible] = useState(false)
    const genderMap = {
        0: "Nam", 1: "Nữ"
    }
    const statusMap = {
        0: "Vô hiệu hóa", 1: "Hoạt động"
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                let e = `${endpoints["user"]}/?size=${rowsPerPage}&page=${page - 1}`
                const res = await authApi().get(e);
                setUserList(res.data.content)
                setTotalPages(res.data.totalPages)
            }
            catch (error) {
                console.log(error)
            }
        }
        fetchUser()
    }, [page, rowsPerPage])


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(1);
    };

    const handleChange = (event, value) => {
        setPage(value);
    };

    const nav = useNavigate()

    const navigateUserDetail = (user) => {
        if (user && user.userRole !== "ROLE_ADMIN") nav(`/management/${user.id}`, { state: user })
        else nav(`/management/create`)
    }

    const navigateUserDelete = (user) => {
        if (user) nav(`/management/delete/${user.id}`, { state: user })
    }

    const renderData = () => {
        try {
            const data = userList.filter(user => {
                let name = ''

                if (user.firstName) {
                    name += user.firstName
                }

                if (user.lastName) {
                    name += user.lastName
                }
                return name.toLowerCase().includes(kw.toLowerCase())
            }

            )
            return data.map((user) => (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{moment(user.birthday).format("DD/MM/YYYY")}</td>
                    <td>{genderMap[user.gender]}</td>
                    <td>{user.address}</td>
                    <td>{user.userRole}</td>
                    <td>{statusMap[user.isActive]}</td>
                    <td style={{ width: "1%", whiteSpace: "nowrap" }}>
                        <Button className="mx-1 my-1" onClick={() => navigateUserDetail(user)}>Sửa</Button>

                        <Button variant="danger" onClick={() => navigateUserDelete(user)}>Xóa</Button>
                    </td>
                </tr>
            ))
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <>
            <Row className="mt-3">
                <Col xs={12} md={8}>
                    <h4>Danh sách người dùng</h4>
                </Col>
                <Col xs={12} md={2}>
                    <Form.Control
                        placeholder="Tìm theo tên..."
                        value={kw}
                        onChange={(evt) => setKw(evt.target.value)}
                        style={{ width: "100%" }}
                    />
                </Col>
                <Col xs={12} md={2} className="mt-2">
                    <Button
                        variant="secondary"
                        onClick={() => navigateUserDetail(null)}
                    >
                        Thêm <AddIcon />
                    </Button>
                </Col>
            </Row>

            <div className="table-responsive">
                <Table bordered hover className="mt-3">
                    <thead>
                        <tr>
                            <th>Mã</th>
                            <th>Họ</th>
                            <th>Tên</th>
                            <th>Ngày sinh</th>
                            <th>Giới tính</th>
                            <th>Địa chỉ</th>
                            <th>Vai trò</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>{renderData()}</tbody>
                </Table>
            </div>

            <Stack spacing={2} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    Rows per page:
                    <Form.Control
                        type="number"
                        style={{ marginLeft: 5, width: "20%" }}
                        value={rowsPerPage}
                        min={0}
                        onChange={handleChangeRowsPerPage}
                    />
                </Typography>
                <Pagination count={totalPages} page={page} onChange={handleChange} />
            </Stack>
        </>
    );
}
export default UserList