document.addEventListener("DOMContentLoaded", () => {
  const chevron = '<svg class="chevron" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';

  const escapeHtml = (str) =>
    str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const beerRow = (beer) => `
    <div class="beer-row" data-search="${escapeHtml((beer.name + " " + beer.brewery + " " + beer.style).toLowerCase())}">
      <div class="beer-row__id">
        <p class="beer-row__name">${escapeHtml(beer.name)}</p>
        <p class="beer-row__brewery">${escapeHtml(beer.brewery)} &middot; ${escapeHtml(beer.style)}</p>
      </div>
      <p class="beer-row__meta">${escapeHtml(beer.abv)} ABV</p>
    </div>`;

  // ---- Tap list (flat, only 11 beers) ----
  const tapList = document.getElementById("tap-list");
  if (tapList && window.TAP_BEERS) {
    tapList.innerHTML = window.TAP_BEERS.map(beerRow).join("");
  }

  // ---- Bottle & can list (grouped + searchable, 218 beers) ----
  const groupsEl = document.getElementById("bottle-groups");
  if (groupsEl && window.BOTTLE_BEERS) {
    const CATEGORY_ORDER = [
      "IPA",
      "Stout & Porter",
      "Sour & Wild Ale",
      "Lager & Pilsner",
      "Pale, Red Ale & Bitter",
      "Wheat & Belgian",
      "Specialty & Other",
      "Non-Alcoholic"
    ];

    const categoryOf = (style) => {
      const s = style.toLowerCase();
      if (s.startsWith("non-alcoholic")) return "Non-Alcoholic";
      if (s.startsWith("ipa")) return "IPA";
      if (s.startsWith("stout") || s.startsWith("porter")) return "Stout & Porter";
      if (s.startsWith("sour") || s.startsWith("wild ale")) return "Sour & Wild Ale";
      if (s.startsWith("lager") || s.startsWith("pilsner")) return "Lager & Pilsner";
      if (s.startsWith("pale ale") || s.startsWith("red ale") || s.startsWith("bitter")) return "Pale, Red Ale & Bitter";
      if (s.startsWith("wheat beer") || s.startsWith("belgian")) return "Wheat & Belgian";
      return "Specialty & Other";
    };

    const groups = {};
    window.BOTTLE_BEERS.forEach((beer) => {
      const cat = categoryOf(beer.style);
      (groups[cat] = groups[cat] || []).push(beer);
    });

    groupsEl.innerHTML = CATEGORY_ORDER.filter((cat) => groups[cat] && groups[cat].length)
      .map((cat) => {
        const beers = groups[cat];
        return `
        <details class="beer-group" data-group>
          <summary>
            <span>${cat}</span>
            <span class="count">${beers.length}</span>
            ${chevron}
          </summary>
          <div class="beer-group__body">
            <div class="beer-list">${beers.map(beerRow).join("")}</div>
          </div>
        </details>`;
      })
      .join("");

    const searchInput = document.getElementById("bottle-search");
    const searchMeta = document.getElementById("bottle-search-meta");
    const allGroups = () => Array.from(groupsEl.querySelectorAll(".beer-group"));
    const totalCount = window.BOTTLE_BEERS.length;

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const q = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        allGroups().forEach((group) => {
          const rows = Array.from(group.querySelectorAll(".beer-row"));
          let groupVisible = 0;

          rows.forEach((row) => {
            const match = !q || row.dataset.search.includes(q);
            row.hidden = !match;
            if (match) { groupVisible++; visibleCount++; }
          });

          group.hidden = groupVisible === 0;
          if (q) group.open = groupVisible > 0;
          else group.open = false;
        });

        if (searchMeta) {
          searchMeta.textContent = q
            ? `Showing ${visibleCount} of ${totalCount} beers matching "${searchInput.value.trim()}"`
            : `${totalCount} beers, always rotating — browse by category or search.`;
        }
      });
    }
  }
});
