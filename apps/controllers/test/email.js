'use strict';
module.exports = function TestEmailController($scope, Feedback){
    $scope.$watch('instance.email', function(email){
        console.debug(`email value has been changed to ${email}`);
    });
}
