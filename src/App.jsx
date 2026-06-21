import { useState } from "react";
import assetData from "../assets/assets.json";
import SelectedAsset from "../components/SelectedAsset";
import AssetTable from "../components/AssetTable";

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

  const projectOptions = [
    "Unassigned",
    "Tillberg Concept",
    "Hospitality Project",
    "Residential Project",
    "Cruise Interior",
    "Mockup Room",
    "Vendor Review",
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
    project: "Unassigned",
    notes: "",
    specifications: "",
    imageUrl: "",
    imageData: "",
    favorite: false,
    vendorContact: "",
vendorEmail: "",
vendorPhone: "",
vendorWebsite: "",
vendorNotes: "",
rating: "3",
  };

  function normalizeAsset(asset, fallbackCategory) {
    return {
      productNumber: "",
      finish: "",
      color: "",
      usage: "",
      status: "Active",
      project: "Unassigned",
      notes: "",
      specifications: "",
      imageUrl: "",
      imageData: "",
      favorite: false,
      vendorContact: "",
      vendorEmail: "",
      vendorPhone: "",
      vendorWebsite: "",
      vendorNotes: "",
      rating: "3",
      ...asset,
      category: asset.category || fallbackCategory,
    };
  }

  const initialAssets = [
    ...assetData.materials.map((item) => normalizeAsset(item, "Material")),
    ...assetData.fabrics.map((item) => normalizeAsset(item, "Fabric")),
    ...assetData.carpets.map((item) => normalizeAsset(item, "Carpet")),
    ...assetData.flooring.map((item) => normalizeAsset(item, "Flooring")),
    ...assetData.wallcoverings.map((item) => normalizeAsset(item, "Wallcovering")),
    ...assetData.furniture.map((item) => normalizeAsset(item, "Furniture")),
  ];

  const [assets, setAssets] = useState(() => {
    const savedAssets = localStorage.getItem("jaylabsAssets");
    if (!savedAssets) return initialAssets;

    try {
      return JSON.parse(savedAssets).map((asset) =>
        normalizeAsset(asset, asset.category || "Material")
      );
    } catch {
      return initialAssets;
    }
  });

  const [form, setForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");
  const [manufacturerFilter, setManufacturerFilter] = useState("All");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [error, setError] = useState("");

  const manufacturers = Array.from(
    new Set(
      assets
        .map((asset) => asset.manufacturer)
        .filter((manufacturer) => manufacturer && manufacturer.trim())
    )
  ).sort();

  const projects = Array.from(
    new Set([
      ...projectOptions,
      ...assets
        .map((asset) => asset.project)
        .filter((project) => project && project.trim()),
    ])
  );

  const categories = assetTypes.map((type) => ({
    name: type,
    count: assets.filter((asset) => asset.category === type).length,
  }));

  const manufacturerStats = manufacturers.map((manufacturer) => ({
    name: manufacturer,
    count: assets.filter((asset) => asset.manufacturer === manufacturer).length,
  }));

  const projectStats = projects.map((project) => ({
    name: project,
    count: assets.filter((asset) => asset.project === project).length,
  }));

  const totalAssets = assets.length;
  const activeAssets = assets.filter((asset) => asset.status === "Active").length;
  const discontinuedAssets = assets.filter((asset) => asset.status === "Discontinued").length;
  const pendingAssets = assets.filter((asset) => asset.status === "Pending Review").length;
  const favoriteAssets = assets.filter((asset) => asset.favorite).length;
  const assetsWithImages = assets.filter((asset) => asset.imageData || asset.imageUrl).length;

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
      ${asset.project}
      ${asset.notes}
      ${asset.specifications}
    `.toLowerCase();

    const matchesSearch = searchText.includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "All" || asset.category === typeFilter;
    const matchesStatus = statusFilter === "All" || asset.status === statusFilter;
    const matchesProject = projectFilter === "All" || asset.project === projectFilter;
    const matchesManufacturer =
      manufacturerFilter === "All" || asset.manufacturer === manufacturerFilter;
    const matchesFavorite = !showFavoritesOnly || asset.favorite;

    return (
      matchesSearch &&
      matchesType &&
      matchesStatus &&
      matchesProject &&
      matchesManufacturer &&
      matchesFavorite
    );
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
      project: form.project || "Unassigned",
      notes: form.notes,
      specifications: form.specifications,
      imageUrl: form.imageUrl,
      imageData: form.imageData,
      favorite: form.favorite,
      vendorContact: form.vendorContact,
      vendorEmail: form.vendorEmail,
      vendorPhone: form.vendorPhone,
      vendorWebsite: form.vendorWebsite,
      vendorNotes: form.vendorNotes,
      rating: form.rating,
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
      project: asset.project || "Unassigned",
      notes: asset.notes || "",
      specifications: asset.specifications || "",
      imageUrl: asset.imageUrl || "",
      imageData: asset.imageData || "",
      favorite: asset.favorite || false,
    });
    setSelectedAsset(asset);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
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
            project: editForm.project,
            notes: editForm.notes,
            specifications: editForm.specifications,
            imageUrl: editForm.imageUrl,
            imageData: editForm.imageData,
            favorite: editForm.favorite,
            vendorContact: editForm.vendorContact,
            vendorEmail: editForm.vendorEmail,
            vendorPhone: editForm.vendorPhone,
            vendorWebsite: editForm.vendorWebsite,
            vendorNotes: editForm.vendorNotes,
            rating: editForm.rating,
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
      favorite: false,
    };

    saveAssets([duplicatedAsset, ...assets]);
    setSelectedAsset(duplicatedAsset);
  }

  function toggleFavorite(id) {
    const nextAssets = assets.map((asset) =>
      asset.id === id ? { ...asset, favorite: !asset.favorite } : asset
    );

    saveAssets(nextAssets);

    const updatedSelected = nextAssets.find((asset) => asset.id === selectedAsset?.id);
    if (updatedSelected) setSelectedAsset(updatedSelected);
  }

  function resetDemoData() {
    const confirmed = window.confirm("Reset back to original demo data?");
    if (!confirmed) return;

    localStorage.removeItem("jaylabsAssets");
    setAssets(initialAssets);
    setSearchTerm("");
    setTypeFilter("All");
    setStatusFilter("All");
    setProjectFilter("All");
    setManufacturerFilter("All");
    setShowFavoritesOnly(false);
    setSelectedAsset(null);
    setEditingId(null);
    setError("");
  }

  function clearFilters() {
    setSearchTerm("");
    setTypeFilter("All");
    setStatusFilter("All");
    setProjectFilter("All");
    setManufacturerFilter("All");
    setShowFavoritesOnly(false);
  }

  function handleImageUpload(event, currentForm, setCurrentForm) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setCurrentForm({
        ...currentForm,
        imageData: reader.result,
        imageUrl: "",
      });
      setError("");
    };

    reader.readAsDataURL(file);
  }

  function removeImage(currentForm, setCurrentForm) {
    setCurrentForm({
      ...currentForm,
      imageData: "",
      imageUrl: "",
    });
  }

  function getAssetImage(asset) {
    return asset.imageData || asset.imageUrl || "";
  }

  function exportCsv() {
    const headers = [
      "ID",
      "Type",
      "Name",
      "Product Number",
      "Manufacturer",
      "Finish",
      "Color",
      "Usage",
      "Status",
      "Project",
      "Notes",
      "Specifications",
      "Favorite",
    ];

    const rows = filteredAssets.map((asset) => [
      asset.id,
      asset.category,
      asset.name,
      asset.productNumber,
      asset.manufacturer,
      asset.finish,
      asset.color,
      asset.usage,
      asset.status,
      asset.project,
      asset.notes,
      asset.specifications,
      asset.favorite ? "Yes" : "No",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => {
            const value = String(cell ?? "");
            return `"${value.replace(/"/g, '""')}"`;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "jaylabs-assets.csv";
    link.click();

    URL.revokeObjectURL(url);
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

  const sectionStyle = {
    maxWidth: "1500px",
    margin: "0 auto",
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
    background: "white",
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

  const imageBoxStyle = {
    width: "100%",
    minHeight: "160px",
    borderRadius: "16px",
    border: "1px dashed #bbb",
    background: "#f3f3f1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    color: "#777",
    fontSize: "14px",
  };

  function renderImagePreview(asset) {
    const image = getAssetImage(asset);

    if (!image) {
      return <div style={imageBoxStyle}>No image</div>;
    }

    return (
      <div style={imageBoxStyle}>
        <img
          src={image}
          alt={asset.name}
          style={{
            width: "100%",
            height: "220px",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    );
  }

  function renderAssetForm(currentForm, setCurrentForm) {
    return (
      <>
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

          <select
            value={currentForm.project}
            onChange={(e) => setCurrentForm({ ...currentForm, project: e.target.value })}
            style={inputStyle}
          >
            {projects.map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </select>

          <input
            placeholder="Image URL"
            value={currentForm.imageUrl}
            onChange={(e) =>
              setCurrentForm({
                ...currentForm,
                imageUrl: e.target.value,
                imageData: "",
              })
            }
            style={inputStyle}
          />

          <label
            style={{
              ...inputStyle,
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              background: "#fff",
            }}
          >
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={(event) => handleImageUpload(event, currentForm, setCurrentForm)}
              style={{ display: "none" }}
            />
          </label>

          <label
            style={{
              ...inputStyle,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <input
              type="checkbox"
              checked={currentForm.favorite}
              onChange={(e) =>
                setCurrentForm({ ...currentForm, favorite: e.target.checked })
              }
            />
            Favorite
          </label>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 2fr 1fr",
            gap: "12px",
            marginTop: "12px",
          }}
        >
          <textarea
            placeholder="Notes"
            value={currentForm.notes}
            onChange={(e) => setCurrentForm({ ...currentForm, notes: e.target.value })}
            style={{
              ...inputStyle,
              minHeight: "90px",
              resize: "vertical",
              fontFamily: "Arial, sans-serif",
            }}
          />

          <textarea
            placeholder="Specifications"
            value={currentForm.specifications}
            onChange={(e) =>
              setCurrentForm({ ...currentForm, specifications: e.target.value })
            }
            style={{
              ...inputStyle,
              minHeight: "90px",
              resize: "vertical",
              fontFamily: "Arial, sans-serif",
            }}
          />
          <input
  placeholder="Vendor Contact"
  value={currentForm.vendorContact}
  onChange={(e) =>
    setCurrentForm({ ...currentForm, vendorContact: e.target.value })
  }
  style={inputStyle}
/>
          <input
  placeholder="Vendor Email"
  value={currentForm.vendorEmail}
  onChange={(e) =>
    setCurrentForm({ ...currentForm, vendorEmail: e.target.value })
  }
  style={inputStyle}
/>

<input
  placeholder="Vendor Phone"
  value={currentForm.vendorPhone}
  onChange={(e) =>
    setCurrentForm({ ...currentForm, vendorPhone: e.target.value })
  }
  style={inputStyle}
/>

<input
  placeholder="Vendor Website"
  value={currentForm.vendorWebsite}
  onChange={(e) =>
    setCurrentForm({ ...currentForm, vendorWebsite: e.target.value })
  }
  style={inputStyle}
/>

<textarea
  placeholder="Vendor Notes"
  value={currentForm.vendorNotes}
  onChange={(e) =>
    setCurrentForm({ ...currentForm, vendorNotes: e.target.value })
  }
  style={{
    ...inputStyle,
    minHeight: "90px",
    resize: "vertical",
    fontFamily: "Arial, sans-serif",
  }}
/>

<select
  value={currentForm.rating}
  onChange={(e) =>
    setCurrentForm({ ...currentForm, rating: e.target.value })
  }
  style={inputStyle}
>
  <option value="1">★☆☆☆☆</option>
  <option value="2">★★☆☆☆</option>
  <option value="3">★★★☆☆</option>
  <option value="4">★★★★☆</option>
  <option value="5">★★★★★</option>
</select>


          <div>
            {currentForm.imageData || currentForm.imageUrl ? (
              <>
                {renderImagePreview(currentForm)}
                <button
                  onClick={() => removeImage(currentForm, setCurrentForm)}
                  style={{
                    ...secondaryButtonStyle,
                    marginTop: "10px",
                    width: "100%",
                  }}
                  type="button"
                >
                  Remove Image
                </button>
              </>
            ) : (
              <div style={imageBoxStyle}>Image preview</div>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <main style={pageStyle}>
      <section style={{ ...sectionStyle, marginTop: "0px" }}>
        <p
          style={{
            letterSpacing: "4px",
            fontSize: "12px",
            color: "#777",
            textAlign: "center",
          }}
        >
          JAYLABS / MADA
        </p>

        <h1
          style={{
            fontSize: "58px",
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          MADA
        </h1>

        <p
  style={{
    fontSize: "18px",
    color: "#666",
    maxWidth: "850px",
    margin: "0 auto",
    textAlign: "center",
  }}
>
  Material Asset & Design Application for managing materials, finishes, furniture, vendors, project assignments, images, specifications, and design-ready asset intelligence.
</p>
</section>
      <section style={{ ...sectionStyle, marginTop: "40px" }}>
        <h2 style={{ textAlign: "center" }}>System Overview</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <div style={cardStyle}>
            <p>Total Assets</p>
            <strong style={{ fontSize: "36px" }}>{totalAssets}</strong>
          </div>

          <div style={cardStyle}>
            <p>Active</p>
            <strong style={{ fontSize: "36px" }}>{activeAssets}</strong>
          </div>

          <div style={cardStyle}>
            <p>Pending</p>
            <strong style={{ fontSize: "36px" }}>{pendingAssets}</strong>
          </div>

          <div style={cardStyle}>
            <p>Discontinued</p>
            <strong style={{ fontSize: "36px" }}>{discontinuedAssets}</strong>
          </div>

          <div style={cardStyle}>
            <p>Favorites</p>
            <strong style={{ fontSize: "36px" }}>{favoriteAssets}</strong>
          </div>

          <div style={cardStyle}>
            <p>With Images</p>
            <strong style={{ fontSize: "36px" }}>{assetsWithImages}</strong>
          </div>
        </div>
      </section>

      <section style={{ ...sectionStyle, marginTop: "40px" }}>
        <h2 style={{ textAlign: "center" }}>Asset Categories</h2>

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

      <section style={{ ...sectionStyle, marginTop: "40px" }}>
        <h2 style={{ textAlign: "center" }}>Find Assets</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
            gap: "12px",
            marginTop: "20px",
            alignItems: "center",
          }}
        >
          <input
            placeholder="Search by name, product number, manufacturer, usage, notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={inputStyle}
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

          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            style={inputStyle}
          >
            <option value="All">All Projects</option>
            {projects.map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </select>

          <select
            value={manufacturerFilter}
            onChange={(e) => setManufacturerFilter(e.target.value)}
            style={inputStyle}
          >
            <option value="All">All Manufacturers</option>
            {manufacturers.map((manufacturer) => (
              <option key={manufacturer} value={manufacturer}>
                {manufacturer}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
          <button onClick={clearFilters} style={secondaryButtonStyle}>
            Clear Search
          </button>

          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            style={{
              ...buttonStyle,
              background: showFavoritesOnly ? "#8a5a00" : "#444",
            }}
          >
            {showFavoritesOnly ? "Showing Favorites" : "Show Favorites"}
          </button>

          <button onClick={exportCsv} style={buttonStyle}>
            Export CSV
          </button>
        </div>

        <p style={{ color: "#666", marginTop: "14px", textAlign: "center" }}>
          Showing {filteredAssets.length} of {totalAssets} assets
        </p>
      </section>

      <section style={{ ...sectionStyle, marginTop: "40px" }}>
        <h2 style={{ textAlign: "center" }}>{editingId ? "Edit Asset" : "Add Asset"}</h2>

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

      

      <section style={{ ...sectionStyle, marginTop: "40px" }}>
        <h2 style={{ textAlign: "center" }}>Manufacturer Directory</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            marginTop: "20px",
          }}
        >
          {manufacturerStats.length > 0 ? (
            manufacturerStats.map((manufacturer) => (
              <div key={manufacturer.name} style={cardStyle}>
                <p style={{ margin: 0, color: "#666" }}>{manufacturer.name}</p>
                <strong style={{ fontSize: "30px" }}>{manufacturer.count}</strong>
              </div>
            ))
          ) : (
            <div style={cardStyle}>No manufacturers yet.</div>
          )}
        </div>
      </section>

      <section style={{ ...sectionStyle, marginTop: "40px" }}>
        <h2 style={{ textAlign: "center" }}>Project Assignment</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            marginTop: "20px",
          }}
        >
          {projectStats.map((project) => (
            <div key={project.name} style={cardStyle}>
              <p style={{ margin: 0, color: "#666" }}>{project.name}</p>
              <strong style={{ fontSize: "30px" }}>{project.count}</strong>
            </div>
          ))}
        </div>
      </section>

      <section style={{ ...sectionStyle, marginTop: "60px" }}>
        <h2 style={{ textAlign: "center" }}>Asset Database</h2>

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
                    background: selectedAsset?.id === asset.id ? "#f4f1ea" : "white",
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
                  <td style={tableCellStyle}>{asset.project || "Unassigned"}</td>
                  <td style={tableCellStyle}>
                    <span style={getStatusStyle(asset.status)}>{asset.status}</span>
                  </td>
                  <td style={tableCellStyle}>{asset.favorite ? "★" : "☆"}</td>
                
                  <td style={tableCellStyle}>{asset.vendorContact || "-"}</td>
                  <td style={tableCellStyle}>{asset.vendorEmail || "-"}</td>
                  <td style={tableCellStyle}>{asset.rating || "-"}</td>
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
                          toggleFavorite(asset.id);
                        }}
                        style={{ ...secondaryButtonStyle, padding: "8px 10px" }}
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
                    colSpan="12"
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