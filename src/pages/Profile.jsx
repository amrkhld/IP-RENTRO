import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../frbase.config";
import { getAuth, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import arrowRight from "./res/arrowRight.svg";
import homeIcon from "./res/homeIcon.svg";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListingItem from "../components/ListingItem";
import "./profile.css";

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const storage = getStorage();

  const [formData, setFormData] = useState({
    name: "",
    image: null,
  });
  const { name, image } = formData;

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [changeDetails, setChangeDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [listings, setListings] = useState([]);

  useEffect(() => {
    if (auth.currentUser) {
      setFormData({
        name: auth.currentUser.displayName || "",
        image: auth.currentUser.photoURL || null,
      });
      setEmail(auth.currentUser.email);
      setProfilePhoto(auth.currentUser.photoURL);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [auth.currentUser]);

  useEffect(() => {
    const fetchUserListings = async () => {
      if (auth.currentUser) {
        try {
          const listingsRef = collection(db, "listings");
          const q = query(listingsRef, where("userRef", "==", auth.currentUser.uid));
          const querySnapshot = await getDocs(q);
          const userListingArray = [];

          querySnapshot.forEach((doc) => {
            userListingArray.push({ id: doc.id, ...doc.data() });
          });

          setListings(userListingArray);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching user listings:", error);
          toast.error("Failed to load listings.");
        }
      }
    };

    fetchUserListings();
  }, [auth]);

  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };

  const updateProfileDetails = async () => {
    const toastId = toast.loading("Saving...");
    try {
      let photoURL = profilePhoto;
      if (image && typeof image === "object") {
        const imageRef = ref(storage, `profileImages/${auth.currentUser.uid}`);
        await uploadBytes(imageRef, image);
        photoURL = await getDownloadURL(imageRef);
      }

      await updateProfile(auth.currentUser, { displayName: name, photoURL });
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { name, photoURL });

      setProfilePhoto(photoURL);

      toast.update(toastId, {
        render: "Profile updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: `Failed to update profile: ${error.message}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const onSubmit = async () => {
    try {
      await updateProfileDetails();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onChange = (e) => {
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        image: e.target.files[0],
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleDelete = async (listingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?"
    );
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "listings", listingId));
        setListings(listings.filter((listing) => listing.id !== listingId));
        toast.success("Listing deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete listing.");
      }
    }
  };

  return (
    <>
      <Row id="rowPP">
        <Col sm={6} className="profileLeft">
          <header>
            <p className="pageHeader">My Profile</p>
            <button onClick={onLogout}>Sign Out</button>
          </header>

          {auth.currentUser ? (
            <main className="mainPP">
              <div className="profileCard">
                <div className="profilePhoto">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile" />
                  ) : (
                    <img
                      src={profilePhoto || "https://via.placeholder.com/300"}
                      alt="Placeholder"
                      style={{
                        width: "300px",
                        height: "300px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>

                <form>
                  <input
                    type="text"
                    id="name"
                    className={
                      !changeDetails ? "profileName" : "profileNameActive"
                    }
                    disabled={!changeDetails}
                    value={name}
                    onChange={onChange}
                  />

                  {!changeDetails && <p className="profileEmail">{email}</p>}
                  {changeDetails && (
                    <>
                      <input
                        type="file"
                        id="fileInput"
                        accept="image/*"
                        onChange={onChange}
                        style={{ display: "none" }}
                      />
                      <label htmlFor="fileInput" className="fileUpload">
                        Upload New Photo
                      </label>
                      {image && typeof image === "object" && (
                        <img
                          src={URL.createObjectURL(image)}
                          alt="Profile Preview"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            marginTop: "10px",
                          }}
                        />
                      )}
                    </>
                  )}
                </form>
              </div>

              <div className="profileDetailsHeader">
                <p
                  className="changePersonalDetails"
                  onClick={() => {
                    if (changeDetails) {
                      onSubmit();
                    }
                    setChangeDetails((prevState) => !prevState);
                  }}
                >
                  {changeDetails ? "Save" : "Update"}
                </p>
              </div>
            </main>
          ) : (
            <p>User not authenticated.</p>
          )}
        </Col>
        <Col sm={5} className="profileRight">
          <header className="right">
            <Link to="/create-listing" className="createListing">
              <img src={homeIcon} alt="home" className="icon" />
              <p className="listingText">Sell or Rent your home</p>
              <img src={arrowRight} alt="arrow right" className="icon" />
            </Link>
          </header>

          <div className="userListings">
            <div className="scrollableBox">
              <h2>My Listings</h2>
              {listings.length > 0 ? (
                <ul className="listingItemsP">
                  {listings.map((listing) => (
                    <ListingItem
                      key={listing.id}
                      listing={listing}
                      id={listing.id}
                      onDelete={() => handleDelete(listing.id)}
                    />
                  ))}
                </ul>
              ) : (
                <p>No listings found</p>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default Profile;
