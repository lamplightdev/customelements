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
    "revision": "15b01bbda478124968269cd48ad1eeaa"
  },
  {
    "url": "counter.js",
    "revision": "9cda1d98e381438717bbf528198810cb"
  },
  {
    "url": "full-mixin.js",
    "revision": "fb6c8b80d82dc17be76e856519524a73"
  },
  {
    "url": "helper-mixin.js",
    "revision": "a49d1ab6250b54832e73adb34d60883f"
  },
  {
    "url": "icons/android.js",
    "revision": "9cbb061c9ff675a61a7e396a5ee3ecf2"
  },
  {
    "url": "index.html",
    "revision": "5934515f33fcec89480a49f8fc2764d9"
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
    "revision": "ce10b35e190db97680220533846d3414"
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
    "revision": "a5acf52a063b577b4f935e4e8e3d81d6"
  },
  {
    "url": "page4.js",
    "revision": "2c0b13054578b2fcc8a90f899bbe9cc9"
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
    "revision": "af797d3607fa14669eb043bbe371a9a7"
  },
  {
    "url": "store.js",
    "revision": "f61c815121bdbcf73abdf44d37521094"
  },
  {
    "url": "styles.js",
    "revision": "b0d0746e380ecb3601e142e15fec04db"
  },
  {
    "url": "test.js",
    "revision": "4d5f14dbddbcb016fb4bbe1bfe25038e"
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
