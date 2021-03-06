'use strict';
class EnergyRating {
    constructor(rootEl, settings) {
        this.svg = rootEl;
        this.settings = settings;
        if (rootEl.tagName.toLowerCase() !== 'svg'){
            this.svg = this._createSvgNode('svg', rootEl);
            rootEl.appendChild(this.svg);            
        }
        this._init();
    }
    _init() {
        this.dim = this.svg.getBoundingClientRect();
        this.position = 1;
        this.space = 10 / 100;
        this.length = this.dim.width / 9;
        this.height = (this.dim.height / this.settings.length);
        this.height = this.height - (this.height * this.space);
    }
    _createSvgNode(name, el, elAttrs) {
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
    _drawSelect(params) {
        return [
            this._drawPath({
                fill: '#000',
                'stroke-width': '1',
                d: 'm' + params.maxlen + ',' + params.position + 'l-' + this.length + ',0l-' + params.height / 2 + ',' + params.height / 2 + 'l' + params.height / 2 + ',' + params.height / 2 + 'l' + params.maxlen + ',0z'
            }),
            this._drawPath({
                stroke: '#000',
                'stroke-width': '1',
                'stroke-dasharray': '2,2',
                d: 'm' + (params.maxlen - this.length - (params.height / 2)) + ',' + (params.position + (params.height / 2)) + 'l-' + (params.maxlen - this.length - ((params.height / 2) * 2) - params.len) + ',0z'
            }),
            this._drawText({
                'fill': '#fff',
                'font-size': params.height / 2,
                'x': params.maxlen - (this.length) + (this.length / 6),
                'y': params.position + (params.height / 2) + (params.height / 6)
            }, params.text)
        ];
    }
    _drawText(options, value) {
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
    _drawLetter(options, value) {
        var defaultOptions = {
            'font-weight': 'bold'
        };
        options = Object.assign(defaultOptions, options);
        return this._drawText(options, value);
    }
    _drawLegend(options, value) {
        var defaultOptions = {
            x: 4
        };
        options = Object.assign(defaultOptions, options);
        return this._drawText(options, value);
    }
    _drawPath(options) {
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
    _drawLine(params) {
        return [
            this._drawPath({
                'fill': params.setting.color,
                'd': 'm1,' + params.position + 'l' + params.len + ',0l' + (params.height / 2) + ',' + (params.height / 2) + 'l-' + (params.height / 2) + ',' + (params.height / 2) + 'l-' + params.len + ',0z'
            }),
            this._drawLetter({
                'fill': params.setting.text_color || '#000',
                'font-size': params.height / 2,
                'x': params.len - ((params.height / 5)),
                'y': params.position + (params.height / 2) + (params.height / 6)
            }, params.setting.letter),
            this._drawLegend({
                'fill': params.setting.text_color || '#000',
                'font-size': params.height / 2.5,
                'y': params.position + (params.height / 2) + (params.height / 6)
            }, params.setting.legend)
        ];
    }
    select(value) {
        var selected;
        var selectedValue;
        if (this.selectedNodes){
            this.selectedNodes.forEach((n) => n.remove());
        }
        if (value !== undefined && typeof value === 'number') {
            var matchValue = this.settings.filter((setting) => setting.isValid(value));
            if (matchValue && matchValue.length === 1) {
                selected = this.settings.indexOf(matchValue[0]);
                selectedValue = value;
            }
        } else if (value !== undefined && typeof value === 'string') {
            var matchLetter = this.settings.filter((setting) => setting.letter.toLowerCase() === value.toLowerCase());
            if (matchLetter && matchLetter.length === 1) {
                selected = this.settings.indexOf(matchLetter[0]);
                selectedValue = matchLetter[0].letter;
            }
        }
        if (selected !== undefined) {
            var data = {
                setting: this.settings[selected],
                position: this.position + ((this.height + (this.height * this.space)) * selected),
                height: this.height,
                len: this.length * (selected + 1),
                maxlen: this.dim.width,
                text: selectedValue
            };
            this.selectedNodes = this._drawSelect(data);
        }
    }
    draw() {
        var that = this;
        this.settings.forEach(function (setting, index) {
            var data = {
                setting: setting,
                position: that.position + ((that.height + (that.height * that.space)) * index),
                height: that.height,
                len: that.length * (index + 1)
            };
            that._drawLine(data);
        });
    }
}
