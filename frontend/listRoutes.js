const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'app');

const getRoutes = (dir, baseRoute = '') => {
  const files = fs.readdirSync(dir);
  let routes = [];

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      routes = routes.concat(getRoutes(filePath, path.join(baseRoute, file)));
    } else if (
      file !== '_app.tsx' &&
      file !== '_document.tsx' &&
      file !== '_error.tsx' &&
      file !== 'favicon.ico'
    ) {
      let route = path
        .join(baseRoute, file)
        .replace(/\\/g, '/') // Replace backslashes with forward slashes
        .replace(/\.(jsx|js|tsx|ts)$/, '') // Remove file extension
        .replace(/\/index$/, '') // Remove /index from the end
        .replace('/page', ''); // Remove /page from the end

      // Remove folders with parentheses from the route
      route = route.replace(/\(.*?\)\//g, '');

      if (route === 'layout') return; // Exclude layout and transform (pages) to /

      if (
        route === '[page-name]' ||
        route === '[page-name]/[page-content-name]'
      )
        return; // Exclude specific dynamic routes

      routes.push('/' + (route === '' ? '' : route));
    }
  });

  return routes;
};

const routes = Array.from(new Set(getRoutes(pagesDir))); // Remove duplicates

// Replace root placeholders with '/'
const formattedRoutes = routes.map((route) =>
  route === '/(pages)' ? '/' : route
);

console.log('Routes:', formattedRoutes);
