import { useState } from "react";
import assetData from "../assets/assets.json";

export default function App() {
  const initialAssets = [
    ...assetData.materials.map((item) => ({ ...item, category: item.category || "Material" })),
    ...assetData.fabrics.map((item) => ({ ...item, category: item.category || "Fabric" })),
    ...assetData.carpets.map((item) => ({ ...item, category: item.category || "Carpet" })),
    ...assetData.flooring.map((item) => ({ ...item, category: item.category || "Flooring" })),
    ...assetData.wallcoverings.map((item) => ({ ...item, category: item.category || "Wallcovering" })),
    ...assetData.furniture.map((item) => ({ ...item, category: item.category || "Furniture" })),
  ];

  const [assets, setAssets] = useState(initialAssets);

  const [form, setForm] = useState({
    category: "Material",
    productNumber: "",
    name: "",
    manufacturer: "",
    finish: "",
    status: "",
  });

  const categories = [
    { name: "Materials", count: assets.filter((asset) => asset.category === "Material").length },
    { name: "Fabrics", count: assets.filter((asset) => asset.category === "Fabric").length },
    { name: "Carpets", count: assets.filter((asset) => asset.category === "Carpet").length },
    { name: "Flooring", count: assets.filter((asset) => asset.category === "Flooring").length },
    { name: "Wallcoverings", count: assets.filter((asset) => asset.category === "Wallcovering").length },
    { name: "Furniture", count: assets.filter((asset) => asset.category === "Furniture").length },
  ];

  const totalAssets = assets.length;

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
    const prefix = getPrefix(form.category);

    const matchingAssets = assets.filter((asset) => asset.id?.startsWith(prefix));

    const newAsset = {
      id: `${prefix}-${String(matchingAssets.length + 1).padStart(3, "0")}`,
      category: form.category,
      productNumber: form.productNumber,
      name: form.name,
      manufacturer: form.manufacturer,
      finish: form.finish,
      status: form.status,
    };

    setAssets([...assets, newAsset]);

    setForm({
      category: "Material",
      productNumber: "",
      name: "",
      manufacturer: "",
      finish: "",
      status: "",
    });
  }

  return (
    <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <section>
        <p style={{ letterSpacing: "2px", fontSize: "12px" }}>
          JAYLABS / MATERIAL INTELLIGENCE
        </p>

        <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>
          Asset Library Dashboard
        </h1>

        <p style={{ fontSize: "18px", color: "#666" }}>
          Digital material library, scanning workflow, and FF&E asset intelligence.
        </p>
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
            <div
              key={category.name}
              style={{
                border: "1px solid #ddd",
                borderRadius: "16px",
                padding: "24px",
                background: "#fafafa",
              }}
            >
              <p style={{ margin: 0, color: "#666" }}>{category.name}</p>
              <h3 style={{ fontSize: "40px", margin: "10px 0 0" }}>
                {category.count}
              </h3>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "40px" }}>
        <h2>System Overview</h2>

        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          <div style={{ border: "1px solid #ddd", padding: "24px", borderRadius: "16px" }}>
            <p>Total Assets</p>
            <strong style={{ fontSize: "32px" }}>{totalAssets}</strong>
          </div>

          <div style={{ border: "1px solid #ddd", padding: "24px", borderRadius: "16px" }}>
            <p>Scanning Studio</p>
            <strong style={{ fontSize: "32px" }}>Ready</strong>
          </div>

          <div style={{ border: "1px solid #ddd", padding: "24px", borderRadius: "16px" }}>
            <p>Mood Board</p>
            <strong style={{ fontSize: "32px" }}>Planned</strong>
          </div>
        </div>
      </section>

      <section style={{ marginTop: "40px" }}>
        <h2>Add Asset</h2>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "20px" }}>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="Material">Material</option>
            <option value="Fabric">Fabric</option>
            <option value="Carpet">Carpet</option>
            <option value="Flooring">Flooring</option>
            <option value="Wallcovering">Wallcovering</option>
            <option value="Furniture">Furniture</option>
            <option value="Lighting">Lighting</option>
            <option value="Artwork">Artwork</option>
            <option value="Accessory">Accessory</option>
          </select>

          <input
            placeholder="Product Number"
            value={form.productNumber}
            onChange={(e) => setForm({ ...form, productNumber: e.target.value })}
          />

          <input
            placeholder="Asset Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Manufacturer"
            value={form.manufacturer}
            onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
          />

          <input
            placeholder="Finish"
            value={form.finish}
            onChange={(e) => setForm({ ...form, finish: e.target.value })}
          />

          <input
            placeholder="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          />

          <button onClick={addAsset}>Add Asset</button>
        </div>
      </section>

      <section style={{ marginTop: "60px" }}>
        <h2>Asset Database</h2>

        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>ID</th>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>Type</th>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>Name</th>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>Product Number</th>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>Manufacturer</th>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>Finish</th>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>Status</th>
            </tr>
          </thead>

          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>{asset.id}</td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>{asset.category}</td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>{asset.name}</td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>{asset.productNumber}</td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>{asset.manufacturer}</td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>{asset.finish}</td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>{asset.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}