import React, { Component } from "react";
import { Helmet } from 'react-helmet';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Home.css";
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom';

import Translated from '../components/Translated';
import { UserContext, Levels } from "../components/UserContext";

class Home extends Component {
  static contextType = UserContext;
  context!: React.ContextType<typeof UserContext>;

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Home";
  }

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

        <div className="d-flex flex-row align-items-center justify-content-around mt-5 pt-5">
          <div>
            <Link to={(this.context.user.info?.level || 0) >= Levels.TournamentOrganizer ? "/tournament/build" : "/contact"} className="btn p-4 big-btn">
              <img className="icon" src="/icons/trophy.svg" alt="" />&nbsp;
              <Translated str="buildTournament" />
            </Link>
          </div>
          <div>
            <Link to="/tournament/find" className="btn p-4 big-btn">
              <img className="icon" src="/icons/search.svg" alt="" />&nbsp;
              <Translated str="findTournament" />
            </Link>
          </div>
        </div>
      </>
    );
  }
}

export default Home;