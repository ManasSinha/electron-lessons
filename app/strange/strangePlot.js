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

    var verticalSeries = [];
    var horizontalSeries = [];

    returnArr.push('<br>Starting Analyzing Data Per Horizontal Series');
    result.data[0].map((eachVSeries, i) => {
        returnArr.push('<br>For Vertical Series : ' + i);
        var seriesMeta =
        {
            allEntries: matrix.getCol(result.data, i),
            index: i
        }
        seriesMeta = doSomeMagic(seriesMeta)
        // reportTheMagic(seriesMeta);
        returnArr= _.flatten([returnArr, reportTheMagic(seriesMeta)]);

        verticalSeries[i] = seriesMeta;
    });

    //for horizontal series do a random sampling if series count is more that 100
    returnArr.push('<p><br>--------------------------------------------------------------------------------');
    returnArr.push('<p><br>Starting Analyzing Data Per Horizontal Series');
    var sampleIndex = _.range(0,result.data.length);
    if(sampleIndex.length > 100)
    {        
        //Take first 10 row, take last 10 row, and add 100 random in between, sort this collectionand use those as index.
        sampleIndex= _.sortBy(_.union(_.sample(_.without(sampleIndex, _.first(sampleIndex,10), _.last(sampleIndex,10)), 50), _.first(sampleIndex, 10), _.last(sampleIndex, 10)));
        returnArr.push('Sampling the collection to '+ sampleIndex.length +' as it is ' + result.data.length);
    }
    
    for (let index = 0; index < sampleIndex.length; index++) 
    {        
        returnArr.push('<br>For Horizontal Series : ' + index + ', which is index of ' + sampleIndex[index] + ' in full data lake');
        var seriesMeta = 
        {
            allEntries: result.data[sampleIndex[index]],
            index: sampleIndex[index]
        }
        seriesMeta = doSomeMagic(seriesMeta)
        //  returnArr = reportTheMagic(seriesMeta);
        returnArr= _.flatten([returnArr, reportTheMagic(seriesMeta)]);

        horizontalSeries[index] = seriesMeta;
    };





    // var abc = _.groupBy(verticalSeries, function(num) {
    //     return num.lastIndexOfString;
    //   })
    // /* loop outside to get the serieses compared */
    // console.log(abc);
    // var confidenceIndexForMetaColumn =
    // {
    //     isString = 1,
    //     isMostlyUnique = 1,
    //     is
    // }


    verticalSeries.map(seriesMeta => 
        {
            var horizontalPerspective = _.countBy(horizontalSeries, function(obj) {return obj.lastIndexOfString >= seriesMeta.index ? 'Yes': 'No';});

            seriesMeta.Strange_IsObservationMeta = (seriesMeta.Strange_IsString && 
                ( 
                    (seriesMeta.lastIndexOfString * 100) / seriesMeta.totalCount > 99
                    || (horizontalPerspective.Yes * 100) / horizontalPerspective.No > 95
                )) 
                || (seriesMeta.Strange_IsNumericSeries && seriesMeta.Strange_IsNumericProgressionSeries)


            seriesMeta.Strange_IsObservationData = seriesMeta.Strange_IsNumericSeries && seriesMeta.Strange_IsBoolean == false &&
                    (
                        (seriesMeta.uniquePct > 50 ) //if more than 50% are unique values
                        ||  (seriesMeta.Strange_IsNumericProgressionSeries == false)
                        ||  (horizontalPerspective.No * 100) / horizontalPerspective.Yes > 95
                    )

            // returnArr= _.flatten([returnArr, reportTheMagic(seriesMeta)]);
        });





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
    seriesMeta.uniquePct = ( 100 * seriesMeta.uniqueCount) / seriesMeta.totalCount;
    seriesMeta.isNumeric = _.countBy(seriesMeta.uniqueEntries, function (num) {
        return (_.isNumber(num) == 1 || _.isNull(num) == 1) ? 'Yes' : 'No';
    });
    seriesMeta.isString = _.countBy(seriesMeta.uniqueEntries, function (num) {
        return (_.isString(num) == 1 || _.isNull(num) == 1) ? 'Yes' : 'No';
    });
    // seriesMeta.isBoolean = _.countBy(seriesMeta.uniqueEntries, function (num) {
    //     return _.isBoolean(num) == 1 ? 'Yes' : 'No';
    // });
    seriesMeta.isBoolean = _.without(seriesMeta.uniqueEntries, null).length == 2 ? {'Yes': 100, 'No': 0} : {'Yes': 0, 'No': 100}
    seriesMeta.isDate = _.countBy(seriesMeta.uniqueEntries, function (num) {
        return _.isDate(num) == 1 ? 'Yes' : 'No';
    });        
    seriesMeta.isNull = _.countBy(seriesMeta.uniqueEntries, function(num) {
        return _.isNull(num) == 1 ? 'Yes': 'No';
    });        
    seriesMeta.lastIndexOfString = _.lastIndexOf(_.map( seriesMeta.allEntries, function(num) {
        return (_.isNull(num) == false && _.isNumber(num) == false);
    }), true);
    seriesMeta.numericValues = _.sortBy(_.filter(seriesMeta.allEntries, function(num){ return _.isNumber(num); }))

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
    // seriesMeta.arrX = arrX;
    // seriesMeta.arrY = arrY;
    // seriesMeta.arrLReg = arrLReg;
    seriesMeta.rSquared = statistic.rSquared(seriesMeta.numericValues, arrLReg);

    //trying to find a pattern
    // seriesMeta.isHavingAPattern = {result: undefined};
    var numericDataUniqSorted = _.sortBy(_.uniq(seriesMeta.numericValues));
    seriesMeta.numericDataUniqSorted = numericDataUniqSorted;
    
    // var min = numericDataUniqSorted[0];
    // var secondMin = numericDataUniqSorted[1];
    // var diff = secondMin - min;

    // seriesMeta.isHavingNumberPattern = { diff: diff, min: min, secondMin: secondMin};
    // var success = 1;
    // for (var a = 1; a<= numericDataUniqSorted.length -1; a++)
    // {
    //     if(_.contains(numericDataUniqSorted, secondMin + (diff * a) ))
    //         success = success + 1;
    // }
    // seriesMeta.isHavingNumberPattern.success = success;
    // seriesMeta.isHavingNumberPattern.following = (success * 100) / numericDataUniqSorted.length ;

    seriesMeta.numberProgressionPattern = [];
    for (var a = 1; a <= seriesMeta.numericDataUniqSorted.length -1; a++ )
    {
        seriesMeta.numberProgressionPattern.push(seriesMeta.numericDataUniqSorted[a] - seriesMeta.numericDataUniqSorted[a-1]);
    }
    seriesMeta.numberProgressionPattern = _.countBy(seriesMeta.numberProgressionPattern, function(num) {
        return num;
    });
    // _.map(Object.keys(seriesMeta.isHavingNumberPattern, function(num){ return num * 3; })
    seriesMeta.isHavingNumberPattern = _.mapObject(seriesMeta.numberProgressionPattern, function(val, key) {
        // return {val : val, total : seriesMeta.numericDataUniqSorted.length -1 , pct :(val * 100) / (seriesMeta.numericDataUniqSorted.length - 1) };
        return (val * 100) / (seriesMeta.numericDataUniqSorted.length - 1) ;
    });



    /* Summary */
    seriesMeta.Strange_IsBoolean = (seriesMeta.isBoolean.Yes * 100) / seriesMeta.uniqueCount > 95 ? true : false;
    seriesMeta.Strange_IsString = (seriesMeta.isString.Yes * 100) / seriesMeta.uniqueCount  > 95 ? true : false;
    seriesMeta.Strange_IsNumericSeries = (seriesMeta.isNumeric.Yes * 100) / seriesMeta.uniqueCount > 95 ? true : false;
    seriesMeta.Strange_IsNumericProgressionSeries = _.max(_.values(seriesMeta.isHavingNumberPattern)) > 90 ? true : false;
    




    return seriesMeta;
}

