import ruleTester from '../utils/ruleTester';
import rule from './ng-strictdi';
ruleTester.run('ng-strictdi', rule, {
  valid: [
    {
      code: `
        import { module } from 'angular';
        module('foo', [])
          .directive('myDirective', ['$scope', function($scope) {}]);
      `,
    },
    {
      code: `
        import { module } from 'angular';
        class Controller {
          static $inject = ['$scope'];
          constructor($scope) {
          }
        }
        module('foo', [])
          .directive('myDirective', ['$scope', function($scope) {}]);
      `,
    },
    {
      code: `
        import { module } from 'angular';
        module('foo', [])
          .directive('myDirective', ['$scope', function($scope) {}]);
      `,
    },
  ],

  invalid: [
    {
      errors: [{ message: 'The injected function has 1 parameter(s): ["$scope"], but no annotation was found' }],
      code: `
        const angular = require('angular');
        angular.module('foo', [])
          .controller('myController', function($scope) {});
      `,
      output: `
        const angular = require('angular');
        angular.module('foo', [])
          .controller('myController', ['$scope', function($scope) {}]);
      `,
    },
    {
      errors: [
        { message: 'The injected function \'MyClass\' has 1 parameter(s): ["$scope"], but no annotation was found' },
      ],
      code: `
        import { module } from 'angular';
        // Do not rename this to MyClassController or the checkDi rule will fire twice
        class MyClass {
          constructor($scope) {
          }
        }
        module('foo', []).controller('myClassController', MyClass);
      `,
      output: `
        import { module } from 'angular';
        // Do not rename this to MyClassController or the checkDi rule will fire twice
        class MyClass {
          constructor($scope) {
          }
        }
MyClass.$inject = ['$scope'];
        module('foo', []).controller('myClassController', MyClass);
      `,
    },
    {
      errors: [{ message: 'The injected function has 1 parameter(s): ["$scope"], but no annotation was found' }],
      code: `
        const angular = require('angular');
        angular.module('foo', [])
          .directive('myDirective', { controller: function namedFunction($scope) {} });
      `,
      output: `
        const angular = require('angular');
        angular.module('foo', [])
          .directive('myDirective', { controller: ['$scope', function namedFunction($scope) {}] });
      `,
    },
    {
      errors: [
        { message: 'The injected function has 2 parameter(s): ["$scope","$location"], but no annotation was found' },
      ],
      code: `
        const angular = require('angular');
        angular.module('foo', [])
          .directive('myDirective', { controller: function ($scope, $location) {} });
      `,
      output: `
        const angular = require('angular');
        angular.module('foo', [])
          .directive('myDirective', { controller: ['$scope', '$location', function ($scope, $location) {}] });
      `,
    },
  ],
});
