
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
    init: function() {
      var self = this;
      this.inputs = this.el.find('[data-mask]');
      this.currPos = 0;
      this.supportedInputEvent = 'input.mask click.mask';

      this.inputs.each(function(){
        var $this = $(this);
        $this.on(self.supportedInputEvent, self.proxy(self.handleInput));
      });

      this.inputs.trigger('input');
    },
    getCursorPosition: function(el) {
      var input = el.get(0);
      if(!input) return;
      if(document.selection) input.focus();
      return 'selectionStart' in input ? input.selectionStart: '' || Math.abs(document.selection.createRange().moveStart('character', -input.value.length));
    },
    setCursorPosition: function(el, pos) {
      var input = el.get(0);
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
      var el = $(event.target);
      var method = el.data('mask');
      var regex = el.data('mask-regex');
      var input = el.val();
      this.currPos = this.getCursorPosition(el);

      el.val(this.parse(method, input, this.currPos, regex));
      
      this.setCursorPosition(el, this.currPos);
    },
    parse: function(method, input, pos, regex) {
      if(typeof this[method] !== 'object') return '';

      pos = pos || 0;
      var params = this[method];
      input = input || params.mask;
      regex = regex || params.regex;
      var mask = params.mask;
      var diff = input.length - mask.length;
      var usable = [];
      var i, c, offset = 0;

      if(diff < 0) diff = 0;

      input = input.split('');
      input.splice(pos, diff);
      input = input.join('');
      
      var matches = input.match(regex);
      if(matches) {
        for(i = 1, c = matches.length; i < c; i++) {
          usable.push(matches[i]);
        }
      }

      usable = usable.join('').split('');

      for(i = 0, c = usable.length; i < c; i++) {
        if(mask.charAt(i + offset) === '' || i + offset > mask.length) break;
        if(mask.charAt(i + offset) === '_') {
          mask = mask.substr(0, i + offset) + usable[i] + mask.substr(i + offset + 1);
        } else {
          offset++;
          i--;
        }
      }

      input = mask;

      // This is annoying...
      if(input.charAt(pos) !== '_') {
        //this.currPos++;
      }

      return input;
    },
    ssn: {
      mask: '___-__-____',
      regex: /([\d_]{3})-?([\d_]{2})?-?([\d_]{4})?/
    },
    phone: {
      mask: '(___) ___-____',
      regex: /\(([\d_]{3})?\) ([\d_]{3})?-?([\d_]{4})?/
    },
    email: {
      mask: '___@___.___',
      regex: /(\w+@[\w\.\w]+)/
    }
  });
}());