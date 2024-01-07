import React, { useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";

const Carousel = ({ items }) => {
  const itemsPerPage = 8;
  const totalItems = items.length;
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextItem = () => {
    if (currentIndex < totalItems - itemsPerPage) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevItem = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);
  };

  const startItemIndex = currentIndex % totalItems;
  const endItemIndex = (startItemIndex + itemsPerPage) % totalItems;

  const displayedItems =
    startItemIndex <= endItemIndex
      ? items.slice(startItemIndex, endItemIndex)
      : [...items.slice(startItemIndex), ...items.slice(0, endItemIndex)];

  const isAtFirstItem = currentIndex === 0;
  const isAtLastItem = currentIndex >= totalItems - itemsPerPage;

  return (
    <div className="carousel-container">
      <MdKeyboardArrowLeft
        className="prev-next-button"
        onClick={!isAtFirstItem ? prevItem : null}
      />

      <div className="carousel-items">
        {displayedItems.map((item, index) => (
          <div
            key={index}
            className={`carousel-item ${
              index === startItemIndex ? "active" : ""
            }`}
          >
            {item}
          </div>
        ))}
      </div>

      <MdKeyboardArrowRight
        className="prev-next-button"
        onClick={!isAtLastItem ? nextItem : null}
      />
    </div>
  );
};

export default Carousel;
