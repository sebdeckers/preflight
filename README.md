# Preflight testing [![Build Status](https://travis-ci.org/cbas/preflight.png)](https://travis-ci.org/cbas/preflight)

> Because "looks good to me" should not be famous last words.

## Use Cases

#### Eyeballing

Check if a page loads without script or network errors.

#### Army of click monkeys

Click on any `button` or `a[href="#"]` and expect something to happen like DOM change or XHR call.

#### Follow all the things

Check if all links work when loaded as new page. Note that preflight respects `robots.txt`. This recurses over internal pages and validates external links.

## Grunt Configuration

```javascript
{
	"Url Regex": {
		options: {
			loadTimeout: Number,
			clickTimeout: Number,
			interactiveElements: Array(DOMQuerySelector...),
			followInternalLinks: Boolean,
			followExternalLinks: Boolean,
			networkLog: String,
		}
	}
}
```
