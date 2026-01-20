import { ReactElement, Suspense, lazy, useMemo } from "react";
import textBanner from "../Images/textBanner.png";
import Tshirt from "../Images/Tshirt.png";
import jacket from "../Images/jacket.jpg";
import styled from "styled-components";
import { StarIcon } from "@chakra-ui/icons";
import { BsGlobe } from "react-icons/bs";
import { BiPlanet } from "react-icons/bi";
import { Icon } from "@chakra-ui/react";

// Use require for video to avoid TypeScript issues with media files
const videoSource = require("../Images/measurmen.mp4") as string;

// Lazy load HomeProduct component for code splitting
const HomeProduct = lazy(() =>
  import("../component/HomeProducts").then((module) => ({
    default: module.HomeProduct,
  }))
);

// Theme colors constant
const THEME_COLORS = {
  primary: "#5c6bc0",
  dark: "#5b1c1c",
  light: "#f2f2f2",
};

// Constants
const CAP_IMAGE_URLS = {
  cap: {
    src: "https://cdn.pixabay.com/photo/2022/06/22/16/00/cap-7278216_960_720.jpg",
    alt: "Featured cap product",
  },
  hat: {
    src: "https://cdn.pixabay.com/photo/2015/07/02/20/13/hats-829509_960_720.jpg",
    alt: "Featured hat product",
  },
};

const BRAND_DESCRIPTION =
  "QUICK BUY makes clothes to elevate everyday life through lighthearted escapism. while styles very by season, all collection are guided by the ineffable sense of freedom that comes with travel.";

const MISSION_TEXT =
  "We're on a mission to empower creative independence in a commercial world and incredible";

const SUSTAINABILITY_TEXT =
  "We're challenging contional retail, putting an end to dead stock, unconventional waste and more funtastic.";

// Loading fallback component for lazy-loaded sections
const ProductsLoadingFallback = () => (
  <div
    style={{
      textAlign: "center",
      padding: "40px 20px",
      color: "#666",
    }}
  >
    <p>Loading products...</p>
  </div>
);

const Home = (): ReactElement => {
  // Memoize CAP_IMAGE_URLS to prevent unnecessary recreations
  const capImages = useMemo(
    () => ({
      cap: CAP_IMAGE_URLS.cap,
      hat: CAP_IMAGE_URLS.hat,
    }),
    []
  );
   return (
      <HomeContainer>
         <section className="topImages" aria-label="Featured products showcase">
            <img 
               src={Tshirt} 
               alt="Featured t-shirt product"
               loading="lazy"
               decoding="async"
            />
            <div className="nextImages">
               <img 
                  src={textBanner} 
                  alt="Text banner promotional"
                  loading="lazy"
                  decoding="async"
               />
               <div className="capsImage">
                  <img
                     src={capImages.cap.src}
                     alt={capImages.cap.alt}
                     loading="lazy"
                     decoding="async"
                  />
                  <img
                     src={capImages.hat.src}
                     alt={capImages.hat.alt}
                     loading="lazy"
                     decoding="async"
                  />
               </div>
            </div>
         </section>
         <p className="brandDesc">
            {BRAND_DESCRIPTION}
            <div className="allCollection" role="emphasis">
               <StarIcon aria-hidden="true" /> all collection
            </div>
         </p>
         <section className="shopSection" aria-labelledby="shop-essentials">
            <h1 id="shop-essentials">SHOP BY ESSENTIALS</h1>
            <Suspense fallback={<ProductsLoadingFallback />}>
              <HomeProduct />
            </Suspense>
         </section>
         <section className="lastDiv" aria-labelledby="mission-title">
            <div className="orangeDiv">
               <h1 id="mission-title">WE'RE CHANGING</h1>
               <h1>THE WAY THINGS</h1>
               <h1>GET MADE.</h1>

               <hr className="hrline" aria-hidden="true" />
               <div className="VisionDiv">
                  <div className="missionDiv">
                     <div className="flexIcon">
                        <div className="lastIcons" aria-hidden="true">
                           <Icon color="white" as={BsGlobe} />
                        </div>
                        <h3>MISSION</h3>
                     </div>
                     <p className="missionText">
                        {MISSION_TEXT}
                     </p>
                  </div>
                  <div className="missionDiv">
                     <div className="flexIcon">
                        <div className="lastIcons" aria-hidden="true">
                           <Icon color="white" as={BiPlanet} />
                        </div>
                        <h3>SUSTAINBILITY</h3>
                     </div>
                     <p className="missionText">
                        {SUSTAINABILITY_TEXT}
                     </p>
                  </div>
               </div>
            </div>

            <img 
               src={jacket} 
               alt="Product design showcase"
               loading="lazy"
               decoding="async"
            />
         </section>
         <h1 className="yourDesign">
            WANT TO DESIGN YOUR OWN? CALM, WE CAN DO IT!
         </h1>
         <video
            autoPlay
            muted
            loop
            className="Mvedio"
            width="95%"
            height="200"
            controls={false}
            aria-label="Custom design demonstration video"
            preload="metadata"
            poster={Tshirt}
         >
            <source src={videoSource} type="video/mp4" />
            Your browser does not support the video tag.
         </video>
      </HomeContainer>
   );
};
export default Home;

