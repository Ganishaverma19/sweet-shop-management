
import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { isAdmin } from "../utils/auth";
import toast from "react-hot-toast";
import "./Dashboard.css";
import gsap from "gsap";

interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

const emptySweet = { name: "", category: "", price: 0, quantity: 0 };

function Dashboard() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  const admin = isAdmin();

  const [showForm, setShowForm] = useState(false);
  const [showRestock, setShowRestock] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [restockId, setRestockId] = useState<number | null>(null);
  const [restockQty, setRestockQty] = useState(0);
  const [sweet, setSweet] = useState(emptySweet);

  /* ===== GSAP ===== */
  useEffect(() => {
    if (!pageRef.current || !headerRef.current || !tableRef.current) return;
    gsap
      .timeline()
      .from(pageRef.current, { opacity: 0, scale: 0.96, duration: 0.4 })
      .from(headerRef.current, { y: -12, opacity: 0, duration: 0.3 })
      .from(tableRef.current, { y: 12, opacity: 0, duration: 0.4 });
  }, []);

  /* ===== LOAD ===== */
  const load = () => {
    setLoading(true);
    api.get("/sweets").then((r: any) => {
      setSweets(r.data);
      setLoading(false);
    });
  };
  useEffect(load, []);

  /* ===== ACTIONS ===== */
  const logout = () => {
    localStorage.removeItem("token");
    location.reload();
  };

  const saveSweet = async () => {
    try {
      editingId
        ? await api.put(`/sweets/${editingId}`, sweet)
        : await api.post("/sweets", sweet);

      toast.success(editingId ? "Sweet updated" : "Sweet added");
      setShowForm(false);
      setEditingId(null);
      setSweet(emptySweet);
      load();
    } catch {
      toast.error("Save failed");
    }
  };

  const deleteSweet = async (id: number) => {
    if (!confirm("Delete this sweet?")) return;
    await api.delete(`/sweets/${id}`);
    toast.success("Sweet deleted");
    load();
  };

  const purchase = async (id: number) => {
    try {
      await api.post(`/sweets/${id}/purchase`);
      toast.success("Purchase successful");
      load();
    } catch {
      toast.error("Out of stock");
    }
  };

  const restock = async () => {
    if (!restockId || restockQty <= 0) return;
    await api.post(`/sweets/${restockId}/restock`, { quantity: restockQty });
    toast.success("Sweet restocked");
    setShowRestock(false);
    setRestockQty(0);
    load();
  };

  const actions = (s: Sweet) =>
    admin ? (
      <div className="action-buttons">
        <button
          className="btn secondary"
          onClick={() => {
            setEditingId(s.id);
            setSweet(s);
            setShowForm(true);
          }}
        >
          Edit
        </button>
        <button
          className="btn success"
          onClick={() => {
            setRestockId(s.id);
            setShowRestock(true);
          }}
        >
          Restock
        </button>
        <button className="btn danger" onClick={() => deleteSweet(s.id)}>
          Delete
        </button>
      </div>
    ) : (
      <button
        className="btn success"
        disabled={s.quantity === 0}
        onClick={() => purchase(s.id)}
      >
        Purchase
      </button>
    );

  return (
    <div ref={pageRef} className="dashboard">
      {/* HEADER */}
      <div ref={headerRef} className="dashboard-header">
        <h2>🍬 Sweet Dashboard {admin && "(Admin)"}</h2>
        <div className="header-actions">
          {admin && (
            <button
              className="btn primary"
              onClick={() => {
                setEditingId(null);
                setSweet(emptySweet);
                setShowForm(true);
              }}
            >
              + Add Sweet
            </button>
          )}
          <button className="btn danger" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="search-bar">
        <input
          placeholder="Search sweets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="btn primary"
          onClick={() =>
            search ? api.get(`/sweets/search?name=${search}`).then(r => setSweets(r.data)) : load()
          }
        >
          Search
        </button>
      </div>

      {/* ADD / EDIT MODAL */}
      {admin && showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="add-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? "Edit Sweet" : "Add Sweet"}</h3>
            <div className="add-form">
              {Object.keys(sweet).map((k) => (
                <input
                  key={k}
                  type={k === "price" || k === "quantity" ? "number" : "text"}
                  placeholder={k}
                  value={(sweet as any)[k] || ""}
                  onChange={(e) =>
                    setSweet({ ...sweet, [k]: e.target.value })
                  }
                />
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button className="btn primary" onClick={saveSweet}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESTOCK MODAL (SAME STYLE) */}
      {admin && showRestock && (
        <div className="modal-overlay" onClick={() => setShowRestock(false)}>
          <div className="add-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Restock Sweet</h3>
            <div className="add-form">
              <input
                type="number"
                placeholder="Quantity"
                value={restockQty || ""}
                onChange={(e) => setRestockQty(Number(e.target.value))}
              />
            </div>
            <div className="modal-actions">
              <button className="btn secondary" onClick={() => setShowRestock(false)}>
                Cancel
              </button>
              <button className="btn primary" onClick={restock}>
                Restock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DATA */}
      {loading ? (
        <p>Loading sweets...</p>
      ) : (
        <>
          <div className="table-desktop">
            <table ref={tableRef} className="sweet-table">
              <thead>
                <tr>
                  <th>Name</th><th>Category</th><th>Price</th><th>Qty</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sweets.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.category}</td>
                    <td>{s.price}</td>
                    <td>{s.quantity}</td>
                    <td>{actions(s)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cards-mobile">
            {sweets.map((s) => (
              <div key={s.id} className="sweet-card">
                <div><b>Name:</b> {s.name}</div>
                <div><b>Category:</b> {s.category}</div>
                <div><b>Price:</b> ₹{s.price}</div>
                <div><b>Qty:</b> {s.quantity}</div>
                <div className="card-actions">{actions(s)}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;

