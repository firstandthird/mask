//mask.js

(function(){
  $.declare('mask', {
    init: function() {
      var self = this;
      this.inputs = this.el.find('[data-mask]');
      this.currPos = 0;
      this.isBackspace = false;

      this.inputs.each(function(){
        var $this = $(this);
        $this.on('input.mask click.mask', self.proxy(self.handleInput));
        $this.on('keydown.mask', function(event){
          if(event.which === 8) {
            self.isBackspace = true;
          }
        });
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

      el.val(this.parse(method, input, this.currPos, event, regex));
      
      this.setCursorPosition(el, this.currPos);
    },
    parse: function(method, input, pos, event, regex) {
      if(typeof this[method] !== 'object') return '';

      event = event || $.Event('input');
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
        if((input === mask || params.strict) && mask.indexOf('_') !== -1) {
          this.currPos = mask.indexOf('_');
          pos = this.currPos;
        }
      }

      if(diff < 0) diff = 0;

      input = input.split('');
      input.splice(pos, diff);
      input = input.join('');
      
      var matches = input.match(regex);
      if(matches) {
        for(i = 0, c = matches.length; i < c; i++) {
          usable.push(matches[i]);
        }
      }

      usable = usable.join('');

      for(i = 0, c = usable.length; i < c; i++) {
        if(mask.charAt(i + offset) === '' && params.strict) break;
        if(mask.charAt(i + offset) === '_' || !params.strict) {
          mask = mask.substr(0, i + offset) + usable.charAt(i) + mask.substr(i + offset + 1);
        } else {
          offset++;
          i--;
        }
      }
      
      if(mask.charAt(pos) !== '_' && !this.isBackspace && params.strict) {
        this.currPos++;
      }

      this.isBackspace = false;

      return mask;
    },
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
    }
  });
}());