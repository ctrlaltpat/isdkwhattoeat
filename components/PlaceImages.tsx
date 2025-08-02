"use client";

import { Component } from "react";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GooglePlacePhoto } from "@/types";

interface PlaceImagesProps {
  images?: GooglePlacePhoto[];
}

export default class PlaceImages extends Component<PlaceImagesProps> {
  private getPhotoUrl(photo: GooglePlacePhoto, maxWidth: number = 400): string {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photo.photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
  }

  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: true,
      lazyLoad: "ondemand" as const,
    };

    const { images } = this.props;

    if (!images || images.length === 0) {
      return (
        <div className="place-image-placeholder">
          <div className="no-image-text">No images available</div>
        </div>
      );
    }

    const imageElements = images.map((img, idx) => (
      <div key={`${idx}-${img.photo_reference}`}>
        <Image
          className="place-image"
          src={this.getPhotoUrl(img, 400)}
          alt={`Place image ${idx + 1}`}
          width={400}
          height={200}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
      </div>
    ));

    const displayImages =
      imageElements.length >= 7 ? imageElements.slice(0, 7) : imageElements;

    return (
      <div className="place-images-container">
        <Slider {...settings}>{displayImages}</Slider>
      </div>
    );
  }
}
