import { useContext, useState } from "react";
import { Button, Container, Form, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { MyCartContext, MyUserContext } from "../App";

const Header = () => {
    const [user, dispatch] = useContext(MyUserContext);
    const [kw, setKw] = useState("");
    const nav = useNavigate();

    const logout = () => {
        dispatch({
            type: "logout",
        });
        nav("/login");
    };

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/">Medical app</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {user === null ? (
                            <Link to="/login" className="nav-link text-danger">
                                Đăng nhập
                            </Link>
                        ) : (
                            <>
                                <Link to="/management" className="nav-link">
                                    Quản lý
                                </Link>
                                <Link to="/statistic" className="nav-link">
                                    Thống kê
                                </Link>
                                <Link to="/login" className="nav-link text-success">
                                    Chào {user.firstName}!
                                </Link>
                                <Button variant="secondary" onClick={logout}>
                                    Đăng xuất
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
