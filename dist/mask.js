
/*!
 * mask - Javascript input mask plugin
 * v0.1.0
 * https://github.com/firstandthird/mask
 * copyright First + Third 2014
 * MIT License
*/
//mask.js

(function(){
  $.declare('mask', {
    defaults: {
      ssn: {
        mask: '___-__-____',
        strict: true,
        regex: /[\d_]/g
      },
      phone: {
        mask: '(___) ___-____',
        strict: true,
        regex: /[\d_]/g
      },
      email: {
        mask: '___@___.___',
        strict: false,
        regex: /[\w_@\.\+]/g
      },
      number: {
        mask: '',
        strict: false,
        regex: /[\d_\.]/g,
        format: function(str) {
          return str;
        }
      }
    },
    init: function() {
      var self = this;
      this.currPos = 0;
      this.isBackspace = false;

      this.type = this.type || this.el.data('mask-type') || '_empty';

      this.el.on((('oninput' in document.createElement('input')) ? 'input.mask' : 'keyup.mask') + ' click.mask', self.proxy(self.handleInput));
      this.el.on('keydown.mask', function(event){
        if(event.which === 8) {
          self.isBackspace = true;
        }
      });

      this.el.trigger('input');
    },
    getCursorPosition: function() {
      var input = this.el.get(0);
      if(!input) return;
      if(document.selection) input.focus();
      return 'selectionStart' in input ? input.selectionStart: '' || Math.abs(document.selection.createRange().moveStart('character', -input.value.length));
    },
    setCursorPosition: function(pos) {
      var input = this.el.get(0);
      if(input.setSelectionRange) {
        input.setSelectionRange(pos, pos);
      } else if(input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
      }
    },
    handleInput: function(event) {
      var method = this.type;
      var regex = this.el.data('mask-regex');
      var input = this.el.val();
      this.currPos = this.getCursorPosition();

      this.el.val(this.parse(method, input, this.currPos, event, regex));
      
      this.setCursorPosition(this.currPos);
    },
    parse: function(method, input, pos, event, regex) {
      if(typeof this[method] !== 'object') return '';

      event = event || $.Event('api');
      pos = pos || 0;
      var params = this[method];
      input = input || params.mask;
      regex = regex || params.regex;
      var mask = params.mask;
      var usable = [];
      var i, c, offset = 0;
      var diff = input.length - mask.length;

      if(this.isBackspace) {
        input = input.substr(0, pos) + '_' + input.substr(pos);
      }

      if(event.type === 'click') {
        if((input === mask || params.strict) && input.indexOf('_') !== -1) {
          this.currPos = input.indexOf('_');
          pos = this.currPos;
        }
      }

      if(diff < 0) diff = 0;

      if(event.type !== 'api') {
        input = input.split('');
        input.splice(pos, diff);
        input = input.join('');
      }
      
      var matches = input.match(regex);

      usable = matches.join('');

      for(i = 0, c = usable.length; i < c; i++) {
        if(mask.charAt(i + offset) === '' && params.strict) break;
        if(mask.charAt(i + offset) === '_' || !params.strict) {
          mask = mask.substr(0, i + offset) + usable.charAt(i) + mask.substr(i + offset + 1);
        } else {
          offset++;
          i--;
        }
      }

      if(matches.length !== mask.match(regex).length) {
        this.currPos--;
      }
      
      if(mask.charAt(pos) !== '_' && !this.isBackspace && params.strict) {
        this.currPos++;
      }

      this.isBackspace = false;

      if(typeof params.format === 'function') {
        mask = params.format(mask);
      }

      return mask;
    }
  });
}());