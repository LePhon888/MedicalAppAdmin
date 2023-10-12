import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Container } from "react-bootstrap";
import Login from "./components/Login";
import { createContext, useReducer } from "react";
import MyUserReducer from "./reducers/MyUserReducer.js";
import cookie from "react-cookies";
import Statistic from "./components/Statistic";
import UserList from "./components/UserList";
import UserDetail from "./components/UserDetail";
import UserDelete from "./components/UserDelete";

export const MyUserContext = createContext();

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, cookie.load("user") || null);

  return (
    <MyUserContext.Provider value={[user, dispatch]}>
      <BrowserRouter>
        <Header />
        <Container>
          <Routes>
            {user === null ? (
              <>
                <Route path="/login" element={<Login />} />
              </>
            ) : (
              <>
                <Route path="/management" element={<UserList />} />
                <Route path="/management/delete/*" element={<UserDelete />} />
                <Route path="/management/*" element={<UserDetail />} />
                <Route path="/statistic" element={<Statistic />} />
              </>
            )}
          </Routes>
        </Container>
        <Footer />
      </BrowserRouter>
    </MyUserContext.Provider>
  );
}

export default App;
