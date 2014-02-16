var dbApp = $.extend(dbApp, {
        mydb : false,
        arrQueueRecords : null,     // list of Queue records currently being processed
        isProcessing : false,       // indicates whether queue records are currently being processed or not
        oQueueTimer : null,
        maxSynchedQueueId : 0,
        delay : 1000,                // how long to wait before syncing the chat logs with server
        numberOfLoaded : 0,
        step : Math.floor(100 / 12)
});

var ENDPOINT = {
    COUNTRY : 'countries',
    EXAMBODY : 'exambodies',
    EXAMBODYGRADES:'exambodygrades',
    HEALTH : 'healthopts',
    IMMIGRATION : 'immigrationcodes',
    LEVELS : 'levels',
    LOCATION : 'locations',
    PARISH : 'parishes',
    PROGRAMTYPES : 'programtypes',
    PROGRAM : 'programs',
    SCHOOLS : 'schools',
    SUBJECTS : 'subjects',
    STUDY : 'studyopts',
    WORK : 'applworkexp',
    BASE : 'appbasedata',
    EMERGENCY : 'emergencydetails',
    MED : 'meddata',
    PROG : 'applprograms',
    ADDR : 'addressdata',
    SUBJ : 'applsubjects',
    SCHL : 'applschools',
	DETAILS : 'appldetails'
};

var TABLE = {
    AUDIT : 'Audit',
    COUNTRY : 'Country',
    SCHOOL : 'School',
    PARISH : 'Parish',
    PROGRAM : 'Program',
    PROGRAMTYPES : 'ProgramType',
    LOCATION : 'Location',
    SUBJECT : 'Subject',
    EXAMBODY: 'ExamBody',
    EXAMBODYGRADES : 'ExamBodyGrade',
    HEALTH :'HealthOption',
    IMMIGRATION : 'ImmigrationCode',
    STUDY : 'Study',
    LEVELS : 'GradeLevel',
    WORK : 'WorkExp',
    BASE : 'ApplicantBaseData',
    EMERGENCY : 'ApplicantEmergencyData',
    MED : 'ApplicantMedData',
    PROG : 'ApplicantProgData',
    ADDR : 'ApplicantAddressData',
    SUBJ : 'ApplicantSubjectData',
    SCHL : 'ApplicantSchoolData',
	DETAILS : 'appldetails'
};

var SYNC_TYPE = {
    FULL : 'FULL',
    PARTIAL : 'PARTIAL',
    UPDATE : 'UPDATE'
};

//populate the specified table by calling the fnCallback function if the table has no rows
dbApp.populateTable = function (tableName, fnCallback, fnResultsCallback) {
    var sql = "SELECT * FROM " + tableName + ";";
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql(sql, [],
                    function (transaction, results) {
                        if (results.rows.length === 0) {
                            fnCallback();
                        } else {
                            if (fnResultsCallback) {
                                fnResultsCallback(results);
                            }
                        }
                    }, dbApp.errorHandler);
            }
        );
    } catch (e) {
        console.log(e.message);
    }
};

/***
 * Function drops the specified table from the SQLite database
 * @param sTableName - name of table to drop
 */
dbApp.dropTable = function (sTableName) {
    var sqlInstruction = 'DROP TABLE IF EXISTS ' + sTableName + ';	';

    dbApp.mydb.transaction(
        function (transaction) {
            transaction.executeSql(sqlInstruction, [], dbApp.nullDataHandler, dbApp.errorHandler);
        }
    );
};

/***
 * Function cleans all the database tables for the currently logged in user
 * No parameters are required to run this function
 */
dbApp.cleanDBTables = function () {
    //List of database tables to clean
    for(var tb in TABLE) {
        var curTb = TABLE[tb];
        dbApp.cleanTable(curTb, function () {
            console.log("Finish cleaning table : " + curTb);
        });
    }
};

/***
 * Function deletes all rows in a specified table
 * @param sTableName - name of table to drop
 * @param callback
 */
dbApp.cleanTable = function (sTableName, callback) {
    var sqlInstruction = 'DELETE FROM ' + sTableName + ';	';
    dbApp.mydb.transaction(
        function (transaction) {
            transaction.executeSql(sqlInstruction, [], callback, dbApp.errorHandler);
        }
    );
    console.log("Cleaning " + sTableName);
};

// initialize the database
dbApp.initDB = function () {
    try {
        var shortName = 'studentApplicant', version = '1.0', displayName = 'Applicant Database', maxSize = 65536; // in bytes
        if (!window.openDatabase) {
            console.log('not supported');
        } else {
            dbApp.mydb = window.openDatabase(shortName, version, displayName, maxSize);
        }
    } catch (e) {

        console.log(e);
        // Error handling code goes here.
        if (e === INVALID_STATE_ERR) {
            // Version number mismatch.
            console.log("Invalid database version.");
        } else {
            console.log("Unknown error " + e + ".");
        }
    }
};

