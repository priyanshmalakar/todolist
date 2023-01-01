exports.getDate = function(){
    var today = new Date();
    
    var options = {
        weekday : "long",
        year : "numeric",
        month: "long"
    }

    
    return today.toLocaleDateString("en-IN", options);
    
}