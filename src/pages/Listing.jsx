import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Navigation, Scrollbar, A11y } from "swiper/modules";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../frbase.config";
import shareIcon from "./res/shareIcon.svg";
import bathtubIcon from "../pages/res/bathtubeIcon.svg";
import bedIcon from "../pages/res/bedIcon.svg";
import "./listing.css";
import "swiper/swiper-bundle.css";

function Listing() {
  const [listing, setListing] = useState(null);
  const [landlordPhoto, setLandlordPhoto] = useState("");
  const [loading, setLoading] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [buttonText, setButtonText] = useState("Contact Landlord");
  const [landlordName, setLandlordName] = useState(null);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();
  const mainSwiperRef = useRef(null);

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const listingData = docSnap.data();
        setListing(listingData);
        setLoading(false);

        const userDocRef = doc(db, "users", listingData.userRef);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setLandlordPhoto(userDocSnap.data().photoURL);
        }

        fetchLandlordName(listingData.userRef);
      }
    };

    const fetchLandlordName = async (userRef) => {
      if (userRef) {
        try {
          const userDoc = await getDoc(doc(db, "users", userRef));
          if (userDoc.exists()) {
            setLandlordName(userDoc.data().name);
          }
        } catch (error) {
          console.error("Error fetching landlord name:", error);
        }
      }
    };

    fetchListing();
  }, [params.listingId]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  const handleShareClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareLinkCopied(true);
      setTimeout(() => setShareLinkCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link: ", error);
    }
  };

  const handleMouseEnter = () => {
    const contactTextElement = document.querySelector(".contactText");

    contactTextElement.classList.add("fade-out");
    setTimeout(() => {
      setButtonText(`Contact ${landlordName || "Landlord"}`);
      contactTextElement.classList.remove("fade-out");
      contactTextElement.classList.add("fade-in");

      setTimeout(() => contactTextElement.classList.remove("fade-in"), 100);
    }, 250);
  };

  const handleMouseLeave = () => {
    const contactTextElement = document.querySelector(".contactText");

    contactTextElement.classList.add("fade-out");
    setTimeout(() => {
      setButtonText("Contact Landlord");
      contactTextElement.classList.remove("fade-out");
      contactTextElement.classList.add("fade-in");

      setTimeout(() => contactTextElement.classList.remove("fade-in"), 100);
    }, 250);
  };

  return (
    <main className="listingContainer">
      <Helmet>
        <title>{listing.name}</title>
      </Helmet>

      <div className="swipers Container">
        <Swiper
          ref={mainSwiperRef}
          slidesPerView={1}
          modules={[Navigation, Scrollbar, A11y, Thumbs]}
          thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
        >
          {listing.imgUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <div
                style={{
                  background: `url(${url}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="swiperSlideDiv"
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>

        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[Thumbs]}
          className="thumbs-swiper"
        >
          {listing.imgUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <img src={url} alt={`Thumbnail ${index + 1}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="listingDetails">
        <div className="shareIconDiv" onClick={handleShareClick}>
          <img src={shareIcon} alt="Share Icon" />
        </div>

        {shareLinkCopied && (
          <p className="linkCopied" aria-live="assertive">
            Link Copied!
          </p>
        )}

        <p className="listingName">
          {listing.name} - $
          {listing.offer
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <p className="listingLocation">{listing.location}</p>
        <p className="listingType">
          For {listing.type === "rent" ? "Rent" : "Sale"}
        </p>
        {listing.offer && (
          <p className="discountPrice">
            ${listing.regularPrice - listing.discountedPrice} discount
          </p>
        )}

        <ul className="listingDetailsList">
          <li>
            <img src={bedIcon} alt="bed" />
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Bedrooms`
              : "1 Bedroom"}
          </li>
          <li>
            <img src={bathtubIcon} alt="bed" />
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Bathrooms`
              : "1 Bathroom"}
          </li>
          <li>{listing.parking && "✅ Parking Spot"}</li>
          <li>{listing.furnished && "✅ Furnished"}</li>
        </ul>

        <p className="listingLocationTitle">Location</p>

        <div className="leafletContainer">
          {listing.geolocation?.lat && listing.geolocation?.lng && (
            <MapContainer
              style={{ height: "100%", width: "100%" }}
              center={[listing.geolocation.lat, listing.geolocation.lng]}
              zoom={13}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
              />
              <Marker
                position={[listing.geolocation.lat, listing.geolocation.lng]}
              >
                <Popup>{listing.location}</Popup>
              </Marker>
            </MapContainer>
          )}
        </div>

        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className="primaryButton"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="landlordContact">
              {landlordPhoto && (
                <img
                  src={landlordPhoto}
                  alt="Landlord Profile"
                  className="landlordPhotoL"
                />
              )}
              <span className="contactText">{buttonText}</span>
            </div>
          </Link>
        )}
      </div>
    </main>
  );
}

export default Listing;
