export default {
  layout: "layouts/post.njk",
  eleventyComputed: {
    permalink: (data) => (data.published === false ? false : `/blog/${data.page.fileSlug}/`),
  },
};
