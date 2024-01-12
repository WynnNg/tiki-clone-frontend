import React, { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import ndtk from "../../assets/nhanduyentienkiep.webp";

const images = [
  {
    original: ndtk,
    thumbnail: ndtk,
    originalClass: "book-detail__image__original",
    thumbnailClass: "book-detail__image__thumbnail",
  },
  {
    original: "https://picsum.photos/id/1015/1000/600/",
    thumbnail: "https://picsum.photos/id/1015/250/150/",
    originalClass: "book-detail__image__original",
    thumbnailClass: "book-detail__image__thumbnail",
  },
  {
    original: "https://picsum.photos/id/1019/1000/600/",
    thumbnail: "https://picsum.photos/id/1019/250/150/",
    originalClass: "book-detail__image__original",
    thumbnailClass: "book-detail__image__thumbnail",
  },
  {
    original: "https://picsum.photos/id/1018/1000/600/",
    thumbnail: "https://picsum.photos/id/1018/250/150/",
    originalClass: "book-detail__image__original",
    thumbnailClass: "book-detail__image__thumbnail",
  },
  {
    original: "https://picsum.photos/id/1015/1000/600/",
    thumbnail: "https://picsum.photos/id/1015/250/150/",
    originalClass: "book-detail__image__original",
    thumbnailClass: "book-detail__image__thumbnail",
  },
  {
    original: "https://picsum.photos/id/1019/1000/600/",
    thumbnail: "https://picsum.photos/id/1019/250/150/",
    originalClass: "book-detail__image__original",
    thumbnailClass: "book-detail__image__thumbnail",
  },
];

export default function BookImage(props) {
  const [bookImages, setBookImages] = useState([]);
  const { bookData } = props;

  useEffect(() => {
    getBookImages();
  }, [bookData]);

  const getBookImages = () => {
    if (bookData) {
      let items = [];
      if (bookData.thumbnail) {
        items.push({
          original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            bookData.thumbnail
          }`,
          thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            bookData.thumbnail
          }`,
          originalClass: "book-detail__image__original",
          thumbnailClass: "book-detail__image__thumbnail",
        });
      }
      if (bookData.slider && bookData.slider.length > 0) {
        bookData.slider.map((item) => {
          items.push({
            original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
            thumbnail: `${
              import.meta.env.VITE_BACKEND_URL
            }/images/book/${item}`,
            originalClass: "book-detail__image__original",
            thumbnailClass: "book-detail__image__thumbnail",
          });
        });
      }
      setBookImages(items);
    }
  };
  return (
    <>
      <ImageGallery
        items={bookImages}
        slideOnThumbnailOver={true}
        useBrowserFullscreen={false}
        showNav={false}
        showPlayButton={false}
      />
    </>
  );
}
