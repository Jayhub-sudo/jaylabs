import { useState } from "react";
import assetData from "../assets/assets.json";

export default function App() {
  const [materials, setMaterials] = useState(assetData.materials);

  const [form, setForm] = useState({
    name: "",
    manufacturer: "",
    finish: "",
    status: "",
  });

  const categories = [
    { name: "Materials", count: materials.length },
    { name: "Fabrics", count: assetData.fabrics.length },
    { name: "Carpets", count: assetData.carpets.length },
    { name: "Flooring", count: assetData.flooring.length },
    { name: "Wallcoverings", count: assetData.wallcoverings.length },
    { name: "Furniture", count: assetData.furniture.length },
  ];

  const totalAssets = categories.reduce((sum, item) => sum + item.count, 0);

  function addMaterial() {
    const newMaterial = {
      id: `MAT-${String(materials.length + 1).padStart(3, "0")}`,
      name: form.name,
      manufacturer: form.manufacturer,
      finish: form.finish,
      status: form.status,
    };

    setMaterials([...materials, newMaterial]);

    setForm({
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
          <select>
  <option>Asset Type</option>
  <option>Material</option>
  <option>Fabric</option>
  <option>Carpet</option>
  <option>Furniture</option>
  <option>Lighting</option>
</select>
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

          <button onClick={addMaterial}>Add Asset</button>
        </div>
      </section>

      <section style={{ marginTop: "60px" }}>
        <h2>Asset Database</h2>

        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>ID</th>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>Name</th>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>Manufacturer</th>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>Finish</th>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>Status</th>
            </tr>
          </thead>

          <tbody>
            {materials.map((material) => (
              <tr key={material.id}>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>{material.id}</td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>{material.name}</td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>{material.manufacturer}</td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>{material.finish}</td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>{material.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}