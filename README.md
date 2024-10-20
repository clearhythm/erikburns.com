# Erik Burns' Eleventy Project

## Overview
This project is built with the Eleventy static site generator and follows an advanced folder structure based on the principles of Separation of Concerns (SoC). The purpose of this structure is to improve readability, maintainability, and scalability as the project grows.

The structure was adapted from [this blog post](https://www.njfamirm.ir/en/blog/eleventy-folder-structure-guide/) and [this blog post](https://www.webstoemp.com/blog/eleventy-projects-structure/), which explains how to optimize Eleventy projects as they expand in complexity.

## Folder Structure
Here's the advanced folder structure implemented in this project:

├── 11ty/             # Eleventy build scripts
    ├── collections/  # Collections
    ├── filters/      # Filters
    ├── shortcodes/   # Shortcodes
    └── utils/        # Utility functions/helpers
├── src/              # Main input folder
    ├── _include/     # Partial templates
    ├── _layout/      # Page layouts
    ├── _data/        # Global data files
    ├── assets/       # Static assets
        ├── fonts/    # Fonts
        ├── img/      # Images
        ├── js/       # JavaScript files (raw and ES6+ to be bundled)
        └── styles/   # SCSS (compiled to CSS)
├── dist/             # Output folder
    └── assets/       # Assets (compiled CSS, JS, optimized images, etc.)

## Rationale Behind This Structure
- **Separation of Concerns**: The structure is designed to keep different parts of the project organized and isolated. Content, templates, static assets, and build logic are separated for better maintainability. All build-related logic is contained within the `11ty/` folder, while content and static assets are in `src/`.
- **Input and Output Folders**: The `/src` folder is used for all inputs (content, templates, and static assets), while the `/dist` folder is used for the output (the built, production-ready site). This clear separation ensures that source files and generated files are easily distinguishable.
- **Partial Templates and Layouts**: Partial templates are stored in `src/_include/` for reusable components, while full-page layouts are kept in `src/_layout/`.
- **Static Assets**: Raw static assets like fonts, images, JavaScript, and SCSS files are stored in `src/assets/`. These assets are either copied directly or processed (compiled SCSS, bundled JavaScript) into `/dist/assets/` for the final site.

## Future Improvements
- Add additional shortcodes, filters, and collections as needed inside the `11ty/` folder to extend Eleventy's functionality.
- Implement a more robust build process for CSS/SCSS and JavaScript in the `src/assets/scss/` and `src/assets/js/` directories, including automatic minification and bundling for production builds.
- Explore adding additional utility functions in the `11ty/utils/` folder to streamline reusable logic across filters, collections, and shortcodes.