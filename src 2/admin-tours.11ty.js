// Data for the Studio dashboard at /admin/ (every tour, including hidden ones)
export default class {
  data() {
    return { permalink: "/admin/tours.json", eleventyExcludeFromCollections: true };
  }
  render({ collections, tourPlaces }) {
    const label = Object.fromEntries((tourPlaces || []).map((p) => [p.value, p.label]));
    const tours = (collections.all || [])
      .filter((t) => t.inputPath.includes("/src/tours/") && t.inputPath.endsWith(".md"))
      .map((t) => {
        const d = t.data;
        const rows = (d.prices || []).map((r) => Number(r.price)).filter((n) => n > 0);
        return {
          slug: t.page.fileSlug,
          title: d.title || t.page.fileSlug,
          duration: d.duration || null,
          currency: d.currency || "€",
          from: rows.length ? Math.min(...rows) : d.price || null,
          places: (d.places || []).map((v) => label[v] || v),
          image: d.image || "",
          published: d.published !== false,
          featured: !!d.featured,
          order: d.order ?? 99,
          days: (d.itinerary || []).length,
          photos: (d.gallery || []).length,
        };
      })
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
    return JSON.stringify({ tours }, null, 1);
  }
}
