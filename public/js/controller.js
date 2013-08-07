function ActiveTab(tab,$rootScope){
    $('#navUL li').removeClass();
    $('#navUL li').eq(tab-1).addClass("active");
}

function getUserStatusArray(){
    var status=['Registered','Account Activated','Resume Upload','Pre-Challenge','Wait For Interview','Interview','Accepted/Rejected'];
    return status;
}

function LoginController($http,$scope,$location,$rootScope){
    //Active Tabs
    ActiveTab('2');


    $scope.notify=false;
    $scope.toggleMSG = function() {
        if ($scope.notify)
        $scope.notify=false
    };
       $scope.submit=function(){
        var payload={email:$scope.email,password:$scope.password};
        $http({
            url:'/login',
            method:'POST',
            data:payload
        }).success(function(data){
                $scope.notify=true;
                if (data=="error")
                {
                    $rootScope.currentUser=null;
                    $scope.notifyMsg="Invalid Username Or Password";
                }
                else {
                    if (data.userType=='Administrator')
                    {
                        $rootScope.currentUser=data.email;
                     $location.path('/dashboard/admin')
                    }
                    else
                    {
                        $rootScope.currentUser=data.email;
                        $location.path('/dashboard/user')

                    }
                }




            });

    };
}
function ValidLoginController($scope){

}
function DefaultController($rootScope,$scope){
    //Active Tabs
    ActiveTab('1');
}

function NavController($scope,$rootScope){
    //Active Tabs
    $rootScope.nav1="active";
    $rootScope.nav2="";
    $rootScope.nav3="";
}

function SuccessController($scope){
    $scope.message="Action Completed Successfully";
}
function checkUserSession($http){
    return $http({
        url:'/checkUserSession',
        method:'GET'
    });
//        .success(function(data){
//            return data;
//
//        });
}

function AdminDashController($scope,$http,$rootScope,$location){
    checkUserSession($http).success(function(data){
        if (data=='invalid')
        {
            $scope.showContainer=false;
            $scope.notify=true;
            $scope.notifyMsg='Invalid Session...Please Login !!!';

        }
        else if (data.userType=='Administrator')
        {
            $scope.showContainer=true;

            $("#navUL li").remove();
            var dashBoard="<a href='#/dashboard/admin'>DashBoard</a>";
            var WelcomeHTML="Welcome <span style='color:red'>"+data.name+"</span>";
            $("#navUL").append("<li class='active'>"+dashBoard+"</li>");
            $("#navUL").append("<li>"+WelcomeHTML+"</li>");
            $("#navUL").append("<li><a href='#/logout'>Logout</a></li>");
        }
        else
            $location.path('/');

    });
}
function UserDashController($scope,$rootScope,$location,$http){
    checkUserSession($http).success(function(data){
        if (data=='invalid')
        {
            $scope.showContainer=false;
            $scope.notify=true;
            $scope.notifyMsg='Invalid User Session...Please Login !!!';
        }
        else if (data.userType=='User')
        {
            $scope.showContainer=true;
            var states=getUserStatusArray();
            $scope.currentState=states[data.userStatus];
            $scope.nextState=states[data.userStatus+1];
            $scope.remainingStates=states.slice(data.userStatus+2);

            $("#navUL li").remove();
            var dashBoard="<a href='#/dashboard/user'>DashBoard</a>";
            var WelcomeHTML="Welcome <span style='color:red'>"+data.name+"</span>";
            $("#navUL").append("<li class='active'>"+dashBoard+"</li>");
            $("#navUL").append("<li>"+WelcomeHTML+"</li>");
            $("#navUL").append("<li><a href='#/logout'>Logout</a></li>");
        }
        else
            $location.path('/');

    });
}


function HomeController($scope){

}
function ForgotController($scope,$http,$rootScope){
    //Active Tabs
    $rootScope.homeActive="";
    $rootScope.aboutActive="";
    $rootScope.loginActive="active";

    $scope.formVisible = true;
    $scope.notify = false;

    $scope.toggleMsg=function(){
        if ($scope.notify==true)
        $scope.notify=false;
    }

    $scope.submit=function(){
        var payload={
            email:$scope.email
        }
        $http({
            url:'/forgotPassword',
            method:'POST',
            data:payload
        }).success(function(data){
                $scope.notify = true;
                if (data=="success")
                {
                    $scope.formVisible = false;


                    $scope.notifyMsg="A New Password Has Been Mailed To You. \n Please Check Your Email For More Instructions";
                }
                else if(data=="error")
                {
                    $scope.notifyMsg="Cannot find email in the database.";
                }
            });

    }

}
function AddViewController($scope){

}

