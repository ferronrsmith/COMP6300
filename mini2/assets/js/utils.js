/**
 * User: ferron
 * Date: 4/24/13
 * Time: 4:59 AM
 */

var global = {
    url : 'http://localhost/sample_app_1/api/'
};

var util = {
    url : global.url + 'utils',
    auth : global.url + 'auth',
    appl : global.url + 'applicant',
//    token : 344207,
    institution : 'SJPP'
};

function auth(opt) {
    console.log(opt.data);
    $.ajax({
        url : opt.url + '/' + opt['endpoint'],
        dataType : 'json',
        type : opt.type || 'GET',
        data : opt.data,
        success: function(data) {
            opt.callback(data);
        }
    });
}

/**
 * The following function retrieves data from the server
 * @param callback
 * @param endpoint
 */
function getDataFromServer(callback, endpoint) {
    auth({
        url : util.url + '/' + endpoint,
        data : {
            token : getToken(),
            institution : util.institution
        },
        callback : callback
    });
}

function getApplicantDataFromServer(callback, endpoint) {
    auth({
        url : util.appl + '/' + endpoint,
        data : {
            token : getToken(),
            appId : getApplicantId()
        },
        callback : callback
    });
}
