var tempCache = {
    Seq : ""
};

function $currentPage() {
    var href = window.location.pathname,
        lastIdx = href.lastIndexOf('/');
    return href.substr(lastIdx + 1, href.length);
}

function isAuth() {
    var token = localStorage.getItem('token'),
        appId = localStorage.getItem('appId');
    return token != null && appId != null;
}

// self-invoking function that gets executing on dom-ready
$(function() {
    (function() {
        var auth = isAuth(),
            page = $currentPage(),
            index = 'index.html';
        if(auth && page === index) {
            $.mobile.changePage('main.html', 'flow');
        } else if (!auth && page != index) {
            // manage directory level ^_^
            // Only manages 1 sub-level at this time
            if(location.pathname.indexOf('/pages/') > -1) {
                index = '../' + index;
            }
            $.mobile.changePage(index, 'flow');
        }
    }());
});

// authenticate user
// should store user token locally
function authenticate () {
    var email = $('#username').val(),
        password = $('#password').val();
    auth({
        url : util.auth,
        endpoint : 'token',
        data : {
            username : email,
            password : password,
            institution: util.institution
        },
        callback : function(data) {
            var token = data.result;
            if(token != -1) {
                getApplId({
                    token : token,
                    email : email,
                    callback : function (app) {
                        saveAppInfo(token, app.result, email);
                        location.href = 'main.html';
                    }
                })
            } else {
                $('.invalidUser').show();
                $('#username, #password').val('');
            }
        }
    });
}

function userExists() {
    var username = $('#un').val();
    auth({
        url : util.auth,
        endpoint : 'userexist',
        data : {
            username : username,
            institution: util.institution
        },
        callback : function (data) {
            var res = data.result;
            if(res == 1) {
                $('#servercheck-username').show();
//                $('#un').removeClass('ng-valid').addClass('ng-invalid')
            } else {
                $('#servercheck-username').hide();
//                $('#un').removeClass('ng-invalid').addClass('ng-valid');
            }
        }
    })
}

function register() {
    var username = $('#un').val(),
        password = $('#pw').val();
    auth({
        url : util.auth,
        endpoint : 'user',
        data : {
            username : username,
            password : password,
            institution: util.institution
        },
        type : 'POST',
        callback : function (data) {
            if(data.result == 1) {
                alert('user was successfully created');
                location.reload();
            }
        }
    })
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('appId');
    localStorage.removeItem('uname');
    location.reload();
}

function saveAppInfo(token, appId, username) {
    localStorage.setItem('token', token);
    localStorage.setItem('appId', appId);
    localStorage.setItem('uname', username);
}

function getApplId(opt) {
    auth({
        url : util.appl,
        endpoint : 'appid',
        data : {
            token : opt.token,
            username : opt.email,
            institution: util.institution
        },
        callback : opt.callback
    });
}

function saveBasicInfo () {
    dbApp.insertBasicDataIntoDb(function() {
        console.log("*** saving data ***");

        // reload the page after saving data
        location.reload();
    });
}

function saveEmergencyInfo () {
    dbApp.insertEmergencyDataIntoDb(function() {
        console.log("*** saving data ***");

        // reload the page after saving data
        location.reload();
    });
}


function saveMedicalInfo () {
    dbApp.insertMedDataIntoDb(function() {
        console.log("*** saving data ***");

        // reload the page after saving data
        location.reload();
    });
}

function saveAddressInfo () {
    dbApp.insertAddressIntoDb(function() {
        console.log("*** saving data ***");

        // reload the page after saving data
        location.reload();
    });
}

function saveContactInfo () {
    dbApp.insertContactDataIntoDb(function() {
        console.log("*** saving data ***");

        // reload the page after saving data
        location.reload();
    });
}

function saveWorkExp() {
    dbApp.insertWorkDataIntoDb(function() {
        console.log("*** saving data ***");

        // reload the page after saving data
        location.reload();
    });
}

function saveProgram() {
    dbApp.insertProgramDataIntoDb(function() {
        console.log("*** saving data ***");

        // reload the page after saving data
        location.reload();
    });
}

function saveSubject () {
    dbApp.insertSubjectDataIntoDb(function() {
        console.log("*** saving data ***");

        // reload the page after saving data
        location.reload();
    });
}

function saveSchool () {
    dbApp.insertSchoolDataIntoDb(function() {
        console.log("*** saving data ***");

        // reload the page after saving data
        location.reload();
    });
}

function changeAppPage () {

}

