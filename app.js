var app = angular.module('app', []);

app.controller('MainCtrl', function($scope){
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
		var wonFinals = [];
		angular.forEach($scope.finals, function(item){
			if(item.won === true){
				wonFinals.push(item);
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