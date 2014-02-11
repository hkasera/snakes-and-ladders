var transportApp = angular.module('snlApp', []);
transportApp.run(function ($rootScope) {
	$rootScope.settings = {'playerCount': 1};
    $rootScope.players = [];
    
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
	$rootScope.currentPlayer = 0;
	$rootScope.gameOver = false;
	$rootScope.showBoard = false;
	$rootScope.isLoading = false;
	$rootScope.isLoadingText ='';
	$rootScope.winner = -1;
});

transportApp.controller('GameCtrl', function ($scope, $rootScope) {
	
	$scope.initializeGame = function(){
	for (i = 0; i < $rootScope.settings.playerCount; ++i) {
        $rootScope.players[i] = {
            'currentPos': -1,
			'isAuto':false
        };
    }
	if($rootScope.settings.playerCount === 1){
	$rootScope.players[1] = {
            'currentPos': -1,
			'isAuto':true
        };
	}
	}
	
	$scope.setSettings = function(count){
	
		$rootScope.settings.playerCount = count;
		$scope.initializeGame();
		$rootScope.showBoard = true;
	}
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
                "isEven": true,
				"class":'',
				"activeClass" :''
            };
        } else {
            board[i] = {
                "start": i,
                "end": i,
                "isEven": false,
				"class":'',
				"activeClass" :''
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
	
	for (i = 0; i < 100; ++i) {
		if(board[i].isEven){
			board[i].class = board[i].class+'fright ';
		}
		if(board[i].start > board[i].end){
			board[i].class = board[i].class+'snake ';
		}
		if(board[i].start < board[i].end){
			board[i].class = board[i].class+'ladder ';
		}
	}


});
transportApp.controller('BtnCtrl', function ($scope, $rootScope,$timeout) {
    $scope.diceValues = [-1, -1];
    $scope.rollDice = function () {
        $scope.diceValues[0] = Math.floor(Math.random() * 6) + 1;
        $scope.diceValues[1] = Math.floor(Math.random() * 6) + 1;
		$rootScope.isLoadingText ='Dice 1 : '+$scope.diceValues[0]+' Dice 2 : '+$scope.diceValues[1];
    }
	$scope.changeCurrentPlayer = function(){
		if($rootScope.currentPlayer !== $rootScope.players.length-1){
			$rootScope.currentPlayer++;
		}else{
		$rootScope.currentPlayer = 0;
		}
		$rootScope.isLoading = false;
		if($rootScope.players[$rootScope.currentPlayer].isAuto){
			$scope.startGame();
		}
	}
    $scope.makeMove = function (player) {
		$rootScope.isLoadingText ="Player"+($rootScope.currentPlayer+1)+"'s turn";
        if ($scope.diceValues[0] == -1 || $scope.diceValues[1] == -1) {
            return;
        }
        var newPos = $rootScope.players[player].currentPos + $scope.diceValues[0] + $scope.diceValues[1];
        if (newPos <= 99) {
            $rootScope.players[player].currentPos = newPos;
            $rootScope.activeSquare = $rootScope.board[100 - $rootScope.players[player].currentPos - 1];
			console.log($rootScope.activeSquare);
            if ($rootScope.activeSquare.start != $rootScope.activeSquare.end) {
                if ($rootScope.activeSquare.start < $rootScope.activeSquare.end) {
                    $rootScope.isLoadingText ="Player " + ($rootScope.currentPlayer+1) + "climbs a ladder";
                }
                if ($rootScope.activeSquare.start > $rootScope.activeSquare.end) {
                   $rootScope.isLoadingText ="Player " + ($rootScope.currentPlayer+1) + "hits a snake";
                }
                $rootScope.players[player].currentPos = $rootScope.activeSquare.end;
                $rootScope.activeSquare = $rootScope.board[$rootScope.players[player].currentPos];
            }
		$rootScope.isLoadingText ="Player " + ($rootScope.currentPlayer+1) +"'s new position is "+ ($rootScope.players[player].currentPos+1) ;
		if(newPos === 99){
		console.log($rootScope.gameOver);
			$rootScope.winner = $rootScope.currentPlayer+1 ;
			$rootScope.gameOver = true;
			$rootScope.isLoadingText ="Player " + ($rootScope.winner) +"wins";
		}
        }
		else {
			
			$rootScope.isLoadingText ="Player"+($rootScope.currentPlayer+1)+" cannot move";
		}
		
        $scope.diceValues = [-1, -1];
		$scope.gameOver = $rootScope.gameOver;
    }
	$scope.startGame = function(){
		
		
		
			$rootScope.isLoading = true;
			$rootScope.isLoadingText ='Rolling Dice..';
			$timeout(function(){$scope.rollDice();},1000);
			
			$timeout(function(){$scope.makeMove($rootScope.currentPlayer);},2000);
			
			if(!$rootScope.gameOver){ $timeout(function(){$scope.changeCurrentPlayer();},3000); }
			
		
		
		
	}
});