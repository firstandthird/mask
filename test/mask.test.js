var form;

function writeVal(el, text, index) {
  index = index || 0;
  var val = el.val().split('');
  val.splice(index, 0, text);
  val = val.join('');

  el.val(val);
  el.trigger('input');
}

suite('mask', function() {
  setup(function() {
    form = $("[data-mask]");
  });

  suite('init', function() {
    test('plugin exists', function() {
      assert.ok($.fn.mask);
    });
    test('custom masks', function() {
      form.mask({
        spyphone: {
          mask: '___-____',
          strict: true,
          regex: /[\d_]/g
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
        // when more than one character is input at once, invalid characters are skipped.
        // When typing the cursor will advance.
        assert.equal(form.mask('parse', 'ssn', 'abc456789'), '456-78-9___');
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
        assert.equal(form.mask('parse', 'phone', '(555) 555 5555'), '(555) 555-5555');
      });
      test('country code included', function() {
        // Should probably make it ignore the country code.
        assert.equal(form.mask('parse', 'phone', '+1 (555)555-5555'), '(155) 555-5555');
      });
      test('invalid characters', function() {
        assert.equal(form.mask('parse', 'phone', '(abc)555-5555'), '(555) 555-5___');
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
    suite.skip('number format (formatters)', function() {
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
      var val = '';
      writeVal(el, '', 0);

      val = el.val();
      assert.equal(val, '___-__-____');
      writeVal(el, 0, 0);
      val = el.val();
      console.log(val);
      assert.equal(val, '0__-__-____');
      writeVal(el, 1, 1);
      val = el.val();
      assert.equal(val, '01_-__-____');
      writeVal(el, 2, 2);
      val = el.val();
      assert.equal(val, '012-__-____');
      writeVal(el, 3, 4);
      writeVal(el, 4, 5);
      val = el.val();
      assert.equal(val, '012-34-____');
      writeVal(el, 5, 7);
      writeVal(el, 6, 8);
      writeVal(el, 7, 9);
      writeVal(el, 8, 10);
      val = el.val();
      assert.equal(val, '012-34-5678');
    });
    test('handle pasted / pre-filled / change', function() {
      var el = $('#spySSN');
      var val = '';
      el.val('');
      el.trigger('input');
      val = el.val();
      assert.equal(val, '___-__-____');
      el.val('123456789');
      el.trigger('input');
      val = el.val();
      assert.equal(val, '123-45-6789');
    });
  });
});