dbApp.createTables = function () {
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql('CREATE TABLE IF NOT EXISTS Country (value INTEGER PRIMARY KEY AUTOINCREMENT, Code TEXT, Description TEXT NOT NULL);', [], dbApp.nullDataHandler, dbApp.errorHandler);
                transaction.executeSql('CREATE TABLE IF NOT EXISTS ExamBody (value INTEGER PRIMARY KEY AUTOINCREMENT, Code TEXT, Description TEXT NOT NULL);', [], dbApp.nullDataHandler, dbApp.errorHandler);
                transaction.executeSql('CREATE TABLE IF NOT EXISTS ExamBodyGrade (value INTEGER PRIMARY KEY AUTOINCREMENT, Grade TEXT, GradeAlternative TEXT NOT NULL, Exambody TEXT NOT NULL);', [], dbApp.nullDataHandler, dbApp.errorHandler);
                transaction.executeSql('CREATE TABLE IF NOT EXISTS HealthOption (value INTEGER PRIMARY KEY AUTOINCREMENT, Code TEXT, Description TEXT NOT NULL);', [], dbApp.nullDataHandler, dbApp.errorHandler);
                transaction.executeSql('CREATE TABLE IF NOT EXISTS Location (value INTEGER PRIMARY KEY AUTOINCREMENT, Code TEXT, Name TEXT NOT NULL);', [], dbApp.nullDataHandler, dbApp.errorHandler);
                transaction.executeSql('CREATE TABLE IF NOT EXISTS Parish (value INTEGER PRIMARY KEY AUTOINCREMENT, Code TEXT, Name TEXT NOT NULL);', [], dbApp.nullDataHandler, dbApp.errorHandler);
                transaction.executeSql('CREATE TABLE IF NOT EXISTS School (value INTEGER PRIMARY KEY AUTOINCREMENT, Code TEXT, Name TEXT NOT NULL);', [], dbApp.nullDataHandler, dbApp.errorHandler);
                transaction.executeSql('CREATE TABLE IF NOT EXISTS Study (value INTEGER PRIMARY KEY AUTOINCREMENT, Code TEXT, Name TEXT NOT NULL);', [], dbApp.nullDataHandler, dbApp.errorHandler);
                transaction.executeSql('CREATE TABLE IF NOT EXISTS Subject (value INTEGER PRIMARY KEY AUTOINCREMENT, Code TEXT, Name TEXT NOT NULL, Level TEXT, ExamBody TEXT);', [], dbApp.nullDataHandler, dbApp.errorHandler);
                transaction.executeSql('CREATE TABLE IF NOT EXISTS Program (value INTEGER PRIMARY KEY AUTOINCREMENT, Code TEXT, Name TEXT NOT NULL, Faculty TEXT NOT NULL);', [], dbApp.nullDataHandler, dbApp.errorHandler);
                transaction.executeSql('CREATE TABLE IF NOT EXISTS ProgramType (value INTEGER PRIMARY KEY AUTOINCREMENT, Code TEXT, Type TEXT NOT NULL);', [], dbApp.nullDataHandler, dbApp.errorHandler);
                transaction.executeSql('CREATE TABLE IF NOT EXISTS GradeLevel (value INTEGER PRIMARY KEY AUTOINCREMENT, Code TEXT, Name TEXT, Exambody TEXT NOT NULL);', [], dbApp.nullDataHandler, dbApp.errorHandler);
                transaction.executeSql('CREATE TABLE IF NOT EXISTS ImmigrationCode (value INTEGER PRIMARY KEY AUTOINCREMENT, Code TEXT, Name TEXT NOT NULL);', [], dbApp.nullDataHandler, dbApp.errorHandler);
                transaction.executeSql('CREATE TABLE IF NOT EXISTS Queue(QueueId INTEGER PRIMARY KEY AUTOINCREMENT, EventType TEXT NOT NULL, METHOD TEXT, Data TEXT NOT NULL);', [], dbApp.nullDataHandler, dbApp.errorHandler);
                transaction.executeSql('CREATE TABLE IF NOT EXISTS Audit(Id INTEGER PRIMARY KEY AUTOINCREMENT, LastSyncDate TEXT NOT NULL, TableSynced TEXT, SyncType TEXT);', [], dbApp.nullDataHandler, dbApp.errorHandler);

                /*applicant tables*/
                transaction.executeSql('CREATE TABLE IF NOT EXISTS WorkExp(Seq INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, StartYear TEXT, EndYear TEXT, Employer TEXT, PositionHeld TEXT);', [], dbApp.nullDataHandler, dbApp.errorHandler);

                transaction.executeSql('CREATE TABLE IF NOT EXISTS ApplicantBaseData(ApplicantID INT PRIMARY KEY, prefix TEXT, FirstName TEXT, LastName TEXT,' +
                    'MiddleName TEXT, natreg TEXT, ssn TEXT, DOB TEXT, Sex TEXT, Telephone TEXT, Cell TEXT, Work TEXT, Email TEXT, maritalStatus TEXT, ' +
                    'passport TEXT, ImmigrationStartDate TEXT, ImmigrationEndDate TEXT, responsibilityforfees TEXT, birthcode TEXT, ' +
                    'countrycode TEXT, residencecode TEXT, immigrationcode TEXT);', [], dbApp.nullDataHandler, dbApp.errorHandler);

                transaction.executeSql('CREATE TABLE IF NOT EXISTS ApplicantEmergencyData(ApplicantID INT PRIMARY KEY, FirstName TEXT, LastName TEXT,' +
                    'Telephone TEXT, Cell TEXT, Work TEXT, Email TEXT, Sex TEXT, Address1 TEXT NOT NULL, Address2 TEXT NOT NULL, ' +
                    'Address3 TEXT NOT NULL, Address4 TEXT NOT NULL, Address5 TEXT NOT NULL, postalcode TEXT);', [], dbApp.nullDataHandler, dbApp.errorHandler);

                transaction.executeSql('CREATE TABLE IF NOT EXISTS ApplicantMedData(ApplicantID INT PRIMARY KEY, disability1 TEXT, disability2 TEXT,' +
                    'disability3 TEXT, disability4 TEXT, disabilitynote1 TEXT, disabilitynote2 TEXT, disabilitynote3 TEXT, disabilitynote4 TEXT);', [], dbApp.nullDataHandler, dbApp.errorHandler);

                transaction.executeSql('CREATE TABLE IF NOT EXISTS ApplicantProgData(code TEXT, programname TEXT,' +
                    'programtypeCode TEXT, programtypeName TEXT, rank TEXT, fulltime TEXT, Seq TEXT, location TEXT, priority TEXT);', [], dbApp.nullDataHandler, dbApp.errorHandler);


                transaction.executeSql('CREATE TABLE IF NOT EXISTS ApplicantAddressData(ApplicantID INT PRIMARY KEY, Address1 TEXT NOT NULL, ' +
                    'Address2 TEXT NOT NULL, Address3 TEXT NOT NULL, Address4 TEXT NOT NULL, Address5 TEXT NOT NULL, MailAddress1 TEXT NOT NULL, ' +
                    'MailAddress2 TEXT NOT NULL, MailAddress3 TEXT NOT NULL, MailAddress4 TEXT NOT NULL, MailAddress5 TEXT NOT NULL, MailPostalCode TEXT);',
                    [], dbApp.nullDataHandler, dbApp.errorHandler);

                transaction.executeSql('CREATE TABLE IF NOT EXISTS ApplicantSubjectData(EntrySeq TEXT PRIMARY KEY, Year TEXT, ' +
                    'ExamBoby TEXT NOT NULL, Grade TEXT NOT NULL, SubjectCode TEXT NOT NULL, Description TEXT, Level TEXT NOT NULL);',
                    [], dbApp.nullDataHandler, dbApp.errorHandler);

                transaction.executeSql('CREATE TABLE IF NOT EXISTS ApplicantSchoolData(code TEXT NOT NULL, ' +
                    'startyear TEXT, endyear TEXT, lastschool TEXT, Seq TEXT PRIMARY KEY, description TEXT NOT NULL, degreeobtain TEXT NOT NULL, ' +
                    'degreegradeobtain TEXT NOT NULL);',
                    [], dbApp.nullDataHandler, dbApp.errorHandler);

            }
        );
    } catch (e) {
        console.log(e.message);
    }
};

/**  Asynchronous data load handlers **/

dbApp.aSyncCountryTb = function() {
    dbApp.getLastSyncDateForTable(TABLE.COUNTRY, function(results) {
        if(results.rows.length > 0){
            if(Math.floor(new XDate(results.rows.item(0).LastSyncDate).diffDays(new XDate())) >= 30) {
                dbApp.getCountryData(SYNC_TYPE.PARTIAL);
            }
        } else {
            dbApp.getCountryData(SYNC_TYPE.FULL);
        }
    });
};

dbApp.aSyncProgramTb = function() {
    dbApp.getLastSyncDateForTable(TABLE.PROGRAM, function(results) {
        if(results.rows.length > 0){
            if(Math.floor(new XDate(results.rows.item(0).LastSyncDate).diffDays(new XDate())) >= 30) {
                dbApp.getProgramData(SYNC_TYPE.PARTIAL);
            }
        } else {
            dbApp.getProgramData(SYNC_TYPE.FULL);
        }
    });
};

dbApp.aSyncSubjectTb = function() {
    dbApp.getLastSyncDateForTable(TABLE.SUBJECT, function(results) {
        if(results.rows.length > 0){
            if(Math.floor(new XDate(results.rows.item(0).LastSyncDate).diffDays(new XDate())) >= 30) {
                dbApp.getSubjectData(SYNC_TYPE.PARTIAL);
            }
        } else {
            dbApp.getSubjectData(SYNC_TYPE.FULL);
        }
    });
};

dbApp.aSyncExamBodyTb = function() {
    dbApp.getLastSyncDateForTable(TABLE.EXAMBODY, function(results) {
        if(results.rows.length > 0){
            if(Math.floor(new XDate(results.rows.item(0).LastSyncDate).diffDays(new XDate())) >= 30) {
                dbApp.getExamBodyData(SYNC_TYPE.PARTIAL);
            }
        } else {
            dbApp.getExamBodyData(SYNC_TYPE.FULL);
        }
    });
};

dbApp.aSyncExamBodyGradesTb = function() {
    dbApp.getLastSyncDateForTable(TABLE.EXAMBODYGRADES, function(results) {
        if(results.rows.length > 0){
            if(Math.floor(new XDate(results.rows.item(0).LastSyncDate).diffDays(new XDate())) >= 30) {
                dbApp.getExamBodyGradesData(SYNC_TYPE.PARTIAL);
            }
        } else {
            dbApp.getExamBodyGradesData(SYNC_TYPE.FULL);
        }
    });
};

dbApp.aSyncHeathTb = function() {
    dbApp.getLastSyncDateForTable(TABLE.HEALTH, function(results) {
        if(results.rows.length > 0){
            if(Math.floor(new XDate(results.rows.item(0).LastSyncDate).diffDays(new XDate())) >= 30) {
                dbApp.getHealthData(SYNC_TYPE.PARTIAL);
            }
        } else {
            dbApp.getHealthData(SYNC_TYPE.FULL);
        }
    });
};

dbApp.aSyncImmigrationTb = function() {
    dbApp.getLastSyncDateForTable(TABLE.IMMIGRATION, function(results) {
        if(results.rows.length > 0){
            if(Math.floor(new XDate(results.rows.item(0).LastSyncDate).diffDays(new XDate())) >= 30) {
                dbApp.getImmigrationData(SYNC_TYPE.PARTIAL);
            }
        } else {
            dbApp.getImmigrationData(SYNC_TYPE.FULL);
        }
    });
};

dbApp.aSyncLevelTb = function() {
    dbApp.getLastSyncDateForTable(TABLE.LEVELS, function(results) {
        if(results.rows.length > 0){
            if(Math.floor(new XDate(results.rows.item(0).LastSyncDate).diffDays(new XDate())) >= 30) {
                dbApp.getLevelData(SYNC_TYPE.PARTIAL);
            }
        } else {
            dbApp.getLevelData(SYNC_TYPE.FULL);
        }
    });
};

dbApp.aSyncLocationTb = function() {
    dbApp.getLastSyncDateForTable(TABLE.LOCATION, function(results) {
        if(results.rows.length > 0){
            if(Math.floor(new XDate(results.rows.item(0).LastSyncDate).diffDays(new XDate())) >= 30) {
                dbApp.getLocationData(SYNC_TYPE.PARTIAL);
            }
        } else {
            dbApp.getLocationData(SYNC_TYPE.FULL);
        }
    });
};

