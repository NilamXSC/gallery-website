import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Fixed GalleryInfinite
 * 
 * - import.meta.glob() must use a literal path, so we map gallery names to known folders
 * - Supports 'certificates', 'coding', and 'misc' sections
 */

export default function GalleryInfinite({
  title,
  section = "certificates",
  pageSize = 12,
  onOpen = () => {},
  onBack = () => {},
}) {
  // 🧩 1. Use literal import.meta.glob calls for each section
  let allImportsObj = {};
  if (section === "certificates") {
    allImportsObj = import.meta.glob("../assets/certificates/*.{jpg,jpeg,png}", { eager: false });
  } else if (section === "coding") {
    allImportsObj = import.meta.glob("../assets/coding/*.{jpg,jpeg,png}", { eager: false });
  } else if (section === "misc") {
    allImportsObj = import.meta.glob("../assets/misc/*.{jpg,jpeg,png}", { eager: false });
  }

  const keys = useMemo(() => Object.keys(allImportsObj).sort(), []);
  const [loadedUrls, setLoadedUrls] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef(null);

  async function loadPage(p) {
    if (loading) return;
    setLoading(true);
    const start = p * pageSize;
    const slice = keys.slice(start, start + pageSize);
    const promises = slice.map((k) => allImportsObj[k]().then((m) => m.default || m));
    try {
      const results = await Promise.all(promises);
      setLoadedUrls((prev) => [...prev, ...results]);
    } catch (err) {
      console.error("Error loading images:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoadedUrls([]);
    setPage(0);
    if (keys.length > 0) loadPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loading) {
            const nextPage = page + 1;
            const nextStart = nextPage * pageSize;
            if (nextStart < keys.length) {
              loadPage(nextPage);
              setPage(nextPage);
            }
          }
        });
      },
      { rootMargin: "300px" }
    );
    io.observe(sentinelRef.current);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, loading, keys.length]);

  return (
    <section>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <button className="btn btn-outline-primary" onClick={onBack}>Back</button>
        <h2 className="mb-0 fw-bold">{title}</h2>
        <div style={{ width: 90 }} />
      </div>

      <div className="row g-3">
        {loadedUrls.map((src, idx) => (
          <div className="col-6 col-sm-4 col-md-3" key={src + idx}>
            <button
              className="card thumb-card p-0 border-0"
              onClick={() => onOpen(loadedUrls, idx)}
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

      <div ref={sentinelRef} style={{ height: 1, margin: "22px 0" }} />

      {loading && (
        <div className="text-center py-3 text-muted">Loading more images...</div>
      )}

      {loadedUrls.length === 0 && !loading && (
        <div className="alert alert-warning mt-3">
          No images found in <code>src/assets/{section}</code>. Check your folder and restart the dev server.
        </div>
      )}
    </section>
  );
}