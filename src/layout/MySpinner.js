import { Spinner } from "react-bootstrap";

const MySpinner = () => {
    return (
        <div className="mt-3 d-flex justify-content-center align-items-center">
            <Spinner animation="grow" variant="primary" />
        </div>
    );
}

export default MySpinner;