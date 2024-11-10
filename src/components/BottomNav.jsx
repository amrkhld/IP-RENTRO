import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import exploreico from "./exploreico.svg";
import offerico from "./offerico.svg";
import profileico from "./profileico.svg";
import brandico from "./brandico.svg";
import aboutico from "./aboutico.svg";

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const handleNavClick = (path, link) => {
    setActiveLink(link);
    navigate(path);
  };

  return (
    <Navbar fixed="bottom" bg="light" data-bs-theme="light">
      <Container>
        <Navbar.Brand onClick={() => handleNavClick("/", "explore")}>
          <img src={brandico} width="250" height="45" alt="Explore" />
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link
            className={
              activeLink === "/" ||
              activeLink === "/category/rent" ||
              activeLink === "/category/sale"
                ? "active"
                : ""
            }
            onClick={() => handleNavClick("/", "explore")}
          >
            <img src={exploreico} width="22" height="22" alt="Explore" />
            Explore
          </Nav.Link>
          <div className="vrm" />
          <Nav.Link
            className={activeLink === "/offers" ? "active" : ""}
            onClick={() => handleNavClick("/offers", "offers")}
          >
            <img src={offerico} width="23" height="23" alt="Offers" />
            Offers
          </Nav.Link>
          <div className="vrm" />
          <Nav.Link
            className={activeLink === "/profile" ? "active" : ""}
            onClick={() => handleNavClick("/profile", "profile")}
          >
            <img src={profileico} width="23" height="23" alt="Profile" />
            Profile
          </Nav.Link>
        </Nav>
      </Container>
      <Nav.Link
        className={activeLink === "/about" ? "active activeRight" : "right"}
        onClick={() => handleNavClick("/about", "about")}
      >
        <img src={aboutico} width="33" height="33" alt="about" />
      </Nav.Link>
    </Navbar>
  );
}

export default BottomNav;
