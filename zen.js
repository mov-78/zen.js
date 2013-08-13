// zen.js - Zen Coding style, declarative DOM tree generator
//
// (MIT) http://623hs.mit-license.org


(function(brand) {
    var patterns = [];
    patterns.push('([a-z][a-z1-6]*)?'); // tag
    patterns.push('(?:#([a-z][-\\w]*))?'); // id
    patterns.push('((?:\\.[a-z][-\\w]*)+)?'); // class
    patterns.push('((?:\\[[a-z][^=]*=[^\\]]+\\])+)?'); // attributes
    patterns.push('(?:\\{(.+)\\})?'); // content

    function trim(s) {
        return s.replace(/^\s+/, '').replace(/\s+$/, '');
    }

    function enumerate(array, callback) {
        for (var i = 0; i < array.length; i++) {
            callback.call(array, array[i], i);
        }
    }

    window[brand] = function(spec, childNodes) {
        var childPattern = /(?:>)[\w]+/g;
        var pattern = '^' + patterns.join('') + '$';
        spec = spec || '';

        var match = spec.match(pattern);
        var childMatch = spec.match(childPattern);
        if (!(match || childMatch)) return null;

        var childSpecs = childMatch ? spec.split(/>/g) : null;
        if (childSpecs) {
            match = childSpecs[0].match(pattern);
            if (!match) return null;
            childSpecs.splice(0, 1);
        }

        // tag
        var tagName = match[1] || 'div';
        var node = document.createElement(tagName);

        // id
        var id = match[2];
        if (id) {
            node.id = id;
        }

        // class
        var classNames = match[3] ? match[3].split(/\./) : null;
        if (classNames) {
            enumerate(classNames, function(className) {
                node.className += ' ' + className;
            });
            node.className = trim(node.className);
        }

        // attributes
        var attr_spec = match[4];
        var attr_pattern = /\[([a-z][^=]*)=([^\]]+)\]/gi;
        if (attr_spec) {
            var attr_match = attr_pattern.exec(attr_spec);
            while (attr_match) {
                node.setAttribute(trim(attr_match[1]), trim(attr_match[2]));
                attr_match = attr_pattern.exec(attr_spec);
            }
        }

        // content
        var html = match[5];
        if (html) {
            if (window[brand].sanitize) {
                html = html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            }
            node.innerHTML = html;
        }

        var specChildNode;
        if (childSpecs) {
            childSpecs = childSpecs.reverse();
            childSpecs.forEach(function(childSpec, index) {
                specChildNode = window[brand](childSpec, specChildNode);
            });

            if (specChildNode instanceof Node) {
                node.appendChild(specChildNode);
            }
        }

        if (childNodes instanceof Node) {
            node.appendChild(childNodes);
        } else if (childNodes instanceof Array) {
            childNodes.forEach(function(childNode, index) {
                if (childNode instanceof Node) {
                    node.appendChild(childNode);
                }
            });
        }

        return node;

    };

    window[brand].sanitize = true;

})('zen');
