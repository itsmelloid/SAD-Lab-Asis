/* Student Record Management System — CRUD with Supabase */
(() => {
  const $ = id => document.getElementById(id);
  const configured = window.SUPABASE_URL && window.SUPABASE_ANON_KEY &&
    !window.SUPABASE_URL.startsWith("YOUR_") && window.supabase;

  // ---------- Data layer ----------
  // Supabase when configured; otherwise a browser-only demo store so the UI can still be tried.
  let db;
  if (configured) {
    const sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
    const T = "students";
    const check = ({ data, error }) => { if (error) throw error; return data; };
    db = {
      list:   async () => check(await sb.from(T).select("*").order("id", { ascending: true })),
      create: async r  => check(await sb.from(T).insert(r).select().single()),          // CREATE
      update: async (id, r) => check(await sb.from(T).update(r).eq("id", id).select().single()), // UPDATE
      remove: async id => check(await sb.from(T).delete().eq("id", id)),                // DELETE
    };
  } else {
    const KEY = "students_demo";
    const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
    const save = rows => { try { localStorage.setItem(KEY, JSON.stringify(rows)); } catch {} };
    const dupe = (rows, r, id) => rows.some(x => x.student_id === r.student_id && x.id !== id);
    const err = () => Object.assign(new Error("duplicate"), { code: "23505" });
    db = {
      list: async () => load(),
      create: async r => { const rows = load(); if (dupe(rows, r)) throw err();
        const n = { ...r, id: Date.now() }; rows.push(n); save(rows); return n; },
      update: async (id, r) => { const rows = load(); if (dupe(rows, r, id)) throw err();
        const i = rows.findIndex(x => x.id === id); rows[i] = { ...rows[i], ...r }; save(rows); return rows[i]; },
      remove: async id => save(load().filter(x => x.id !== id)),
    };
  }

  // ---------- State & elements ----------
  let students = [], editingId = null, deleteId = null;
  const form = $("studentForm"), fields = ["student_id","full_name","program","year_level","email"];

  const badge = $("dbStatus");
  if (configured) { badge.textContent = "● Supabase connected"; badge.className = "badge ok"; }
  else {
    badge.textContent = "Demo mode (local only)"; badge.className = "badge demo";
    $("notice").hidden = false;
    $("notice").textContent = "Supabase is not configured yet. Edit config.js with your project URL and anon key. Until then, records are saved only in this browser.";
  }

  // ---------- Helpers ----------
  let toastTimer;
  function toast(msg, isErr) {
    const t = $("toast"); t.textContent = msg; t.className = "toast" + (isErr ? " err" : ""); t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.hidden = true, 3000);
  }
  const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const ordinal = n => ({1:"1st",2:"2nd",3:"3rd"}[n] || n + "th") + " Year";
  const errMsg = e => e.code === "23505" ? "That Student ID already exists."
    : [e.message, e.hint, e.code && "(code " + e.code + ")"].filter(Boolean).join(" ") || "Something went wrong.";

  function validate() {
    let ok = true;
    fields.forEach(f => {
      const el = $(f), bad = !el.value.trim() || (f === "email" && !el.checkValidity());
      el.classList.toggle("invalid", bad); if (bad) ok = false;
    });
    return ok;
  }

  // ---------- READ ----------
  async function load() {
    try { students = await db.list(); render(); }
    catch (e) { toast("Could not load records: " + errMsg(e), true); }
  }

  function render() {
    const q = $("search").value.trim().toLowerCase();
    const rows = students.filter(s => !q || [s.student_id, s.full_name, s.program, s.email].join(" ").toLowerCase().includes(q));
    $("count").textContent = students.length;
    $("empty").hidden = rows.length > 0;
    $("empty").textContent = students.length ? "No records match your search." : "No student records yet. Add one above.";
    $("tbody").innerHTML = rows.map(s => `
      <tr class="${s.id === editingId ? "editing" : ""}">
        <td>${esc(s.student_id)}</td><td>${esc(s.full_name)}</td><td>${esc(s.program)}</td>
        <td>${ordinal(s.year_level)}</td><td>${esc(s.email)}</td>
        <td class="act">
          <button class="btn sm" data-edit="${s.id}">Edit</button>
          <button class="btn sm danger" data-del="${s.id}">Delete</button>
        </td>
      </tr>`).join("");
  }

  // ---------- CREATE / UPDATE ----------
  form.addEventListener("submit", async ev => {
    ev.preventDefault();
    if (!validate()) return toast("Please complete all fields correctly.", true);
    const rec = {
      student_id: $("student_id").value.trim(), full_name: $("full_name").value.trim(),
      program: $("program").value.trim(), year_level: Number($("year_level").value), email: $("email").value.trim(),
    };
    const btn = $("saveBtn"); btn.disabled = true;
    try {
      if (editingId === null) { await db.create(rec); toast("Student added."); }
      else { await db.update(editingId, rec); toast("Student updated."); }
      resetForm(); await load();
    } catch (e) { toast(errMsg(e), true); }
    finally { btn.disabled = false; }
  });

  function startEdit(id) {
    const s = students.find(x => x.id === id); if (!s) return;
    editingId = id;
    fields.forEach(f => $(f).value = s[f]);
    $("formTitle").textContent = "Edit Student";
    $("saveBtn").textContent = "Update"; $("cancelBtn").hidden = false;
    render(); form.scrollIntoView({ behavior: "smooth", block: "start" }); $("full_name").focus();
  }

  function resetForm() {
    editingId = null; form.reset();
    fields.forEach(f => $(f).classList.remove("invalid"));
    $("formTitle").textContent = "Add Student";
    $("saveBtn").textContent = "Save"; $("cancelBtn").hidden = true; render();
  }
  $("cancelBtn").addEventListener("click", resetForm);

  // ---------- DELETE (with confirmation) ----------
  function askDelete(id) {
    const s = students.find(x => x.id === id); if (!s) return;
    deleteId = id;
    $("mText").textContent = `Delete ${s.full_name} (${s.student_id})? This cannot be undone.`;
    $("modal").hidden = false; $("mCancel").focus();
  }
  const closeModal = () => { $("modal").hidden = true; deleteId = null; };
  $("mCancel").addEventListener("click", closeModal);
  $("modal").addEventListener("click", e => { if (e.target.id === "modal") closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("modal").hidden) closeModal(); });
  $("mOk").addEventListener("click", async () => {
    const id = deleteId; closeModal();
    try {
      await db.remove(id);
      if (editingId === id) resetForm();
      toast("Student deleted."); await load();
    } catch (e) { toast("Delete failed: " + errMsg(e), true); }
  });

  // ---------- Events ----------
  $("tbody").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.edit) startEdit(Number(b.dataset.edit));
    if (b.dataset.del) askDelete(Number(b.dataset.del));
  });
  $("search").addEventListener("input", render);

  load();
})();
