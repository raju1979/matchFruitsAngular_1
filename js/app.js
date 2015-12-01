"use strict"

var dragDropSampleApp = angular.module("dragDropSampleApp", []);

dragDropSampleApp.factory("draggableData", function () {
        var data = [
            {
                fruitname: "apple",
                fruitimg: "apple.png"
        }, {
                fruitname: "banana",
                fruitimg: "banana.png"
        }, {
                fruitname: "cherry",
                fruitimg: "cherry.png"
        }, {
                fruitname: "greenapple",
                fruitimg: "greenapple.png"
        }, {
                fruitname: "kiwi",
                fruitimg: "kiwi.png"
        }, {
                fruitname: "peach",
                fruitimg: "peach.png"
        }, {
                fruitname: "strawberry",
                fruitimg: "strawberry.png"
        }, {
                fruitname: "watermelon",
                fruitimg: "watermelon.png"
        }
    ];

        return data;
    }) //

dragDropSampleApp.factory("droppableData", function () {
    var data = [
        {
            fruitname: "apple",
            fruitimg: "apple_callout.png"
        }, {
            fruitname: "banana",
            fruitimg: "banana_callout.png"
        }, {
            fruitname: "cherry",
            fruitimg: "cherry_callout.png"
        }, {
            fruitname: "greenapple",
            fruitimg: "greenapple_callout.png"
        }, {
            fruitname: "kiwi",
            fruitimg: "kiwi_callout.png"
        }, {
            fruitname: "peach",
            fruitimg: "peach_callout.png"
        }, {
            fruitname: "strawberry",
            fruitimg: "strawberry_callout.png"
        }, {
            fruitname: "watermelon",
            fruitimg: "watermelon_callout.png"
        }
    ];

    return data;
}); ///

dragDropSampleApp.controller("MainController", ["$scope", "draggableData", "droppableData","$timeout" ,function ($scope, draggableData, droppableData,$timeout) {

    $scope.draggableArray = draggableData;
    $scope.droppableArray = droppableData;

    //shuffle the array for randomness
    $scope.draggableArray = _.shuffle($scope.draggableArray);
    $scope.droppableArray = _.shuffle($scope.droppableArray);

    $scope.draggableArrayLength = $scope.draggableArray.length;

    $scope.doraemonStatus = "sleeping";
    $scope.setDoraemonStatus = function (value) {
        $scope.$apply(function () {
            $scope.doraemonStatus = value;
        })
    }

    $scope.score = 0;
    $scope.setScore = function (value) {
        $scope.$apply(function () {
            $scope.score = $scope.score + value;
        });
    };

    $scope.$watch(function () {
        return $scope.score;
    }, function (newVal, oldVal) {
        if (newVal !== oldVal) {
            console.log("array length", $scope.draggableArrayLength, "score", newVal)
            if (newVal == $scope.draggableArrayLength) {
                console.log("game over");
                $timeout(function(){
                    $scope.setDoraemonStatus("finish")
                },2000)
            }
        }
    });

    $scope.removeFromArray = function (value) {
        console.log(value);
        angular.forEach($scope.draggableArray, function (arrvalue, arrindex) {
            var fruitname = arrvalue.fruitname;
            if (fruitname == value) {
                $scope.matchedIndex = arrindex;
            }
        });
        $scope.$apply(function () {
            $scope.draggableArray.splice($scope.matchedIndex, 1);
        })
    }

}]); //

dragDropSampleApp.directive("dragme", ["$timeout", function ($timeout) {
    return {
        restrict: "A",
        replace: true,
        scope: {
            myindex: "=",
            setDoraemon: "&"
        },
        link: function ($scope, $elem, $attr) {
            var backgroundImage = $attr.backgroundimage;
            var answerData = $attr.answerdata;
            var myBgcolor = $attr.bgcolor;
            var myLeft = parseInt($attr.left);

            $elem.addClass("draggable");
            $elem.attr("data-answerimage", backgroundImage);
            $elem.attr("data-answerdata", answerData);
            $elem.attr("data-myindex", $scope.myindex);

            $elem.css({
                left: myLeft,
                backgroundImage: "url(img/" + backgroundImage + ")"
            });

            $elem.draggable({
                helper: "clone",
                revert: true,
                appendTo: "body",
                zIndex: 100,
                drag: function (event, ui) {
                    $(ui.helper).css("border", "0px");
                    $scope.setDoraemon({
                        value: "dragging"
                    })
                }
            })

        }
    }
}]); ///

dragDropSampleApp.directive("dropme", ["$timeout", function ($timeout) {
    return {
        restrict: "A",
        replace: true,
        scope: {
            setScore: "&",
            removeArray: "&",
            setDoraemon: "&"
        },
        link: function ($scope, $elem, $attr) {
            var backgroundImage = $attr.backgroundimage;
            var answerData = $attr.fruitname;

            $elem.addClass("droppable");
            $elem.attr("data-answerimage", backgroundImage);
            $elem.attr("data-answerdata", answerData);
            $elem.css({
                backgroundImage: "url(img/" + backgroundImage + ")"
            });
            $elem.droppable({
                accept: ".draggable",
                drop: function (event, ui) {
                    var droppedElem = ui.draggable;
                    var myAnswer = $(this).attr("data-answerdata");
                    if ($(droppedElem).attr("data-answerdata") == myAnswer) { //if both match
                        $(this).css("background-image", "url(img/" + droppedElem.attr("backgroundimage") + ")");
                        $(this).attr("data-isanswered", "yes");
                        $scope.setScore({
                            value: 1
                        });
                        $scope.removeArray({
                            value: $(droppedElem).attr("data-answerdata")
                        });
                        $scope.setDoraemon({
                            value: "happy"
                        })
                    } else {
                        $(this).effect("shake");
                        $scope.setDoraemon({
                            value: "tease"
                        })
                    }

                }
            })
        }
    }
}]); ///