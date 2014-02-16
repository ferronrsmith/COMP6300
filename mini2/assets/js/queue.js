"use strict";

// private object literal for managing private scope within the dbStorage service
var dbApp = {
    mydb : false,
    arrQueueRecords : null,     // list of Queue records currently being processed
    isProcessing : false,       // indicates whether queue records are currently being processed or not
    oQueueTimer : null,
    maxSynchedQueueId : 0,
    delay : 1000                // how long to wait before syncing the chat logs with server
};

// db error handler - prevents the rest of the transaction going ahead on failure
dbApp.errorHandler = function (transaction, error) {
    console.log("error: ",error.message);// returns true to rollback the transaction
    return true;
};

// null db data handler
dbApp.nullDataHandler = function (transaction, results) {
    console.log(results);
};

// starting processing of Queue records
dbApp.startQueueProcessing = function () {
    // console.log('Start Queue Processing -- Still processing the last queue push? ' + isProcessing);
    if (dbApp.isProcessing === false) {
        dbApp.isProcessing = true;
        dbApp.arrQueueRecords = null;
        dbApp.getQueueRecords(dbApp.setQueueRecordList);
        //console.log('Processing Log: ' + isProcessing);
    } else {
        try {
            clearTimeout(this.oQueueTimer);
            dbApp.isProcessing = false;
        } catch (err) {
        }

        this.oQueueTimer = setTimeout(dbApp.startQueueProcessing(), dbApp.delay);	// try again in a second if you were blocked this time
    }
};

// starting processing of Queue records
dbApp.stopQueueProcessing = function () {
    //console.log('stopQueueProcessing');
    dbApp.arrQueueRecords = null;
    //isProcessing = false;
};

// Clear the queue
dbApp.clearQueue = function () {
    console.log('entering clear function');
    setTimeout(dbApp.emptyQueue(dbApp.maxSynchedQueueId), dbApp.delay);
    //	isProcessing =false;
};

// Clear the queue
dbApp.removeFromQueue = function (queueId) {
    console.log('entering clear function');
    setTimeout(dbApp.removeQueue(queueId), dbApp.delay);
    //	isProcessing =false;
};


// being processing of the queue records specified
dbApp.setQueueRecordList = function (rQueueRecords) {
    dbApp.arrQueueRecords = [];
    var queueRecordCounter = 0, queueLength = 0, i, sJsonObject;

    if (rQueueRecords.rows && rQueueRecords.rows.length > 0) {
        queueLength = rQueueRecords.rows.length;
        // record the max id we're running against so other calls can move beyond it
        dbApp.maxSynchedQueueId = rQueueRecords.rows.item(0).QueueId;

        for (i = 0; i < queueLength; i += 1) {

            sJsonObject = {
                mobileQueueId: rQueueRecords.rows.item(i).QueueId,
                data: rQueueRecords.rows.item(i).Data,
                event: rQueueRecords.rows.item(i).EventType,
                verb: rQueueRecords.rows.item(i).METHOD
            };

            dbApp.postQueueData(sJsonObject);
        }

    }
};

//handles the successful posting of queue data
dbApp.queuePostSuccess = function () {
    //remove successfully posted queue record from the database
    dbApp.arrQueueRecords = null;
    //isProcessing = false;
    dbApp.stopQueueProcessing();
};

//send queue record to the server
dbApp.postQueueData = function (sJSONData) {
    $.ajax(
        {
            url : util.appl + '/' + sJSONData.event,
            data : {
                token : getToken(),
                appId : getApplicantId(),
                data : sJSONData.data
            },
            type : sJSONData.verb,
            dataType : 'json',
            success : function (data, textStatus, jqXHR) {
                // this callback will be called asynchronously
                // when the response is available
                if (data !== undefined && data.success) {
                    dbApp.removeFromQueue(sJSONData.mobileQueueId);
                    dbApp.queuePostSuccess();
                    dbApp.isProcessing = false;
                    //console.log("No longer processing the last queue push");
                } else {
                    // allow future requests to attempt to be processed
                    // need to rollback the max queue id, too -- set it to 0 so that next pass
                    // will pick up all records
                    dbApp.maxSynchedQueueId = 0;
                    dbApp.stopQueueProcessing();
                    dbApp.isProcessing = false;
                }

                console.log(data);
            },
            error : function (jqXHR, textStatus, errorThrown) {
                // called asynchronously if an error occurs
                // or server returns response with status
                // code outside of the <200, 400) range

                // need to rollback the max queue id, too -- set it to 0 so that next pass
                // will pick up all records
                dbApp.maxSynchedQueueId = 0;
                dbApp.stopQueueProcessing();
                dbApp.isProcessing = false;
                //console.log("No longer processing the last queue push");
            }
        })
};

