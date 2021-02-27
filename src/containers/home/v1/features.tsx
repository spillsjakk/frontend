import React, { FunctionComponent, useState } from "react";
import { Carousel } from "react-bootstrap";
import Translated from "../../../components/translated";
import style from "./style.module.scss";

const Features: FunctionComponent<{}> = () => {
  const data = [
    {
      title: Translated.byKey("carousel1"),
      description: Translated.byKey("carousel1Desc"),
      icon: "/icons/carousel/management-svgrepo-com.svg",
    },
    {
      title: Translated.byKey("carousel2"),
      description: Translated.byKey("carousel2Desc"),
      icon: "/icons/carousel/hammer-and-wrench-doodle-svgrepo-com.svg",
    },
    {
      title: Translated.byKey("carousel3"),
      description: Translated.byKey("carousel3Desc"),
      icon: "/icons/carousel/chess-board-svgrepo-com.svg",
    },
    {
      title: Translated.byKey("carousel4"),
      description: Translated.byKey("carousel4Desc"),
      icon: "/icons/carousel/podium-svgrepo-com.svg",
    },
  ];

  const [index, setIndex] = useState(0);

  function onCarouselSelect(index: number) {
    setIndex(index);
  }

  return (
    <div>
      <Carousel
        activeIndex={index}
        onSelect={onCarouselSelect}
        className={`${style["features-carousel"]} ${style.box}`}
        interval={8000}
        prevIcon={
          <img
            src="/icons/caret-left-fill.svg"
            alt=""
            width="32"
            height="32"
            className="icon"
          />
        }
        nextIcon={
          <img
            src="/icons/caret-right-fill.svg"
            alt=""
            width="32"
            height="32"
            className="icon"
          />
        }
      >
        {Array.isArray(data) &&
          data.map((datum, i) => (
            <Carousel.Item key={i}>
              <div className={style.item}>
                <div className={style["image-container"]}>
                  <img src={datum.icon} />
                </div>
                <h3>{datum.title}</h3>
                <p>{datum.description}</p>
              </div>
            </Carousel.Item>
          ))}
      </Carousel>
    </div>
  );
};

export { Features };
