'use strict';

/* Controllers */

var app = angular.module('checklistApp', []);

app.controller('SecurityChecklistCtrl', function($scope, $http, $sce) {
    $scope.filter      = {}; //Selected frameworks
    $scope.guidelines  = []; //Contains the descriptions and content for each rules

    $scope.addGuideline = function (title, tag, descriptionHtml, ref) {
        $scope.guidelines.push(
            {"title": title,
             "tag":tag,
             "descriptionHtml": $sce.trustAsHtml(descriptionHtml),
             "refUrl":ref}
        );
    };

    //Parsing that allow Multine string in JSON. It make it easier for maintenance
    function jsonSpecialParse(data) {
        return angular.fromJson(data.replace(/[\r\n]+/g, ''));
    }

    //Loading guildelines
    $http.get('data/guildelines.json',
        {transformResponse: function(d, h) {
            return jsonSpecialParse(d);
        }})
        .success(function (data) {
        //console.info(data);
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            //console.info(item);
            $scope.addGuideline(item[0], item[1], item[2], item[3]);
        }
    });

    function noFilter(filterObj) {
        for (var key in filterObj) {
            if (filterObj[key]) {
                return false;
            }
        }
        return true;
    }

    $scope.filterByFrameworks = function (item) { //http://stackoverflow.com/a/23983570/89769
        if($scope.filter[item.tag]) {
            return true;
        }
        return noFilter($scope.filter);
    }

});