dbApp.addDataToQueue = function (rec, verb, data, callback) {
    var sdata = {};
    console.log(data);
    if(rec === 'meddata') {
        sdata = {
            disability1:data['condition1'],
            disability2:data['condition2'],
            disability3:data['condition3'],
            disability4:data['condition4'],
            disabilitynote1:"",
            disabilitynote2:"",
            disabilitynote3:"",
            disabilitynote4:""
        };
    } else if (rec === 'addressdata') {
        sdata = {
            Address1:data['Address1'],
            Address2:data['Address2'],
            Address3:data['Address3'],
            Address4:data['Address4'],
            Address5:data['Address5'],
            PostalCode:data['MailPostalCode'],
            MailAddress1:data['Address1'],
            MailAddress2:data['Address2'],
            MailAddress3:data['Address3'],
            MailAddress4:data['Address4'],
            MailAddress5:data['Address5'],
            MailPostalCode:data['MailPostalCode']
        };
    } else if (rec === 'emergencydetails') {
        sdata = {
            FirstName:data['FirstName'],
            LastName:data['LastName'],
            Telephone:data['Telephone'],
            Cell:data['Cell'],
            Work:data['Work'],
            Email:"",
            Sex:"",
            Address1:data['Address1'],
            Address2:data['Address2'],
            Address3:data['Address3'],
            Address4:data['Address4'],
            Address5:data['Address5'],
            PostalCode:data['postalcode']
        }
    } else if (rec === 'applworkexp' && verb === 'POST') {
        sdata = {
            Seq:data['Seq'],
            Name:"",
            StartYear:data['StartYear'],
            EndYear:data['EndYear'],
            Employer:data['Employer'],
            PositionHeld:data['PositionHeld']
        }
    } else if (rec === 'applworkexp' && verb === 'DELETE') {
        sdata = {
            Seq:data['Seq'],
            Name:"",
            StartYear:"",
            EndYear:"",
            Employer:"",
            PositionHeld:""
        }
    } else if (rec === 'applprograms' && verb === 'POST') {
        sdata = {
            code:data['code'],
            programname:data['programname'],
            programtypeCode:data['programtypeCode'],
            programtypeName:data['programtypeName'],
            rank:data['rank'],
            fulltime:data['fulltime'],
            Seq:data['Seq'],
            location:data['location'],
            priority:data['priority']
        }
    } else if (rec === 'applprograms' && verb === 'DELETE') {
        sdata = {
            code:"",
            programname:"",
            programtypeCode:"",
            programtypeName:"",
            rank:"",
            fulltime:"",
            Seq:data['Seq'],
            location:"",
            priority:""
        }
    } else if (rec === 'applsubjects' && verb === 'POST') {
        sdata = {
            EntrySeq:data['EntrySeq'],
            Year:data['Year'],
            ExamBoby:data['ExamBoby'],
            Grade:data['Grade'],
            SubjectCode:data['SubjectCode'],
            Description:data['Description'],
            Level:data['Level']
        }
    } else if (rec === 'applsubjects' && verb === 'DELETE') {
        sdata = {
            EntrySeq:data['EntrySeq'],
            Year:0,
            ExamBoby:"",
            Grade:"",
            SubjectCode:"",
            Description:"",
            Level:""
        }
    } else if (rec === 'applschools' && verb === 'POST') {
        sdata = {
            code:data['code'],
            startyear:data['startyear'],
            endyear:data['endyear'],
            lastschool:"",
            Seq:data['Seq'],
            description:"",
            degreeobtain:data['degreeobtain'],
            degreegradeobtain:data['degreegradeobtain']
        }
    } else if (rec === 'applschools' && verb === 'DELETE') {
        sdata = {
            code:"",
            startyear:0,
            endyear:0,
            lastschool:"",
            Seq:data['Seq'],
            description:"",
            degreeobtain:"",
            degreegradeobtain:""
        }
    } else if (rec === 'appbasedata') {
        sdata = {
            ApplicantID:data['ApplicantID'],
            prefix:data['prefix'],
            FirstName:data['FirstName'],
            LastName:data['LastName'],
            MiddleName:data['MiddleName'],
            natreg:data['natreg'],
            ssn:'',
            DOB:data["DOB"],
            Sex:data["Sex"],
            Telephone:data['Telephone'],
            Cell:data['Cell'],
            Work:data['Work'],
            Email:getEmail(),
            maritalStatus:data['maritalStatus'],
            passport:data['passport'],
            ImmigrationStartDate:data['ImmigrationStartDate'],
            ImmigrationEndDate:data['ImmigrationEndDate'],
            responsibilityforfees:data['responsibilityforfees']
        }
    } else if (rec === 'appldetails') {
        sdata = {
            birthcode:data['birthcode'],
            countrycode:data['countrycode'],
            residencecode:data['residencecode'],
            immigrationcode:data['immigrationcode'],
            ethnicity:"",
            religionCode:"",
            ImmigrationStartDate:data['ImmigrationStartDate'],
            ImmigrationEndDate:data['ImmigrationEndDate']
        };
    } else {
        console.log('invalid command ' + rec + ' entered');
        return;
    }

    dbApp.saveToQueue(rec, dbApp.deNull(sdata), verb, callback)
};

