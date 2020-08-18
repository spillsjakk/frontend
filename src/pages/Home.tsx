import React, { Component } from "react";
import { Helmet } from 'react-helmet';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Home.css";
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom';

import Translated from '../components/Translated';

class Home extends Component {
  render() {
    return (
      <>
        <Helmet>
          <title>Home page</title>
        </Helmet>

        <div className="mt-5 carousel-container">
          <Carousel autoPlay={true} interval={10000} showThumbs={false}>
            <div>
              <div className="carousel-image-container">
                <img src="/icons/carousel/management-svgrepo-com.svg" />
              </div>
              <h3 className="mt-3"><Translated str="carousel1" /></h3>
              <p>
                <Translated str="carousel1Desc" />
              </p>
              <p>
                <Link to="/about"><em><Translated str="about" />...</em></Link>
              </p>
            </div>
            <div>
              <div className="carousel-image-container">
                <img src="/icons/carousel/hammer-and-wrench-doodle-svgrepo-com.svg" />
              </div>
              <h3 className="mt-3"><Translated str="carousel2" /></h3>
              <p>
                <Translated str="carousel2Desc" />
              </p>
              <p>
                <Link to="/about"><em><Translated str="about" />...</em></Link>
              </p>
            </div>
            <div>
              <div className="carousel-image-container">
                <img src="/icons/carousel/chess-board-svgrepo-com.svg" />
              </div>
              <h3 className="mt-3"><Translated str="carousel3" /></h3>
              <p>
                <Translated str="carousel3Desc" />
              </p>
              <p>
                <Link to="/about"><em><Translated str="about" />...</em></Link>
              </p>
            </div>
            <div>
              <div className="carousel-image-container">
                <img src="/icons/carousel/podium-svgrepo-com.svg" />
              </div>
              <h3 className="mt-3"><Translated str="carousel4" /></h3>
              <p>
                <Translated str="carousel4Desc" />
              </p>
              <p>
                <Link to="/about"><em><Translated str="about" />...</em></Link>
              </p>
            </div>
          </Carousel>
        </div>
      </>
    );
  }
}

export default Home;