function copyAddressInfo (self) {
    if($(self).is(':checked')) {
        var address = $('#saddress').val();
        var address2 = $('#address2').val();
        var address3 = $('#address3').val();
//        var zipcode = $('#zipcode').val();
        var pCode = $('#parish').find(':selected').val();
        var cCode = $('#country').find(':selected').val();

        $('#dsaddress').val(address).textinput('disable');
        $('#daddress2').val(address2).textinput('disable');
        $('#daddress3').val(address3).textinput('disable');
//        $('#dzipcode').val(zipcode).textinput('disable');
        $('#dparish').val(pCode).selectmenu('refresh').selectmenu('disable');
        $('#dcountry').val(cCode).selectmenu('refresh').selectmenu('disable');

    } else {
        $('#dsaddress, #daddress2, #daddress3').val("").textinput('enable');
        $('#dparish, #dcountry').val("default").selectmenu('enable').selectmenu('refresh');
    }
}

function copyAddressInfoFromDb (self) {
    dbApp.getApplicantAddressFromDb(function(result) {

        $('#saddress').val(result['Address1']);
        $('#address2').val(result['Address2']);
        $('#address3').val(result['Address5']);
        $('#zipcode').val(result['MailPostalCode']);

        $('#parish').val(isdefault(result['Address3']));
        $('#country').val(isdefault(result['Address4']));

        $('select').selectmenu('refresh');

    }, function () {
        console.log('no address data found');

    })
}

function populateAddressPage() {
    dbApp.getApplicantAddressFromDb(function(result) {

        $('#saddress').val(result['Address1']);
        $('#address2').val(result['Address2']);
        $('#address3').val(result['Address5']);
        $('#zipcode').val(result['MailPostalCode']);

        $('#parish').val(isdefault(result['Address3']));
        $('#country').val(isdefault(result['Address4']));

        $('#dsaddress').val(result['MailAddress1']);
        $('#daddress2').val(result['MailAddress2']);
        $('#daddress3').val(result['MailAddress5']);

        $('#dparish').val(isdefault(result['MailAddress3']));
        $('#dcountry').val(isdefault(result['MailAddress4']));

        $('select').selectmenu('refresh');

    }, function () {
        console.log('no address found');
    })
}

function populateEmergencyPage() {
    dbApp.getApplicantEmergencyInfoFromDb(function(result) {

        $('#firstname').val(result['FirstName']);
        $('#lastname').val(result['LastName']);
        $('#homeNumber').val(result['Telephone']);
        $('#workNumber').val(result['Work']);
        $('#mobileNumber').val(result['Cell']);

        $('#saddress').val(result['Address1']);
        $('#address2').val(result['Address2']);
        $('#address3').val(result['Address3']);
        $('#zipcode').val(result['postalcode']);

        $('#parish').val(isdefault(result['Address4']));
        $('#country').val(isdefault(result['Address5']));

        $('select').selectmenu('refresh');

    }, function () {
        console.log('no emergency info found');
    })
}

function populateMedPage() {
    dbApp.getApplicantMedFromDb(function(result) {

        $('#condition1').val(isdefault(result['disability1']));
        $('#condition2').val(isdefault(result['disability2']));
        $('#condition3').val(isdefault(result['disability3']));
        $('#condition4').val(isdefault(result['disability4']));

        $('select').selectmenu('refresh');

    }, function () {
        console.log('no medical data found');
    })
}

function populateContactPage() {
    dbApp.getApplicantContactFromDb(function(result) {

        $('#email').val(result['Email']);
        $('#homeNumber').val(result['Telephone']);
        $('#workNumber').val(result['Work']);
        $('#mobileNumber').val(result['Cell']);


        var fee = result['responsibilityforfees'];

        if(!/(Self|Government|Parent)/.test(fee) && fee != null && fee != "") {
            $('#other').val(fee);
            $('#fee').val('Other');
        } else {
            $('#fee').val(isdefault(fee));
        }



        $('select').selectmenu('refresh');

    }, function () {
        console.log('no contact data found');
    })
}

function populateBasicInfoPage() {
    dbApp.getApplicantContactFromDb(function(result) {


        $('#immigration').val(isdefault(result['immigrationcode']));
        $('#eid').val(result['ImmigrationStartDate']);
        $('#expiryDate').val(result['ImmigrationEndDate']);
        $('#passport').val(result['passport']);

        $('input:radio[value="' + result['prefix'] + '"]').prop('checked', true).checkboxradio('refresh');

        $('#firstname').val(result['FirstName']);
        $('#middlename').val(result['MiddleName']);
        $('#lastname').val(result['LastName']);
        $('#bnumer').val(result['natreg']);

        $('input:radio[value="' + result['Sex'] + '"]').prop('checked', true).checkboxradio('refresh');
        $('input:radio[value="' + result['maritalStatus'] + '"]').prop('checked', true).checkboxradio('refresh');

        $('#dob').val(result['DOB']);
        $('#cob').val(isdefault(result['birthcode']));
        $('#nation').val(isdefault(result['countrycode']));
        $('#residency').val(isdefault(result['residencecode']));
        $('#country').val(isdefault(result['Address5']));

        $('select').selectmenu('refresh');

    }, function () {
        console.log('no basic info found');
    })
}

