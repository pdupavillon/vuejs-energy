(function () {
    'use strict';
    var presets = {
        'dpe': [
            { color: '#309535', letter: 'A', legend: '<= 50', isValid: (i) => i <= 50 },
            { color: '#51a835', letter: 'B', legend: '51 à 90', isValid: (i) => i >= 51 && i <= 90},
            { color: '#c2ce00', letter: 'C', legend: '91 à 150', isValid: (i) => i >= 91 && i <= 150},
            { color: '#eade00', letter: 'D', legend: '151 à 230', isValid: (i) => i >= 151 && i <= 230},
            { color: '#f9c802', letter: 'E', legend: '231 à 330', isValid: (i) => i >= 231 && i <= 330},
            { color: '#f09538', letter: 'F', legend: '331 à 450', isValid: (i) => i >= 331 && i <= 450},
            { color: '#e0251e', letter: 'G', text_color: '#fff', legend: '> 450', isValid: (i) => i > 450}
        ],
        'ges': [
            {color:'#f6eefd', letter:'A', legend:'<= 5', isValid:(i) => i <= 5},
            {color:'#e0c2f8',letter:'B', legend:'6 à 10', isValid:(i) => i >= 6 && i <= 10},
            {color:'#d4aaf6', letter:'C', legend:'11 à 20', isValid:(i) => i >= 11 && i <= 20},
            {color:'#cb95f3',letter:'D', legend:'21 à 35', isValid:(i) => i >= 21 && i <= 35},
            {color:'#ba72ef',letter:'E', legend:'36 à 55', isValid:(i) => i >= 36 && i <= 55},
            {color:'#a74deb',letter:'F', legend:'56 à 80', isValid:(i) => i >= 56 && i <= 80},
            {color:'#8919df', text_color:'#fff', letter:'G', legend:'> 80', isValid:(i) => i > 80}
        ]
    };
    Vue.component('energy', {
        props: ['value', 'preset', 'settings'],
        data:function(){
            return {rating:null};
        },
        watch:{
            value: function(v){
                this.rating.drawSelect(v);
            }
        },
        mounted: function () {
            var settings = null;
            if (!!this.preset && Object.keys(presets).indexOf(this.preset) !== -1) { settings = presets[this.preset]; }
            else if (!!this.settings) { settings = this.settings; }
            else {  throw new Error('missing settings'); }
            this.rating = new EnergyRating(this.$el, settings);
            this.rating.draw();
            if (!!this.value){
                this.rating.drawSelect(this.value);
            }
        },
        template: '<svg></svg>'
    });    
})();