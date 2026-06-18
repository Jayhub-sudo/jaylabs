import assetData from "../assets/assets.json";

export default function App() {
  const categories = [
    { name: "Materials", count: assetData.materials.length },
    { name: "Fabrics", count: assetData.fabrics.length },
    { name: "Carpets", count: assetData.carpets.length },
    { name: "Flooring", count: assetData.flooring.length },
    { name: "Wallcoverings", count: assetData.wallcoverings.length },
    { name: "Furniture", count: assetData.furniture.length },
  ];

  const totalAssets = categories.reduce((sum, item) => sum + item.count, 0);

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
          <div
            style={{
              border: "1px solid #ddd",
              padding: "24px",
              borderRadius: "16px",
            }}
          >
            <p>Total Assets</p>
            <strong style={{ fontSize: "32px" }}>{totalAssets}</strong>
          </div>

          <div
            style={{
              border: "1px solid #ddd",
              padding: "24px",
              borderRadius: "16px",
            }}
          >
            <p>Scanning Studio</p>
            <strong style={{ fontSize: "32px" }}>Ready</strong>
          </div>

          <div
            style={{
              border: "1px solid #ddd",
              padding: "24px",
              borderRadius: "16px",
            }}
          >
            <p>Mood Board</p>
            <strong style={{ fontSize: "32px" }}>Planned</strong>
          </div>
        </div>
      </section>
    </main>
  );
}