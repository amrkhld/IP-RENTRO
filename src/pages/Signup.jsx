import "./signin-signup.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import googlealt from "./res/googlealt.svg";
import google from "./res/google.svg";
import brandico from "./res/brandico.svg";
import alUser from "./res/alUser.svg";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { db } from "../frbase.config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import GoogleAuth from "../components/GoogleAuth";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const { name, email, password } = formData;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Signing Up...");

    try {
      const auth = getAuth();
      const userCredit = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredit.user;
      updateProfile(auth.currentUser, {
        displayName: name,
      });
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);
      toast.update(toastId, {
        render: "Signed Up successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      navigate("/sign-in");
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
        <p>Create Account</p>
        <GoogleAuth />
        <hr />
        <Form onSubmit={handleSubmit}>
          <Form.Floating className="mb-3">
            <Form.Control
              id="name"
              value={name}
              type="text"
              placeholder="John/Jane Doe"
              aria-label="Name"
              onChange={handleChange}
            />
            <label htmlFor="name">Name</label>
          </Form.Floating>
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
              placeholder="*****"
              aria-label="Password"
              onChange={handleChange}
            />
            <label htmlFor="password">Password</label>
          </Form.Floating>

          <Button type="submit" variant="primary" size="lg">
            Sign Up
          </Button>
        </Form>
        <div className="miscLinks">
          <Link className="sign-up" to="/sign-in">
            Already a user?
            <img className="alUser" src={alUser} height={20} width={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
