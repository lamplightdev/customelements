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
    "revision": "22b61d5fb64d0382452115848d13b774"
  },
  {
    "url": "counter.js",
    "revision": "9cda1d98e381438717bbf528198810cb"
  },
  {
    "url": "full-mixin.js",
    "revision": "761556ba39ef6348dd701c511ae150ff"
  },
  {
    "url": "helper-mixin.js",
    "revision": "a49d1ab6250b54832e73adb34d60883f"
  },
  {
    "url": "index.html",
    "revision": "c8ec9d915be90848cdf7fc852ffa6f30"
  },
  {
    "url": "input.js",
    "revision": "eacff32130b172cfe351052f13d5ef14"
  },
  {
    "url": "items.js",
    "revision": "bde3e1abccc604e52899f61f76015339"
  },
  {
    "url": "list.js",
    "revision": "abd27ee79d3de8b4d91dc475a18b6b8a"
  },
  {
    "url": "listitem.js",
    "revision": "0d8112b0f28adfcd9221d3053462968e"
  },
  {
    "url": "listitems.js",
    "revision": "7cf0b4e3b947a5c2b9fa3c334b557a87"
  },
  {
    "url": "manifest.json",
    "revision": "ecca366485c1462de38acaf700e14e97"
  },
  {
    "url": "nav.js",
    "revision": "a4f53de3dcad787543b113085a1c7214"
  },
  {
    "url": "page1.js",
    "revision": "a1ff56975281962e1e20a2cc04715a2e"
  },
  {
    "url": "page2.js",
    "revision": "0a5e89851f46ca6231f7942dc485de24"
  },
  {
    "url": "page3.js",
    "revision": "7ad7efac7a1b7e646a255fced6701264"
  },
  {
    "url": "page4.js",
    "revision": "0f5750f2bb058718b7c58d0200569245"
  },
  {
    "url": "property-mixin.js",
    "revision": "6fa1333fcf8e5c2971a235a0318c99e7"
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
    "revision": "e38c0f700204a3bf0177967ba195eef2"
  },
  {
    "url": "script.js",
    "revision": "3e99a8558116a9a32c05ae3c3e2566e1"
  },
  {
    "url": "shadow-mixin.js",
    "revision": "ba6436ed51d3f128656374900d6aa295"
  },
  {
    "url": "styles.css",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "test.js",
    "revision": "33b19b405a4a7893d6acf92d12e64292"
  },
  {
    "url": "testing-app.js",
    "revision": "8734932824e54ad412a20763f7d7f0fb"
  },
  {
    "url": "testing.html",
    "revision": "adb00d71e0941ac83d92dfdafd93da93"
  }
];

const workboxSW = new self.WorkboxSW();
workboxSW.precache(fileManifest);
