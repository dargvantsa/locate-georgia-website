export default {
  layout: "layouts/post.njk",
  eleventyComputed: {
    permalink: (data) => (data.published === false ? false : `/journal/${data.page.fileSlug}/`),
  },
};