const HomeContainer = styled.div`
   /* CSS Variables for theme colors - improves maintainability and performance */
   --primary-color: #5c6bc0;
   --dark-color: #5b1c1c;
   --light-bg: #f2f2f2;
   --text-white: white;
   --border-color: black;
   
   /* Mobile-First Responsive Design */
   background-color: var(--light-bg);
   padding: 16px;
   padding-top: 60px;
   margin: 0;

   /* ===== MOBILE BASE STYLES (320px - 640px) ===== */
   .topImages {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      width: 100%;
      margin: auto;
      gap: 8px;
   }

   .topImages > :nth-child(1) {
      border-radius: 8px;
      width: 100%;
      cursor: pointer;
   }

   .nextImages {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 8px;
   }

   .nextImages > img {
      width: 100%;
      border-radius: 8px;
      /* object-fit improves image rendering and layout stability */
      object-fit: cover;
   }

   .capsImage {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin: 8px 0 0 0;
   }

   .capsImage > img {
      border-radius: 8px;
      width: 100%;
      height: auto;
      object-fit: cover;
   }

   .brandDesc {
      font-size: 18px;
      width: 100%;
      margin: auto;
      margin-top: 20px;
      font-weight: 600;
      text-align: left;
      line-height: 1.6;
   }

   .allCollection {
      border: 1px solid var(--border-color);
      float: left;
      font-size: 14px;
      line-height: 22px;
      margin: 4px 8px 4px 0;
      padding: 4px 12px;
      width: fit-content;
      border-radius: 20px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
   }

   .shopSection {
      margin: 16px 0;
      padding: 0;
   }

   .shopSection > h1 {
      font-weight: 800;
      margin: 16px 0;
      font-size: 24px;
   }

   .lastDiv {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0;
   }

   .lastDiv > img {
      filter: grayscale(100%);
      width: 100%;
      border-radius: 16px;
      height: auto;
      order: 2;
      object-fit: cover;
   }

   .orangeDiv {
      width: 100%;
      border-radius: 20px;
      padding: 20px;
      font-weight: 600;
      background-color: var(--primary-color);
      order: 1;
   }

   .orangeDiv > h1 {
      font-weight: 900;
      font-size: 28px;
      margin: 8px 0;
      line-height: 1.3;
   }

   .lastIcons {
      background-color: var(--dark-color);
      width: fit-content;
      border-radius: 50%;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
   }

   .flexIcon {
      display: flex;
      gap: 12px;
      padding: 8px 0;
      align-items: flex-start;
   }

   .flexIcon > h3 {
      margin: 0;
      font-weight: 600;
      font-size: 16px;
   }

   .missionDiv {
      padding: 12px 0;
   }

   .missionText {
      color: var(--text-white);
      margin: 8px 0 0 0;
      font-size: 14px;
      line-height: 1.6;
   }

   .VisionDiv {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 16px;
   }

   .yourDesign {
      margin: 24px auto;
      font-weight: 900;
      text-align: center;
      width: 95%;
      font-size: 20px;
      line-height: 1.4;
   }

   .Mvedio {
      border-radius: 16px;
      margin: 16px auto;
      width: 100%;
      height: auto;
      display: block;
   }

   .hrline {
      color: white;
      border: none;
      height: 2px;
      background-color: rgba(255, 255, 255, 0.3);
      margin: 16px 0;
   }

   /* ===== TABLET STYLES (min-width: 768px) ===== */
   @media only screen and (min-width: 768px) {
      padding: 20px;
      padding-top: 80px;

      .topImages {
         grid-template-columns: repeat(2, 1fr);
         width: 95%;
         gap: 12px;
      }

      .nextImages {
         gap: 12px;
      }

      .capsImage {
         gap: 12px;
         margin: 12px 0 0 0;
      }

      .capsImage > img {
         border-radius: 10px;
      }

      .brandDesc {
         font-size: 24px;
         width: 95%;
         margin-top: 30px;
         text-align: justify;
      }

      .allCollection {
         font-size: 16px;
         line-height: 28px;
         margin: 3px 8px 3px 0;
         padding: 4px 14px;
      }

      .shopSection {
         margin: 20px;
      }

      .shopSection > h1 {
         font-weight: 800;
         margin: 20px 0;
         font-size: 32px;
      }

      .lastDiv {
         flex-direction: row;
         gap: 20px;
         padding: 20px;
      }

      .lastDiv > img {
         width: 35%;
         order: 2;
      }

      .orangeDiv {
         width: 65%;
         border-radius: 30px;
         padding: 30px;
         order: 1;
      }

      .orangeDiv > h1 {
         font-size: 40px;
         margin: 12px 0;
      }

      .flexIcon {
         gap: 16px;
         padding: 12px 0;
      }

      .flexIcon > h3 {
         font-size: 18px;
      }

      .missionDiv {
         padding: 20px;
      }

      .missionText {
         font-size: 16px;
      }

      .VisionDiv {
         flex-direction: row;
         justify-content: space-between;
      }

      .yourDesign {
         margin: 30px auto;
         width: 90%;
         font-size: 28px;
      }
   }

   /* ===== DESKTOP STYLES (min-width: 1024px) ===== */
   @media only screen and (min-width: 1024px) {
      padding: 20px;
      padding-top: 80px;

      .topImages {
         grid-template-columns: repeat(2, 1fr);
         width: 95%;
         gap: 10px;
      }

      .nextImages {
         gap: 10px;
      }

      .capsImage {
         gap: 10px;
      }

      .capsImage > img {
         width: 95%;
      }

      .brandDesc {
         font-size: 30px;
         width: 95%;
      }

      .allCollection {
         font-size: 18px;
         line-height: 30px;
         margin: 3px 8px 3px 0;
         padding: 2px 12px;
      }

      .shopSection {
         margin: 20px;
      }

      .shopSection > h1 {
         font-size: 36px;
      }

      .lastDiv {
         flex-direction: row;
         gap: 20px;
         padding: 20px;
      }

      .lastDiv > img {
         width: 30%;
      }

      .orangeDiv {
         width: 70%;
         padding: 30px;
      }

      .orangeDiv > h1 {
         font-size: 50px;
      }

      .flexIcon {
         gap: 20px;
         padding: 12px 0;
      }

      .flexIcon > h3 {
         font-size: 20px;
      }

      .missionDiv {
         padding: 20px;
      }

      .missionText {
         font-size: 16px;
      }

      .VisionDiv {
         flex-direction: row;
         justify-content: space-between;
      }

      .yourDesign {
         width: 90%;
         font-size: 32px;
      }
   }

   /* ===== LARGE DESKTOP STYLES (min-width: 1440px) ===== */
   @media only screen and (min-width: 1440px) {
      .brandDesc {
         font-size: 32px;
      }

      .allCollection {
         font-size: 20px;
      }

      .shopSection > h1 {
         font-size: 40px;
      }

      .orangeDiv > h1 {
         font-size: 56px;
      }

      .yourDesign {
         font-size: 36px;
      }
   }
`;
