import { useEffect, useState } from "react"
import { authApi, endpoints } from "../configs/Apis"
import { Button, Col, Form, Row, Table } from "react-bootstrap"
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
const Home = () => {

    const [userList, setUserList] = useState([])
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [kw, setKw] = useState('')
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

    const renderData = () => {
        try {
            const data = userList.filter(user => {
                if (user.firstName) {
                    return user.firstName.toLowerCase().includes(kw.toLowerCase())
                }

                if (user.lastName) {
                    return user.lastName.toLowerCase().includes(kw.toLowerCase())
                }
            }

            )
            return data.map((user) => (
                <tr>
                    <td>{user.id}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.birthday}</td>
                    <td>{genderMap[user.id]}</td>
                    <td>{user.andress}</td>
                    <td>{statusMap[user.isActive]}</td>
                    <td style={{ width: "1%", whiteSpace: "nowrap" }}>
                        <Button className="mx-1 my-1">Sửa</Button>
                        <Button variant="danger">Xóa</Button>
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
                <Col><h4>Danh sách người dùng</h4></Col>
                <Col xs="auto"><Form.Control placeholder="Tìm theo tên..." value={kw} onChange={(evt) => setKw(evt.target.value)} /></Col>
                <Col xs="auto"><Button variant="secondary">Thêm<AddIcon /></Button></Col>
            </Row>
            <Table bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>Mã</th>
                        <th>Họ</th>
                        <th>Tên</th>
                        <th>Ngày sinh</th>
                        <th>Giới tính</th>
                        <th>Địa chỉ</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {renderData()}
                </tbody>
            </Table >
            <Stack spacing={2} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    Rows per page:
                    <Form.Control type="number" style={{ marginLeft: 5, width: "20%" }}
                        value={rowsPerPage}
                        min={0}
                        onChange={handleChangeRowsPerPage} />
                </Typography>
                <Pagination count={totalPages} page={page} onChange={handleChange} />
            </Stack>
        </>
    )
}
export default Home