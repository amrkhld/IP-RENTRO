import "./about.css";
import coderLogo from "./res/coder.png";

function About() {
  const year = new Date().getFullYear();

  return (
    <div className="about">
      <div className="about-wrapper">
        <div className="about-container">
          <h1>
            <h1 className="f">IP - Rentro</h1>
          </h1>
          <p>
            This project is a dynamic real estate listing web application built
            with React and Firebase, designed to provide users with a seamless
            browsing experience for property rentals and sales. Users can
            explore various property listings categorized by type and location,
            with each listing showcasing essential details, including images,
            property descriptions, pricing, and key amenities (e.g., number of
            bedrooms and bathrooms). A custom `ListingItem` component enriches
            the user experience by offering a responsive layout with interactive
            elements like hover effects, making the displayed information
            engaging and accessible. Firebase Firestore serves as the backend,
            storing user profiles and listing data, while Firebase
            Authentication facilitates secure login and registration. The app
            integrates a contact feature, enabling users to directly reach out
            to property landlords via email, pre-filled with listing details for
            a streamlined communication process. Using Leaflet.js, the project
            also features an interactive map for spatial context on listing
            locations. The combination of React Router and conditional styling
            ensures a fluid, user-friendly navigation experience, while custom
            animations and CSS effects provide a polished look and feel.
          </p>
        </div>
      </div>
      <div className="footer">
        <img
          src={coderLogo}
          width="50"
          height="50"
          className="uLogo"
          alt="Ugit Logo"
        />
        <p>Copyright &copy; {year} Amr K. | Built with React.</p>
      </div>
    </div>
  );
}

export default About;
