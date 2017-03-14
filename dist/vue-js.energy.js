'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    'use strict';

    var presets = {
        'dpe': [{ color: '#309535', letter: 'A', legend: '<= 50', isValid: function isValid(i) {
                return i <= 50;
            } }, { color: '#51a835', letter: 'B', legend: '51 à 90', isValid: function isValid(i) {
                return i >= 51 && i <= 90;
            } }, { color: '#c2ce00', letter: 'C', legend: '91 à 150', isValid: function isValid(i) {
                return i >= 91 && i <= 150;
            } }, { color: '#eade00', letter: 'D', legend: '151 à 230', isValid: function isValid(i) {
                return i >= 151 && i <= 230;
            } }, { color: '#f9c802', letter: 'E', legend: '231 à 330', isValid: function isValid(i) {
                return i >= 231 && i <= 330;
            } }, { color: '#f09538', letter: 'F', legend: '331 à 450', isValid: function isValid(i) {
                return i >= 331 && i <= 450;
            } }, { color: '#e0251e', letter: 'G', text_color: '#fff', legend: '> 450', isValid: function isValid(i) {
                return i > 450;
            } }],
        'ges': [{ color: '#f6eefd', letter: 'A', legend: '<= 5', isValid: function isValid(i) {
                return i <= 5;
            } }, { color: '#e0c2f8', letter: 'B', legend: '6 à 10', isValid: function isValid(i) {
                return i >= 6 && i <= 10;
            } }, { color: '#d4aaf6', letter: 'C', legend: '11 à 20', isValid: function isValid(i) {
                return i >= 11 && i <= 20;
            } }, { color: '#cb95f3', letter: 'D', legend: '21 à 35', isValid: function isValid(i) {
                return i >= 21 && i <= 35;
            } }, { color: '#ba72ef', letter: 'E', legend: '36 à 55', isValid: function isValid(i) {
                return i >= 36 && i <= 55;
            } }, { color: '#a74deb', letter: 'F', legend: '56 à 80', isValid: function isValid(i) {
                return i >= 56 && i <= 80;
            } }, { color: '#8919df', text_color: '#fff', letter: 'G', legend: '> 80', isValid: function isValid(i) {
                return i > 80;
            } }]
    };
    Vue.component('energy', {
        props: ['value', 'preset', 'settings'],
        data: function data() {
            return { rating: null };
        },
        watch: {
            value: function value(v) {
                this.rating.select(v);
            }
        },
        mounted: function mounted() {
            var settings = null;
            if (!!this.preset && Object.keys(presets).indexOf(this.preset) !== -1) {
                settings = presets[this.preset];
            } else if (!!this.settings) {
                settings = this.settings;
            } else {
                throw new Error('missing settings');
            }
            this.rating = new EnergyRating(this.$el, settings);
            this.rating.draw();
            if (!!this.value) {
                this.rating.select(this.value);
            }
        },
        template: '<svg></svg>'
    });
})();
'use strict';