function removeWorkExp() {
    dbApp.deleteWorkDataFromDb(tempCache.Seq,function () {
        location.reload();
    })
}

function removeProgram () {
    dbApp.deleteProgDataFromDb(tempCache.Seq,function () {
        location.reload();
    })
}

function removeQual() {
    dbApp.deleteQualDataFromDb(tempCache.Seq,function () {
        location.reload();
    })
}

function removeSchool () {
    dbApp.deleteSchoolDataFromDb(tempCache.Seq,function () {
        location.reload();
    })
}

function setSeq(self) {
    tempCache.Seq = $(self).prop('id');
}

function populateWorkExpPage() {

    var template = '<li><a href="#">' +
        '<img src="../assets/images/main/work2.png" />' +
        '    <h3>{PositionHeld}</h3>' +
        '    <p>Worked at <strong>{Employer}</strong> :- From {StartYear} - {EndYear}</p>' +
        '</a><a href="#deleterec" data-rel="popup" data-position-to="window" data-transition="pop" id="{Seq}" onclick="setSeq(this);">Delete Record</a>' +
        '</li>';

    dbApp.getApplicantWorkFromDb(function(result) {

        var $element = $("#workexp");
        var res = [];
        var len = result.length;
        for(var i = 0; i < len; i++) {
            res.push(template.t(result.item(i)));
        }
        $element.append(res);
        $element.listview( "refresh" );

    }, function () {
        console.log('no work exp data found');
    })
}

function populateProgramPage() {

    var template = '<li><a href="#">' +
        '<img src="../assets/images/main/prog.png" />' +
        '    <h3>{programname}</h3>' +
        '    <p>Pursuing a <strong>{programtypeName}</strong> from {locationName}</p>' +
        '</a><a href="#deleterec" data-rel="popup" data-position-to="window" data-transition="pop" id="{Seq}" onclick="setSeq(this);">Delete Record</a>' +
        '</li>';

    dbApp.getApplicantProgFromDb(function(result) {

        var $element = $("#progList");
        var res = [];
        var len = result.length;
        for(var i = 0; i < len; i++) {
            var row = result.item(i);
            row['locationName'] = dbApp.getOptTxt('location', row.location);
            console.log(row);
            res.push(template.t(row));
        }
        $element.append(res);
        $element.listview( "refresh" );

        if(len >= 2) {
            $('#progPopUp').fadeTo('slow',.5).removeAttr('href');
        }

    }, function () {
        console.log('no work exp data found');
    })
}

function populateYear() {
    var curYear = new Date().getFullYear(),
        iter = 100,
        len = arguments.length,
        i = 0,
        fragment = document.createDocumentFragment();

    for(i = 0; i < iter; i++) {
        var option = document.createElement('option');
        option.value = curYear - i;
        option.innerText = (curYear - i).toString();
        fragment.appendChild(option);
    }

    for(var arg in arguments) {
        var select = document.getElementById(arguments[arg]);
        select.appendChild(fragment.cloneNode(true));
    }
}

function populateSchoolPage() {

    var template = '<li><a href="#">' +
        '<img src="../assets/images/main/school.png" />' +
        '    <h3>{schoolName}</h3>' +
        '    <p>Obtained a <strong>{degreeObtain}</strong> from {startyear} - {endyear} </p>' +
        '</a><a href="#deleterec" data-rel="popup" data-position-to="window" data-transition="pop" id="{Seq}" onclick="setSeq(this);">Delete Record</a>' +
        '</li>';

    dbApp.getApplicantSchoolFromDb(function(result) {

        var $element = $("#schoolList");
        var res = [];
        var len = result.length;
        for(var i = 0; i < len; i++) {
            var row = result.item(i);
            row['schoolName'] = dbApp.getOptTxt('school', row.code);
            row['degreeObtain'] = dbApp.getOptTxt('degree', row.degreeobtain);
            console.log(row);
            res.push(template.t(row));
        }
        $element.append(res);
        $element.listview( "refresh" );

    }, function () {
        console.log('no school data found');
    })
}

