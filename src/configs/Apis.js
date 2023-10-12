// Import necessary libraries and modules
import axios from "axios";
import cookie from "react-cookies";
const SERVER = "http://localhost:8080";
// const SERVER = "http://192.168.1.105:8080";

export const endpoints = {
    login: `${SERVER}/auth/login`,
    signup: `${SERVER}/auth/register`,
    currentUser: `${SERVER}/auth/current-user`,
    hours: `${SERVER}/api/hours`,
    doctors: `${SERVER}/api/doctors/department`,
    departments: `${SERVER}/api/departments`,
    appointment: `${SERVER}/api/appointment`,
    payment: `${SERVER}/api/payment/create-payment`,
    user: `${SERVER}/api/user`,
    websocket: `${SERVER}/chat`,
    news: `${SERVER}/api/scrape`,
    statsPatientVisits: `${SERVER}/api/stats-patient-visits/`,
    statsRevenue: `${SERVER}/api/stats-revenue/`,
};

export const authApi = () => {
    return axios.create({
        baseURL: SERVER,
        headers: {
            "Authorization": `Bearer ${cookie.load("token")}`
        }
    })
}

export default axios.create({
    baseURL: SERVER,
});