var EnergyRating = function () {
    function EnergyRating(rootEl, settings) {
        _classCallCheck(this, EnergyRating);

        this.svg = rootEl;
        this.settings = settings;
        if (rootEl.tagName.toLowerCase() !== 'svg') {
            this.svg = this._createSvgNode('svg', rootEl);
            rootEl.appendChild(this.svg);
        }
        this._init();
    }

    _createClass(EnergyRating, [{
        key: '_init',
        value: function _init() {
            this.dim = this.svg.getBoundingClientRect();
            this.position = 1;
            this.space = 10 / 100;
            this.length = this.dim.width / 9;
            this.height = this.dim.height / this.settings.length;
            this.height = this.height - this.height * this.space;
        }
    }, {
        key: '_createSvgNode',
        value: function _createSvgNode(name, el, elAttrs) {
            var namespace = 'http://www.w3.org/2000/svg';
            var node = document.createElementNS(namespace, name);
            for (var attribute in elAttrs) {
                var value = elAttrs[attribute];
                if (value !== undefined && !attribute.match(/\$/) && (typeof value !== 'string' || value !== '')) {
                    node.setAttribute(attribute, value);
                }
            }
            return node;
        }
    }, {
        key: '_drawSelect',
        value: function _drawSelect(params) {
            return [this._drawPath({
                fill: '#000',
                'stroke-width': '1',
                d: 'm' + params.maxlen + ',' + params.position + 'l-' + this.length + ',0l-' + params.height / 2 + ',' + params.height / 2 + 'l' + params.height / 2 + ',' + params.height / 2 + 'l' + params.maxlen + ',0z'
            }), this._drawPath({
                stroke: '#000',
                'stroke-width': '1',
                'stroke-dasharray': '2,2',
                d: 'm' + (params.maxlen - this.length - params.height / 2) + ',' + (params.position + params.height / 2) + 'l-' + (params.maxlen - this.length - params.height / 2 * 2 - params.len) + ',0z'
            }), this._drawText({
                'fill': '#fff',
                'font-size': params.height / 2,
                'x': params.maxlen - this.length + this.length / 6,
                'y': params.position + params.height / 2 + params.height / 6
            }, params.text)];
        }
    }, {
        key: '_drawText',
        value: function _drawText(options, value) {
            var defaultOptions = {
                'stroke-width': '0',
                'stroke-linejoin': 'null',
                'stroke-linecap': 'null',
                'font-family': 'Arial'
            };
            options = Object.assign(defaultOptions, options);
            var node = this._createSvgNode('text', this.svg, options);
            node.innerHTML = value;
            this.svg.appendChild(node);
            return node;
        }
    }, {
        key: '_drawLetter',
        value: function _drawLetter(options, value) {
            var defaultOptions = {
                'font-weight': 'bold'
            };
            options = Object.assign(defaultOptions, options);
            return this._drawText(options, value);
        }
    }, {
        key: '_drawLegend',
        value: function _drawLegend(options, value) {
            var defaultOptions = {
                x: 4
            };
            options = Object.assign(defaultOptions, options);
            return this._drawText(options, value);
        }
    }, {
        key: '_drawPath',
        value: function _drawPath(options) {
            var defaultOptions = {
                'stroke-width': '0',
                'stroke-linejoin': 'null',
                'stroke-linecap': 'null'
            };
            options = Object.assign(defaultOptions, options);
            var node = this._createSvgNode('path', this.svg, options);
            this.svg.appendChild(node);
            return node;
        }
    }, {
        key: '_drawLine',
        value: function _drawLine(params) {
            return [this._drawPath({
                'fill': params.setting.color,
                'd': 'm1,' + params.position + 'l' + params.len + ',0l' + params.height / 2 + ',' + params.height / 2 + 'l-' + params.height / 2 + ',' + params.height / 2 + 'l-' + params.len + ',0z'
            }), this._drawLetter({
                'fill': params.setting.text_color || '#000',
                'font-size': params.height / 2,
                'x': params.len - params.height / 5,
                'y': params.position + params.height / 2 + params.height / 6
            }, params.setting.letter), this._drawLegend({
                'fill': params.setting.text_color || '#000',
                'font-size': params.height / 2.5,
                'y': params.position + params.height / 2 + params.height / 6
            }, params.setting.legend)];
        }
    }, {
        key: 'select',
        value: function select(value) {
            var selected;
            var selectedValue;
            if (this.selectedNodes) {
                this.selectedNodes.forEach(function (n) {
                    return n.remove();
                });
            }
            if (value !== undefined && typeof value === 'number') {
                var matchValue = this.settings.filter(function (setting) {
                    return setting.isValid(value);
                });
                if (matchValue && matchValue.length === 1) {
                    selected = this.settings.indexOf(matchValue[0]);
                    selectedValue = value;
                }
            } else if (value !== undefined && typeof value === 'string') {
                var matchLetter = this.settings.filter(function (setting) {
                    return setting.letter.toLowerCase() === value.toLowerCase();
                });
                if (matchLetter && matchLetter.length === 1) {
                    selected = this.settings.indexOf(matchLetter[0]);
                    selectedValue = matchLetter[0].letter;
                }
            }
            if (selected !== undefined) {
                var data = {
                    setting: this.settings[selected],
                    position: this.position + (this.height + this.height * this.space) * selected,
                    height: this.height,
                    len: this.length * (selected + 1),
                    maxlen: this.dim.width,
                    text: selectedValue
                };
                this.selectedNodes = this._drawSelect(data);
            }
        }
    }, {
        key: 'draw',
        value: function draw() {
            var that = this;
            this.settings.forEach(function (setting, index) {
                var data = {
                    setting: setting,
                    position: that.position + (that.height + that.height * that.space) * index,
                    height: that.height,
                    len: that.length * (index + 1)
                };
                that._drawLine(data);
            });
        }
    }]);

    return EnergyRating;
}();