//inserts new record into the queue table based on the data specified
dbApp.saveToQueue = function (iEventType, sData, sMethod, callback) {
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql ('INSERT INTO Queue (EventType, METHOD, Data) VALUES (?,?,?);',
                    [iEventType, sMethod, JSON.stringify(sData)], function () {
                        try {
                            clearTimeout(dbApp.oQueueTimer);
                        } catch (err) {
                        }	// if there was another timer waiting to start the queue, erase it and only consider this one (to make the batch bigger)
                        dbApp.oQueueTimer = setTimeout(dbApp.startQueueProcessing, dbApp.delay);
                        callback();
                    }, dbApp.errorHandler);
            });
    }
    catch(e) {
        console.log(e.message);
        return false;
    }
};

dbApp.emptyQueue =  function (maxQueueId) {
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql('DELETE FROM Queue WHERE QueueId <= ?;', [maxQueueId], dbApp.nullDataHandler, dbApp.errorHandler);
            }
        );
        // the queue id resets back to 0 in the table
        dbApp.maxSynchedQueueId = 0;
    } catch (e) {
        console.log(e.message);
    }

};

dbApp.removeQueue =  function (maxQueueId) {
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql('DELETE FROM Queue WHERE QueueId = ?;', [maxQueueId], dbApp.nullDataHandler, dbApp.errorHandler);
            }
        );
        // the queue id resets back to 0 in the table
    } catch (e) {
        console.log(e.message);
    }
};

//retrieve all records currently in the queue, beyond the last processed index
dbApp.getQueueRecords = function (fnCallback) {
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql('SELECT * FROM Queue WHERE QueueId > ? Order By QueueId DESC;', [dbApp.maxSynchedQueueId],
                    function (transaction, results) {
                        fnCallback(results);
                    },
                    dbApp.errorHandler);
            }
        );
    } catch (e) {
        console.log(e.message);
    }
};

// removes all null removes from obj and replace it with empty string
dbApp.deNull = function(obj) {
    var prop;
    for(prop in obj) {
        if(obj.hasOwnProperty(prop)) {
            if(obj[prop] === null || obj[prop] === undefined) {
                obj[prop] = "";
            }
        }
    }
    return obj;
};


(function () {
    // start processing queue 5 seconds after the page loads
    dbApp.oQueueTimer = setTimeout(dbApp.startQueueProcessing, 5000);
})();