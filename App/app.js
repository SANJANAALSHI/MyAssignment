var app = angular.module('ImunizationApp', [
    'ngRoute'
  ])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/home', {
        templateUrl: './home/template/homePage.html',
        controller: 'homePageCtrl'
      })
      .otherwise({
        redirectTo: '/home'
      });
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
  }]);