dbApp.aSyncParishTb = function() {
    dbApp.getLastSyncDateForTable(TABLE.PARISH, function(results) {
        if(results.rows.length > 0){
            if(Math.floor(new XDate(results.rows.item(0).LastSyncDate).diffDays(new XDate())) >= 30) {
                dbApp.getParishData(SYNC_TYPE.PARTIAL);
            }
        } else {
            dbApp.getParishData(SYNC_TYPE.FULL);
        }
    });
};

dbApp.aSyncProgramTypeTb = function() {
    dbApp.getLastSyncDateForTable(TABLE.PROGRAMTYPES, function(results) {
        if(results.rows.length > 0){
            if(Math.floor(new XDate(results.rows.item(0).LastSyncDate).diffDays(new XDate())) >= 30) {
                dbApp.getProgramTypeData(SYNC_TYPE.PARTIAL);
            }
        } else {
            dbApp.getProgramTypeData(SYNC_TYPE.FULL);
        }
    });
};

dbApp.aSyncStudyTb = function() {
    dbApp.getLastSyncDateForTable(TABLE.STUDY, function(results) {
        if(results.rows.length > 0){
            if(Math.floor(new XDate(results.rows.item(0).LastSyncDate).diffDays(new XDate())) >= 30) {
                dbApp.getStudyData(SYNC_TYPE.PARTIAL);
            }
        } else {
            dbApp.getStudyData(SYNC_TYPE.FULL);
        }
    });
};

dbApp.aSyncSchoolTb = function() {
    dbApp.getLastSyncDateForTable(TABLE.SCHOOL, function(results) {
        if(results.rows.length > 0){
            if(Math.floor(new XDate(results.rows.item(0).LastSyncDate).diffDays(new XDate())) >= 30) {
                dbApp.getSchoolData(SYNC_TYPE.PARTIAL);
            }
        } else {
            dbApp.getSchoolData(SYNC_TYPE.FULL);
        }
    });
};


/** Retrieving data from server **/

dbApp.getCountryData = function (syncType) {
    getDataFromServer(function(result){
        dbApp.cleanTable(TABLE.COUNTRY, function () {
            var countries = result["countries"];
            var len = countries.length, i = 0, callback = null;
            for (i = 0; i < len; i++) {

                // ensure that method only gets called after last record has been processed
                if(i == len-1) {
                    callback = function () {
                        dbApp.appAuditTb(new Date().toString(), TABLE.COUNTRY, syncType);
                        dbApp.auditCallback(TABLE.COUNTRY);
                    };
                }

                dbApp.populateCountryTb(countries[i].Code, countries[i].Description, callback);

            }
        });
    }, ENDPOINT.COUNTRY);
};

dbApp.getProgramData = function (syncType) {
    getDataFromServer(function(result){
        dbApp.cleanTable(TABLE.PROGRAM, function () {
            var programs = result["programs"];
            var len = programs.length, i = 0, callback = null;
            for (i = 0; i < len; i++) {

                // ensure that method only gets called after last record has been processed
                if(i == len-1) {
                    callback = function () {
                        dbApp.appAuditTb(new Date().toString(), TABLE.PROGRAM, syncType);
                        dbApp.auditCallback(TABLE.PROGRAM);
                    };
                }

                dbApp.populateProgramTb(programs[i].Code, programs[i].Programname, programs[i].Facultyname, callback);

            }
        });
    }, ENDPOINT.PROGRAM);
};

dbApp.getProgramTypeData = function (syncType) {
    getDataFromServer(function(result){
        dbApp.cleanTable(TABLE.PROGRAMTYPES, function () {
            var programs = result["programtypes"];
            var len = programs.length, i = 0, callback = null;
            for (i = 0; i < len; i++) {

                // ensure that method only gets called after last record has been processed
                if(i == len-1) {
                    callback = function () {
                        dbApp.appAuditTb(new Date().toString(), TABLE.PROGRAMTYPES, syncType);
                        dbApp.auditCallback(TABLE.PROGRAMTYPES);
                    };
                }

                dbApp.populateProgramTypeTb(programs[i].Code, programs[i].Programtype, callback);

            }
        });
    }, ENDPOINT.PROGRAMTYPES);
};

dbApp.getSubjectData = function (syncType) {
    getDataFromServer(function(result){
        dbApp.cleanTable(TABLE.SUBJECT, function () {
            var subjects = result["subjects"];
            var len = subjects.length, i = 0, callback = null;
            for (i = 0; i < len; i++) {

                // ensure that method only gets called after last record has been processed
                if(i == len-1) {
                    callback = function () {
                        dbApp.appAuditTb(new Date().toString(), TABLE.SUBJECT, syncType);
                        dbApp.auditCallback(TABLE.SUBJECT);
                    };
                }

                dbApp.populateSubjectTb(subjects[i].Code, subjects[i].Name, subjects[i].Level, subjects[i].exam_body, callback);

            }
        });
    }, ENDPOINT.SUBJECTS);
};

dbApp.getSchoolData = function (syncType) {
    getDataFromServer(function(result){
        dbApp.cleanTable(TABLE.SCHOOL, function () {
            var schools = result["schools"];
            var len = schools.length, i = 0, callback = null;
            for (i = 0; i < len; i++) {

                // ensure that method only gets called after last record has been processed
                if(i == len-1) {
                    callback = function () {
                        dbApp.appAuditTb(new Date().toString(), TABLE.SCHOOL, syncType);
                        dbApp.auditCallback(TABLE.SCHOOL);
                    };
                }

                dbApp.populateSchoolTb(schools[i].Code, schools[i].Name, callback);

            }
        });
    }, ENDPOINT.SCHOOLS);
};

dbApp.getParishData = function (syncType) {
    getDataFromServer(function(result){
        dbApp.cleanTable(TABLE.PARISH, function () {
            var parishes = result["parishes"];
            var len = parishes.length, i = 0, callback = null;
            for (i = 0; i < len; i++) {

                // ensure that method only gets called after last record has been processed
                if(i == len-1) {
                    callback = function() {
                        dbApp.appAuditTb(new Date().toString(), TABLE.PARISH, syncType);
                        dbApp.auditCallback(TABLE.PARISH);
                    };
                }

                dbApp.populateParishTb(parishes[i].Code, parishes[i].ParishName, callback);

            }
        });
    }, ENDPOINT.PARISH);
};

dbApp.getExamBodyData = function (syncType) {
    getDataFromServer(function(result){
        dbApp.cleanTable(TABLE.EXAMBODY, function () {
            var exambodies = result["exambodies"];
            var len = exambodies.length, i = 0, callback = null;
            for (i = 0; i < len; i++) {

                // ensure that method only gets called after last record has been processed
                if(i == len-1) {
                    callback = function() {
                        dbApp.appAuditTb(new Date().toString(), TABLE.EXAMBODY, syncType);
                        dbApp.auditCallback(TABLE.EXAMBODY);
                    };
                }

                dbApp.populateExamBodyTb(exambodies[i].Code, exambodies[i].Description, callback);

            }
        });
    }, ENDPOINT.EXAMBODY);
};

dbApp.getExamBodyGradesData = function (syncType) {
    getDataFromServer(function(result){
        dbApp.cleanTable(TABLE.EXAMBODYGRADES, function () {
            var grades = result["grades"];
            var len = grades.length, i = 0, callback = null;
            for (i = 0; i < len; i++) {

                // ensure that method only gets called after last record has been processed
                if(i == len-1) {
                    callback = function() {
                        dbApp.appAuditTb(new Date().toString(), TABLE.EXAMBODYGRADES, syncType);
                        dbApp.auditCallback(TABLE.EXAMBODYGRADES);
                    };
                }

                dbApp.populateExamBodyGradeTb(grades[i].Grade, grades[i].GradeAlternative, grades[i].exam_body, callback);

            }
        });
    }, ENDPOINT.EXAMBODYGRADES);
};

dbApp.getHealthData = function (syncType) {
    getDataFromServer(function(result){
        dbApp.cleanTable(TABLE.HEALTH, function () {
            var health = result["healthoptioncodes"];
            var len = health.length, i = 0, callback = null;
            for (i = 0; i < len; i++) {

                // ensure that method only gets called after last record has been processed
                if(i == len-1) {
                    callback = function () {
                        dbApp.appAuditTb(new Date().toString(), TABLE.HEALTH, syncType);
                        dbApp.auditCallback(TABLE.HEALTH);
                    };
                }

                dbApp.populateHealthOptionTb(health[i].Code, health[i].Description, callback);

            }
        });
    }, ENDPOINT.HEALTH);
};

