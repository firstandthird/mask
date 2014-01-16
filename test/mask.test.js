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
    test('ssn', function() {
      assert.equal(form.mask('parse', 'ssn', ''), '___-__-____');
      assert.equal(form.mask('parse', 'ssn', '123456789'), '123-45-6789');
      assert.equal(form.mask('parse', 'ssn', '1234567'), '123-45-67__');
      assert.equal(form.mask('parse', 'ssn', '123-45-6789'), '123-45-6789');
      assert.equal(form.mask('parse', 'ssn', '123 45 6789'), '123-45-6789');
      assert.equal(form.mask('parse', 'ssn', '1234567890'), '123-45-6789');
      assert.equal(form.mask('parse', 'ssn', 'abc456789'), '___-45-6789');
    });
    test('phone (nanp style)', function() {
      assert.equal(form.mask('parse', 'phone', ''), '(___) ___-____');
      assert.equal(form.mask('parse', 'phone', '5555555555'), '(555) 555-5555');
      assert.equal(form.mask('parse', 'phone', '55555555'), '(555) 555-55__');
      assert.equal(form.mask('parse', 'phone', '(555)555-5555'), '(555) 555-5555');
      assert.equal(form.mask('parse', 'phone', '(555) 555 5555'), '(555) 555 5555');
      assert.equal(form.mask('parse', 'phone', '+1 (555)555-5555'), '(555) 555-5555');
      assert.equal(form.mask('parse', 'phone', '(abc)555-5555'), '(___) 555-5555');
      assert.equal(form.mask('parse', 'phone', '555.555.5555'), '(555) 555-5555');
      assert.equal(form.mask('parse', 'phone', '55555555555'), '(555) 555-5555');
    });
    test('email', function() {
      assert.equal(form.mask('parse', 'email', ''), '___@___.___');
      assert.equal(form.mask('parse', 'email', 'email'), 'email@___.___');
      assert.equal(form.mask('parse', 'email', 'a'), 'a@___.___');
      assert.equal(form.mask('parse', 'email', 'email+test'), 'email+test@___.___');
      assert.equal(form.mask('parse', 'email', 'email_test'), 'email_test@___.___');
      assert.equal(form.mask('parse', 'email', 'email/test'), 'email_test@___.___');
      assert.equal(form.mask('parse', 'email', 'email@example'), 'email@example.___');
      assert.equal(form.mask('parse', 'email', 'email@local'), 'email@local.___');
      assert.equal(form.mask('parse', 'email', 'email@example.com'), 'email@example.com');
      assert.equal(form.mask('parse', 'email', 'email@example.ru'), 'email@example.ru');
      assert.equal(form.mask('parse', 'email', 'email@example.f+t'), 'email@example.f_t');
    });
    test('number format', function() {
      assert.equal(form.mask('parse', 'number', ''), '');
      assert.equal(form.mask('parse', 'number', '10'), '10');
      assert.equal(form.mask('parse', 'number', '1000'), '1,000');
      assert.equal(form.mask('parse', 'number', '10,000'), '10,000');
      assert.equal(form.mask('parse', 'number', '$1,000'), '$1,000');
      assert.equal(form.mask('parse', 'number', 'abcd'), 'abcd');
      assert.equal(form.mask('parse', 'number', '1000.00'), '1,000.00');
      assert.equal(form.mask('parse', 'number', '10,000.0000'), '10,000.0000');

      // Nice to have
      // Maybe add support for locales instead.
      assert.equal(form.mask('parse', 'number', '100,00'), '100.00');
    });
    test('custom', function() {
      assert.equal(form.mask('parse', 'spyphone', ''), '___-____');
      assert.equal(form.mask('parse', 'spyphone', '5555555'), '555-5555');
      assert.equal(form.mask('parse', 'spyphone', '55555'), '555-55__');
      assert.equal(form.mask('parse', 'spyphone', '(555)555-5555'), '555-5555');
      assert.equal(form.mask('parse', 'spyphone', '(555) 555 5555'), '555-5555');
      assert.equal(form.mask('parse', 'spyphone', '+1 (555)555-5555'), '555-5555');
      assert.equal(form.mask('parse', 'spyphone', '(abc)555-5555'), '555-5555');
      assert.equal(form.mask('parse', 'spyphone', '555.555.5555'), '555-5555');
      assert.equal(form.mask('parse', 'spyphone', '55555555555'), '555-5555');
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
