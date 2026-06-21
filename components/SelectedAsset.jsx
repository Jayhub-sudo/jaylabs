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

  return (
    <section style={{ ...sectionStyle, marginTop: "40px" }}>
      <h2 style={{ textAlign: "center" }}>Selected Asset</h2>

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
            <div>
              <strong>ID</strong>
              <p>{selectedAsset.id}</p>
            </div>

            <div>
              <strong>Type</strong>
              <p>{selectedAsset.category}</p>
            </div>

            <div>
              <strong>Name</strong>
              <p>{selectedAsset.name}</p>
            </div>

            <div>
              <strong>Status</strong>
              <p>
                <span style={getStatusStyle(selectedAsset.status)}>
                  {selectedAsset.status}
                </span>
              </p>
            </div>

            <div>
              <strong>Product Number</strong>
              <p>{selectedAsset.productNumber || "—"}</p>
            </div>

            <div>
              <strong>Manufacturer</strong>
              <p>{selectedAsset.manufacturer || "—"}</p>
            </div>

            <div>
              <strong>Finish</strong>
              <p>{selectedAsset.finish || "—"}</p>
            </div>

            <div>
              <strong>Color</strong>
              <p>{selectedAsset.color || "—"}</p>
            </div>

            <div>
              <strong>Project</strong>
              <p>{selectedAsset.project || "Unassigned"}</p>
            </div>

            <div>
              <strong>Favorite</strong>
              <p>{selectedAsset.favorite ? "Yes" : "No"}</p>
            </div>

            <div>
              <strong>Vendor Contact</strong>
              <p>{selectedAsset.vendorContact || "—"}</p>
            </div>

            <div>
              <strong>Vendor Email</strong>
              <p>{selectedAsset.vendorEmail || "—"}</p>
            </div>

            <div>
              <strong>Vendor Phone</strong>
              <p>{selectedAsset.vendorPhone || "—"}</p>
            </div>

            <div>
              <strong>Vendor Website</strong>
              <p>{selectedAsset.vendorWebsite || "—"}</p>
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <strong>Vendor Notes</strong>
              <p>{selectedAsset.vendorNotes || "—"}</p>
            </div>

            <div>
              <strong>Rating</strong>
              <p>{selectedAsset.rating || "—"}</p>
            </div>

            <div>
              <strong>Usage</strong>
              <p>{selectedAsset.usage || "—"}</p>
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <strong>Notes</strong>
              <p>{selectedAsset.notes || "—"}</p>
            </div>

            <div style={{ gridColumn: "span 2" }}>
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