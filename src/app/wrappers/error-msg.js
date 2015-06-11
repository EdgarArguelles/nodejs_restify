var wrapper = {
    message: "",
    messages: [],
    devMessage: ""
};

module.exports = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    get: function (message, devMessage) {
        wrapper.message = message;
        wrapper.messages = [message];
        wrapper.devMessage = devMessage;
        return wrapper;
    },
    fromErrors: function (errors) {
        wrapper.message = null;
        wrapper.messages = [];
        wrapper.devMessage = JSON.stringify(errors);
        for (var attributename in errors) {
            var error = errors[attributename],
                msg = null,
                field = error.path;
            switch (error.kind) {
                case "required" :
                    msg = "The field [" + field + "] is required.";
                    break;
                case "ObjectID" :
                    msg = "The field [" + field + "] should be an id value.";
                    break;
                case "Number" :
                    msg = "The field [" + field + "] should be a numeric.";
                    break;
                case "min" :
                    var min = error.message.substring(error.message.lastIndexOf("(") + 1, error.message.lastIndexOf(")"));
                    msg = "The minimum allowed value for the field [" + field + "] is " + min + ".";
                    break;
                case "max" :
                    var max = error.message.substring(error.message.lastIndexOf("(") + 1, error.message.lastIndexOf(")"));
                    msg = "The maximum allowed value for the field [" + field + "] is " + max + ".";
                    break;
                case "minlength" :
                    var min = error.message.substring(error.message.lastIndexOf("(") + 1, error.message.lastIndexOf(")"));
                    msg = "The minimum length for the field [" + field + "] is " + min + ".";
                    break;
                case "maxlength" :
                    var max = error.message.substring(error.message.lastIndexOf("(") + 1, error.message.lastIndexOf(")"));
                    msg = "The maximum length for the field [" + field + "] is " + max + ".";
                    break;
                default :
                    msg = error.message;
            }

            wrapper.messages.push(msg);
            if (!wrapper.message) {
                wrapper.message = msg;
            }
        }
        return wrapper;
    }
};