dbApp.getImmigrationData = function (syncType) {
    getDataFromServer(function(result){
        dbApp.cleanTable(TABLE.IMMIGRATION, function () {
            var immi = result["immigrationcodes"];
            var len = immi.length, i = 0, callback = null;
            for (i = 0; i < len; i++) {

                // ensure that method only gets called after last record has been processed
                if(i == len-1) {
                    callback = function() {
                        dbApp.appAuditTb(new Date().toString(), TABLE.IMMIGRATION, syncType);
                        dbApp.auditCallback(TABLE.IMMIGRATION);
                    };
                }

                dbApp.populateImmigrationTb(immi[i].Code, immi[i].Name, callback);

            }
        });
    }, ENDPOINT.IMMIGRATION);
};

dbApp.getLevelData = function (syncType) {
    getDataFromServer(function(result){
        dbApp.cleanTable(TABLE.LEVELS, function () {
            var levels = result["levelcodes"];
            var len = levels.length, i = 0, callback = null;
            for (i = 0; i < len; i++) {

                // ensure that method only gets called after last record has been processed
                if(i == len-1) {
                    callback = function () {
                        dbApp.appAuditTb(new Date().toString(), TABLE.LEVELS, syncType);
                        dbApp.auditCallback(TABLE.LEVELS);
                    };
                }

                dbApp.populateGradeLevelTb(levels[i].Code, levels[i].Name, levels[i].exambody, callback);

            }
        });
    }, ENDPOINT.LEVELS);
};

dbApp.getLocationData = function (syncType) {
    getDataFromServer(function(result){
        dbApp.cleanTable(TABLE.LOCATION, function () {
            var location = result["locationcodes"];
            var len = location.length, i = 0, callback = null;
            for (i = 0; i < len; i++) {

                // ensure that method only gets called after last record has been processed
                if(i == len-1) {
                    callback = function () {
                        dbApp.appAuditTb(new Date().toString(), TABLE.LOCATION, syncType);
                        dbApp.auditCallback(TABLE.LOCATION);
                    };
                }

                dbApp.populateLocationTb(location[i].Code, location[i].Name, callback);

            }
        });
    }, ENDPOINT.LOCATION);
};

dbApp.getStudyData = function (syncType) {
    getDataFromServer(function(result){
        dbApp.cleanTable(TABLE.STUDY, function () {
            var study = result["studyoptioncodes"];
            var len = study.length, i = 0, callback = null;
            for (i = 0; i < len; i++) {

                // ensure that method only gets called after last record has been processed
                if(i == len-1) {
                    callback = function () {
                        dbApp.appAuditTb(new Date().toString(), TABLE.STUDY, syncType);
                        dbApp.auditCallback(TABLE.STUDY);
                    };
                }

                dbApp.populateStudyTb(study[i].Code, study[i].Name, callback);

            }
        });
    }, ENDPOINT.STUDY);
};

dbApp.auditCallback = function (tb) {

    var $element  = $('#progressBar');

    if($element != null || $element != undefined) {
        dbApp.numberOfLoaded++;
        progressBar(dbApp.step * dbApp.numberOfLoaded, "loading " + tb + " data", $element);
        if(dbApp.numberOfLoaded == 12) {
            dbApp.numberOfLoaded = 0;
            $element.hide('slow');
        }
    }
    console.log(tb,"** Adding entry to audit log ***")
};



/** Auditing tables **/

dbApp.getLastSyncDateForTable = function(tb, callback) {
    dbApp.mydb.transaction(
        function (transaction) {
            transaction.executeSql('SELECT LastSyncDate FROM Audit WHERE TableSynced = (?) ', [tb], function (transaction, results) {
                callback(results)
            }, dbApp.errorHandler);
        }
    );
};

dbApp.appAuditTb = function(date, table, synType, callback) {
    var sql;
    synType = synType || SYNC_TYPE.FULL;
    try {

        if (synType === SYNC_TYPE.FULL) {
            sql = 'INSERT INTO Audit (LastSyncDate, TableSynced, SyncType) VALUES(?,?,?);';
        } else {
            sql = 'UPDATE Audit SET LastSyncDate (?) WHERE TableSynced = (?) VALUES(?,?);'
        }

        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql(sql, [date, table, synType], callback, dbApp.errorHandler);
            }
        );

    } catch (e) {
        console.log(e.message);
    }
};


/*** Table Population ***/

dbApp.populateCountryTb = function (code, description, callback) {
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql('INSERT INTO Country (Code, Description) VALUES(?,?);',
                    [code, description], callback, dbApp.errorHandler);
            }
        );

    } catch (e) {
        console.log(e.message);
        return;
    }
};

dbApp.populateProgramTb = function (code, name, faculty, callback) {
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql('INSERT INTO Program (Code, Name, Faculty) VALUES(?,?,?);',
                    [code, name, faculty], callback, dbApp.errorHandler);
            }
        );

    } catch (e) {
        console.log(e.message);
        return;
    }
};

dbApp.populateSubjectTb = function (code, name, level, body, callback) {
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql('INSERT INTO Subject (Code, Name, Level, ExamBody) VALUES(?,?,?,?);',
                    [code, name, level, body], callback, dbApp.errorHandler);
            }
        );

    } catch (e) {
        console.log(e.message);
        return;
    }
};

dbApp.populateSchoolTb = function (code, name, callback) {
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql('INSERT INTO School (Code, Name) VALUES(?,?);',
                    [code, name], callback, dbApp.errorHandler);
            }
        );

    } catch (e) {
        console.log(e.message);
        return;
    }
};

dbApp.populateParishTb = function (code, name, callback) {
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql('INSERT INTO Parish (Code, Name) VALUES(?,?);',
                    [code, name], callback, dbApp.errorHandler);
            }
        );

    } catch (e) {
        console.log(e.message);
        return;
    }
};

dbApp.populateImmigrationTb = function (code, name, callback) {
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql('INSERT INTO ImmigrationCode (Code, Name) VALUES(?,?);',
                    [code, name], callback, dbApp.errorHandler);
            }
        );

    } catch (e) {
        console.log(e.message);
        return;
    }
};

dbApp.populateLocationTb = function (code, name, callback) {
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql('INSERT INTO Location (Code, Name) VALUES(?,?);',
                    [code, name], callback, dbApp.errorHandler);
            }
        );

    } catch (e) {
        console.log(e.message);
        return;
    }
};

dbApp.populateExamBodyTb = function (code, description, callback) {
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql('INSERT INTO ExamBody (Code, Description) VALUES(?,?);',
                    [code, description], callback, dbApp.errorHandler);
            }
        );

    } catch (e) {
        console.log(e.message);
        return;
    }
};

dbApp.populateExamBodyGradeTb = function (grade, alt, body, callback) {
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql('INSERT INTO ExamBodyGrade (Grade, GradeAlternative, ExamBody) VALUES(?,?,?);',
                    [grade, alt, body], callback, dbApp.errorHandler);
            }
        );

    } catch (e) {
        console.log(e.message);
        return;
    }
};

dbApp.populateGradeLevelTb = function (code, name, body, callback) {
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql('INSERT INTO GradeLevel (Code, Name, ExamBody) VALUES(?,?,?);',
                    [code, name, body], callback, dbApp.errorHandler);
            }
        );

    } catch (e) {
        console.log(e.message);
        return;
    }
};

dbApp.populateProgramTypeTb = function (code, type, callback) {
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql('INSERT INTO ProgramType (Code, Type) VALUES(?,?);',
                    [code, type], callback, dbApp.errorHandler);
            }
        );

    } catch (e) {
        console.log(e.message);
        return;
    }
};

dbApp.populateStudyTb = function (code, name, callback) {
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql('INSERT INTO Study(Code, Name) VALUES(?,?);',
                    [code, name], callback, dbApp.errorHandler);
            }
        );

    } catch (e) {
        console.log(e.message);
        return;
    }
};

dbApp.populateHealthOptionTb = function (code, description, callback) {
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql('INSERT INTO HealthOption (Code, Description) VALUES(?,?);',
                    [code, description], callback, dbApp.errorHandler);
            }
        );

    } catch (e) {
        console.log(e.message);
        return;
    }
};

dbApp.populateWorkExpTb = function (obj, callback) {
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql('INSERT INTO WorkExp (Seq, Name, StartYear, EndYear, Employer, PositionHeld) VALUES(?,?,?,?,?,?);',
                    [obj.Seq, obj.Name, obj.StartYear, obj.EndYear, obj.Employer, obj.PositionHeld], callback, dbApp.errorHandler);
            }
        );

    } catch (e) {
        console.log(e.message);
        return;
    }
};

