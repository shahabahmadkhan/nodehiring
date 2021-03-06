angular.module('nodeHiring', []).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/', {templateUrl: 'view/default.html',   controller: DefaultController}).
            when('/register', {templateUrl: 'view/register.html',   controller: RegController}).
            when('/login', {templateUrl: 'view/login.html',   controller: LoginController}).
            when('/forgotPassword', {templateUrl: 'view/forgot.html',   controller: ForgotController}).
            when('/activate/:id', {templateUrl: 'view/activate.html',   controller: ActivateController}).
            when('/dashboard/admin', {templateUrl: 'view/adminDash.html',   controller: AdminDashController}).
            when('/dashboard/admin/updateProfile', {templateUrl: 'view/updateAdminProfile.html',   controller: UpdateProfileController}).
            when('/dashboard/user/updateProfile', {templateUrl: 'view/updateUserProfile.html',   controller: UpdateProfileController}).
            when('/dashboard/admin/viewApplications', {templateUrl: 'view/viewApplications.html',   controller: ViewApplicationController}).
            when('/dashboard/user', {templateUrl: 'view/userDash.html',   controller: UserDashController}).
            when('/edit/:user', {templateUrl: 'view/edit.html',   controller: EditController}).
            when('/delete/:user', {templateUrl: 'view/delete.html',   controller: DeleteController}).
            when('/logout', {templateUrl: 'view/logout.html',   controller: LogoutController}).
            when('/view', {templateUrl: 'view/viewpage.html', controller: ViewController}).
            otherwise({redirectTo: '/'});
    }]);


