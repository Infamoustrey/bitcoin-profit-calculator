
let app = angular.module('app-calculator', []);


app.controller('mainController', function($scope, $http){

    $scope.reward = 12.5;
    $scope.difficulty = 0;

    $scope.hashingPower = 13.5;
    $scope.machineWattage = 1200;
    $scope.powerCost = 0.12;

    $scope.bitcoin = {
        time: Date.now(),
        exchangerates: {
            usd: 0,
            gbp: 0,
            eur: 0
        }
    };

    $scope.hashingUnitOptions = {
        availablehashingUnits: [
            {value: 1, name: 'H/s'},
            {value: 1000, name: 'KH/s'},
            {value: 1000000, name: 'MH/s'},
            {value: 1000000000, name: 'GH/s'},
            {value: 1000000000000, name: 'TH/s'},

        ],
        selectedHashingUnit: {value: 1000000000000, name: 'TH/s'}
    };

    $http.get('http://api.coindesk.com/v1/bpi/currentprice.json').then(function (response) {

        let cdr = response.data;

        $scope.bitcoin.exchangerates.usd = parseFloat(cdr.bpi.USD.rate.replace(',',''));
        $scope.bitcoin.exchangerates.gbp = parseFloat(cdr.bpi.GBP.rate.replace(',',''));
        $scope.bitcoin.exchangerates.eur = parseFloat(cdr.bpi.EUR.rate.replace(',',''));

    });

    $http.get('https://blockchain.info/q/getdifficulty?cors=true').then(function (response) {
        $scope.difficulty = parseFloat(response.data);
    });

    $scope.getBTCPerDay_Exact = function () {
        return 86400 / ($scope.difficulty * (Math.pow(2,48)/65535) / ($scope.hashingPower * $scope.hashingUnitOptions.selectedHashingUnit.value)) * $scope.reward;
    };

    $scope.getBTCPerDay = function () {
        let temp = $scope.getBTCPerDay_Exact();
        return temp.toPrecision(2);
    };

    $scope.getUSDPerDay = function () {
        let temp = $scope.getBTCPerDay_Exact();
        temp *= $scope.bitcoin.exchangerates.usd;
        return temp.toFixed(2);
    };

    $scope.getGBPPerDay = function () {
        let temp = $scope.getBTCPerDay_Exact();
        temp *= $scope.bitcoin.exchangerates.gbp;
        return temp.toFixed(2);
    };

    $scope.getEURPerDay = function () {
        let temp = $scope.getBTCPerDay_Exact();
        temp *= $scope.bitcoin.exchangerates.eur;
        return temp.toFixed(2);
    };

    $scope.getPowerCostPerDay = function () {
        let temp = $scope.machineWattage * $scope.powerCost / 1000 * 24;
        return temp.toFixed(2);
    };

    $scope.getProfitPerDay = function () {
        let temp = $scope.getUSDPerDay() - $scope.getPowerCostPerDay();
        return temp.toFixed(2);
    };

});
