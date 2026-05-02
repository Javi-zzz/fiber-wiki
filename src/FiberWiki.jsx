import { useState, useMemo } from "react";

// ── Data ──────────────────────────────────────────────────────────────────────

const FIBER_GOALS = {
  male: [
    { max: 8,  g: 25 }, { max: 13, g: 31 }, { max: 18, g: 38 },
    { max: 50, g: 38 }, { max: 70, g: 30 }, { max: 999, g: 28 },
  ],
  female: [
    { max: 8,  g: 25 }, { max: 13, g: 26 }, { max: 18, g: 26 },
    { max: 50, g: 25 }, { max: 70, g: 21 }, { max: 999, g: 21 },
  ],
};

function getFiberGoal(sex, age) {
  const table = FIBER_GOALS[sex];
  for (const row of table) if (age <= row.max) return row.g;
  return 25;
}

// ── Food Data ─────────────────────────────────────────────────────────────────

const FOODS = {
  fruits: [
    { id: "f1", name: "Apple",        img: "/images/fruits/apple.png",       servings: [{ label: "1 medium", g: 4.4 }, { label: "2 medium", g: 8.8 }] },
    { id: "f2", name: "Banana",       img: "/images/fruits/banana.png",      servings: [{ label: "1 medium", g: 3.1 }, { label: "2 medium", g: 6.2 }] },
    { id: "f3", name: "Dragon Fruit", img: "/images/fruits/dragonfruit.png", servings: [{ label: "½ cup", g: 1.8 }, { label: "1 cup", g: 3.5 }] },
    { id: "f4", name: "Mango",        img: "/images/fruits/mango.png",       servings: [{ label: "½ cup", g: 1.3 }, { label: "1 cup", g: 2.6 }] },
    { id: "f5", name: "Peach",        img: "/images/fruits/peach.png",       servings: [{ label: "1 medium", g: 1.5 }, { label: "2 medium", g: 3.0 }] },
    { id: "f6", name: "Pear",         img: "/images/fruits/pear.png",        servings: [{ label: "1 medium", g: 5.5 }, { label: "2 medium", g: 11.0 }] },
    { id: "f7", name: "Pineapple",    img: "/images/fruits/pineapple.png",   servings: [{ label: "½ cup", g: 1.1 }, { label: "1 cup", g: 2.3 }] },
    { id: "f8", name: "Watermelon",   img: "/images/fruits/watermelon.png",  servings: [{ label: "1 cup", g: 0.6 }, { label: "2 cups", g: 1.2 }] },
    { id: "f9", name: "Honeydew",     img: "/images/fruits/honeydew.png",    servings: [{ label: "1 cup", g: 1.4 }, { label: "2 cups", g: 2.8 }] },
  ],
  vegetables: [
    { id: "v1", name: "Avocado",      img: "/images/vegetables/avocado.png",     servings: [{ label: "½ medium", g: 4.6 }, { label: "1 medium", g: 9.2 }] },
    { id: "v2", name: "Broccoli",     img: "/images/vegetables/broccoli.png",    servings: [{ label: "½ cup", g: 2.6 }, { label: "1 cup", g: 5.1 }] },
    { id: "v3", name: "Carrot",       img: "/images/vegetables/carrot.png",      servings: [{ label: "1 medium", g: 1.7 }, { label: "2 medium", g: 3.4 }] },
    { id: "v4", name: "Cauliflower",  img: "/images/vegetables/cauliflower.png", servings: [{ label: "½ cup", g: 1.1 }, { label: "1 cup", g: 2.1 }] },
    { id: "v5", name: "Celery",       img: "/images/vegetables/celery.png",      servings: [{ label: "1 stalk", g: 0.6 }, { label: "2 stalks", g: 1.2 }] },
    { id: "v6", name: "Cucumber",     img: "/images/vegetables/cucumber.png",    servings: [{ label: "½ cup", g: 0.3 }, { label: "1 cup", g: 0.5 }] },
    { id: "v7", name: "Kale",         img: "/images/vegetables/kale.png",        servings: [{ label: "½ cup cooked", g: 1.3 }, { label: "1 cup cooked", g: 2.6 }] },
    { id: "v8", name: "Lettuce",      img: "/images/vegetables/lettuce.png",     servings: [{ label: "1 cup", g: 0.5 }, { label: "2 cups", g: 1.0 }] },
    { id: "v9", name: "Potato",       img: "/images/vegetables/potato.png",      servings: [{ label: "1 medium", g: 2.4 }, { label: "2 medium", g: 4.8 }] },
  ],
  beans: [
    { id: "b1", name: "Black Beans",  img: "/images/beans/blackbeans.png",  servings: [{ label: "½ cup", g: 7.5 }, { label: "1 cup", g: 15.0 }] },
    { id: "b2", name: "Lentils",      img: "/images/beans/lentils.png",     servings: [{ label: "½ cup", g: 7.8 }, { label: "1 cup", g: 15.6 }] },
    { id: "b3", name: "Chickpeas",    img: "/images/beans/chickpeas.png",   servings: [{ label: "½ cup", g: 6.2 }, { label: "1 cup", g: 12.5 }] },
    { id: "b4", name: "Kidney Beans", img: "/images/beans/kidneybeans.png", servings: [{ label: "½ cup", g: 5.7 }, { label: "1 cup", g: 11.3 }] },
    { id: "b5", name: "Pinto Beans",  img: "/images/beans/pintobeans.png",  servings: [{ label: "½ cup", g: 7.7 }, { label: "1 cup", g: 15.4 }] },
    { id: "b6", name: "Edamame",      img: "/images/beans/edamame.png",     servings: [{ label: "½ cup", g: 4.0 }, { label: "1 cup", g: 8.0 }] },
  ],
};

