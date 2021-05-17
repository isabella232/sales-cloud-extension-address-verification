
module.exports = (container, basePath, router, handlers) => {
  if (basePath.endsWith("/")) {
    basePath = basePath.substring(0, basePath.length - 1)
  }
  handlers.forEach(h => {
    if (h.path.startsWith("/")) {
      h.path = h.path.substring(1)
    }
    router[h.method.toLowerCase()](`${basePath}/${h.path}`, container.inject(h.factory));
  });
  return router;
};
