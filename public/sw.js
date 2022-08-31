const cacheKeepList = ["v12"];
const currentVersion = "v12";
const forceClearCache = true
// https://stackoverflow.com/questions/40100922/activate-updated-service-worker-on-refresh
// add resources to cache with version
const addResourcesToCache = async (resources) => {
  const cache = await caches.open(currentVersion);
  await cache.addAll(resources);
};

// remove all cache forcefully


self.addEventListener("install", (event) => {
  console.log("Installing");
  // forcefully remove cache
  if (forceClearCache) self.skipWaiting();
  event.waitUntil(
    addResourcesToCache([
      "/",
      "/index.html",
      "/css/extra.css",
      "/js/extra.js"
    ])
  );
});

// handle offline resources
const putInCache = async (request, response) => {
  const cache = await caches.open(currentVersion);
  await cache.put(request, response);
};

const cacheFirst = async (request) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
  const responseFromNetwork = await fetch(request);
  putInCache(request, responseFromNetwork.clone());
  return responseFromNetwork;
};

self.addEventListener("fetch", (event) => {
  event.respondWith(cacheFirst(event.request));
});


// delete old cash
const deleteCache = async (key) => {
  await caches.delete(key);
};

const deleteOldCaches = async () => {

  const keyList = await caches.keys();
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
  await Promise.all(cachesToDelete.map(deleteCache));
};

self.addEventListener("activate", (event) => {
  event.waitUntil(deleteOldCaches());
});