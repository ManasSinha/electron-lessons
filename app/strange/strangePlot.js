const matrix = require('numbers').matrix;
const statistic = require('numbers').statistic;
const _ = require('underscore');
const basic = require('numbers').basic;


exports.callStrange = function (obj) {

    var returnArr = [];
    var result = {
        data: [],
        errors: [],
        meta: {}
    }

    returnArr.push("here in strange class");
    returnArr.push("<p>");

    if (obj && obj.data && obj.errors && obj.meta) {
        result.data = obj.data
        result.errors = obj.errors
        result.meta = obj.meta
    }

    /* 
    agenda of this method
    1 visible rows count
    2 visible column count
    3 sane column count
    4 sane row count
    6 value columns
    7 attributes column
    8 each column meta info
    
    */


    /*1 visible rows count*/
    returnArr.push('Visible rows : ' + result.data.length);

    /*2 visible column count*/
    returnArr.push('Visible columns : ' + result.data[0].length);

    /* 3 sane column count 
        get each column and each row meta first
        now cross apply the info, 
            if ignoring horizontal series at top and bottom can make vertical series homonenous
                if those ignored horizontal series also are homogenous 
                    then those ignored series are attributes headers
                    and those vice versa series are data
 
    */

    var verticalSeries = {};
    var horizontalSeries = {};

    result.data[0].map((eachVSeries, i) => {
        var seriesMeta =
        {
            allEntries: matrix.getCol(result.data, i)
        }
        seriesMeta = doSomeMagic(seriesMeta)

        verticalSeries[i] = seriesMeta;
    });

    //for horizontal series do a random sampling if series count is more that 100
    var sampleIndex = _.range(0,result.data.length);
    if(sampleIndex.length > 100)
    {
        // sampleIndex = basic.random(sampleIndex, 100, false);
        sampleIndex = _.sample(sampleIndex, 100);
    }
    
    for (let index = 0; index < sampleIndex.length; index++) 
    {        
        var seriesMeta =
        {
            allEntries: result.data[sampleIndex[index]]
        }
        seriesMeta = doSomeMagic(seriesMeta)

        horizontalSeries[index] = seriesMeta;
    };

    // var abc = matrix.getCol(result.data,3);
    // abc = matrix.isSquare(result.data);
    console.log('verticalSeries', verticalSeries);
    console.log('horizontalSeries', horizontalSeries);







    return returnArr.join('</br>');
}

function doSomeMagic(seriesMeta)
{
    seriesMeta.totalCount = seriesMeta.allEntries.length;
    seriesMeta.uniqueEntries = _.uniq(seriesMeta.allEntries);
    seriesMeta.uniqueCount = seriesMeta.uniqueEntries.length;
    seriesMeta.isNumeric = _.countBy(seriesMeta.uniqueEntries, function (num) {
        return _.isNumber(num) == 1 ? 'Yes' : 'No';
    });
    seriesMeta.isString = _.countBy(seriesMeta.uniqueEntries, function (num) {
        return _.isString(num) == 1 ? 'Yes' : 'No';
    });
    seriesMeta.isBoolean = _.countBy(seriesMeta.uniqueEntries, function (num) {
        return _.isBoolean(num) == 1 ? 'Yes' : 'No';
    });
    seriesMeta.isDate = _.countBy(seriesMeta.uniqueEntries, function (num) {
        return _.isDate(num) == 1 ? 'Yes' : 'No';
    });        
    seriesMeta.isNull = _.countBy(seriesMeta.uniqueEntries, function(num) {
        return _.isNull(num) == 1 ? 'Yes': 'No';
    });        
    seriesMeta.lastIndexOfString = _.lastIndexOf(_.map( seriesMeta.allEntries, function(num) {
        return _.isNull(num) || _.isNumber(num);
    }), false);
    seriesMeta.numericValues = _.filter(seriesMeta.allEntries, function(num){ return _.isNumber(num); })

    seriesMeta.minNumericValue = _.min(seriesMeta.numericValues);
    seriesMeta.maxNumericValue = _.max(seriesMeta.numericValues);
    
    //Statistics here
    seriesMeta.mean = statistic.mean(seriesMeta.numericValues);
    seriesMeta.median = statistic.median(seriesMeta.numericValues);
    seriesMeta.quantile = {
        // statistic.quantile(seriesMeta.numericValues,0,4),
        '1st': statistic.quantile(seriesMeta.numericValues,1,4),
        '2nd': statistic.quantile(seriesMeta.numericValues,2,4),
        '3rd': statistic.quantile(seriesMeta.numericValues,3,4),
    };        
    seriesMeta.standardDev = statistic.standardDev(seriesMeta.numericValues);
    
    var arrX = _.range(1, seriesMeta.numericValues.length + 1);
    var arrY = seriesMeta.numericValues;
    var arrLReg = _.map( seriesMeta.numericValues, function(num) {
        return statistic.linearRegression(arrX,arrY)(num);
    })
    seriesMeta.arrX = arrX;
    seriesMeta.arrY = arrY;
    seriesMeta.arrLReg = arrLReg;
    seriesMeta.rSquared = statistic.rSquared(seriesMeta.numericValues, seriesMeta.arrLReg);


    return seriesMeta;
}