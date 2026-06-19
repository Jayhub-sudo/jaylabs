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

  const emptyForm = {
    category: "Material",
    productNumber: "",
    name: "",
    manufacturer: "",
    finish: "",
    color: "",
    usage: "",
    status: "Active",
  };

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

  const [form, setForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [error, setError] = useState("");

  const categories = assetTypes.map((type) => ({
    name: type,
    count: assets.filter((asset) => asset.category === type).length,
  }));

  const totalAssets = assets.length;
  const activeAssets = assets.filter((asset) => asset.status === "Active").length;
  const discontinuedAssets = assets.filter((asset) => asset.status === "Discontinued").length;
  const pendingAssets = assets.filter((asset) => asset.status === "Pending Review").length;

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
    const matchesStatus = statusFilter === "All" || asset.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
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

  function validateAsset(asset) {
    if (!asset.name.trim()) return "Asset Name is required.";
    if (!asset.manufacturer.trim()) return "Manufacturer is required.";
    return "";
  }

  function addAsset() {
    const validationMessage = validateAsset(form);

    if (validationMessage) {
      setError(validationMessage);
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
    setForm(emptyForm);
    setError("");
    setSelectedAsset(newAsset);
  }

  function startEdit(asset) {
    setEditingId(asset.id);
    setEditForm({
      category: asset.category || "Material",
      productNumber: asset.productNumber || "",
      name: asset.name || "",
      manufacturer: asset.manufacturer || "",
      finish: asset.finish || "",
      color: asset.color || "",
      usage: asset.usage || "",
      status: asset.status || "Active",
    });
    setSelectedAsset(asset);
    setError("");
  }

  function saveEdit() {
    const validationMessage = validateAsset(editForm);

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    const nextAssets = assets.map((asset) =>
      asset.id === editingId
        ? {
            ...asset,
            category: editForm.category,
            productNumber: editForm.productNumber,
            name: editForm.name,
            manufacturer: editForm.manufacturer,
            finish: editForm.finish,
            color: editForm.color,
            usage: editForm.usage,
            status: editForm.status,
          }
        : asset
    );

    saveAssets(nextAssets);

    const updatedAsset = nextAssets.find((asset) => asset.id === editingId);
    setSelectedAsset(updatedAsset);
    setEditingId(null);
    setEditForm(emptyForm);
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(emptyForm);
    setError("");
  }

  function deleteAsset(id) {
    const confirmed = window.confirm("Delete this asset?");
    if (!confirmed) return;

    const nextAssets = assets.filter((asset) => asset.id !== id);
    saveAssets(nextAssets);

    if (selectedAsset?.id === id) {
      setSelectedAsset(null);
    }

    if (editingId === id) {
      cancelEdit();
    }
  }

  function duplicateAsset(asset) {
    const prefix = getPrefix(asset.category);
    const matchingAssets = assets.filter((item) => item.id?.startsWith(prefix));

    const duplicatedAsset = {
      ...asset,
      id: `${prefix}-${String(matchingAssets.length + 1).padStart(3, "0")}`,
      name: `${asset.name} Copy`,
      status: "Pending Review",
    };

    saveAssets([duplicatedAsset, ...assets]);
    setSelectedAsset(duplicatedAsset);
  }

  function resetDemoData() {
    const confirmed = window.confirm("Reset back to original demo data?");
    if (!confirmed) return;

    localStorage.removeItem("jaylabsAssets");
    setAssets(initialAssets);
    setSearchTerm("");
    setTypeFilter("All");
    setStatusFilter("All");
    setSelectedAsset(null);
    setEditingId(null);
    setError("");
  }

  function getStatusStyle(status) {
    const base = {
      display: "inline-block",
      padding: "6px 10px",
      borderRadius: "999px",
      fontSize: "13px",
      fontWeight: "bold",
    };

    if (status === "Active") {
      return { ...base, background: "#e8f5e9", color: "#1b5e20" };
    }

    if (status === "Discontinued") {
      return { ...base, background: "#ffebee", color: "#b71c1c" };
    }

    if (status === "Pending Review") {
      return { ...base, background: "#fff8e1", color: "#8a5a00" };
    }

    return { ...base, background: "#eeeeee", color: "#444" };
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
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    minWidth: "180px",
    fontSize: "15px",
  };

  const buttonStyle = {
    padding: "11px 16px",
    border: "none",
    borderRadius: "10px",
    background: "#111",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: "#777",
  };

  const dangerButtonStyle = {
    ...buttonStyle,
    background: "#b00020",
    padding: "8px 12px",
  };

  const tableCellStyle = {
    border: "1px solid #ddd",
    padding: "12px",
    textAlign: "left",
    verticalAlign: "top",
  };

  const tableHeaderStyle = {
    ...tableCellStyle,
    background: "#f1f1ef",
    fontWeight: "bold",
  };

  function renderAssetForm(currentForm, setCurrentForm) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginTop: "20px",
        }}
      >
        <select
          value={currentForm.category}
          onChange={(e) => setCurrentForm({ ...currentForm, category: e.target.value })}
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
          value={currentForm.productNumber}
          onChange={(e) => setCurrentForm({ ...currentForm, productNumber: e.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="Asset Name *"
          value={currentForm.name}
          onChange={(e) => setCurrentForm({ ...currentForm, name: e.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="Manufacturer *"
          value={currentForm.manufacturer}
          onChange={(e) => setCurrentForm({ ...currentForm, manufacturer: e.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="Finish"
          value={currentForm.finish}
          onChange={(e) => setCurrentForm({ ...currentForm, finish: e.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="Color"
          value={currentForm.color}
          onChange={(e) => setCurrentForm({ ...currentForm, color: e.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="Usage"
          value={currentForm.usage}
          onChange={(e) => setCurrentForm({ ...currentForm, usage: e.target.value })}
          style={inputStyle}
        />

        <select
          value={currentForm.status}
          onChange={(e) => setCurrentForm({ ...currentForm, status: e.target.value })}
          style={inputStyle}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Discontinued">Discontinued</option>
          <option value="Pending Review">Pending Review</option>
        </select>
      </div>
    );
  }

  return (
    <main style={pageStyle}>
      <section>
        <p style={{ letterSpacing: "2px", fontSize: "12px", color: "#777" }}>
          JAYLABS / MATERIAL INTELLIGENCE
        </p>

        <h1 style={{ fontSize: "52px", marginBottom: "10px" }}>
          Asset Library Dashboard
        </h1>

        <p style={{ fontSize: "18px", color: "#666", maxWidth: "850px" }}>
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
            <p>Discontinued</p>
            <strong style={{ fontSize: "36px" }}>{discontinuedAssets}</strong>
          </div>

          <div style={cardStyle}>
            <p>Pending Review</p>
            <strong style={{ fontSize: "36px" }}>{pendingAssets}</strong>
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

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={inputStyle}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Discontinued">Discontinued</option>
            <option value="Pending Review">Pending Review</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm("");
              setTypeFilter("All");
              setStatusFilter("All");
            }}
            style={secondaryButtonStyle}
          >
            Clear Search
          </button>
        </div>

        <p style={{ color: "#666", marginTop: "10px" }}>
          Showing {filteredAssets.length} of {totalAssets} assets
        </p>
      </section>

      <section style={{ marginTop: "40px" }}>
        <h2>{editingId ? "Edit Asset" : "Add Asset"}</h2>

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

        {editingId ? renderAssetForm(editForm, setEditForm) : renderAssetForm(form, setForm)}

        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          {editingId ? (
            <>
              <button onClick={saveEdit} style={buttonStyle}>
                Save Changes
              </button>

              <button onClick={cancelEdit} style={secondaryButtonStyle}>
                Cancel Edit
              </button>
            </>
          ) : (
            <>
              <button onClick={addAsset} style={buttonStyle}>
                Add Asset
              </button>

              <button onClick={resetDemoData} style={secondaryButtonStyle}>
                Reset Demo Data
              </button>
            </>
          )}
        </div>
      </section>

      {selectedAsset && (
        <section style={{ marginTop: "40px" }}>
          <h2>Selected Asset</h2>

          <div style={cardStyle}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "16px",
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

              <div style={{ gridColumn: "span 4" }}>
                <strong>Usage</strong>
                <p>{selectedAsset.usage || "—"}</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <button onClick={() => startEdit(selectedAsset)} style={buttonStyle}>
                Edit Selected
              </button>

              <button onClick={() => duplicateAsset(selectedAsset)} style={secondaryButtonStyle}>
                Duplicate Selected
              </button>

              <button onClick={() => setSelectedAsset(null)} style={secondaryButtonStyle}>
                Close Panel
              </button>
            </div>
          </div>
        </section>
      )}

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
                <tr
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  style={{
                    cursor: "pointer",
                    background: selectedAsset?.id === asset.id ? "#f4f1ea" : "white",
                  }}
                >
                  <td style={tableCellStyle}>{asset.id}</td>
                  <td style={tableCellStyle}>{asset.category}</td>
                  <td style={tableCellStyle}>{asset.name}</td>
                  <td style={tableCellStyle}>{asset.productNumber}</td>
                  <td style={tableCellStyle}>{asset.manufacturer}</td>
                  <td style={tableCellStyle}>{asset.finish}</td>
                  <td style={tableCellStyle}>{asset.color}</td>
                  <td style={tableCellStyle}>{asset.usage}</td>
                  <td style={tableCellStyle}>
                    <span style={getStatusStyle(asset.status)}>{asset.status}</span>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          startEdit(asset);
                        }}
                        style={{ ...buttonStyle, padding: "8px 10px" }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          duplicateAsset(asset);
                        }}
                        style={{ ...secondaryButtonStyle, padding: "8px 10px" }}
                      >
                        Copy
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