function populateQualPage() {

    var template = '<li><a href="#">' +
        '<img src="../assets/images/main/subject.png" />' +
        '    <h3>{subject}</h3>' +
        '    <p>Obtained from <strong>{ExamBoby}</strong> in {Year}</p>' +
        '    <p>{GradeStr} {Grade}</p>' +
        '</a><a href="#deleterec" data-rel="popup" data-position-to="window" data-transition="pop" id="{EntrySeq}" onclick="setSeq(this);">Delete Record</a>' +
        '</li>';

    dbApp.getApplicantQualFromDb(function(result) {

        var $element = $("#subjectList");
        var res = [];
        var len = result.length;
        for(var i = 0; i < len; i++) {
            var row = result.item(i);
            row['subject'] = dbApp.getOptTxt('subject', row.SubjectCode + "." + row.ExamBoby);
            row['GradeStr'] = (row['Grade'] != "") ? "Grade" : "";

            console.log(row);
            res.push(template.t(row));
        }
        $element.append(res);
        $element.listview( "refresh" );

    }, function () {
        console.log('no subject data found');
    })
}

function isdefault (res) {
    return res === undefined || res === null || res.trim() === '' ? 'default' : res;
}

function checkForOther () {
    var val = $('#fee').find(":selected").val();
    if(val == 'Other') {
        $('#other').textinput('enable');
    } else {
        $('#other').val("").textinput('disable');
    }
}

function changeExamBody (self) {
    var examBody = $(self).val();

    var grade = $('#grade').val('default').find('option');
    var subject = $('#subject').find('option');
    var level = $('#level').val('default').find('option');


    var callback = function(key, opt) {
        var vals = opt.value.split('.');
        var len = vals.length;

        //console.log(vals[len-1],examBody);
        //console.log('equiv',vals[len-1]===examBody);
        if(len==1)
            return;

        if(examBody == vals[len-1]) {
            $(opt).css('display','block');
        } else {
            $(opt).css('display','none');
        }
    };
    $.each(grade, callback);
    $.each(level, callback);
    $.each(subject, callback);

    //$('#subject').selectmenu('refresh');
    $("#level, #grade").val("default").selectmenu('refresh');
    $("#subject").val("default").trigger("liszt:updated");
}

function changeSchool(self) {
    if($(self).val() === 'default') {
        $('#dschool').textinput('enable');
    } else {
        $('#dschool').val("").textinput('disable');
    }
}

/**
 * The following function removes the exam body portion from a string
 * @param str
 * @returns {string}
 */
function removeExamBodyFromString(str) {
    if(str === '' || str === undefined)
        return "";
    var idx = str.lastIndexOf('.');
    return (idx > -1) ? str.substring(0, str.lastIndexOf('.')) : str;
}

function getApplicantId() {
    return localStorage.getItem('appId');
}

function getToken() {
    return localStorage.getItem('token');
}

function getEmail() {
    return localStorage.getItem('uname');
}

function getDataFromForm () {

}


/******************* Custom plugins for JQUERY ******************/


(function( $ ) {
    $.fn.custSerializer = function() {

        var r20 = /%20/g,
            rbracket = /\[\]$/,
            rCRLF = /\r?\n/g,
            rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
            rsubmittable = /^(?:input|select|textarea|keygen)/i,
            manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
            result = {};
        this.map(function(){
            // Can add propHook for "elements" to filter or add form elements
            var elements = jQuery.prop( this, "elements" );
            return elements ? jQuery.makeArray( elements ) : this;
        })
            .filter(function(){
                var type = this.type;
                return this.name /* && !jQuery( this ).is( ":disabled" )*/ &&
                    rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
                    ( this.checked || !manipulation_rcheckableType.test( type ));
            })
            .map(function( i, elem ){
                var val = jQuery( this ).val();

                return val == null ?
                    null :
                    jQuery.isArray( val ) ?
                        jQuery.map( val, function( val ){
                            return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
                        }) :
                    { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
            }).map(function ( i, elem) {
                result[elem.name] = elem.value.unmask();
            });
            return result;
    }
})( jQuery );

//Remove masking before persisting data to server
String.prototype.unmask = function() {
    if(this.indexOf('-') != 4)
        return this.replace(/(\(|\)|\s|-)/g,"");
    return this.toString();
};


function progressBar(percent, message, $element) {
    var progressBarWidth = percent * $element.width() / 100;
    $element.find('div').animate({ width: progressBarWidth }, 500).html(percent + "%&nbsp; " + message);
}

String.prototype.t = function () {
    /**
     * Simple templating engine that takes as arguments an abject literal and replace the content inside the template
     *
     * "Hello {who}!".t({ who : 'JavaScript'});
     * // Hello JavaScript!
     *
     * "Hello {who}! It's {time} ms since epoch".t({who : 'JavaScript', time : Date.now});
     * // Hello JavaScript! It's ...... ms since epoch
     * @return {*}
     */
    "use strict";
    var p, res = this, i, len = arguments.length, cur;
    for (i = 0; i < len; i += 1) {
        cur = arguments[i];
        for (p in cur) {
            if (cur.hasOwnProperty(p)) {
                res = res.replace(new RegExp('{' + p + '}', 'g'), cur[p]);
            }
        }
    }
    return res;
};