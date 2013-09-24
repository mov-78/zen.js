// simple shiv for Array#forEach
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(callback) {
        for (var i = 0; i < this.length; i++) {
            callback(this[i], i);
        }
    };
}

// simple shiv for String#trim
if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+/, '').replace(/\s+$/, '');
    };
}

describe('zen.js', function() {
    //
    // generic hooks & custom matchers
    //

    beforeEach(function() {
        this.addMatchers({
            toBeEmpty: function() {
                // by empty, we mean
                if (typeof this.actual == 'string') {
                    // an empty string for strings
                    return this.actual === '';
                } else if ('innerHTML' in this.actual) {
                    // a node with empty innerHTML for DOM nodes
                    return this.actual.innerHTML === '';
                } else {
                    // otherwise we consider this to be falsy
                    return false;
                }
            },
            toBeTagged: function(expectedTagName) {
                if ('nodeName' in this.actual) {
                    this.message = function() {
                        return "Expected " + this.actual.nodeName + " to be tagged as " + expectedTagName + ".";
                    };
                    return this.actual.nodeName.match(new RegExp(expectedTagName, 'i'));
                } else {
                    return false;
                }
            }
        });
    });

    describe('when no spec is given', function() {
        it('should create a plain div', function() {
            var node = zen();
            expect(node).not.toBeNull();
            expect(node).toBeTagged('div');
            expect(node.id).toBeEmpty();
            expect(node.className).toBeEmpty();
            expect(node).toBeEmpty();
        });
    });

    //
    // tag-related specs
    //

    describe('when the spec contains a valid tag definition', function() {
        var valid_specs = [
            'a',
            'h6',
            'artificial'
        ];
        it('should be able to extract the tag name from the spec', function() {
            valid_specs.forEach(function(spec) {
                var node = zen(spec);
                expect(node).not.toBeNull();
                expect(node).toBeTagged(spec);
            });
        });
    });

    describe('when the spec does not contain any tag definition', function() {
        var specs = [
            '#heading',
            '.item',
            '[foo=bar]',
            '[k1=v1][k2=v2]',
            '{text}'
        ];
        it('should create a div', function() {
            specs.forEach(function(spec) {
                var node = zen(spec);
                expect(node).not.toBeNull();
                expect(node).toBeTagged('div');
            });
        });
    });

    describe('when the spec contains invalid tag definitions', function() {
        var invalid_specs = [
            'body img',
            // 'ul>li',
            'p+p',
            'h7',
            'foo:bar',
            '911',
            '?!',
            '豆瓣'
        ];
        it('should reject the spec and returns null', function() {
            invalid_specs.forEach(function(spec) {
                expect(zen(spec)).toBeNull();
            });
        });
    });

    //
    // id-related specs
    //

    describe('when the spec contains a valid id definition', function() {
        var valid_specs = [
            ['#heading', 'heading'],
            ['ul#recent-posts', 'recent-posts'],
            ['#f4n_c-y_', 'f4n_c-y_']
        ];
        it('should be able to extract the id from the spec', function() {
            valid_specs.forEach(function(spec) {
                var node = zen(spec[0]);
                expect(node).not.toBeNull();
                expect(node.id).toEqual(spec[1]);
            });
        });
    });

    describe('when the spec dose not contain any id definition', function() {
        var specs = [
            'a',
            '.item',
            '.x.y',
            '[foo=bar]',
            '[k1=v1][k2=v2]',
            '{txt}'
        ];
        it('the node zen creates should have no id attribute associated with it', function() {
            specs.forEach(function(spec) {
                expect(zen(spec).id).toBeEmpty();
            });
        });
    });

    describe('when the spec contains invalid id definitions', function() {
        it('should reject the spec and returns null', function() {
            var invalid_specs = [
                '#',
                '##',
                '#.',
                '.#',
                '#a#b',
                '#3rd',
                '#?!',
                '#豆瓣'
            ];
            invalid_specs.forEach(function(spec) {
                expect(zen(spec)).toBeNull();
            });
        });
    });

    //
    // class-related specs
    //

    describe('when the spec contains a single valid class definition', function() {
        var specs = [
            ['.item', 'item'],
            ['.sec2', 'sec2'],
            ['.f4n_c-y_', 'f4n_c-y_']
        ];
        it('should be able to extract the class from the spec', function() {
            specs.forEach(function(spec) {
                expect(zen(spec[0]).className).toEqual(spec[1]);
            });
        });
    });

    describe('when the spec contains multiple valid class definitions', function() {
        var specs = [
            ['div.a.b', ['a', 'b']],
            ['#logo.x.y.z', ['x', 'y', 'z']],
            ['.a.f4n_c-y_', ['a', 'f4n_c-y_']]
        ];
        it('should be able to extract each class correctly from the spec', function() {
            specs.forEach(function(spec) {
                var node = zen(spec[0]);
                expect(node).not.toBeNull();
                spec[1].forEach(function(className) {
                    expect(node.className).toContain(className);
                });
                expect(node.className.trim().split(' ').length).toEqual(spec[1].length);
            });
        });
    });

    describe('when the spec does not contain any class definitions', function() {
        var specs = [
            'a',
            '#logo',
            '#logo[a=b]',
            '[a=b][m=n]',
            '{foobar}'
        ];
        it('the node zen creates should not have any class associated with it', function() {
            specs.forEach(function(spec) {
                expect(zen(spec).className).toBeEmpty();
            });
        });
    });

    describe('when the spec contains invalid class definitions', function() {
        var invalid_specs = [
            '.',
            '..',
            '.a#b',
            '.1024',
            '.?!',
            '.豆瓣'
        ];
        it('should reject the spec and returns null', function() {
            invalid_specs.forEach(function(spec) {
                expect(zen(spec)).toBeNull();
            });
        });
    });

    //
    // attribute-related specs
    //

    describe('when the spec contains a single valid attribute definition', function() {
        var specs = [
            ['[m4=n_-_]', ['m4', 'n_-_']],
            ['[href=http://ex4mple.com/index.html#hsh?a=b&e=f]', ['href', 'http://ex4mple.com/index.html#hsh?a=b&e=f']]
        ];
        it('should be able to extract the correct attribute from the spec', function() {
            specs.forEach(function(spec) {
                var node = zen(spec[0]);
                expect(node.getAttribute(spec[1][0])).toEqual(spec[1][1]);
            });
        });

    });

    describe('when the spec contains multiple valid attribute definitions', function() {
        it('should be able to extract each attribute correctly from the spec', function() {
            var node = zen('a[href=http://bit.ly/reg.htm#s1.2.232?a=b&fo0=bar][title=an url shortener][target=_blank]');
            expect(node.getAttribute('href')).toEqual('http://bit.ly/reg.htm#s1.2.232?a=b&fo0=bar');
            expect(node.getAttribute('title')).toEqual('an url shortener');
            expect(node.getAttribute('target')).toEqual('_blank');
        });
    });

    describe('when the spec contains invalid attribute definitions', function() {
        var invalid_specs = [
            '][',
            'a=b][b=c[c=d]',
            '[a=b[',
            '[[a=b]',
            '[a=b]]',
            '[a]',
            '[a=b][xy=][m=n]',
            '[asd=]',
            '[=dsa]'
        ];
        it('should reject the spec and returns null', function() {
            invalid_specs.forEach(function(spec) {
                expect(zen(spec)).toBeNull();
            });
        });
    });

    //
    // content-related specs
    //

    describe('when the spec contains valid content definitions', function() {
        it('should be able to recognize and inject the content to the node', function() {
            var txt = '!@#$%^*()1234567890[];:\'"\\/,.`~颜文字ƒ';
            expect(zen('p.para[foo=bar]{' + txt + '}').innerHTML).toEqual(txt);
        });
        it('should sanitize content by default', function() {
            expect(zen.sanitize).toBeDefined();
            expect(zen.sanitize).toBeTruthy();
            expect(zen('{<script src="evil.js"></script>}').innerHTML).not.toMatch(/[<>]/g);
        });

        it('should not sanitize content when zen.sanitize is falsy', function() {
            zen.sanitize = false;
            var XSS = '<script></script>';
            expect(zen('{' + XSS + '}').innerHTML).toEqual(XSS);
        });
    });

    //
    // children-related specs
    //

    describe('when a zen instance is given as the second parameter', function() {
        it('should be inserted as the child of the first one', function() {
            var parent = zen("div.parent", zen("div.child"));
            var child = parent.children[0];
            expect(child).toBeDefined();
            expect(child).toBeTagged("div");
            expect(child.className).toEqual("child");
        });

        it('should allow nesting of additional children', function() {
            var parent = zen('div.parent', zen('div.child', zen('div.grandChild')));
            var child = parent.children[0];
            expect(child).toBeDefined();
            expect(child).toBeTagged('div');
            expect(child.className).toEqual('child');
            var grandChild = child.children[0];
            expect(grandChild).toBeDefined();
            expect(grandChild).toBeTagged('div');
            expect(grandChild.className).toEqual('grandChild');
        });
        
        it('should allow an array of children of the first one', function() {
            var parent = zen("div.parent", [zen("div.child0"), zen("div.child1")]);
            var child0 = parent.children[0];
            var child1 = parent.children[1];
            expect(child0).toBeDefined();
            expect(child0).toBeTagged("div");
            expect(child0.className).toEqual("child0");
            expect(child1).toBeDefined();
            expect(child1).toBeTagged("div");
            expect(child1.className).toEqual("child1");
        });
    });

    describe('when the spec contains a child operator', function() {
        it('should create a child element described by the operand', function() {
            var specs = [
                'ul>li.child',
                'div>a[href=http://www.google.com/]',
                'a>b>c>d'
            ];

            specs.forEach(function(spec) {
                var elem = zen(spec);
                expect(elem).not.toBeNull();
                expect(elem.children.length).toBe(1);
            });

            var li = zen(specs[0]).children[0];
            expect(li).toBeTagged('li');
            expect(li.className).toEqual('child');

            var a = zen(specs[1]).children[0];
            expect(a).toBeTagged('a');
            expect(a.href).toEqual('http://www.google.com/');

            var b = zen(specs[2]).children[0];
            expect(b).toBeTagged('b');
            expect(b.children[0]).toBeTagged('c');
            expect(b.children[0].children[0]).toBeTagged('d');
        });
    });

    describe('when the spec contains child elements and invalid entries', function() {
        it('should throw away the invalid children', function() {
            var invalid_specs = [
                'ul>li[asd=]',
                'div>a[href=http://<>www.google.com/]',
            ];

            var ul = zen(invalid_specs[0]);
            expect(ul.children.length).toEqual(0);
            var div = zen(invalid_specs[1]);
            expect(div.children.length).toEqual(0);
        });

        it('should throw away the whole spec and return null if the parent element is invalid', function() {
            var invalid_specs = [
                'ul[]=afa]>li'
            ];

            var ul = zen(invalid_specs[0]);
            expect(ul).toEqual(null);
        });
    })
});
