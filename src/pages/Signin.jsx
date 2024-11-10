import "./signin-signup.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import brandico from "./res/brandico.svg";
import createAccount from "./res/create-account.svg";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import GoogleAuth from "../components/GoogleAuth";

function Signin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const { email, password } = formData;


  const onSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Signing in...");
    try {
      const auth = getAuth();

      const userCredit = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredit.user) {
        toast.update(toastId, {
          render: "Signed in successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        navigate("/");
      }
    } catch (error) {
      toast.update(toastId, {
        render: "Error signing in!",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="signIn-wrapper">
      <div className="form-wrapper">
        <div className="sign-brand">
          <img src={brandico} width="300" height="90" alt="Explore" />
        </div>
        <p>Sign In to Rentro!</p>
        <GoogleAuth />
        <hr />
        <Form onSubmit={onSubmit}>
          <Form.Floating className="mb-3">
            <Form.Control
              id="email"
              value={email}
              type="email"
              placeholder="name@example.com"
              aria-label="Email address"
              onChange={handleChange}
            />
            <label htmlFor="email">Email address</label>
          </Form.Floating>
          <Form.Floating>
            <Form.Control
              id="password"
              value={password}
              type="password"
              placeholder="Password"
              aria-label="Password"
              onChange={handleChange}
            />
            <label htmlFor="password">Password</label>
          </Form.Floating>
          <Button variant="primary" size="lg" type="submit">
            Sign In
          </Button>
        </Form>

        <div className="miscLinks">
          <Link className="forgot-password" to="/forgot-password">
            Forgot password?
          </Link>
          <Link className="sign-up" to="/sign-up">
            Create Account
            <img src={createAccount} height={20} width={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signin;
