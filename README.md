# zen.js

Zen Coding style, declarative DOM tree generator.

### Usage

Creating a node of a particular type:

```javascript
var header = zen('header');
var div1 = zen('div');
var div2 = zen();
```

Specifying IDs:

```javascript
var logo = zen('div#logo');

// tag name can be omitted, in which case the node you
// create will be a div.
var heading = zen('#heading');
```

Specifying classe(s):

```javascript
var item = zen('li.item');
```

How about attributes?

```javascript
var link = zen('a[href=https://google.com][title=Google Search]');
```

You can specify the content (as HTML) of the node as well:

```javascript
var p = zen('p{lorem ipsum}');
```

You can append children:

```javascript
var parent = zen('div', zen('p{lorem ipsum}'));
```

and strings (gets append as textNodes):

```javascript
var p = zen('p', 'lorem ipsum');
```

and combine them in arrays:

```javascript
var h1 = zen('h1', [zen('i.icon'), 'Foobar']);
```

### TODO

* Repitition: `zen('li.item*5')`
* Auto-Indexing: `zen('li.item{item $}')`
* Better Documentation

### License

([MIT](http://623hs.mit-license.org))

