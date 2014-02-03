var transportApp = angular.module('snlApp', []);
transportApp.run(function ($rootScope) {
    $rootScope.currentPos = -1; //global variable
    $rootScope.ladders = [{
        "index": 14,
        "end": 48
    }, {
        "index": 19,
        "end": 60
    }, {
        "index": 55,
        "end": 76
    }, {
        "index": 78,
        "end": 97
    }];
    $rootScope.snakes = [{
        "index": 99,
        "end": 29
    }, {
        "index": 47,
        "end": 18
    }, {
        "index": 25,
        "end": 7
    }];
    $rootScope.board = {};
    $rootScope.activeSquare = {};
});
transportApp.controller('BoardCtrl', function ($scope, $rootScope) {
    var board = [],
        i = 0,
        ladders, snakes;


    for (i = 0; i < 100; ++i) {
        if (Math.floor(i / 10) % 2 == 0) {
            board[i] = {
                "start": i,
                "end": i,
                "isEven": true
            };
        } else {
            board[i] = {
                "start": i,
                "end": i,
                "isEven": false
            };
        }


    }
    for (i = 0; i < $rootScope.ladders.length; ++i) {
        board[($rootScope.ladders[i].index - 1)].end = $rootScope.ladders[i].end - 1;
    }
    for (i = 0; i < $rootScope.snakes.length; ++i) {
        board[($rootScope.snakes[i].index - 1)].end = $rootScope.snakes[i].end - 1;
    }
    $rootScope.board = board;
    $scope.board = board.reverse();



});
transportApp.controller('BtnCtrl', function ($scope, $rootScope) {
    $scope.diceValues = [-1, -1];
    $scope.rollDice = function () {
        $scope.diceValues[0] = Math.floor(Math.random() * 6) + 1;
        $scope.diceValues[1] = Math.floor(Math.random() * 6) + 1;
    }
    $scope.makeMove = function () {
        if ($scope.diceValues[0] == -1 || $scope.diceValues[1] == -1) {
            return;
        }
        var newPos = $rootScope.currentPos + $scope.diceValues[0] + $scope.diceValues[1];
        console.log($rootScope.currentPos, $scope.diceValues[0], $scope.diceValues[1], newPos);
        if (newPos <= 99) {
            $rootScope.currentPos = newPos;
            $rootScope.activeSquare = $rootScope.board[100 - $rootScope.currentPos - 1];
            console.log($rootScope.activeSquare);
            if ($rootScope.activeSquare.start != $rootScope.activeSquare.end) {
                if ($rootScope.activeSquare.start < $rootScope.activeSquare.end) {
                    alert("You climb a ladder");
                }
                if ($rootScope.activeSquare.start > $rootScope.activeSquare.end) {
                    alert("You hit a snake");
                }
                $rootScope.currentPos = $rootScope.activeSquare.end;
                $rootScope.activeSquare = $rootScope.board[$rootScope.currentPos];
            }
        }
        $scope.diceValues = [-1, -1];
    }
});