function reportTheMagic(seriesMeta)
{
    var returnArr = [];
    _.filter(Object.keys(seriesMeta), function(a) {return a.startsWith('Strange_');}).map((eachProp, i) => 
    {
        if(_.isArray(seriesMeta[eachProp]) === false && _.isObject(seriesMeta[eachProp]) === false)
        {
            returnArr.push('&nbsp&nbsp>&nbsp' + eachProp + ' : ' + seriesMeta[eachProp]);
        }
        else if(_.isArray(seriesMeta[eachProp]) === true)
        {
            returnArr.push('&nbsp&nbsp>&nbsp' + eachProp + ' : count ' + seriesMeta[eachProp].length + ', showing top 10 items');
            _.first(seriesMeta[eachProp], 10).map((eachPropItem, j) =>
            {
                returnArr.push('&nbsp&nbsp&nbsp&nbsp|&nbsp' + eachPropItem);
            });
        }
        else if(_.isObject(seriesMeta[eachProp]) === true)
        {
            returnArr.push('&nbsp&nbsp>&nbsp' + eachProp + '  : count ' + Object.keys(seriesMeta[eachProp]).length + ', showing top 10 items');
            
            var allVal = ''
            _.first(Object.keys(seriesMeta[eachProp]), 10).map((eachPropItem, j) =>
            {
                allVal = allVal + '&nbsp&nbsp&nbsp&nbsp|&nbsp' + eachPropItem + ' : ' + seriesMeta[eachProp][eachPropItem]                
            });
            returnArr.push(allVal);
        }
    })
    
    return returnArr;
}