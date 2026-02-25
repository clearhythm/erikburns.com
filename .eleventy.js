module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/img");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addWatchTarget("src/assets/css/");

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