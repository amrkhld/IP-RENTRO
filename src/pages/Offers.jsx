import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../frbase.config";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
import "./category-offers.css";

function Offer() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, "listings");

        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(12)
        );
        const querySnap = await getDocs(q);

        const listings = [];

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Could not fetch offers");
      }
    };
    fetchListings();
  }, []);
  return (
    <div className="offers">
      <header className="headFigureOF">
        <div className="figureOF">
          <p className="pageHeaderOF">Offers</p>
        </div>
      </header>

      {loading ? (
        "loading"
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="offerListing">
              {listings.map((listing) => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p>There are no offers!</p>
      )}
    </div>
  );
}

export default Offer;
