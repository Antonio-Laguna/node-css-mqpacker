/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');
var postcss = require('postcss');

var mqpacker = require('../index');

var dirFixtures = path.join(__dirname, 'fixtures');
var dirExpected = path.join(__dirname, 'expected');
var input = '';
var expected = '';
var opts = {};
var loadInput = function (name) {
  return fs.readFileSync(path.join(dirFixtures, name + '.css'), {
    encoding: 'utf8'
  });
};
var loadExpected = function (name) {
  return fs.readFileSync(path.join(dirExpected, name + '.css'), {
    encoding: 'utf8'
  });
};

exports.testPublicInterfaces = function (test) {
  test.expect(4);

  input = '.foo { color: black; }';
  expected = postcss.parse(input);
  test.strictEqual(mqpacker.pack(input).css, expected.toString());

  opts.map = true;
  test.deepEqual(
    mqpacker.pack(input, opts).map,
    expected.toResult(opts).map
  );

  test.strictEqual(
    postcss().use(mqpacker.postcss).process(input).css,
    expected.toString()
  );

  // Old interface
  test.strictEqual(
    postcss().use(mqpacker.processor).process(input).css,
    expected.toString()
  );

  test.done();
};

exports.testRealCSS = function (test) {
  test.expect(4);

  var testCases = [
    'simple',
    'multi',
    'query-order',
    'between-the-packed-rules'
  ];

  for (var i = 0, l = testCases.length; i < l; i++) {
    var testCase = testCases[i];
    input = loadInput(testCase);
    expected = loadExpected(testCase);
    test.strictEqual(mqpacker.pack(input).css, expected);
  }

  test.done();
};
