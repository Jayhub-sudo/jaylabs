export default function AssetTable({
  filteredAssets,
  selectedAsset,
  sectionStyle,
  tableHeaderStyle,
  tableCellStyle,
  buttonStyle,
  secondaryButtonStyle,
  dangerButtonStyle,
  getAssetImage,
  getStatusStyle,
  setSelectedAsset,
  startEdit,
  duplicateAsset,
  toggleFavorite,
  deleteAsset,
}) {
  return (
    <section style={{ ...sectionStyle, marginTop: "60px" }}>
      <h2 style={{ textAlign: "center" }}>Asset Database</h2>

      <div style={{ overflowX: "auto", marginTop: "20px" }}>
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "white",
          }}
        >
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Image</th>
              <th style={tableHeaderStyle}>ID</th>
              <th style={tableHeaderStyle}>Type</th>
              <th style={tableHeaderStyle}>Name</th>
              <th style={tableHeaderStyle}>Product Number</th>
              <th style={tableHeaderStyle}>Manufacturer</th>
              <th style={tableHeaderStyle}>Finish</th>
              <th style={tableHeaderStyle}>Color</th>
              <th style={tableHeaderStyle}>Project</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Favorite</th>
              <th style={tableHeaderStyle}>Vendor Contact</th>
              <th style={tableHeaderStyle}>Vendor Email</th>
              <th style={tableHeaderStyle}>Rating</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAssets.map((asset) => (
              <tr
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                style={{
                  cursor: "pointer",
                  background:
                    selectedAsset?.id === asset.id ? "#f4f1ea" : "white",
                }}
              >
                <td style={tableCellStyle}>
                  {getAssetImage(asset) ? (
                    <img
                      src={getAssetImage(asset)}
                      alt={asset.name}
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "10px",
                        background: "#eee",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        color: "#777",
                      }}
                    >
                      No image
                    </div>
                  )}
                </td>

                <td style={tableCellStyle}>{asset.id}</td>
                <td style={tableCellStyle}>{asset.category}</td>
                <td style={tableCellStyle}>{asset.name}</td>
                <td style={tableCellStyle}>{asset.productNumber}</td>
                <td style={tableCellStyle}>{asset.manufacturer}</td>
                <td style={tableCellStyle}>{asset.finish}</td>
                <td style={tableCellStyle}>{asset.color}</td>
                <td style={tableCellStyle}>
                  {asset.project || "Unassigned"}
                </td>

                <td style={tableCellStyle}>
                  <span style={getStatusStyle(asset.status)}>
                    {asset.status}
                  </span>
                </td>

                <td style={tableCellStyle}>
                  {asset.favorite ? "★" : "☆"}
                </td>

                <td style={tableCellStyle}>
                  {asset.vendorContact || "-"}
                </td>

                <td style={tableCellStyle}>
                  {asset.vendorEmail || "-"}
                </td>

                <td style={tableCellStyle}>
                  {asset.rating || "-"}
                </td>

                <td style={tableCellStyle}>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        startEdit(asset);
                      }}
                      style={{
                        ...buttonStyle,
                        padding: "8px 10px",
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        duplicateAsset(asset);
                      }}
                      style={{
                        ...secondaryButtonStyle,
                        padding: "8px 10px",
                      }}
                    >
                      Copy
                    </button>

                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleFavorite(asset.id);
                      }}
                      style={{
                        ...secondaryButtonStyle,
                        padding: "8px 10px",
                      }}
                    >
                      {asset.favorite ? "Unstar" : "Star"}
                    </button>

                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteAsset(asset.id);
                      }}
                      style={dangerButtonStyle}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredAssets.length === 0 && (
              <tr>
                <td
                  colSpan="15"
                  style={{
                    ...tableCellStyle,
                    textAlign: "center",
                    color: "#777",
                    padding: "30px",
                  }}
                >
                  No assets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}