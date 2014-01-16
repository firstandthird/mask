var form;

function input(el, text, index) {
  index = index || 0;
  var e = $.Event('keypress');
  var val = el.val().split('').splice(index, 0, 'text').join('');

  e.which = text.charCodeAt(0);
  el.val(val);
  el.trigger(e);
}

suite('mask', function() {
  setup(function() {
    form = $("#spySignup");
  });

  suite('init', function() {
    test('plugin exists', function() {
      assert.ok($.fn.mask);
    });
    test('custom masks', function() {
      form.mask({
        spyphone: {
          mask: '___-____',
          regex: /\d{3}-\d{4}/
        }
      });

      assert.ok(form.data('mask').spyphone);
    });
  });

  suite('parsers', function() {
    suite('ssn', function() {
      test('empty', function() {
        assert.equal(form.mask('parse', 'ssn', ''), '___-__-____');
      });
      test('plain numbers', function() {
        assert.equal(form.mask('parse', 'ssn', '123456789'), '123-45-6789');
      });
      test('partially filled in, just numbers', function() {
        assert.equal(form.mask('parse', 'ssn', '1234567'), '123-45-67__');
      });
      test('filled out correctly', function() {
        assert.equal(form.mask('parse', 'ssn', '123-45-6789'), '123-45-6789');
      });
      test('filled out with spaces', function() {
        assert.equal(form.mask('parse', 'ssn', '123 45 6789'), '123-45-6789');
      });
      test('filled out with too many numbers', function(){
        assert.equal(form.mask('parse', 'ssn', '1234567890'), '123-45-6789');  
      });
      test('invalid characters', function() {
        assert.equal(form.mask('parse', 'ssn', 'abc456789'), '___-45-6789');
      });
    });
    suite('phone (nanp style)', function() {
      test('empty', function() {
        assert.equal(form.mask('parse', 'phone', ''), '(___) ___-____');
      });
      test('plain numbers', function() {
        assert.equal(form.mask('parse', 'phone', '5555555555'), '(555) 555-5555');
      });
      test('partially filled in, just numbers', function() {
        assert.equal(form.mask('parse', 'phone', '55555555'), '(555) 555-55__');
      });
      test('filled out without space', function() {
        assert.equal(form.mask('parse', 'phone', '(555) 555-5555'), '(555) 555-5555');
      });
      test('filled out with spaces', function() {
        assert.equal(form.mask('parse', 'phone', '(555) 555 5555'), '(555) 555 5555');
      });
      test('country code included', function() {
        assert.equal(form.mask('parse', 'phone', '+1 (555)555-5555'), '(555) 555-5555');
      });
      test('invalid characters', function() {
        assert.equal(form.mask('parse', 'phone', '(abc)555-5555'), '(___) 555-5555');
      });
      test('filled out with periods', function() {
        assert.equal(form.mask('parse', 'phone', '555.555.5555'), '(555) 555-5555');
      });
      test('too many numbers', function() {
        assert.equal(form.mask('parse', 'phone', '55555555555'), '(555) 555-5555');
      });
    });
    suite('email', function() {
      test('empty', function() {
        assert.equal(form.mask('parse', 'email', ''), '___@___.___');
      });
      test('partially filled out', function() {
        assert.equal(form.mask('parse', 'email', 'email'), 'email__.___');
      });
      test('with +', function() {
        assert.equal(form.mask('parse', 'email', 'email+test'), 'email+test_');
      });
      test('with _', function() {
        assert.equal(form.mask('parse', 'email', 'email_test'), 'email_test_');
      });
      test('invalid character', function() {
        assert.equal(form.mask('parse', 'email', 'email/test'), 'emailtest__');
      });
      test('with @', function() {
        assert.equal(form.mask('parse', 'email', 'email@example'), 'email@example');
      });
      test('filled out completely', function() {
        assert.equal(form.mask('parse', 'email', 'email@example.com'), 'email@example.com');
      });
    });
    suite('number format (formatters)', function() {
      test('empty', function() {
        assert.equal(form.mask('parse', 'number', ''), '');
      });
      test('10', function() {
        assert.equal(form.mask('parse', 'number', '10'), '10');
      });
      test('1,000', function() {
        assert.equal(form.mask('parse', 'number', '1000'), '1,000');
      });
      test('10,000', function() {
        assert.equal(form.mask('parse', 'number', '10,000'), '10,000');
      });
      test('$1,000', function() {
        assert.equal(form.mask('parse', 'number', '$1,000'), '1,000');
      });
      test('invalid characters', function() {
        assert.equal(form.mask('parse', 'number', 'abcd'), '');
      });
      test('1,000.00', function() {
        assert.equal(form.mask('parse', 'number', '1000.00'), '1,000.00');
      });
      test('1,000,000.000', function() {
        assert.equal(form.mask('parse', 'number', '1000000.000'), '1,000,000.000');
      });
    });
    suite('custom masks', function() {
      test('empty', function() {
        assert.equal(form.mask('parse', 'spyphone', ''), '___-____');
      });
      test('plain', function() {
        assert.equal(form.mask('parse', 'spyphone', '5555555'), '555-5555');
      });
      test('not enough characters', function() {
        assert.equal(form.mask('parse', 'spyphone', '55555'), '555-55__');
      });
      test('correctly filled out', function() {
        assert.equal(form.mask('parse', 'spyphone', '(555) 555-5555'), '555-5555');
      });
      test('filled out spaces', function() {
        assert.equal(form.mask('parse', 'spyphone', '(555) 555 5555'), '555-5555');
      });
      test('invalid characters', function() {
        assert.equal(form.mask('parse', 'spyphone', '(abc)555-5555'), '555-5555');
      });
      test('too many characters', function() {
        assert.equal(form.mask('parse', 'spyphone', '55555555555'), '555-5555');
      });
    });
  });

  suite('input', function() {
    test('should parse as typed', function() {
      var el = $('#spySSN');
      el.val('');
      assert.equal(el.val(), '___-__-____');
      input(el, 1, 0);
      assert.equal(el.val(), '1__-__-____');
      input(el, 2, 1);
      assert.equal(el.val(), '12_-__-____');
      input(el, 3, 2);
      assert.equal(el.val(), '123-__-____');
      input(el, 4, 3);
      input(el, 5, 4);
      assert.equal(el.val(), '123-45-____');
      input(el, 6, 5);
      input(el, 7, 6);
      input(el, 8, 7);
      input(el, 9, 8);
      assert.equal(el.val(), '123-45-6789');
    });
    test('too many characters shouldn\'t matter', function() {
      var el = $('#spySSN');
      el.val('');
      assert.equal(el.val(), '___-__-____');
      input(el, 1, 0);
      assert.equal(el.val(), '1__-__-____');
      input(el, 2, 1);
      assert.equal(el.val(), '12_-__-____');
      input(el, 3, 2);
      assert.equal(el.val(), '123-__-____');
      input(el, 4, 3);
      input(el, 5, 4);
      assert.equal(el.val(), '123-45-____');
      input(el, 6, 5);
      input(el, 7, 6);
      input(el, 8, 7);
      input(el, 9, 8);
      assert.equal(el.val(), '123-45-6789');
      input(el, 0, 9);
      assert.equal(el.val(), '123-45-6789');
    });
    test('invalid characters', function() {
      var el = $('#spySSN');
      el.val('');
      assert.equal(el.val(), '___-__-____');
      input(el, 1, 0);
      assert.equal(el.val(), '1__-__-____');
      input(el, 'a', 1);
      assert.equal(el.val(), '1__-__-____');
      input(el, 3, 2);
      assert.equal(el.val(), '1_3-__-____');
    });
    test('handle pasted / pre-filled / change', function() {
      var el = $('#spySSN');
      el.val('');
      assert.equal(el.val(), '___-__-____');
      el.val('123456789');
      assert.equal(el.val(), '123-45-6789');
    });
  });
});
