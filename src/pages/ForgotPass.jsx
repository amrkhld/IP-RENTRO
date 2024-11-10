import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./forgot-pass.css";

function ForgotPass() {
  const [email, setEmail] = useState("");

  const onChange = (e) => {
    setEmail(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("email Sent");
    } catch (error) {
      toast.error("couldn't Sent");
    }
  };
  return (
    <Container>
      <Row>
        <Col>
          <div className="formContent">
            <div className="formContainer">
              <header>
                <p className="pageHeaderFP">Reset Password</p>

                <main>
                  <form className="form-FP" onSubmit={onSubmit}>
                    <input
                      type="email"
                      className="emailInput"
                      placeholder="Email"
                      id="email"
                      value={email}
                      onChange={onChange}
                    />

                    <Link to={"/sign-in"} className="forgotPasswordLink"></Link>

                    <button className="resetButton">Send Reset Link</button>
                  </form>
                </main>
              </header>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ForgotPass;
