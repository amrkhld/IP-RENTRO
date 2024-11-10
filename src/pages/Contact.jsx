import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../frbase.config";
import { toast } from "react-toastify";
import "./contact.css";

function Contact() {
  const [message, setMessage] = useState("");
  const [landlord, setLandlord] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();

  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, "users", params.landlordId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error("Could not get landlord data");
      }
    };

    getLandlord();
  }, [params.landlordId]);

  const onChange = (e) => setMessage(e.target.value);

  return (
    <div className="pageContainer">
      <header className="pageHeaderC">
        <p className="pageHeaderC">Contact Landlord</p>
      </header>

      {landlord !== null && (
        <main>
          <div className="contactLandlord">
            <div
              className="landlordBackground"
              style={{
                backgroundImage: landlord.photoURL
                  ? `url(${landlord.photoURL})`
                  : "none",
              }}
            ></div>
            {landlord.photoURL && (
              <img
                src={landlord.photoURL}
                alt={`${landlord.name}'s profile`}
                className="landlordPhoto"
              />
            )}

            <p className="landlordName">{landlord?.name}</p>
          </div>
        </main>
      )}

      <div className="formWrapC">
        {" "}
        <form className="messageForm">
          <div className="messageDiv">
            <label htmlFor="message" className="messageLabel">
              Message
            </label>
            <textarea
              name="message"
              id="message"
              className="textarea"
              value={message}
              onChange={onChange}
            ></textarea>
          </div>

          <a
            href={
              landlord && landlord.email
                ? `mailto:${landlord.email}?Subject=${searchParams.get(
                    "listingName"
                  )}&body=${message}`
                : "#"
            }
          >
            <button type="button" className="primaryButton">
              Send Message
            </button>
          </a>
        </form>
      </div>
    </div>
  );
}

export default Contact;
