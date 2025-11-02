import React from "react";
import { motion } from "framer-motion";

export default function GallerySection({ title, images = [], onOpen = () => {}, onBack = () => {} }) {
  return (
    <section>
      <div className="d-flex align-items-center justify-content-between mb-4">
        {/* Professional back button */}
        <motion.button
          onClick={onBack}
          className="btn btn-outline-primary back-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Back
        </motion.button>
        <h2 className="mb-0 fw-bold">{title}</h2>
        <div style={{ width: "90px" }} /> {/* spacing balance */}
      </div>

      <div className="row g-3">
        {images.map((src, idx) => (
          <div key={src} className="col-6 col-sm-4 col-md-3">
            <button
              className="card thumb-card p-0 border-0"
              onClick={() => onOpen(idx)}
              aria-label={`${title} image ${idx + 1}`}
            >
              <div className="ratio ratio-4x3">
                <img
                  src={src}
                  alt={`${title} ${idx + 1}`}
                  className="card-img-top object-cover"
                  loading="lazy"
                />
              </div>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}