import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../frbase.config";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
  EffectFade,
} from "swiper/modules";
import "./slider.css";
import "swiper/swiper-bundle.css";

function Slider() {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
      const querySnap = await getDocs(q);

      let listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    };

    fetchListings();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (listings.length === 0) {
    return <></>;
  }

  const updateBackground = (index) => {
    const currentListing = listings[index];
    const backgroundImage = currentListing
      ? currentListing.data.imgUrls[0]
      : "";

    const backgroundDiv = document.getElementById("blurredBackground");
    if (backgroundDiv) {
      backgroundDiv.style.backgroundImage = `url(${backgroundImage})`;
    }
  };

  return (
    <>
      <div className="blurredBackground" id="blurredBackground"></div>
      <div className="sliderWrap">
        <p className="exploreHeading">Recommended</p>

        <Swiper
          onSlideChange={(swiper) => updateBackground(swiper.activeIndex)}
          navigation
          slidesPerView={1}
          pagination={{ clickable: true }}
          effect="fade"
          modules={[
            Navigation,
            Pagination,
            Scrollbar,
            A11y,
            Autoplay,
            EffectFade,
          ]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          speed={1000}
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div
                style={{
                  background: `url(${data.imgUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="swiperSlideDiv"
              >
                <div className="detailsCont">
                  <p className="swiperSlideText">{data.name}</p>
                  <p className="swiperSlidePrice">
                    ${data.discountedPrice ?? data.regularPrice}
                    {data.type === "rent" && " / month"}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}

export default Slider;