dbApp.populateProgTb = function (obj, callback) {
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql('INSERT INTO ApplicantProgData (code, programname, programtypeCode, programtypeName, rank, fulltime , Seq, location, priority) VALUES(?,?,?,?,?,?,?,?,?);',
                    [
                        obj.code,
                        obj.programname,
                        obj.programtypeCode,
                        obj.programtypeName,
                        obj.rank,
                        obj.fulltime,
                        obj.Seq,
                        obj.location,
                        obj.priority,
                    ], callback, dbApp.errorHandler);
            }
        );

    } catch (e) {
        console.log(e.message);
        return;
    }
};

dbApp.populateSubjTb = function (obj, callback) {
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql('INSERT INTO ApplicantSubjectData (EntrySeq, Year, ' +
                    'ExamBoby, Grade , SubjectCode , Description, Level) VALUES (?,?,?,?,?,?,?);',
                    [obj.EntrySeq, obj.Year, obj.ExamBoby, obj.Grade, obj.SubjectCode, obj.Description, obj.Level], callback, dbApp.errorHandler);
            }
        );

    } catch (e) {
        console.log(e.message);
        return;
    }
};

dbApp.populateSchljTb = function (obj, callback) {
    console.log(obj);
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql('INSERT INTO ApplicantSchoolData (code, startyear, endyear, lastschool, Seq, ' +
                    'description, degreeobtain, degreegradeobtain) VALUES(?,?,?,?,?,?,?,?);',
                    [obj.code, obj.startyear, obj.endyear, obj.lastschool, obj.Seq, obj.description, obj.degreeobtain, obj.degreegradeobtain], callback, dbApp.errorHandler);
            }
        );

    } catch (e) {
        console.log(e.message);
        return;
    }
};

dbApp.populateAddrTb = function (obj, callback) {
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql('INSERT INTO ApplicantAddressData (ApplicantID, Address1, Address2, Address3, Address4, Address5, MailAddress1, ' +
                    'MailAddress2, MailAddress3, MailAddress4, MailAddress5, MailPostalCode) VALUES(?,?,?,?,?,?,?,?,?,?,?,?);',
                    [getApplicantId(), obj.Address1, obj.Address2, obj.Address3, obj.Address4, obj.Address5,
                        obj.MailAddress1, obj.MailAddress2, obj.MailAddress3, obj.MailAddress4, obj.MailAddress5, obj.MailPostalCode], callback, dbApp.errorHandler);
            }
        );

    } catch (e) {
        console.log(e.message);
        return;
    }
};


dbApp.populateEmgTb = function (obj, callback) {
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql('INSERT INTO ApplicantEmergencyData (ApplicantID, FirstName, LastName,' +
                    'Telephone, Cell, Work, Email, Sex, Address1, Address2, ' +
                    'Address3, Address4, Address5, postalcode) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
                    [getApplicantId(), obj.FirstName, obj.LastName, obj.Telephone, obj.Cell, obj.Work,
                        obj.Email, obj.Sex, obj.Address1, obj.Address2, obj.Address3, obj.Address4, obj.Address5, obj.postalcode], callback, dbApp.errorHandler);
            }
        );

    } catch (e) {
        console.log(e.message);
        return;
    }
};

dbApp.populateMedTb = function (obj, callback) {
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql('INSERT INTO ApplicantMedData (ApplicantID, disability1, disability2,' +
                    'disability3, disability4, disabilitynote1, disabilitynote2, disabilitynote3, disabilitynote4) VALUES(?,?,?,?,?,?,?,?,?);',
                    [getApplicantId(), obj.disability1, obj.disability2, obj.disability3, obj.disability4,
                        obj.disabilitynote1, obj.disabilitynote2, obj.disabilitynote3, obj.disabilitynote4], callback, dbApp.errorHandler);
            }
        );

    } catch (e) {
        console.log(e.message);
        return;
    }
};

dbApp.populateBaseTb = function (obj, callback) {
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql('INSERT INTO ApplicantBaseData (ApplicantID, prefix, FirstName, LastName,' +
                    'MiddleName, natreg, ssn, DOB, Sex, Telephone, Cell, Work, Email, maritalStatus, ' +
                    'passport, ImmigrationStartDate, ImmigrationEndDate, responsibilityforfees) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
                    [obj.ApplicantID, obj.prefix, obj.FirstName, obj.LastName, obj.MiddleName,
                        obj.natreg, obj.ssn, dbApp.formatDate(obj.DOB), obj.Sex,
                        obj.Telephone, obj.Cell, obj.Work, obj.Email, obj.maritalStatus, obj.passport,
                        dbApp.formatDate(obj.ImmigrationStartDate), dbApp.formatDate(obj.ImmigrationEndDate), obj.responsibilityforfees
                    ], callback, dbApp.errorHandler);
            }
        );

    } catch (e) {
        console.log(e.message);
        return;
    }
};

dbApp.updateBaseData = function (obj, callback) {
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql('UPDATE ApplicantBaseData SET birthcode = ?, countrycode = ?, residencecode = ?, immigrationcode = ? WHERE ApplicantID = ?;',
                    [obj.birthcode, obj.countrycode, obj.residencecode, obj.immigrationcode, getApplicantId()], callback, dbApp.errorHandler);
            }
        );

    } catch (e) {
        console.log(e.message);
        return;
    }
};

/* Methods for populating drop down menus*/

dbApp.getCountryDataFromDb = function () {
    dbApp.getDataFromDb('SELECT Code, Description FROM Country;', arguments, dbApp.loadDropDown);
};

dbApp.getParishDataFromDb = function () {
    dbApp.getDataFromDb('SELECT Code, Name FROM Parish;', arguments, dbApp.loadDropDown);
};

dbApp.getImmigrationDataFromDb = function () {
    dbApp.getDataFromDb('SELECT Code, Name FROM ImmigrationCode;', arguments, dbApp.loadDropDown);
};

dbApp.getExamBodyDataFromDb = function () {
    dbApp.getDataFromDb('SELECT Code, Description FROM ExamBody;', arguments, dbApp.loadDropDown);
};

dbApp.getLevelDataFromDb = function () {
    dbApp.getDataFromDb('SELECT Code, Name, ExamBody FROM GradeLevel;', arguments, dbApp.loadDropDown);
};

dbApp.getSubjectDataFromDb = function () {
    dbApp.getDataFromDb('SELECT Code, Name, ExamBody FROM Subject;', arguments, dbApp.loadDropDown);
};

dbApp.getExamBodyGradeDataFromDb = function () {
    dbApp.getDataFromDb('SELECT Grade, GradeAlternative, ExamBody FROM ExamBodyGrade;', arguments, dbApp.loadDropDown);
};

dbApp.getSchoolDataFromDb = function () {
    dbApp.getDataFromDb('SELECT Code, Name FROM School;', arguments, dbApp.loadDropDown);
};

dbApp.getHealthDataFromDb = function () {
    dbApp.getDataFromDb('SELECT Code, Description FROM HealthOption;', arguments, dbApp.loadDropDown);
};

dbApp.getHealthDataFromDb = function () {
    dbApp.getDataFromDb('SELECT Code, Description FROM HealthOption;', arguments, dbApp.loadDropDown);
};

dbApp.getLocationDataFromDb = function () {
    dbApp.getDataFromDb('SELECT Code, Name FROM Location;', arguments, dbApp.loadDropDown);
};

dbApp.getStudyDataFromDb = function () {
    dbApp.getDataFromDb('SELECT Code, Name FROM Study;', arguments, dbApp.loadDropDown);
};

dbApp.getProgramDataFromDb = function () {
    dbApp.getDataFromDb('SELECT Code, Name FROM Program;', arguments, dbApp.loadDropDown);
};

dbApp.getApplicantMedFromDb = function (dCallback,eCallback) {
    dbApp.getRowDataFromDb('SELECT * FROM ApplicantMedData;', dCallback, eCallback);
};

dbApp.getApplicantContactFromDb = function (dCallback,eCallback) {
    dbApp.getRowDataFromDb('SELECT * FROM ApplicantBaseData;', dCallback, eCallback);
};

dbApp.getApplicantWorkFromDb = function (dCallback,eCallback) {
    dbApp.getListDataFromDb('SELECT * FROM WorkExp;', dCallback, eCallback);
};

dbApp.getApplicantProgFromDb = function (dCallback,eCallback) {
    dbApp.getListDataFromDb('SELECT * FROM ApplicantProgData;', dCallback, eCallback);
};

dbApp.getApplicantSchoolFromDb = function (dCallback,eCallback) {
    dbApp.getListDataFromDb('SELECT * FROM ApplicantSchoolData;', dCallback, eCallback);
};

dbApp.getApplicantQualFromDb = function (dCallback,eCallback) {
    dbApp.getListDataFromDb('SELECT * FROM ApplicantSubjectData;', dCallback, eCallback);
};

dbApp.getApplicantAddressFromDb = function (dCallback,eCallback) {
    dbApp.getRowDataFromDb('SELECT * FROM ApplicantAddressData;', dCallback, eCallback);
};

