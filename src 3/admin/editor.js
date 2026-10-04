// Locate Georgia Studio — small additions to the Decap CMS editor
(function () {
  // 1) Studio name in the top bar, linking back to the dashboard
  function addBrand() {
    const content = document.querySelector('[class*="-AppHeaderContent"]');
    if (!content || content.querySelector(".studio-brand")) return;
    const a = document.createElement("a");
    a.className = "studio-brand";
    a.href = "/admin/";
    a.title = "Back to Your tours";
    a.innerHTML = "<b>locate</b><span>Georgia / Studio</span>";
    content.prepend(a);
  }

  // 2) "Edit itinerary", "Update prices", "Manage photos" on the dashboard jump to that field
  const TARGETS = { itinerary: "Itinerary (day by day)", prices: "Price table", gallery: "Photo gallery" };
  function jumpToField() {
    let key;
    try { key = sessionStorage.getItem("studio-focus"); } catch (_) { return; }
    if (!key || !TARGETS[key]) return;
    const want = TARGETS[key].toLowerCase();
    const label = [...document.querySelectorAll('[class*="-FieldLabel"]')]
      .find((l) => l.textContent.trim().toLowerCase().startsWith(want));
    if (!label) return;
    try { sessionStorage.removeItem("studio-focus"); } catch (_) {}
    const box = label.closest('[class*="-ControlContainer"]') || label;
    setTimeout(() => {
      box.scrollIntoView({ behavior: "smooth", block: "start" });
      box.classList.add("studio-focus");
      // open a collapsed list so its items are visible
      const expand = box.querySelector('[class*="-ExpandButton"]');
      if (expand && box.querySelector('[class*="-TopBar"]') && !box.querySelector('[class*="-ListItem"]')) expand.click();
    }, 250);
  }

  new MutationObserver(() => { addBrand(); jumpToField(); })
    .observe(document.documentElement, { childList: true, subtree: true });
})();