function ActivateController($scope,$routeParams,$http,$rootScope){
    $rootScope.logoutTab=false;

    $scope.submit=function(){
        if ($scope.password!==$scope.ConfirmPassword)
        {
            $scope.notify=true;
            $scope.notifyMsg="Password Do Not Match";
        }
        else
        {
            var payload={
                'email':$routeParams.id,
                'password':$scope.password
            }
            $http({
                url:'/activate',
                method:'POST',
                data:payload
            }).success(function(data){

                    $scope.notify=false;
                    if (data=='error' || data=='notFound')
                    {
                        $scope.notify=true;

                        $scope.notifyMsg="Database error";
                        $scope.formVisible=true;
                    }
                    else if(data=='success')
                    {
                        $scope.notify=true;
                        $scope.notifyMsg="Password Updated Successfully...Proceed To Login";
                        $scope.formVisible=false;
                    }
                    else if(data=='Activated')
                    {
                        $scope.notify=true;
                        $scope.notifyMsg="Your Account Has Already Been Activated...Proceed To Login";
                        $scope.formVisible=false;
                    }
                });


        }
    }

    $http({
        url:'/activateUser',
        method:'POST',
        data:{'email':$routeParams.id}
    }).success(function(data){
            $scope.notify=true;
            if (data=='error')
            {
                $scope.notifyMsg="Invalid Activation Id";
               $scope.formVisible=false;

            }
            else if (data=='notFound')
            {
                $scope.notifyMsg="No Such User Found";
                $scope.formVisible=false;
            }
            else if(data=='Activated')
            {
                $scope.notifyMsg="Your Account Has Already Been Activated...Proceed To Login";
                $scope.formVisible=false;
            }
            else
            {                  $scope.notify=false;
                $scope.UserName=data.name;
                $scope.formVisible=true;
                $scope.submitText="Submit";
            }
        });


}


function AddController($scope,$routeParams,$http,$location,$rootScope){
    $scope.submit=function(){
        var payload={name:$scope.name,age:$scope.age,mobile:$scope.mobile,email:$scope.email,pass:$scope.password}
        $http({
            url:'/adduser',
            method:'POST',
            data:payload
        }).success(function(data){
                $location.path('/success');
            });

    };

}

function RegController($scope,$routeParams,$http,$location,$rootScope){
    $rootScope.logoutTab=false;

    $scope.checkPassword = function () {
        if ($scope.registerForm.confirmPass!==$scope.registerForm.pass)
        {

        }
        $scope.registerForm.confirmPass.$error.dontMatch = $scope.registerForm.pass !== $scope.registerForm.confirmPass;
    };

    //Initializing form variables
    $scope.notify = false;
    $scope.sendBtnDisable=false;
    $scope.submitText="Submit";

    $scope.toggle = function() {

        $scope.isVisible = ! $scope.isVisible;

    };
    $scope.isVisible = false;
    $scope.formVisible = true;

    $scope.studentType="Fresher";
    $scope.expYear="6-months";

    //defining submit function

    $scope.submit=function(){
        $scope.sendBtnDisable=true;
        $scope.submitText="Processing Your Request";

        if ($scope.studentType=="Fresher")
            expYear=null;
        else
        expYear=$scope.studentType;

        var payload={
            name:$scope.name,
            age:$scope.age,
            mobile:$scope.mobile,
            email:$scope.email,
            expYear:expYear,
            education:$scope.education,
            studentType:$scope.studentType
        };
            $http({
            url:'/ApplyNow',
            method:'POST',
            data:payload
        }).success(function(data,status,headers,config){
                    $scope.notify = true;
                if (data=='error')
                {           $scope.sendBtnDisable=false;

                    $scope.submitText="Submit";

                    $scope.notifyMsg="Email Already Exists !!!";
                }
                else if(data=='success')
                {        $scope.formVisible = false;

                    $scope.notifyMsg="Your account has been successfully created and your password has been sent to your email.\n" +
                        " Kindly check your password and try to login via the link given in the email."

                }


            });

    };







}
function EditController($scope,$routeParams,$http,$location,$rootScope){

    $http({
        url:'/edit?id='+$routeParams.user,
        method:'GET'
    }).success(function(data){
            $scope.name=data.name;
            $scope.age=data.age;
            $scope.password=data.pass;
            $scope.mobile=data.mobile;
            $scope.email=data.uname;
        });
    var eid=$routeParams.user;

    $scope.submit=function(){
        var payload={id:eid,name:$scope.name,age:$scope.age,mobile:$scope.mobile,uname:$scope.email,pass:$scope.password};
        $http({
            url:'/edit',
            method:'POST',
            data:payload
        }).success(function(data){
                $rootScope.myswitch=true;
                $location.path('/success')
            });

    };
}
function DeleteController($http,$scope,$location,$routeParams,$rootScope){

    $scope.perform=function(val){                $rootScope.myswitch=true;
        if (val==0)
            $location.path('/view');
        else
        {
            var eid=$routeParams.user;
            var payload={id:eid};
            $http({
                url:'/delrecord',
                method:'POST',
                data:payload
            }).success(function(data){
                    console.log('deleted');

                });
            $location.path('/view');
        }
    };



}
function LogoutController($scope,$rootScope,$http){
    $http({
        url:'/logout',
        method:'GET'
    }).success(function(data){

            $("#navUL li").remove();
            var tab2="<a href='#/login'>View Application</a>";
            $("#navUL").append("<li ng-model='nav1' class='tab1'><a href='#/'>Home</a></li>" +
                "<li ng-model='nav2' class='tab2'><a href='#/login'>View Application</a></li>");
            $scope.notifyMsg="You Have Successfully Logged Out";

        });
}

function ViewController($scope,$http,$location,$rootScope){
    $scope.editRecord=function(val){
        $location.path('/edit/'+val);
    }
    $scope.delRecord=function(val){
        $location.path('/delete/'+val);

    }
    $http({
        url:'/viewusers',
        method:'GET'
    }).success(function(data){
            $rootScope.UserData=data;






        });
}