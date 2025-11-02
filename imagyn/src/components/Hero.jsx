import React from "react";
import { motion } from "framer-motion";

export default function Hero({ onSelect = () => {} }) {
  const owner = (window.__IMAGYN && window.__IMAGYN.owner) || "Nilam Chakraborty";

  return (
    <header className="hero bg-dark text-white py-5">
      <div className="container">
        <div className="row align-items-center gy-4">
          {/* Left: welcome message (buttons removed) */}
          <div className="col-md-7">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="display-5 fw-bold mb-3 hero-title-line">
                Welcome to <span className="hero-imagyn">Imagyn</span>
              </h1>

              <p className="lead text-white-50">
                What would you like to browse today?
              </p>
            </motion.div>
          </div>

          {/* Right: hero card with image */}
          <div className="col-md-5 text-center">
            <motion.div
              className="hero-card p-0 rounded-3 shadow-sm overflow-hidden"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="hero-visual" role="img" aria-label="Imagyn hero image">
                <div className="hero-overlay" />
                <div className="hero-title-wrap">
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
}