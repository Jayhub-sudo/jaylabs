import { useState } from "react";
import assetData from "../assets/assets.json";

export default function App() {
  const assetTypes = [
    "Material",
    "Fabric",
    "Carpet",
    "Flooring",
    "Wallcovering",
    "Furniture",
    "Lighting",
    "Artwork",
    "Accessory",
  ];

  const initialAssets = [
    ...assetData.materials.map((item) => ({
      productNumber: "",
      finish: "",
      color: "",
      usage: "",
      ...item,
      category: item.category || "Material",
    })),
    ...assetData.fabrics.map((item) => ({
      productNumber: "",
      finish: "",
      color: "",
      usage: "",
      ...item,
      category: item.category || "Fabric",
    })),
    ...assetData.carpets.map((item) => ({
      productNumber: "",
      finish: "",
      color: "",
      usage: "",
      ...item,
      category: item.category || "Carpet",
    })),
    ...assetData.flooring.map((item) => ({
      productNumber: "",
      finish: "",
      color: "",
      usage: "",
      ...item,
      category: item.category || "Flooring",
    })),
    ...assetData.wallcoverings.map((item) => ({
      productNumber: "",
      finish: "",
      color: "",
      usage: "",
      ...item,
      category: item.category || "Wallcovering",
    })),
    ...assetData.furniture.map((item) => ({
      productNumber: "",
      finish: "",
      color: "",
      usage: "",
      ...item,
      category: item.category || "Furniture",
    })),
  ];

  const [assets, setAssets] = useState(() => {
    const savedAssets = localStorage.getItem("jaylabsAssets");
    return savedAssets ? JSON.parse(savedAssets) : initialAssets;
  });

  const [form, setForm] = useState({
    category: "Material",
    productNumber: "",
    name: "",
    manufacturer: "",
    finish: "",
    color: "",
    usage: "",
    status: "Active",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [error, setError] = useState("");

  const categories = assetTypes.map((type) => ({
    name: type,
    count: assets.filter((asset) => asset.category === type).length,
  }));

  const totalAssets = assets.length;
  const activeAssets = assets.filter((asset) => asset.status === "Active").length;
  const inactiveAssets = assets.filter((asset) => asset.status !== "Active").length;

  const filteredAssets = assets.filter((asset) => {
    const searchText = `
      ${asset.id}
      ${asset.category}
      ${asset.name}
      ${asset.productNumber}
      ${asset.manufacturer}
      ${asset.finish}
      ${asset.color}
      ${asset.usage}
      ${asset.status}
    `.toLowerCase();

    const matchesSearch = searchText.includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "All" || asset.category === typeFilter;

    return matchesSearch && matchesType;
  });

  function saveAssets(nextAssets) {
    setAssets(nextAssets);
    localStorage.setItem("jaylabsAssets", JSON.stringify(nextAssets));
  }

  function getPrefix(category) {
    const prefixes = {
      Material: "MAT",
      Fabric: "FAB",
      Carpet: "CAR",
      Flooring: "FLR",
      Wallcovering: "WAL",
      Furniture: "FUR",
      Lighting: "LGT",
      Artwork: "ART",
      Accessory: "ACC",
    };

    return prefixes[category] || "AST";
  }

  function addAsset() {
    if (!form.name.trim()) {
      setError("Asset Name is required.");
      return;
    }

    if (!form.manufacturer.trim()) {
      setError("Manufacturer is required.");
      return;
    }

    const prefix = getPrefix(form.category);
    const matchingAssets = assets.filter((asset) => asset.id?.startsWith(prefix));

    const newAsset = {
      id: `${prefix}-${String(matchingAssets.length + 1).padStart(3, "0")}`,
      category: form.category,
      productNumber: form.productNumber,
      name: form.name,
      manufacturer: form.manufacturer,
      finish: form.finish,
      color: form.color,
      usage: form.usage,
      status: form.status || "Active",
    };

    saveAssets([newAsset, ...assets]);

    setForm({
      category: "Material",
      productNumber: "",
      name: "",
      manufacturer: "",
      finish: "",
      color: "",
      usage: "",
      status: "Active",
    });

    setError("");
  }

  function deleteAsset(id) {
    const confirmed = window.confirm("Delete this asset?");
    if (!confirmed) return;

    const nextAssets = assets.filter((asset) => asset.id !== id);
    saveAssets(nextAssets);
  }

  function resetDemoData() {
    const confirmed = window.confirm("Reset back to original demo data?");
    if (!confirmed) return;

    localStorage.removeItem("jaylabsAssets");
    setAssets(initialAssets);
    setSearchTerm("");
    setTypeFilter("All");
  }

  const pageStyle = {
    padding: "40px",
    fontFamily: "Arial, sans-serif",
    background: "#f8f8f6",
    color: "#222",
    minHeight: "100vh",
  };

  const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: "18px",
    padding: "24px",
    background: "white",
    boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
  };

  const inputStyle = {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    minWidth: "180px",
  };

  const buttonStyle = {
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    background: "#111",
    color: "white",
    cursor: "pointer",
  };

  const tableCellStyle = {
    border: "1px solid #ddd",
    padding: "12px",
    textAlign: "left",
  };

  const tableHeaderStyle = {
    ...tableCellStyle,
    background: "#f1f1ef",
    fontWeight: "bold",
  };

  return (
    <main style={pageStyle}>
      <section>
        <p style={{ letterSpacing: "2px", fontSize: "12px", color: "#777" }}>
          JAYLABS / MATERIAL INTELLIGENCE
        </p>

        <h1 style={{ fontSize: "52px", marginBottom: "10px" }}>
          Asset Library Dashboard
        </h1>

        <p style={{ fontSize: "18px", color: "#666", maxWidth: "800px" }}>
          Digital material library, scanning workflow, FF&E asset intelligence,
          and project-ready product information.
        </p>
      </section>

      <section style={{ marginTop: "40px" }}>
        <h2>System Overview</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <div style={cardStyle}>
            <p>Total Assets</p>
            <strong style={{ fontSize: "36px" }}>{totalAssets}</strong>
          </div>

          <div style={cardStyle}>
            <p>Active Assets</p>
            <strong style={{ fontSize: "36px" }}>{activeAssets}</strong>
          </div>

          <div style={cardStyle}>
            <p>Inactive Assets</p>
            <strong style={{ fontSize: "36px" }}>{inactiveAssets}</strong>
          </div>

          <div style={cardStyle}>
            <p>Scanning Studio</p>
            <strong style={{ fontSize: "32px" }}>Ready</strong>
          </div>
        </div>
      </section>

      <section style={{ marginTop: "40px" }}>
        <h2>Asset Categories</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {categories.map((category) => (
            <div key={category.name} style={cardStyle}>
              <p style={{ margin: 0, color: "#666" }}>{category.name}</p>
              <h3 style={{ fontSize: "40px", margin: "10px 0 0" }}>
                {category.count}
              </h3>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "40px" }}>
        <h2>Find Assets</h2>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "20px",
            alignItems: "center",
          }}
        >
          <input
            placeholder="Search by name, product number, manufacturer, usage..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ ...inputStyle, minWidth: "420px" }}
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={inputStyle}
          >
            <option value="All">All Asset Types</option>
            {assetTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearchTerm("");
              setTypeFilter("All");
            }}
            style={{ ...buttonStyle, background: "#666" }}
          >
            Clear Search
          </button>
        </div>

        <p style={{ color: "#666", marginTop: "10px" }}>
          Showing {filteredAssets.length} of {totalAssets} assets
        </p>
      </section>

      <section style={{ marginTop: "40px" }}>
        <h2>Add Asset</h2>

        {error && (
          <div
            style={{
              background: "#ffe8e8",
              color: "#8a1f1f",
              padding: "12px",
              borderRadius: "8px",
              marginTop: "12px",
              maxWidth: "600px",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "12px",
            marginTop: "20px",
          }}
        >
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            style={inputStyle}
          >
            {assetTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <input
            placeholder="Product Number"
            value={form.productNumber}
            onChange={(e) => setForm({ ...form, productNumber: e.target.value })}
            style={inputStyle}
          />

          <input
            placeholder="Asset Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={inputStyle}
          />

          <input
            placeholder="Manufacturer *"
            value={form.manufacturer}
            onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
            style={inputStyle}
          />

          <input
            placeholder="Finish"
            value={form.finish}
            onChange={(e) => setForm({ ...form, finish: e.target.value })}
            style={inputStyle}
          />

          <input
            placeholder="Color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            style={inputStyle}
          />

          <input
            placeholder="Usage"
            value={form.usage}
            onChange={(e) => setForm({ ...form, usage: e.target.value })}
            style={inputStyle}
          />

          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            style={inputStyle}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Discontinued">Discontinued</option>
            <option value="Pending Review">Pending Review</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <button onClick={addAsset} style={buttonStyle}>
            Add Asset
          </button>

          <button
            onClick={resetDemoData}
            style={{ ...buttonStyle, background: "#999" }}
          >
            Reset Demo Data
          </button>
        </div>
      </section>

      <section style={{ marginTop: "60px" }}>
        <h2>Asset Database</h2>

        <div style={{ overflowX: "auto", marginTop: "20px" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "white",
            }}
          >
            <thead>
              <tr>
                <th style={tableHeaderStyle}>ID</th>
                <th style={tableHeaderStyle}>Type</th>
                <th style={tableHeaderStyle}>Name</th>
                <th style={tableHeaderStyle}>Product Number</th>
                <th style={tableHeaderStyle}>Manufacturer</th>
                <th style={tableHeaderStyle}>Finish</th>
                <th style={tableHeaderStyle}>Color</th>
                <th style={tableHeaderStyle}>Usage</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAssets.map((asset) => (
                <tr key={asset.id}>
                  <td style={tableCellStyle}>{asset.id}</td>
                  <td style={tableCellStyle}>{asset.category}</td>
                  <td style={tableCellStyle}>{asset.name}</td>
                  <td style={tableCellStyle}>{asset.productNumber}</td>
                  <td style={tableCellStyle}>{asset.manufacturer}</td>
                  <td style={tableCellStyle}>{asset.finish}</td>
                  <td style={tableCellStyle}>{asset.color}</td>
                  <td style={tableCellStyle}>{asset.usage}</td>
                  <td style={tableCellStyle}>{asset.status}</td>
                  <td style={tableCellStyle}>
                    <button
                      onClick={() => deleteAsset(asset.id)}
                      style={{
                        background: "#b00020",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredAssets.length === 0 && (
                <tr>
                  <td
                    colSpan="10"
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
    </main>
  );
}