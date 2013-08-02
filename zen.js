// zen.js - Zen Coding style, declarative DOM tree generator
//
// (MIT) http://623hs.mit-license.org


(function(brand) {
    var patterns = [];
    patterns.push('([a-z][a-z1-6]*)?');                 // tag
    patterns.push('(?:#([a-z][-\\w]*))?');              // id
    patterns.push('((?:\\.[a-z][-\\w]*)+)?');           // class
    patterns.push('((?:\\[[a-z][^=]*=[^\\]]+\\])+)?');  // attributes
    patterns.push('(?:\\{(.+)\\})?');                   // content
    var pattern = '^' + patterns.join('') + '$';

    function trim(s) {
        return s.replace(/^\s+/, '').replace(/\s+$/, '');
    }

    function enumerate(array, callback) {
        for (var i = 0; i < array.length; i++) {
            callback.call(array, array[i], i);
        }
    }

    window[brand] = function(spec, childNode) {
        spec = spec || '';

        var match = spec.match(pattern);
        if (!match) return null;

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

        if(childNode instanceof Node) {
            node.appendChild(childNode);
        }

        return node;

    };

    window[brand].sanitize = true;

})('zen');
