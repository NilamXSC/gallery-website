import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lightbox from "./Lightbox";

/* literal globs for Vite */
const certImports = import.meta.glob("../assets/certificates/*.{jpg,jpeg,png}", { eager: true, import: "default" });
const codingImports = import.meta.glob("../assets/coding/*.{jpg,jpeg,png}", { eager: true, import: "default" });
const miscImports = import.meta.glob("../assets/misc/*.{jpg,jpeg,png}", { eager: true, import: "default" });

function sortedValues(obj) {
  return Object.entries(obj || {})
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([, url]) => url);
}

const CERTIFICATES = sortedValues(certImports);
const CODING = sortedValues(codingImports);
const MISC = sortedValues(miscImports);

function filenameToTitle(path) {
  const parts = path.split("/");
  const name = parts[parts.length - 1] || path;
  return name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
}

const DETAILS_KEY = "imagyn_details";

export default function GalleryButtons() {
  const [active, setActive] = useState("certificates");
  const [lightbox, setLightbox] = useState({ list: null, idx: null });
  const [detailsOpen, setDetailsOpen] = useState({ open: false, src: null, text: "" });
  const [detailsMap, setDetailsMap] = useState({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DETAILS_KEY);
      if (raw) setDetailsMap(JSON.parse(raw));
    } catch (e) {
      console.warn("Failed to load details from localStorage", e);
    }
  }, []);

  function getDetail(src) {
    return detailsMap[src] || `No details available for ${filenameToTitle(src)}.`;
  }

  function openLightbox(list, idx) {
    setLightbox({ list, idx });
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    setLightbox({ list: null, idx: null });
    document.body.style.overflow = "";
  }
  function goto(delta) {
    if (!lightbox.list) return;
    const next = (lightbox.idx + delta + lightbox.list.length) % lightbox.list.length;
    setLightbox({ ...lightbox, idx: next });
  }

  function openDetails(src) {
    setDetailsOpen({ open: true, src, text: getDetail(src) });
    document.body.style.overflow = "hidden";
  }
  function closeDetails() {
    setDetailsOpen({ open: false, src: null, text: "" });
    document.body.style.overflow = "";
  }

  const sections = {
    certificates: { title: "Certificates", items: CERTIFICATES },
    coding: { title: "Coding Area", items: CODING },
    misc: { title: "Miscellaneous", items: MISC },
  };

  const current = sections[active];

  return (
    <section className="gallery-section py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4 gap-3 flex-wrap">
          <h3 className="mb-0 section-title">Browse</h3>

          <div className="button-row d-flex gap-3">
            {Object.keys(sections).map((key) => (
              <motion.button
                key={key}
                onClick={() => setActive(key)}
                className={`btn btn-lg ${active === key ? "btn-primary" : "btn-outline-secondary"}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {sections[key].title}
              </motion.button>
            ))}
          </div>
        </div>

        {current.items.length === 0 ? (
          <div className="alert alert-secondary muted-alert">
            No images found in <code>src/assets/{active}</code>. Add images and restart dev server.
          </div>
        ) : (
          <motion.div
            className="row g-4"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
          >
            {current.items.map((src, idx) => (
              <motion.div
                className="col-12 col-sm-6 col-md-4 col-lg-3"
                key={src + idx}
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              >
                <div className="card gallery-card larger">
                  {/* Make the whole thumb interactive: click or press Enter/Space to open Lightbox */}
                  <div
                    className="thumb-wrap interactive"
                    role="button"
                    tabIndex={0}
                    onClick={() => openLightbox(current.items, idx)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openLightbox(current.items, idx);
                      }
                    }}
                    aria-label={`Open ${filenameToTitle(src)} (press Enter or Space)`}
                  >
                    <img src={src} alt={`${current.title} ${idx + 1}`} className="thumb-img" loading="lazy" />
                    {/* keep a subtle overlay hint */}
                    <div className="thumb-overlay">
                      <span className="thumb-overlay-text">Open</span>
                    </div>
                  </div>

                  <div className="card-body p-2 d-flex justify-content-between align-items-center">
                    {/* Details button placed where filename used to be */}
                    <button className="btn btn-sm btn-outline-secondary details-caption-btn" onClick={() => openDetails(src)}>
                      Details
                    </button>

                    
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {lightbox.list && (
        <Lightbox
          src={lightbox.list[lightbox.idx]}
          onClose={closeLightbox}
          onPrev={() => goto(-1)}
          onNext={() => goto(1)}
        />
      )}

      {/* Read-only Details modal */}
      {detailsOpen.open && (
        <div className="details-modal-overlay" role="dialog" aria-modal="true">
          <div className="details-modal">
            <div className="details-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Details - {filenameToTitle(detailsOpen.src)}</h5>
              <button className="btn btn-sm btn-outline-secondary" onClick={closeDetails}>Close</button>
            </div>

            <div className="details-body mt-3">
              <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>{detailsOpen.text}</pre>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}