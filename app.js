var app = angular.module('app', []);

app.config(function($locationProvider){
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});
});

app.controller('MainCtrl', function($scope, $location){
	$scope.matches = [
		{
			name: "",
			k: ""
		},
		{
			name: "",
			k: ""
		}
	];	
	$scope.finals = [];	
	$scope.combinations = [];	
	$scope.systems = "";
	$scope.bet = 1;
	$scope.totalWinning = 0;
	$scope.won = 0;
	
	$scope.init = function(){
		if($location.search().matches !== undefined){
			$scope.matches = angular.fromJson($location.search().matches);
		}
	};
	
	$scope.getUrl = function(){
		$scope.url = $location.protocol() + '://' + $location.host() + 'matches=' + angular.toJson($scope.matches);
	};
	
	$scope.addMatch = function(){
		$scope.matches.push({
			name: "",
			k: ""
		});	
	};
	
	$scope.removeMatch = function(index){
		$scope.matches.splice(index, 1);
	};
	
	$scope.see = function(){
		$scope.won = 0;
		
		var wonFinals = [];
		angular.forEach($scope.finals, function(item){
			if(item.won === true){
				wonFinals.push(item);
			}
		});
		
		
		angular.forEach($scope.combinations, function(cmb){
			//is the combination winning
			var flag = true;
			angular.forEach(cmb.matches, function(matchIndex){
				console.log(_.findWhere(wonFinals, {index: matchIndex}));
				if(_.findWhere(wonFinals, {index: matchIndex}) === undefined){
					flag = false;
				}
			});
			if(flag){
				$scope.won += cmb.winning;
			}
		});
	};
	
	$scope.check = function(){
		$scope.totalWinning = 0;
		$scope.finals = [];
		$scope.combinations = [];
		if($scope.systems === ""){
			$scope.systems = $scope.finals.length;
		}
		var index = 1;
		angular.forEach($scope.matches, function(key){
			if(key.name !== "" && key.k >= 1){
				$scope.finals.push({
					index: index,
					name: key.name,
					k: parseFloat(Math.round(key.k * 100) / 100).toFixed(2),
					won: false
				});
				index++;
			}
		});
		var cmb = Combinatorics.combination($scope.finals, $scope.systems);
		
		var tempCombinations = cmb.toArray();
		
		angular.forEach(tempCombinations, function(item){
			var k=1;
			var matches = [];
			angular.forEach(item,  function(match){
				k*=match.k;
				matches.push(match.index);
			});
			k = parseFloat(Math.round(k * 100) / 100).toFixed(2);
			$scope.combinations.push({
				matches: matches,
				k: k,
				winning: k*$scope.bet
			});
			$scope.totalWinning += k*$scope.bet;
		});
	};
});