dbApp.getApplicantEmergencyInfoFromDb = function (dCallback,eCallback) {
    dbApp.getRowDataFromDb('SELECT * FROM ApplicantEmergencyData;', dCallback, eCallback);
};

dbApp.insertAddressIntoDb = function(callback) {
    var formData = $('form').custSerializer();
    var fields = "saddress,address2,parish,country,address3,dsaddress,daddress2,dparish,dcountry,daddress3,zipcode".split(",");
    //var fields = "saddress,address2,address3,parish,country,dsaddress,daddress2,daddress3,dparish,dcountry,zipcode".split(",");
    var addressInfo = {
        tableName : 'ApplicantAddressData',
        primaryCol : 'ApplicantID',
        appId : getApplicantId(),
        insertSql : 'INSERT INTO ApplicantAddressData (ApplicantID,Address1,Address2,Address3,Address4,Address5, MailAddress1, MailAddress2, MailAddress3, MailAddress4, MailAddress5, MailPostalCode) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
        insertParams : $.merge([getApplicantId()], dbApp.getList(formData,fields)),
        updateSql : 'UPDATE ApplicantAddressData SET Address1 = ?, Address2 = ?, Address3 = ?, Address4 = ?, Address5 = ?, MailAddress1 = ?, MailAddress2 = ?, MailAddress3 = ?, MailAddress4 = ?, MailAddress5 = ?, MailPostalCode = ? WHERE ApplicantID = ?',
        updateParams : $.merge(dbApp.getList(formData,fields), [getApplicantId()]),
        callback : function() {
            dbApp.getRowDataFromDb('SELECT * FROM ApplicantAddressData WHERE ApplicantID = ' + getApplicantId(), function (result) {
                dbApp.addDataToQueue('addressdata', 'PUT', result, callback);
            });
        }
    };

    dbApp.insertDataIntoDb(addressInfo)
};

dbApp.insertMedDataIntoDb = function(callback) {
    var formData = $('select').custSerializer(),
        fields = "condition1,condition2,condition3,condition4".split(","),
        params = dbApp.getList(formData,fields);
    var medInfo = {
        tableName : 'ApplicantMedData',
        primaryCol : 'ApplicantID',
        appId : getApplicantId(),
        insertSql : 'INSERT INTO ApplicantMedData (ApplicantID,disability1,disability2,disability3,disability4) VALUES (?,?,?,?,?)',
        insertParams : $.merge([getApplicantId()], params),
        updateSql : 'UPDATE ApplicantMedData SET disability1 = ?, disability2 = ?, disability3 = ?, disability4 = ? WHERE ApplicantID = ?',
        updateParams : $.merge(params, [getApplicantId()]),
        callback : function() {
            dbApp.addDataToQueue('meddata', 'PUT', formData, callback);
        }
    };

    dbApp.insertDataIntoDb(medInfo);


};

// {"FirstName":"Pete","LastName":"Smith","Telephone":"2460000000","Cell":"2460000000","Work":"2460000000",
// "Email":"ferron@something.com","Sex":"male","Address1":"Lot 54 Daytona","Address2":"Greater Portmore",
// "Address3":"J","Address4":"JM","Address5":"","postalcode":"876"}

dbApp.insertEmergencyDataIntoDb = function(callback) {
    var formData = $('select, input').custSerializer(),
        fields = "firstname,lastname,homeNumber,mobileNumber,workNumber,saddress,address2,parish,country,address3,zipcode".split(","),
        params = dbApp.getList(formData,fields);
    var medInfo = {
        tableName : 'ApplicantEmergencyData',
        primaryCol : 'ApplicantID',
        appId : getApplicantId(),
        insertSql : 'INSERT INTO ApplicantEmergencyData (ApplicantID,FirstName,LastName,Telephone,Cell,Work,Address1,Address2,Address3,Address4,Address5,postalcode) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
        insertParams : $.merge([getApplicantId()], params),
        updateSql : 'UPDATE ApplicantEmergencyData SET FirstName = ?, LastName = ?, Telephone =?, Work = ?, Cell = ?, Address1 = ?, Address2 = ?, Address3 = ?, Address4 = ?, Address5 = ?, postalcode = ? WHERE ApplicantID = ?',
        updateParams : $.merge(params, [getApplicantId()]),
        callback : function() {
            dbApp.getRowDataFromDb('SELECT * FROM ApplicantEmergencyData WHERE ApplicantID = ' + getApplicantId(), function (result) {
                dbApp.addDataToQueue('emergencydetails', 'PUT', result, callback);
            });
        }
    };

    dbApp.insertDataIntoDb(medInfo)
};

// {"ApplicantID":683,"prefix":"Mr","FirstName":"Ferron","LastName":"Smith","MiddleName":"E","natreg":"000-099099",
// "ssn":"","DOB":"2013-03-13","Sex":"male","Telephone":"2460000000","Cell":"2460000000","Work":"2460000000",
// "Email":"ferronrsmith@gmail.com","maritalStatus":"single","passport":"",
// "ImmigrationStartDate":"2013-03-13","ImmigrationEndDate":"2013-03-13","responsibilityforfees":"Self"}
dbApp.insertBasicDataIntoDb = function(callback) {
    var formData = $('form').custSerializer(),
        fields = "immigration,eid,expiryDate,passport,title,firstname,middlename,lastname,bnumer,gender,marital,dob,cob,nation,residency".split(","),
        params = dbApp.getList(formData,fields);
    var medInfo = {
        tableName : 'ApplicantBaseData',
        primaryCol : 'ApplicantID',
        appId : getApplicantId(),
        insertSql : 'INSERT INTO ApplicantBaseData (ApplicantID,immigrationcode,ImmigrationStartDate,ImmigrationEndDate,passport,prefix,FirstName,MiddleName,LastName,natreg,Sex,maritalStatus,DOB,birthcode,countrycode,residencecode) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        insertParams : $.merge([getApplicantId()], params),
        updateSql : 'UPDATE ApplicantBaseData SET immigrationcode = ?, ImmigrationStartDate = ?, ImmigrationEndDate =?, passport = ?, prefix = ?, FirstName = ?, MiddleName = ?, LastName = ?, natreg = ?, Sex = ?, maritalStatus = ?, DOB = ?, birthcode = ?, countrycode = ?, residencecode = ?  WHERE ApplicantID = ?',
        updateParams : $.merge(params, [getApplicantId()]),
        callback : function() {
            dbApp.getRowDataFromDb('SELECT * FROM ApplicantBaseData WHERE ApplicantID = ' + getApplicantId(), function (result) {
                dbApp.addDataToQueue('appbasedata', 'PUT', result, function(){});
                dbApp.addDataToQueue('appldetails', 'PUT', result, callback);
            });
        }
    };

    dbApp.insertDataIntoDb(medInfo)
};

dbApp.insertContactDataIntoDb = function(callback) {
    var formData = $('select, input').custSerializer();
    // handle user selection of 'other' on the storage side
    if(formData && formData['fee'] == 'Other') {
        formData['fee'] = formData['other'];
    }

    var fields = "email,homeNumber,workNumber,mobileNumber,fee".split(","),
        params = dbApp.getList(formData,fields);
    var contactInfo = {
        tableName : 'ApplicantBaseData',
        primaryCol : 'ApplicantID',
        appId : getApplicantId(),
        insertSql : 'INSERT INTO ApplicantBaseData (ApplicantID, Email,Telephone,Cell,Work,responsibilityforfees) VALUES (?,?,?,?,?,?)',
        insertParams : $.merge([getApplicantId()], params),
        updateSql : 'UPDATE ApplicantBaseData SET Email = ?, Telephone = ?, Cell = ?, Work = ?, responsibilityforfees = ? WHERE ApplicantID = ?',
        updateParams : $.merge(params, [getApplicantId()]),
        callback : function() {
            dbApp.getRowDataFromDb('SELECT * FROM ApplicantBaseData WHERE ApplicantID = ' + getApplicantId(), function (result) {
                dbApp.addDataToQueue('appbasedata', 'PUT', result, function(){});
                dbApp.addDataToQueue('appldetails', 'PUT', result, callback);
            });
        }
    };

    dbApp.insertDataIntoDb(contactInfo)
};

dbApp.insertWorkDataIntoDb = function(callback) {
    var formData = $('select,input').custSerializer();

    var fields = "position,employer,fromyear,toyear".split(","),
        seq = dbApp.uuid(),
        params = $.merge([seq],dbApp.getList(formData,fields));
    var contactInfo = {
        tableName : 'WorkExp',
        primaryCol : 'Seq',
        appId : 0,
        insertSql : 'INSERT INTO WorkExp (Seq,PositionHeld,Employer,StartYear,EndYear) VALUES (?,?,?,?,?)',
        insertParams : params,
        callback : function() {
            dbApp.getRowDataFromDb('SELECT * FROM WorkExp WHERE Seq = ' + seq,
                function (result) {
                    dbApp.addDataToQueue('applworkexp', 'POST', result, callback)
            });
        }
    };

    dbApp.insertDataIntoDb(contactInfo)
};