const TABS = ["fruits", "vegetables", "beans", "all"];
const TAB_LABELS = { fruits: "Fruits", vegetables: "Vegetables", beans: "Beans", all: "View All" };
const TAB_ICONS  = { fruits: "🍎", vegetables: "🥦", beans: "🫘", all: "🌿" };

// ── FoodCard ──────────────────────────────────────────────────────────────────

function FoodCard({ food, value, onChange }) {
  const selected = value !== "";
  return (
    <div style={{
      background: "rgba(255,255,255,0.82)",
      backdropFilter: "blur(8px)",
      borderRadius: 20,
      overflow: "hidden",
      boxShadow: selected
        ? "0 6px 24px rgba(56,142,60,0.22)"
        : "0 2px 12px rgba(56,142,60,0.08)",
      border: selected
        ? "2px solid #66bb6a"
        : "1.5px solid rgba(165,214,167,0.5)",
      transition: "box-shadow 0.2s, transform 0.2s, border 0.2s",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 10px 28px rgba(56,142,60,0.20)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = selected
          ? "0 6px 24px rgba(56,142,60,0.22)"
          : "0 2px 12px rgba(56,142,60,0.08)";
      }}
    >
      {/* Image */}
      <div style={{
        width: "100%",
        aspectRatio: "1 / 1",
        background: "linear-gradient(135deg, #f1f8e9 0%, #e8f5e9 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        <img
          src={food.img}
          alt={food.name}
          style={{
            width: "72%",
            height: "72%",
            objectFit: "contain",
            transition: "transform 0.3s",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          onError={e => {
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement.innerHTML =
              `<div style="width:60%;aspect-ratio:1/1;background:#c8e6c9;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:12px;color:#2e7d32;text-align:center;padding:8px;">${food.name}</div>`;
          }}
        />
      </div>

      {/* Name */}
      <div style={{
        fontFamily: "'Lora', Georgia, serif",
        fontWeight: 700,
        fontSize: 15,
        color: "#1b5e20",
        padding: "12px 12px 4px",
        textAlign: "center",
        width: "100%",
      }}>
        {food.name}
      </div>

      {/* Fiber badge */}
      <div style={{
        fontSize: 12, fontWeight: 700,
        color: selected ? "#2e7d32" : "#bdbdbd",
        marginBottom: 6,
        transition: "color 0.2s",
        fontFamily: "monospace",
        minHeight: 18,
      }}>
        {selected ? `${food.servings[+value].g}g fiber` : "—"}
      </div>

      {/* Serving Size Dropdown */}
      <div style={{ padding: "0 12px 14px", width: "100%" }}>
        <select
          value={value}
          onChange={e => onChange(food.id, e.target.value)}
          style={{
            width: "100%",
            fontSize: 13,
            padding: "6px 10px",
            borderRadius: 10,
            border: "1.5px solid #a5d6a7",
            background: "#f1f8e9",
            color: "#2e7d32",
            cursor: "pointer",
            outline: "none",
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 600,
          }}
        >
          <option value="">— select serving —</option>
          {food.servings.map((s, i) => (
            <option key={i} value={i}>{s.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ── FoodSection ───────────────────────────────────────────────────────────────

function FoodSection({ category, selections, onChange }) {
  const foods = FOODS[category];
  return (
    <div>
      {category !== "all" && (
        <h2 style={{
          fontFamily: "'Lora', Georgia, serif", fontSize: 22,
          color: "#1b5e20", marginBottom: 20, marginTop: 0,
          letterSpacing: 0.5,
        }}>
          {TAB_ICONS[category]} {TAB_LABELS[category]}
        </h2>
      )}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: 18,
      }}>
        {foods.map(food => (
          <FoodCard
            key={food.id}
            food={food}
            value={selections[food.id] ?? ""}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────

export default function FiberWiki() {
  const [sex, setSex] = useState("male");
  const [age, setAge] = useState(25);
  const [tab, setTab] = useState("fruits");
  const [selections, setSelections] = useState({});

  const goal = getFiberGoal(sex, age);

  const total = useMemo(() => {
    let sum = 0;
    const allFoods = [...FOODS.fruits, ...FOODS.vegetables, ...FOODS.beans];
    for (const [id, idx] of Object.entries(selections)) {
      if (idx === "") continue;
      const food = allFoods.find(f => f.id === id);
      if (food) sum += food.servings[+idx].g;
    }
    return Math.round(sum * 10) / 10;
  }, [selections]);

  const pct = Math.min(100, Math.round((total / goal) * 100));

  function handleChange(id, val) {
    setSelections(prev => ({ ...prev, [id]: val }));
  }

  function handleReset() {
    setSelections({});
  }

  const barColor = pct >= 100 ? "#388e3c" : pct >= 60 ? "#66bb6a" : "#aed581";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 40%, #dcedc8 100%)",
      fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Nunito:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        select:focus { border-color: #388e3c !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f8e9; }
        ::-webkit-scrollbar-thumb { background: #a5d6a7; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <header style={{
        background: "linear-gradient(90deg, #2e7d32 0%, #388e3c 60%, #43a047 100%)",
        padding: "20px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 4px 20px rgba(46,125,50,0.25)",
        flexWrap: "wrap", gap: 16,
      }}>
        <div>
          <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>
            🌿 Fiber Wiki
          </div>
          <div style={{ fontSize: 13, color: "#c8e6c9", marginTop: 2 }}>
            Explore how food fuels your daily fiber goals
          </div>
        </div>

        {/* Fiber Summary */}
        <div style={{
          background: "rgba(255,255,255,0.15)", borderRadius: 16,
          padding: "12px 24px", minWidth: 210, textAlign: "center",
          border: "1.5px solid rgba(255,255,255,0.3)",
        }}>
          <div style={{ color: "#e8f5e9", fontSize: 11, marginBottom: 4, fontWeight: 700, letterSpacing: 1 }}>
            DAILY FIBER
          </div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4 }}>
            <span style={{ fontSize: 34, fontWeight: 700, color: "#fff", fontFamily: "monospace" }}>{total}</span>
            <span style={{ fontSize: 15, color: "#c8e6c9" }}>/ {goal}g</span>
          </div>
          <div style={{ height: 7, background: "rgba(255,255,255,0.2)", borderRadius: 4, marginTop: 10, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${pct}%`,
              background: barColor, borderRadius: 4,
              transition: "width 0.5s ease",
            }} />
          </div>
          <div style={{ fontSize: 11, color: "#c8e6c9", marginTop: 5 }}>{pct}% of daily goal</div>
        </div>
      </header>

      {/* User Input Panel */}
      <div style={{
        background: "rgba(255,255,255,0.65)", backdropFilter: "blur(10px)",
        borderBottom: "1.5px solid #c8e6c9",
        padding: "14px 32px",
        display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap",
      }}>
        {/* Sex Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#2e7d32", letterSpacing: 0.8 }}>SEX</span>
          <div style={{
            display: "flex", background: "#e8f5e9",
            borderRadius: 24, padding: 3,
            border: "1.5px solid #a5d6a7",
          }}>
            {["male", "female"].map(s => (
              <button key={s} onClick={() => setSex(s)} style={{
                padding: "6px 18px", borderRadius: 20, border: "none",
                cursor: "pointer", fontSize: 13, fontWeight: 700,
                background: sex === s ? "#2e7d32" : "transparent",
                color: sex === s ? "#fff" : "#388e3c",
                transition: "all 0.2s",
                textTransform: "capitalize",
              }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Age */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#2e7d32", letterSpacing: 0.8 }}>AGE</span>
          <input
            type="number" min={1} max={120} value={age}
            onChange={e => setAge(Math.max(1, Math.min(120, +e.target.value)))}
            style={{
              width: 70, padding: "6px 10px", borderRadius: 10,
              border: "1.5px solid #a5d6a7", background: "#f1f8e9",
              fontSize: 15, color: "#1b5e20", fontWeight: 700,
              outline: "none", textAlign: "center",
            }}
          />
        </div>

        <div style={{ fontSize: 13, color: "#555", flex: 1 }}>
          Recommended goal: <strong style={{ color: "#2e7d32" }}>{goal}g fiber/day</strong>
        </div>

        <button onClick={handleReset} style={{
          padding: "7px 18px", borderRadius: 20,
          border: "1.5px solid #ef9a9a", background: "#fff",
          color: "#c62828", fontWeight: 700, fontSize: 13,
          cursor: "pointer", transition: "all 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "#ffebee"}
          onMouseLeave={e => e.currentTarget.style.background = "#fff"}
        >
          Reset All
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", gap: 4, padding: "16px 32px 0",
        borderBottom: "2px solid #c8e6c9",
        background: "rgba(255,255,255,0.3)",
      }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "9px 22px", border: "none", cursor: "pointer",
            fontSize: 14, fontWeight: 700,
            borderRadius: "12px 12px 0 0",
            background: tab === t ? "#2e7d32" : "rgba(255,255,255,0.6)",
            color: tab === t ? "#fff" : "#388e3c",
            borderBottom: tab === t ? "2px solid #2e7d32" : "2px solid transparent",
            transition: "all 0.2s",
            marginBottom: -2,
          }}>
            {TAB_ICONS[t]} {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Content */}
      <main style={{ padding: "28px 32px", maxWidth: 1200, margin: "0 auto" }}>
        {tab === "all" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
            {["fruits", "vegetables", "beans"].map(cat => (
              <FoodSection key={cat} category={cat} selections={selections} onChange={handleChange} />
            ))}
          </div>
        ) : (
          <FoodSection category={tab} selections={selections} onChange={handleChange} />
        )}
      </main>

      <footer style={{ textAlign: "center", padding: "24px", color: "#81c784", fontSize: 12 }}>
        Fiber values are approximate. Based on USDA nutritional data and general dietary guidelines.
      </footer>
    </div>
  );
}
