import React from "react";
import Hero from "./components/Hero";
import GalleryButtons from "./components/GalleryButtons";
import Lightbox from "./components/Lightbox"; // optional if you’re keeping the zoom featuredsd

export default function App() {
  return (
    <div className="app-root">
      <Hero />
      <GalleryButtons />
      <footer className="bg-white border-top py-3 text-center">
        <b>
          <small className="text-muted">Imagyn - a personal gallery designed by Nilam Chakraborty</small>
        </b>
      </footer>
    </div>
  );
}
