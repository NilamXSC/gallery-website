import React, { useEffect, useState } from "react";

/*
  DetailsEditor — simple admin/editor to edit details for every image and save to localStorage.
  Usage: import and render this component somewhere only you can access (e.g., route /admin or hidden UI).
*/

const DETAILS_KEY = "imagyn_details";

export default function DetailsEditor({ images = [] }) {
  const [map, setMap] = useState({});
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DETAILS_KEY);
      if (raw) setMap(JSON.parse(raw));
    } catch (e) {
      console.warn("Failed to load details:", e);
    }
  }, []);

  function handleChange(src, text) {
    setMap((m) => {
      const next = { ...m, [src]: text };
      setDirty(true);
      return next;
    });
  }

  function handleSave() {
    try {
      localStorage.setItem(DETAILS_KEY, JSON.stringify(map));
      setDirty(false);
      alert("Details saved to localStorage.");
    } catch (e) {
      console.error("Failed to save details", e);
      alert("Save failed — see console.");
    }
  }

  function handleClear(src) {
    setMap((m) => {
      const next = { ...m };
      delete next[src];
      setDirty(true);
      return next;
    });
  }

  return (
    <div style={{ padding: 20 }}>
      <h3>Details Editor</h3>
      <p className="text-muted">Edit details for images. Changes saved to localStorage (imagyn_details).</p>

      <div style={{ display: "grid", gap: 12 }}>
        {images.length === 0 ? (
          <div className="alert alert-secondary">No images passed to the editor. Provide the images prop.</div>
        ) : (
          images.map((src) => (
            <div key={src} style={{ border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <img src={src} alt="" style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 6 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{src.split("/").pop()}</div>
                  <textarea
                    value={map[src] || ""}
                    onChange={(e) => handleChange(src, e.target.value)}
                    rows={4}
                    style={{ width: "100%", marginTop: 8 }}
                  />
                  <div style={{ marginTop: 8 }}>
                    <button className="btn btn-sm btn-primary me-2" onClick={handleSave} disabled={!dirty}>Save All</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleClear(src)}>Clear</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}