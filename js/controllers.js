'use strict';

/* Controllers */

var app = angular.module('checklistApp', []);

app.controller('DotNetChecklistCtrl', function($scope, $http, $sce) {
    $scope.filter = {}; //
    $scope.rules  = []; //Contains the descriptions and content for each rules

    $scope.addRule = function (title, tag, descriptionHtml, ref) {
        $scope.rules.push(
            {"title": title,
             "tag":tag,
             "descriptionHtml": $sce.trustAsHtml(descriptionHtml),
             "refUrl":ref}
        );
    };

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
            $scope.addRule(item[0], item[1], item[2], item[3]);
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

        console.info(item);
        if($scope.filter[item.tag]) {
            return true;
        }
        return noFilter($scope.filter);
    }

});
