export default function SelectedAsset({
  selectedAsset,
  sectionStyle,
  cardStyle,
  buttonStyle,
  secondaryButtonStyle,
  renderImagePreview,
  getStatusStyle,
  startEdit,
  duplicateAsset,
  toggleFavorite,
  setSelectedAsset,
}) {
  if (!selectedAsset) return null;

  const fieldStyle = {
    padding: "12px",
    border: "1px solid #eee",
    borderRadius: "10px",
    background: "#fafafa",
  };

  const sectionHeaderStyle = {
    gridColumn: "1 / -1",
    marginTop: "10px",
    paddingTop: "12px",
    borderTop: "1px solid #ddd",
    fontSize: "18px",
    fontWeight: "700",
    textAlign: "left",
  };

  return (
    <section style={{ ...sectionStyle, marginTop: "40px" }}>
      <h2 style={{ textAlign: "center" }}>MADA Asset Specification</h2>

      <div style={cardStyle}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 3fr",
            gap: "24px",
          }}
        >
          <div>{renderImagePreview(selectedAsset)}</div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "16px",
              textAlign: "center",
            }}
          >
            <div style={sectionHeaderStyle}>Asset Identity</div>

            <div style={fieldStyle}>
              <strong>ID</strong>
              <p>{selectedAsset.id}</p>
            </div>

            <div style={fieldStyle}>
              <strong>Type</strong>
              <p>{selectedAsset.category}</p>
            </div>

            <div style={fieldStyle}>
              <strong>Name</strong>
              <p>{selectedAsset.name}</p>
            </div>

            <div style={fieldStyle}>
              <strong>Status</strong>
              <p>
                <span style={getStatusStyle(selectedAsset.status)}>
                  {selectedAsset.status}
                </span>
              </p>
            </div>

            <div style={fieldStyle}>
              <strong>Product Number</strong>
              <p>{selectedAsset.productNumber || "—"}</p>
            </div>

            <div style={fieldStyle}>
              <strong>Manufacturer</strong>
              <p>{selectedAsset.manufacturer || "—"}</p>
            </div>

            <div style={fieldStyle}>
              <strong>Project</strong>
              <p>{selectedAsset.project || "Unassigned"}</p>
            </div>

            <div style={fieldStyle}>
              <strong>Favorite</strong>
              <p>{selectedAsset.favorite ? "Yes" : "No"}</p>
            </div>

            <div style={sectionHeaderStyle}>Material & Finish</div>

            <div style={fieldStyle}>
              <strong>Finish</strong>
              <p>{selectedAsset.finish || "—"}</p>
            </div>

            <div style={fieldStyle}>
              <strong>Color</strong>
              <p>{selectedAsset.color || "—"}</p>
            </div>

            <div style={fieldStyle}>
              <strong>Usage</strong>
              <p>{selectedAsset.usage || "—"}</p>
            </div>

            <div style={fieldStyle}>
              <strong>Rating</strong>
              <p>{selectedAsset.rating || "—"}</p>
            </div>

            <div style={sectionHeaderStyle}>Technical Specifications</div>

            <div style={fieldStyle}>
              <strong>Dimensions</strong>
              <p>{selectedAsset.dimensions || "—"}</p>
            </div>

            <div style={fieldStyle}>
              <strong>Cost</strong>
              <p>{selectedAsset.cost || "—"}</p>
            </div>

            <div style={fieldStyle}>
              <strong>Lead Time</strong>
              <p>{selectedAsset.leadTime || "—"}</p>
            </div>

            <div style={fieldStyle}>
              <strong>Warranty</strong>
              <p>{selectedAsset.warranty || "—"}</p>
            </div>

            <div style={sectionHeaderStyle}>Vendor Intelligence</div>

            <div style={fieldStyle}>
              <strong>Vendor Contact</strong>
              <p>{selectedAsset.vendorContact || "—"}</p>
            </div>

            <div style={fieldStyle}>
              <strong>Vendor Email</strong>
              <p>{selectedAsset.vendorEmail || "—"}</p>
            </div>

            <div style={fieldStyle}>
              <strong>Vendor Phone</strong>
              <p>{selectedAsset.vendorPhone || "—"}</p>
            </div>

            <div style={fieldStyle}>
              <strong>Vendor Website</strong>
              <p>{selectedAsset.vendorWebsite || "—"}</p>
            </div>

            <div style={{ ...fieldStyle, gridColumn: "span 4" }}>
              <strong>Vendor Notes</strong>
              <p>{selectedAsset.vendorNotes || "—"}</p>
            </div>

            <div style={sectionHeaderStyle}>Notes & Specifications</div>

            <div style={{ ...fieldStyle, gridColumn: "span 2" }}>
              <strong>Notes</strong>
              <p>{selectedAsset.notes || "—"}</p>
            </div>

            <div style={{ ...fieldStyle, gridColumn: "span 2" }}>
              <strong>Specifications</strong>
              <p>{selectedAsset.specifications || "—"}</p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
          <button onClick={() => startEdit(selectedAsset)} style={buttonStyle}>
            Edit Selected
          </button>

          <button
            onClick={() => duplicateAsset(selectedAsset)}
            style={secondaryButtonStyle}
          >
            Duplicate Selected
          </button>

          <button
            onClick={() => toggleFavorite(selectedAsset.id)}
            style={secondaryButtonStyle}
          >
            {selectedAsset.favorite ? "Remove Favorite" : "Add Favorite"}
          </button>

          <button
            onClick={() => setSelectedAsset(null)}
            style={secondaryButtonStyle}
          >
            Close Panel
          </button>
        </div>
      </div>
    </section>
  );
}