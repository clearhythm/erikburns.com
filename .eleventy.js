module.exports = function(eleventyConfig) {
  // Passthrough Copy for static assets (images and fonts)
  eleventyConfig.addPassthroughCopy("src/assets/img");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");

  return {
    dir: {
      input: "src",          // Input folder for content, templates, and static assets
      output: "dist",        // Output folder for the built site
      includes: "_include",  // Partial templates (components)
      layouts: "_layout",    // Layouts for full-page templates
      data: "_data"          // Global data available to all templates
    }
  };
};