'use strict';

var clear = require('es5-ext/array/#/clear');

module.exports = function (t, a) {
	var conf = {}, router, called = [];
	conf = {
		foo: {
			validate: function () { called.push('foo:validate'); },
			save: function () { called.push('foo:save'); },
			returnUrl: 'marko'
		},
		'elo/[a-z]+': {
			match: function (a1) { called.push('elo:match'); return true; },
			validate: function () { called.push('elo:validate'); },
			save: function () { called.push('elo:save'); }
		},
		miszka: true,
		remote: {
			remoteSave: function (x) {
				called.push('remote:remoteSave');
				return x;
			},
			processResponse: function (x) {
				called.push('remote:processResponse');
				return x;
			}
		}
	};
	router = t(conf, {
		validate: function (x) {
			called.push('validate');
			return x;
		},
		save: function () {
			called.push('save');
		}
	});
	a.deep(router('foo'), { conf: router.routes.foo, result: undefined });
	a.deep(called, ['foo:validate', 'foo:save']);
	clear.call(called);

	a.deep(router('elo/fiszka'), { conf: router.routes['elo/[a-z]+'], result: undefined });
	a.deep(called, ['elo:match', 'elo:validate', 'elo:save']);
	clear.call(called);

	a.deep(router('remote'), { conf: router.routes.remote, result: undefined });
	a.deep(called, ['validate', 'remote:remoteSave', 'remote:processResponse']);
	clear.call(called);
};
