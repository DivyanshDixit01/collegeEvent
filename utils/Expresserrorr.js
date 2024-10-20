class Expresserrorr extends Error{
    constructor(statusCode,smessage){
        super();
        this.statusCode = statusCode;
        this.message = message;

    }
}
module.exports= Expresserrorr;