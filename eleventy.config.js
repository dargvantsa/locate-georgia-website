// Locate Georgia — Eleventy build config
export default function (eleventyConfig) {
  eleventyConfig.ignores.add("src/admin/**");

  // Files copied as-is
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/admin");

  // All published tours, in the order set in the admin panel
  eleventyConfig.addCollection("tours", (api) =>
    api
      .getFilteredByGlob("src/tours/*.md")
      .filter((t) => t.data.published !== false)
      .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99))
  );

  eleventyConfig.addCollection("featuredTours", (api) =>
    api
      .getFilteredByGlob("src/tours/*.md")
      .filter((t) => t.data.published !== false && t.data.featured)
      .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99))
      .slice(0, 3)
  );

  eleventyConfig.addCollection("journal", (api) =>
    api
      .getFilteredByGlob("src/journal/*.md")
      .filter((p) => p.data.published !== false)
      .sort((a, b) => b.date - a.date)
  );

  // €2100 -> €2,100
  eleventyConfig.addFilter("euro", (n) =>
    n == null || n === "" ? "" : "€" + Number(n).toLocaleString("en-US")
  );
  // Line breaks typed in the admin panel become <br>
  eleventyConfig.addFilter("nl2br", (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\n/g, "<br>")
  );
  eleventyConfig.addFilter("year", () => new Date().getFullYear());
  eleventyConfig.addFilter("digits", (s) => String(s || "").replace(/[^\d+]/g, ""));

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
