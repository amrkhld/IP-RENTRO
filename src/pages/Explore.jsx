import { Link } from "react-router-dom";
import rentImg from "./res/rentImg.jpg";
import saleImg from "./res/saleImg.jpg";
import Slider from "../components/Slider";
import "./explore.css";

function Explore() {
  return (
    <div className="explore">

      <main className="mainExplore">
        <Slider />

        <div className="categoriesWrap">
          <p className="exploreCategoryHeading">Categories</p>
          <div className="exploreCategories">
            <Link to="/category/sale">
              <figure className="figureEx">
                <img src={saleImg} alt="sale" className="exploreCategoryImg" />
              </figure>
              <p className="categoryName">Places for sale</p>
            </Link>

            <Link to="/category/rent">
              <figure className="figureEx">
                <img src={rentImg} alt="rent" className="exploreCategoryImg" />
              </figure>
              <p className="categoryName">Places for rent</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Explore;
