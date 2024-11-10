import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../frbase.config";
import { ReactComponent as DeleteIcon } from "../pages/res/deleteIcon.svg";
import bathtubIcon from "../pages/res/bathtubeIcon.svg";
import bedIcon from "../pages/res/bedIcon.svg";
import "./listingitem.css";

function ListingItem({ listing, id, onDelete }) {
  const location = useLocation();
  const isProfilePage = location.pathname === "/profile";
  const [userData, setUserData] = useState({ name: "", photoURL: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      if (listing.userRef) {
        const userDoc = await getDoc(doc(db, "users", listing.userRef));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };
    fetchUserData();
  }, [listing.userRef]);

  return (
    <li className={`categoryListing ${isProfilePage ? "profileStyle" : ""}`}>
      <Link
        to={`/category/${listing.type}/${id}`}
        className={`categoryListingLink ${isProfilePage ? "profileStyle" : ""}`}
      >
        <div className={`listingImageWrapper ${
              isProfilePage ? "profileStyle" : ""
            }`}>
          <img
            className={`categoryListingImg ${
              isProfilePage ? "profileStyle" : ""
            }`}
            src={listing.imgUrls[0]}
            alt={listing.name}
            loading="lazy"
          />
          <div className={`userOverlay ${isProfilePage ? "profileStyle" : ""}`}>
            {userData.photoURL && (
              <img
                src={userData.photoURL}
                alt="User"
                className="userOverlayPhoto"
              />
            )}
            <p
              className={`userOverlayName ${
                isProfilePage ? "profileStyle" : ""
              }`}
            >
              {userData.name}
            </p>
          </div>
        </div>

        <div
          className={`categoryListingDetails ${
            isProfilePage ? "profileStyle" : ""
          }`}
        >
          <p
            className={`categoryListingLocation ${
              isProfilePage ? "profileStyle" : ""
            }`}
          >
            {listing.location}
          </p>
          <p
            className={`categoryListingName ${
              isProfilePage ? "profileStyle" : ""
            }`}
          >
            {listing.name}
          </p>
          <div
            className={`categoryListingInfoDiv ${
              isProfilePage ? "profileStyle" : ""
            }`}
          >
            <div
              className={`bed/bathRoom ${isProfilePage ? "profileStyle" : ""}`}
            >
              <img src={bedIcon} alt="bed" />
              <p
                className={`categoryListingInfoText ${
                  isProfilePage ? "profileStyle" : ""
                }`}
              >
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Bedrooms`
                  : "1 Bedroom"}
              </p>
            </div>
            <div
              className={`bed/bathRoom ${isProfilePage ? "profileStyle" : ""}`}
            >
              <img src={bathtubIcon} alt="bath" />
              <p
                className={`categoryListingInfoText ${
                  isProfilePage ? "profileStyle" : ""
                }`}
              >
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Bathrooms`
                  : "1 Bathroom"}
              </p>
            </div>
          </div>
          <p
            className={`categoryListingPrice ${
              isProfilePage ? "profileStyle" : ""
            }`}
          >
            {listing.offer
              ? listing.discountedPrice.toLocaleString()
              : listing.regularPrice.toLocaleString()}
            $ {listing.type === "rent" && "/Month"}
          </p>
          {listing.description && (
            <p
              className={`categoryListingDescription ${
                isProfilePage ? "profileStyle" : ""
              }`}
            >
              {listing.description}
            </p>
          )}
        </div>
      </Link>
      {onDelete && (
        <DeleteIcon
          className={`removeIcon ${isProfilePage ? "profileStyle" : ""}`}
          onClick={() => onDelete(listing.id, listing.name)}
        />
      )}
    </li>
  );
}

export default ListingItem;
