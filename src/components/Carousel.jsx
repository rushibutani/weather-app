import React, { useState, useRef, useEffect } from "react";

const Carousel = ({ children }) => {
  const sliderRef = useRef(null);
  const [startPosition, setStartPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [itemWidth, setItemWidth] = useState(200);

  useEffect(() => {
    const itemCount = children.length;
    const containerWidth = sliderRef.current.offsetWidth;
    setItemWidth(containerWidth / itemCount);
  }, []);

  const handleMouseDown = (e, index) => {
    setIsDragging(true);
    setStartPosition(e.clientX);
    setSelectedItemIndex(index);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const delta = e.clientX - startPosition;
    sliderRef.current.scrollLeft -= delta;
    setStartPosition(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e, index) => {
    setStartPosition(e.touches[0].clientX);
    setSelectedItemIndex(index);
  };

  const handleTouchMove = (e) => {
    const delta = e.touches[0].clientX - startPosition;
    sliderRef.current.scrollLeft -= delta;
    setStartPosition(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleSnapToSlide = () => {
    if (!itemWidth) return;
    const newSlideIndex = Math.round(sliderRef.current.scrollLeft / itemWidth);
    setSelectedItemIndex(newSlideIndex);
  };

  useEffect(() => {
    const handleScrollEnd = () => {
      handleSnapToSlide();
    };
    sliderRef.current.addEventListener("scroll", handleScrollEnd);
    return () =>
      sliderRef?.current?.removeEventListener("scroll", handleScrollEnd);
  }, [itemWidth]);

  return (
    <div
      className="slider"
      ref={sliderRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children.map((child, index) => (
        <div
          key={index}
          className={`carousel-item ${
            index === selectedItemIndex ? "selected" : ""
          }`}
          onMouseDown={(e) => handleMouseDown(e, index)}
          onTouchStart={(e) => handleTouchStart(e, index)}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default Carousel;
