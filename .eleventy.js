module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/img");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addWatchTarget("src/assets/css/");

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_include",
      layouts: "_layout",
      data: "_data"
    }
  };
};
