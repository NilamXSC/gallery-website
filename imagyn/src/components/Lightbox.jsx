import React, { useEffect } from "react";

export default function Lightbox({ src, onClose = () => {}, onPrev = () => {}, onNext = () => {} }) {
  useEffect(() => {
    function handler(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  return (
    <div className="imagyn-lightbox" role="dialog" aria-modal="true">
      <div className="lb-backdrop" onClick={onClose} />
      <div className="lb-inner">
        <button className="btn lb-nav left" onClick={onPrev} aria-label="Previous">‹</button>
        <img src={src} alt="Full" className="lb-img" />
        <button className="btn lb-nav right" onClick={onNext} aria-label="Next">›</button>

        <button className="btn lb-close" onClick={onClose} aria-label="Close">✕</button>
      </div>
    </div>
  );
}