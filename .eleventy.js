const path = require("path");
const sass = require("sass");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/img");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/assets/js");

  // Compile SCSS natively so 11ty watches partials and live-reloads CSS
  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    compile: async function(inputContent, inputPath) {
      let parsed = path.parse(inputPath);
      if (parsed.name.startsWith("_")) return;

      const self = this;
      return async () => {
        let result = sass.compileString(inputContent, {
          loadPaths: [parsed.dir],
          style: "expanded"
        });
        self.addDependencies(inputPath, result.loadedUrls);
        return result.css;
      };
    }
  });

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