dbApp.insertProgramDataIntoDb = function(callback) {
    var formData = $('select').custSerializer();

    var fields = "programcode,programtype,studyoptions,rank,priority,location".split(","),
        params = dbApp.getList(formData,fields),
        seq = dbApp.uuid().toString();

    params.push(dbApp.getOptTxt('program', formData['programcode']));
    params.push(dbApp.getOptTxt('progtype', formData['programtype']));
    params.push(seq);

    console.log(params);

    var contactInfo = {
        tableName : 'ApplicantProgData',
        primaryCol : 'Seq',
        appId : 0,
        insertSql : 'INSERT INTO ApplicantProgData (code,programtypeCode,fulltime,rank,priority,location,programname,programtypeName,Seq) VALUES (?,?,?,?,?,?,?,?,?)',
        insertParams : params,
        callback : function() {
            dbApp.getRowDataFromDb('SELECT * FROM ApplicantProgData WHERE Seq = ' + seq, function (result) {
                    dbApp.addDataToQueue('applprograms', 'POST', result, callback);
            });
        }
    };

    dbApp.insertDataIntoDb(contactInfo)
};

dbApp.insertSchoolDataIntoDb = function(callback) {
    var formData = $('select,input').custSerializer();

    //{"code":"A1","startyear":2009,"endyear":2012,"lastschool":"","Seq":1,"description":"","degreeobtain":"CERT","degreegradeobtain":"P"}

    var fields = "school,fromyear,toyear,dschool,degree,grade".split(","),
        params = dbApp.getList(formData,fields),
        seq = dbApp.uuid().toString();

    params.push(seq);

    var contactInfo = {
        tableName : 'ApplicantSchoolData',
        primaryCol : 'Seq',
        appId : 0,
        insertSql : 'INSERT INTO ApplicantSchoolData (code,startyear,endyear,description,degreeobtain,degreegradeobtain,Seq) VALUES (?,?,?,?,?,?,?)',
        insertParams : params,
        callback : function() {
            dbApp.getRowDataFromDb('SELECT * FROM ApplicantSchoolData WHERE Seq = ' + seq, function (result) {
                dbApp.addDataToQueue('applschools', 'POST', result, callback);
            });
        }
    };

    dbApp.insertDataIntoDb(contactInfo)
};

dbApp.insertSubjectDataIntoDb = function(callback) {
    var formData = $('select,input').custSerializer();

    //{"EntrySeq":"","Year":2007,"ExamBoby":"CXC","Grade":"I","SubjectCode":"SPAN.CXC","Description":"","Level":"GEN"}

    formData['subject'] = removeExamBodyFromString(formData['subject']);
    formData['grade'] = removeExamBodyFromString(formData['grade']);
    formData['level'] = removeExamBodyFromString(formData['level']);

    console.log(formData);

    var fields = "year,exambody,grade,subject,level".split(","),
        params = dbApp.getList(formData,fields),
        seq = dbApp.uuid().toString();

    params.push(seq);

    var contactInfo = {
        tableName : 'ApplicantSubjectData',
        primaryCol : 'EntrySeq',
        appId : 0,
        insertSql : 'INSERT INTO ApplicantSubjectData (Year,ExamBoby,Grade,SubjectCode,Level,EntrySeq) VALUES (?,?,?,?,?,?)',
        insertParams : params,
        callback : function() {
            dbApp.getRowDataFromDb('SELECT * FROM ApplicantSubjectData WHERE EntrySeq = ' + seq, function (result) {
                dbApp.addDataToQueue('applsubjects', 'POST', result, callback);
            });
        }
    };

    dbApp.insertDataIntoDb(contactInfo)
};

dbApp.getOptTxt = function (id, code) {
    return $('#'+id).find('option[value="' + code +'"]').text()
};

dbApp.uuid = function () {
    return Math.floor(Math.random() * 992998282);
};

dbApp.deleteWorkDataFromDb = function(id, callback) {
    var workData = {
        table : 'WorkExp',
        primaryCol : 'Seq',
        primaryVal : id,
        callback : function() {
            dbApp.addDataToQueue('applworkexp', 'DELETE', {Seq:id}, callback);
        }
    };
    dbApp.deleteFromDb(workData);
};

dbApp.deleteProgDataFromDb = function(id, callback) {
    var progData = {
        table : 'ApplicantProgData',
        primaryCol : 'Seq',
        primaryVal : id,
        callback : function() {
            dbApp.addDataToQueue('applprograms', 'DELETE', {Seq:id}, callback);
        }
    };
    dbApp.deleteFromDb(progData);
};

dbApp.deleteQualDataFromDb = function(id, callback) {
    var qualData = {
        table : 'ApplicantSubjectData',
        primaryCol : 'EntrySeq',
        primaryVal : id,
        callback : function() {
            dbApp.addDataToQueue('applsubjects', 'DELETE', {EntrySeq:id}, callback);
        }
    };
    dbApp.deleteFromDb(qualData);
};

dbApp.deleteSchoolDataFromDb = function(id, callback) {
    var schoolData = {
        table : 'ApplicantSchoolData',
        primaryCol : 'Seq',
        primaryVal : id,
        callback : function() {
            dbApp.addDataToQueue('applschool', 'DELETE', {Seq:id}, callback);
        }
    };
    dbApp.deleteFromDb(schoolData);
};

//dbApp.insertBaseDataIntoDb = function() {
//
//    //{"ApplicantID":683,"prefix":"Mr","FirstName":"Ferron","LastName":"Smith","MiddleName":"E","natreg":"000-099099","ssn":"","DOB":"2013-03-13","Sex":"male","Telephone":"2460000000","Cell":"2460000000","Work":"2460000000","Email":"ferronrsmith@gmail.com","maritalStatus":"single","passport":"",
//    // "ImmigrationStartDate":"2013-03-13","ImmigrationEndDate":"2013-03-13","responsibilityforfees":"Self"}
//
//    var formData = $('form').custSerializer();
//    var fields = "saddress,address2,address3,parish,country,dsaddress,daddress2,daddress3,dparish,dcountry,zipcode".split(",");
//    var addressInfo = {
//        tableName : 'ApplicantAddressData',
//        primaryCol : 'ApplicantID',
//        appId : getApplicantId(),
//        insertSql : 'INSERT INTO ApplicantAddressData (ApplicantID,Address1,Address2,Address3,Address4,Address5, MailAddress1, MailAddress2, MailAddress3, MailAddress4, MailAddress5, MailPostalCode) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
//        insertParams : $.merge([getApplicantId()], dbApp.getList(formData,fields)),
//        updateSql : 'UPDATE ApplicantAddressData SET Address1 = ?, Address2 = ?, Address3 = ?, Address4 = ?, Address5 = ?, MailAddress1 = ?, MailAddress2 = ?, MailAddress3 = ?, MailAddress4 = ?, MailAddress5 = ?, MailPostalCode = ? WHERE ApplicantID = ?',
//        updateParams : $.merge(dbApp.getList(formData,fields), [getApplicantId()]),
//        callback : callback
//    };
//
//    dbApp.insertDataIntoDb(addressInfo)
//
//};

dbApp.getList = function(obj, elems) {
    var result = [];
    var callback = function(i, elm) {
        result.push(dbApp.get(obj, elm));
    };

    if($.isArray(elems)) {
        $.each(elems, callback);
    } else {
        $.each(elems.split(','), callback);
    }
    return result;
};

dbApp.get = function(obj, elem) {
    var res = obj[elem];
    return (res === undefined || res === '' || res === 'default') ? '' : res;
};

/* Generic method for populating from down */
dbApp.loadDropDown = function(args, results)  {
    var len = results.rows.length, rec, i = 0, fragment = document.createDocumentFragment(), res = [];
    if(len > 0) {
        for(i = 0; i < len ; i++) {
            rec = results.rows.item(i);
            var opt = document.createElement("option");
            for(var item in rec) {
                res.push(rec[item]);
            }

            opt.value = res[0];
            opt.innerText = res[1];

            if(res.length == 3)
                opt.value = res[0] + "." + res[2];

            // reset array
            res = [];
            fragment.appendChild(opt);
        }

        for(var field in args) {
            var select = document.getElementById(args[field]);
            select.appendChild(fragment.cloneNode(true));
        }
    }
};

dbApp.getRowDataFromDb = function (sql, dCallback,eCallback) {
    dbApp.getDataFromDb(sql,
        null, function(args, results) {
            if(results.rows.length > 0) {
                dCallback(results.rows.item(0));
            } else {
                console.log('no data found');
                eCallback();
            }
        });
};

