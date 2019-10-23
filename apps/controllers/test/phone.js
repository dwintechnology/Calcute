'use strict';
module.exports = function TestPhoneController($scope, InspectionInfo){
    $scope.$watch('instance.phone', function(phone){
        console.debug(`phone value has been changed to ${phone}`);
    });
}
