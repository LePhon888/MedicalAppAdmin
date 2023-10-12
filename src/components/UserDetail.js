import { useEffect, useState } from "react";
import Apis, { authApi, endpoints } from "../configs/Apis";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Row, Col, Button, Alert, Container } from "react-bootstrap";
import cookie from "react-cookies";
import MySpinner from "../layout/MySpinner";
const UserDetail = () => {
    const [user, setUser] = useState({
        id: null,
        address: null,
        email: null,
        enabled: null,
        firstName: null,
        gender: 0,
        image: null,
        isActive: 1,
        lastName: null,
        password: null,
        phoneNumber: null,
        provider: null,
        userRole: null,
        verificationCode: null,
    });

    const { state } = useLocation();
    const [file, setFile] = useState(null);
    const [isVisible, setVisible] = useState(false);
    const [error, setError] = useState(null);
    const nav = useNavigate();

    useEffect(() => {
        if (state) {
            setUser(state)
        }
    }, [])

    const userFields = [
        { field: "email", type: "text" },
        { field: "firstName", type: "text" },
        { field: "lastName", type: "text" },
        { field: "birthday", type: "date" },
        { field: "gender", type: "select", options: ["Nam", "Nữ"] },
        { field: "image", type: "file" },
        { field: "address", type: "text" },
        { field: "isActive", type: "select", options: ["Vô hiệu hóa", "Hoạt động"] },
        { field: "password", type: "text" },
        { field: "phoneNumber", type: "text" },
        { field: "userRole", type: "text", },
    ];

    const handleSubmit = async () => {
        setVisible(true)
        setError(null)
        const formData = new FormData();
        formData.append('file', file);
        formData.append('user', new Blob([JSON.stringify(user)], { type: 'application/json' }));
        const e = `${endpoints["user"]}/`;
        try {

            let res = await authApi().post(e, formData, {
                headers:
                {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setVisible(false)
            if (res.status === 200)
                nav("/management")
        } catch (error) {
            setVisible(false)
            console.error('Error uploading data:', error);
            setError(error.response.data)
        }
    };


    const renderFormControl = (field, value) => {
        switch (field.type) {
            case "select": {
                return (
                    <Form.Control as="select" value={value || 0} onChange={(e) => setUser({ ...user, [field.field]: e.target.value })}
                    >
                        {field.options.map((option, index) => (
                            <option key={option} value={index}>
                                {option}
                            </option>
                        ))}
                    </Form.Control>
                );
            }
            case "file": {
                return (
                    <>
                        <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])}
                        />
                        {value && (
                            <img src={value} style={{ display: "flex", width: "60px", height: "60px" }} className="my-2" />
                        )}
                    </>
                );
            }
            case "date": {
                return (
                    <Form.Control type="date" value={value} onChange={(e) => setUser({ ...user, [field.field]: e.target.value })}
                    />
                );
            }
            default: {
                return (
                    <Form.Control type={[field.field] == "password" ? "password" : "text"} value={value || ""}
                        onChange={(e) => setUser({ ...user, [field.field]: e.target.value })}
                    />
                );
            }
        }
    };

    return (
        <Container>
            <h4 className="mt-3 text-center">{state ? "Cập nhật người dùng" : "Tạo mới người dùng"}</h4>
            <Form style={{ padding: "5px" }}>
                {userFields.map((field) => (
                    <div class="form-floating mb-3 mt-3">
                        {renderFormControl(field, user[field.field])}
                        <Form.Label>{field.field}</Form.Label>
                    </div>
                ))}
            </Form>
            <div class="form-floating mb-3" style={{ marginLeft: "10px" }}>
                <Button variant="primary" onClick={handleSubmit}>
                    {state ? "Cập nhật" : "Tạo mới"}
                </Button>
            </div>
            {isVisible && <MySpinner />}
            {error && (
                <Alert variant="danger" className="text-center">
                    <Alert.Heading>{error}</Alert.Heading>
                </Alert>
            )}
        </Container >
    );
};

export default UserDetail;
