importScripts('workbox-sw.prod.v2.1.2.js');

/**
 * DO NOT EDIT THE FILE MANIFEST ENTRY
 *
 * The method precache() does the following:
 * 1. Cache URLs in the manifest to a local cache.
 * 2. When a network request is made for any of these URLs the response
 *    will ALWAYS comes from the cache, NEVER the network.
 * 3. When the service worker changes ONLY assets with a revision change are
 *    updated, old cache entries are left as is.
 *
 * By changing the file manifest manually, your users may end up not receiving
 * new versions of files because the revision hasn't changed.
 *
 * Please use workbox-build or some other tool / approach to generate the file
 * manifest which accounts for changes to local files and update the revision
 * accordingly.
 */
const fileManifest = [
  {
    "url": "app.js",
    "revision": "0a5aa858d5bf3a12d3d869edf7d9c0e1"
  },
  {
    "url": "base-element.js",
    "revision": "eca9953aaecd10a19aa19ea14d43ee72"
  },
  {
    "url": "counter.js",
    "revision": "c6d339a3c7c08421a46d9959343dcdbb"
  },
  {
    "url": "index.html",
    "revision": "22a2ad5012e1768eb41d958bfc3b6a75"
  },
  {
    "url": "input.js",
    "revision": "93435f5e4e9938f822e593cc79903d39"
  },
  {
    "url": "items.js",
    "revision": "e42b0c50b8d912930752dcdf014dd777"
  },
  {
    "url": "list.js",
    "revision": "319b70880d3ca245e6a81ec9d3a1bf87"
  },
  {
    "url": "listitem.js",
    "revision": "3ee4f462de34198afbfe6e8a87586c63"
  },
  {
    "url": "listitems.js",
    "revision": "a282a4ef9be5d3f8b0f7264e77c06c00"
  },
  {
    "url": "nav.js",
    "revision": "abae129348437887a3cc2f4e01f3f45e"
  },
  {
    "url": "page1.js",
    "revision": "9ad5f0e4555f997373e23d582699eaac"
  },
  {
    "url": "page2.js",
    "revision": "c6cc5639940dccb1b859eea3bdd9b192"
  },
  {
    "url": "page3.js",
    "revision": "911f44517c4862a8f9c0ff5825e8cd8e"
  },
  {
    "url": "page4.js",
    "revision": "6cc5b18d298a1753534bd7424c389ff8"
  },
  {
    "url": "README.md",
    "revision": "949085e1e7aa1417472d1aa287d5ef82"
  },
  {
    "url": "repeat.js",
    "revision": "aa0b1b52eacd7523c65eea6484be1d68"
  },
  {
    "url": "route.js",
    "revision": "56262c836b766e6c3b6f10f3808d8961"
  },
  {
    "url": "script.js",
    "revision": "3e99a8558116a9a32c05ae3c3e2566e1"
  },
  {
    "url": "store.js",
    "revision": "6839495ff5707b4374566cd32af8d6d5"
  },
  {
    "url": "styles.css",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "test.js",
    "revision": "5e6a1890698639c112b9f2b1ccb3f9fd"
  },
  {
    "url": "testing-app.js",
    "revision": "a02e15dd3b8125af3f6a9637ce2f0c01"
  },
  {
    "url": "testing.html",
    "revision": "adb00d71e0941ac83d92dfdafd93da93"
  }
];

const workboxSW = new self.WorkboxSW();
workboxSW.precache(fileManifest);
