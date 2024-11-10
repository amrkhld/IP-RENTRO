import { useState } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../frbase.config";
import Button from "react-bootstrap/Button";
import googlealt from "../pages/res/googlealt.svg";
import google from "../pages/res/google.svg";

function GoogleAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [googleIco, setGoogleIco] = useState(google);

  const onClick = async () => {
    const toastId = toast.loading("Authenticating...");
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      toast.update(toastId, {
        render: "Authenticated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      navigate("/");
    } catch (error) {
      toast.update(toastId, {
        render: "Authentication Faild!",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleMouseEnter = () => {
    setGoogleIco(googlealt);
  };

  const handleMouseLeave = () => {
    setGoogleIco(google);
  };

  return (
    <div className="socialLogin">
      <div className="sign-with-google">
        <div className="d-grid gap-2">
          <Button
            id="btn-styleM7md"
            variant="primary"
            size="lg"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
          >
            Sign {location.pathname === "/sign-in" ? "In" : "Up"} with
            <img src={googleIco} width={100} height={30} alt="Google Logo" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default GoogleAuth;
