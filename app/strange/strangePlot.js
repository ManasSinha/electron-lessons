exports.callStrange = function(obj){
    
    var returnArr = [];
    var result = {
        data: [],
        errors: [],
        meta: {}
    }
    
    returnArr.push("here in strange class");
    returnArr.push("<p>");

    if(obj && obj.data && obj.errors && obj.meta)
    {
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

    
    
    
    
    
    
    return returnArr.join('</br>');
}