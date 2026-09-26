// Shared settings for every tour file (including ones created in the admin panel)
export default {
  layout: "layouts/tour.njk",
  eleventyComputed: {
    permalink: (data) => (data.published === false ? false : `/tours/${data.page.fileSlug}/`),
  },
};
