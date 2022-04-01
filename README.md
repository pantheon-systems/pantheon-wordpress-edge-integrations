# Pantheon WordPress Edge Integrations

Stable tag: 0.2.13  
Requires at least: 5.8  
Tested up to: 5.9  
Requires PHP: 7.4  
License: MIT  
Tags: pantheon, personalization, edge integrations, geolocation, geoip, interest tracking, vcl, developer
Contributors: jazzs3quence, jspellman, getpantheon

WordPress plugin and developer toolkit to support Pantheon Edge Integrations and personalization features. 

[![Unsupported](https://img.shields.io/badge/pantheon-unsupported-yellow?logo=pantheon&color=FFDC28)](https://pantheon.io/docs/oss-support-levels#unsupported) ![Pantheon WordPress Edge Integrations](https://github.com/pantheon-systems/pantheon-wordpress-edge-integrations/actions/workflows/test.yml/badge.svg) [![GitHub release](https://img.shields.io/github/release/pantheon-systems/pantheon-wordpress-edge-integrations.svg)](https://github.com/pantheon-systems/pantheon-wordpress-edge-integrations/releases/)

## Description

This plugin provides tools for integrating with Pantheon's Edge features provided by our Advanced Global CDN. Integrate natively with geolocation and interest tracking features to build personalization-enhanced features for your site.

If you would like to contribute to this plugin, please see the [CONTRIBUTING.md](https://github.com/pantheon-systems/pantheon-wordpress-edge-integrations/blob/main/CONTRIBUTING.md) file for more information.

## Frequently Asked Questions

### How do I check if vary headers are being sent from the CDN?

There are two ways to check for the vary headers sent by the CDN to ensure that your site is able to personalize based on that information.

#### Browser developer tools

In the browser Inspector (Right Click → Inspect in Firefox/Chrome), go to the Network tab. You may need to reload the page. The first element in the list should show the URL of the site. Click that item and ensure that the Headers tab is selected in the right panel. In the **Response Headers** section, there are three things you can be looking for depending on your AGCDN Varnish configuration: `audience`, `audience-set` and `interest`. `interest` will only show up if an interest is set in the browser (and enabled in VCL), but `audience`, `audience-set` or both should appear if Geolocation has been configured for your site. If either of those are showing in the response headers, the CDN is sending the data to your browser and personalization is configured correctly.

#### Using cURL

You can also make a `curl` request against the URL of your site to see the headers.

```bash
$ curl --head ${your-domain}
```

Running a `curl` request in a terminal application like the above will output the response headers of the requested URL. If the headers are being sent by the CDN, you should see entries in the returned response head data like the following:

```
HTTP/2 200
cache-control: public, max-age=600
content-type: text/html; charset=UTF-8
link: <https://your-domain.com/wp-json/>; rel="https://api.w.org/"
link: <https://your-domain.com/wp-json/wp/v2/posts/123>; rel="alternate"; type="application/json"
link: <https://your-domain.com/?p=123>; rel=shortlink
server: nginx
strict-transport-security: max-age=300
traceparent: 00-d9c96d620d6840908df7fcc1c87355e2-3c672567583b6ecf-00
x-cloud-trace-context: d9c96d620d6840908df7fcc1c87355e2/4352488690669022927;o=0
x-pantheon-styx-hostname: styx-fe4-a-c8f79d547-q9h4q
x-pingback: https://your-domain.com/xmlrpc.php
x-styx-req-id: 83e9fe48-b052-11ec-aac2-b6d4b691b347
age: 19
accept-ranges: bytes
via: 1.1 varnish, 1.1 varnish, 1.1 varnish
date: Wed, 30 Mar 2022 17:55:18 GMT
x-served-by: cache-mdw17372-MDW, cache-sjc10033-SJC, cache-sjc10027-SJC
x-cache: MISS, HIT, MISS
x-cache-hits: 0, 6, 0
x-timer: S1648662918.165521,VS0,VE3
vary: Accept-Encoding, Audience-Set, Interest, Cookie, Cookie
audience: geo:US
audience-set: country:US|city:salt lake city|region:UT|continent:NA|conn-speed:broadband|conn-type:wired
content-length: 58566
```

Again, you are looking for `audience` or `audience-set` headers to be returned, which are visible at the bottom of the request in the example above.

Interest headers will only be sent back from the CDN if a cookie with the interest defined exists, however, you can test this with `curl` as well by passing a `--cookie` value:

```bash
$ curl --head --cookie "interest=through-the-looking-glass" ${your-domain}
```

This will return a response like this:

```
HTTP/2 200
cache-control: public, max-age=600
content-type: text/html; charset=UTF-8
link: <https://your-domain.com/wp-json/>; rel="https://api.w.org/"
link: <https://your-domain.com/wp-json/wp/v2/pages/8>; rel="alternate"; type="application/json"
link: <https://your-domain.com/>; rel=shortlink
server: nginx
strict-transport-security: max-age=300
traceparent: 00-79357addac994f0da9fada52ede5174e-de0cbffa799c0e62-00
x-cloud-trace-context: 79357addac994f0da9fada52ede5174e/16000374658643529314;o=0
x-pantheon-styx-hostname: styx-fe4-b-97f8fd4b8-2h5j7
x-styx-req-id: b16a334c-b052-11ec-90c9-c2ea4801bb9c
age: 0
accept-ranges: bytes
via: 1.1 varnish, 1.1 varnish, 1.1 varnish
fastly-original-body-size: 0
date: Wed, 30 Mar 2022 17:56:15 GMT
x-served-by: cache-mdw17362-MDW, cache-sjc10051-SJC, cache-sjc10024-SJC
x-cache: MISS, MISS, MISS
x-cache-hits: 0, 0, 0
x-timer: S1648662975.164371,VS0,VE226
vary: Accept-Encoding, Audience-Set, Interest, Cookie, Cookie
audience: geo:US
audience-set: country:US|city:salt lake city|region:UT|continent:NA|conn-speed:broadband|conn-type:wired
interest: through-the-looking-glass
content-length: 57183
```

In the example output above, you can see the `interest` key is returned with a value of `through-the-looking-glass` which matches what was sent in the cookie via the `curl` request.

### How do I validate that my vary headers are being sent to the CDN to vary content on interest/geolocation?

Like the above, validating that the vary headers are being sent correctly can be done either in the browser tools, or via `curl`.

#### Browser developer tools

Using the browser Inspector → Network tab again, repeat the process [as above](#how-do-i-check-if-vary-headers-are-being-sent-from-the-cdn). This time, you will be looking for the `vary` key. This tells us what the CDN has been told we should vary content on. If the Vary headers are being sent properly from the plugin, you should see something like:

```
vary: Accept-Encoding, Audience-Set, Interest, Cookie, Cookie
```

This represents the default vary headers that are set by the WordPress Edge Integrations plugin. There could be any number of combinations of `Audience-Set`, `Audience`, `Interest` or other vary headers that you have set yourself in the code.

#### Using cURL

You can get the same information using cURL as above, as well. When reading a `curl --head ${your-domain}` request to look for Vary headers, you'll want to look for the `vary` key in the response. Again, it will output something similar to:

```
vary: Accept-Encoding, Audience-Set, Interest, Cookie, Cookie
```

This tells you what Vary headers are currently being sent by the code.

### How can I troubleshoot no Vary headers being sent?

If you are looking at the response headers for your page and no Vary headers are being sent on a page that you'd expect them to (e.g. not a page that includes logic to _not_ send Vary headers), the first thing to check is to see what the output of [`get_supported_vary_headers`](https://github.com/pantheon-systems/edge-integrations-wordpress-sdk/blob/main/docs/api.md#get_supported_vary_headers) is. `get_supported_vary_headers` should output an array of _just_ the currently-supported Vary headers (contrast this with the [`pantheon.ei.supported_vary_headers`](https://github.com/pantheon-systems/edge-integrations-wordpress-sdk/blob/main/docs/api.md#get_supported_vary_headers) filter, which takes an array of headers and whether they are supported or unsupported). If the output is not what you expect (empty, a multidimensional array, etc.), you know that the problem exists in how the Vary headers are being defined. `get_supported_vary_headers` is run immediately before the [`header`](https://www.php.net/manual/en/function.header.php) function is called, so it's the last place where the Vary headers would be breaking down. It might also be valuable to experiment with the [`pantheon.ei.supported_vary_headers`](https://github.com/pantheon-systems/edge-integrations-wordpress-sdk/blob/main/docs/api.md#get_supported_vary_headers) filter, which is used to filter the output before returning the array of just the Vary header array keys.

<!-- changelog -->