dbApp.getListDataFromDb = function (sql, dCallback,eCallback) {
    dbApp.getDataFromDb(sql,
        null, function(args, results) {
            if(results.rows.length > 0) {
                dCallback(results.rows);
            } else {
                console.log('no data found');
                eCallback();
            }
        });
};

/** Retrieve data from Server **/
dbApp.getDataFromDb = function (sql, args, callback) {
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql(sql,
                    [], function(transaction, results) {
                        callback(args, results);
                    }, dbApp.errorHandler);
            }
        );

    } catch (e) {
        console.log(e.message);
        return;
    }
};

/***
 * Function deletes all rows in a specified table
 * @param opt
 * @param callback
 */
dbApp.deleteFromDb = function(opt){
    var sqlInstruction = 'DELETE FROM ' + opt['table'] +' WHERE ' + opt['primaryCol'] + ' = ' + opt['primaryVal'] + ';';
    dbApp.mydb.transaction(
        function (transaction) {
            transaction.executeSql (sqlInstruction, [], opt.callback(), dbApp.errorHandler);
        });
    console.log("Cleaning " + opt['table']);
};

dbApp.insertDataIntoDb = function (opt) {
    var sql = "SELECT * FROM " + opt['tableName'] + " WHERE " + opt['primaryCol'] + " = " + opt['appId'] + ";";
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql(sql, [],
                    function (transaction, results) {
                        console.log(results);
                        if (results.rows.length === 0) {
                            transaction.executeSql(opt['insertSql'], opt['insertParams'], function(transaction, result) {
                                console.log()
                               opt.callback();
                            }, dbApp.errorHandler);
                        } else {
                            transaction.executeSql(opt['updateSql'], opt['updateParams'], function(transaction, result) {
                                opt.callback();
                            }, dbApp.errorHandler);
                        }
                    }, dbApp.errorHandler);
            }
        );

    } catch (e) {
        console.log(e.message);
        return;
    }
};

dbApp.getWorkData = function () {
    getApplicantDataFromServer(function(data){
        console.log(data);
        dbApp.cleanTable(TABLE.WORK, function () {
            var workplaces = data.result["workplaces"],
                len = workplaces.length, i = 0;
            for(i = 0; i < len; i++) {
                dbApp.populateWorkExpTb(workplaces[i], function () {
                    console.log('*** finish syncing work experience data ***');
                })
            }

        });
    }, ENDPOINT.WORK);
};

dbApp.getProgData = function () {
    getApplicantDataFromServer(function(data){
        console.log(data);
        dbApp.cleanTable(TABLE.PROG, function () {
            var programs = data.result["applicantprograms"],
                len = programs.length, i = 0;
            for(i = 0; i < len; i++) {
                dbApp.populateProgTb(programs[i], function () {
                    console.log('*** finish syncing program data ***');
                })
            }

        });
    }, ENDPOINT.PROG);
};

dbApp.getSubjData = function () {
    getApplicantDataFromServer(function(data){
        console.log(data);
        dbApp.cleanTable(TABLE.SUBJ, function () {
            var subjects = data.result["applicantsubjects"],
                len = subjects.length, i = 0;
            for(i = 0; i < len; i++) {
                dbApp.populateSubjTb(subjects[i], function () {
                    console.log('*** finish syncing subject data ***');
                })
            }
        });
    }, ENDPOINT.SUBJ);
};

dbApp.getSchlData = function () {
    getApplicantDataFromServer(function(data){
        console.log(data);
        dbApp.cleanTable(TABLE.SCHL, function () {
            var schools = data.result["applicantschools"],
                len = schools.length, i = 0;
            for(i = 0; i < len; i++) {
                dbApp.populateSchljTb(schools[i], function () {
                    console.log('*** finish syncing school data ***');
                })
            }
        });
    }, ENDPOINT.SCHL);
};

dbApp.getAddrData = function () {
    getApplicantDataFromServer(function(data){
        console.log(data);
        dbApp.cleanTable(TABLE.ADDR, function () {
            dbApp.populateAddrTb(data.result, function () {
                console.log('*** finish syncing address data ***');
            })
        });
    }, ENDPOINT.ADDR);
};

dbApp.getEmergData = function () {
    getApplicantDataFromServer(function(data){
        console.log(data);
        dbApp.cleanTable(TABLE.EMERGENCY, function () {
            dbApp.populateEmgTb(data.result, function () {
                console.log('*** finish syncing emergency data ***');
            })
        });
    }, ENDPOINT.EMERGENCY);
};

dbApp.getMedicalData = function () {
    getApplicantDataFromServer(function(data){
        console.log(data);
        dbApp.cleanTable(TABLE.MED, function () {
            dbApp.populateMedTb(data.result, function () {
                console.log('*** finish syncing medical data ***');
            })
        });
    }, ENDPOINT.MED);
};

dbApp.getBaseData = function () {
    getApplicantDataFromServer(function(data){
        console.log(data);
        dbApp.cleanTable(TABLE.BASE, function () {
            dbApp.populateBaseTb(data.result, function () {
                getApplicantDataFromServer(function(data) {
                    dbApp.updateBaseData(data.result, function() {
                        console.log('*** finish syncing base data ***');
                    })
                }, ENDPOINT.DETAILS)
            })
        });
    }, ENDPOINT.BASE);
};

/***************** App initialization portion **********************/

dbApp.sync = function () {
    console.log('*** syncing work experience data ***');
    dbApp.getWorkData();
    console.log('*** syncing work program data ***');
    dbApp.getProgData();
    console.log('*** syncing work subject data ***');
    dbApp.getSubjData();
    console.log('*** syncing work school data ***');
    dbApp.getSchlData();
    console.log('*** syncing work address data ***');
    dbApp.getAddrData();
    console.log('*** syncing work emergency data ***');
    dbApp.getEmergData();
    console.log('*** syncing work medical data ***');
    dbApp.getMedicalData();
    console.log('*** syncing work base data ***');
    dbApp.getBaseData();
};

dbApp.initDBTables = function () {
    dbApp.aSyncCountryTb();
    console.log("** Loading country data **");
    dbApp.aSyncProgramTb();
    console.log("** Loading program data **");
    dbApp.aSyncSubjectTb();
    console.log("** Loading subject data **");
    dbApp.aSyncExamBodyTb();
    console.log("** Loading exam body data **");
    dbApp.aSyncExamBodyGradesTb();
    console.log("** Loading exam body grades data **");
    dbApp.aSyncHeathTb();
    console.log("** Loading health data **");
    dbApp.aSyncImmigrationTb();
    console.log("** Loading immigration data **");
    dbApp.aSyncLevelTb();
    console.log("** Loading grade level data **");
    dbApp.aSyncLocationTb();
    console.log("** Loading location data **");
    dbApp.aSyncParishTb();
    console.log("** Loading parish data **");
    //dbApp.aSyncProgramTypeTb();
    //console.log("** Loading program type data **");
    dbApp.aSyncStudyTb();
    console.log("** Loading study data **");
    dbApp.aSyncSchoolTb();
    console.log("** Loading school data **");
};

/** the following function deletes all record within user specific tables **/
dbApp.clearDBTables = function () {
    //list of tables to be cleaned
    //dbApp.cleanTable('Chat');
    //dbApp.cleanTable('UserGroup');
    // cleanTable('Queue'); /** Review security issue of this */
};

dbApp.setup = function ()  {
    dbApp.initDB();
    dbApp.createTables();
    dbApp.initDBTables();
};

dbApp.teardown = function () {
   dbApp.clearDBTables();
};

dbApp.formatDate = function(date) {
    if(date === null || date === undefined || date === "" || date.trim() === "")
        return "";
    var output = new XDate(date).toString('yyyy-MM-dd');
    return (output !== "Invalid Date") ? output : "";
};

/*
dbApp.populateCountryTb = function (senderId, groupId, recieverId, message) {
    try {
        dbApp.mydb.transaction(
            function (transaction) {
                transaction.executeSql('INSERT INTO Chat (UID, GID, RID, MESSAGE) VALUES(?,?,?,?);',
                    [senderId, groupId, recieverId, message], function () {
                        dbApp.saveToQueue('ChatLog', {
                            senderId: senderId,
                            groupId: groupId,
                            recieverId: recieverId,
                            message: message
                        });
                    }, dbApp.errorHandler);
            }
        );

    } catch (e) {
        console.log(e.message);
        return;
    }

    try {
        clearTimeout(dbApp.oQueueTimer);
    } catch (err) {
    }	// if there was another timer waiting to start the queue, erase it and only consider this one (to make the batch bigger)
    dbApp.oQueueTimer = setTimeout(dbApp.startQueueProcessing, dbApp.delay);

};
*/