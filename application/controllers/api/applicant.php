<?php defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require(APPPATH.'libraries/REST_Controller.php');

class Applicant extends REST_Controller {
    function __construct() {
        parent::__construct();

        $this->load->driver('cache');
        $this->load->helper('wsdl_helper');
    }

    /*** GET METHODS FOR SOAP SERVICE   ***/

    //http://localhost/sample_app_1/api/profile/appid/token/339382/username/ferronrsmith%40gmail.com/institution/BCC
    function appid_get() {
        // ensure that username is encoded before sending to this method
        $token = $this->get('token');
        $username = $this->get('username');
        $institution = $this->get('institution');
        if($token && $username && $institution) {
            $operation = 'getApplicationID';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'username' => $username,
                'institution' => $institution
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/username/institution missing from request'), 400);
        }
    }

    // base data

    function appbasedata_get() {
        // ensure that username is encoded before sending to this method
        $token = $this->get('token');
        $appId = $this->get('appId');
        if($token && $appId) {
            $operation = 'getApplicantBaseData';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationID' => $appId,
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }

    // male : 1
    // female : 2
    function appbasedata_put() {
        // ensure that username is encoded before sending to this method
        $token = $this->put('token');
        $appId = $this->put('appId');
        $data = $this->put('data');
        if($token && $appId) {
            $operation = 'updateApplicantBaseData';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationid' => $appId,
                'info' => json_decode($data)
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }

    // address data

    function addressdata_get() {
        // ensure that username is encoded before sending to this method
        $token = $this->get('token');
        $appId = $this->get('appId');
        if($token && $appId) {
            $operation = 'getApplicantAddressData';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationID' => $appId,
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }

    function addressdata_put() {
        // ensure that username is encoded before sending to this method
        $token = $this->put('token');
        $appId = $this->put('appId');
        $data = $this->put('data');
        if($token && $appId) {
            $operation = 'updateApplicantAddressData';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationid' => $appId,
                'info' => json_decode($data)
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }

    // application data

    function appdata_get() {
        // ensure that username is encoded before sending to this method
        $token = $this->get('token');
        $appId = $this->get('appId');
        if($token && $appId) {
            $operation = 'getApplicationDetails';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationID' => $appId,
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }

    /**
     * @deprecated this method should not be used
     */
    function appdata_put() {
        // ensure that username is encoded before sending to this method
        $token = $this->put('token');
        $appId = $this->put('appId');
        $data = $this->put('data');
        if($token && $appId) {
            $operation = 'updateApplicationDetails';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationid' => $appId,
                'info' => json_decode($data)
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }

    // applicant details

    function appldetails_get() {
        // ensure that username is encoded before sending to this method
        $token = $this->get('token');
        $appId = $this->get('appId');
        if($token && $appId) {
            $operation = 'getApplicantDetails';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationID' => $appId,
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }

    function appldetails_put() {
        // ensure that username is encoded before sending to this method
        $token = $this->put('token');
        $appId = $this->put('appId');
        $data = $this->put('data');
        if($token && $appId) {
            $operation = 'updateApplicantDetails';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationid' => $appId,
                'info' => json_decode($data)
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }

    // emergency details

    function emergencydetails_get() {
        // ensure that username is encoded before sending to this method
        $token = $this->get('token');
        $appId = $this->get('appId');
        if($token && $appId) {
            $operation = 'getApplicantEmergencyData';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationID' => $appId,
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }

    function emergencydetails_put() {
        // ensure that username is encoded before sending to this method
        $token = $this->put('token');
        $appId = $this->put('appId');
        $data = $this->put('data');
        if($token && $appId) {
            $operation = 'updateApplicantEmergencyData';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationid' => $appId,
                'info' => json_decode($data)
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }

    // medical data

    function meddata_get() {
        // ensure that username is encoded before sending to this method
        $token = $this->get('token');
        $appId = $this->get('appId');
        if($token && $appId) {
            $operation = 'getApplicantMedData';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationID' => $appId,
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }

    function meddata_put() {
        // ensure that username is encoded before sending to this method
        $token = $this->put('token');
        $appId = $this->put('appId');
        $data = $this->put('data');
        if($token && $appId) {
            $operation = 'updateApplicantMedData';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationid' => $appId,
                'info' => json_decode($data)
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }


    // subject related

    function applsubjects_get() {
        // ensure that username is encoded before sending to this method
        $token = $this->get('token');
        $appId = $this->get('appId');
        if($token && $appId) {
            $operation = 'getApplicantSubjects';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationid' => $appId,
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }

    function applsubjects_post() {
        // ensure that username is encoded before sending to this method
        $token = $this->post('token');
        $appId = $this->post('appId');
        $data = $this->post('data');
        if($token && $appId) {
            $operation = 'AddApplicantSubject';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationid' => $appId,
                'Data' => json_decode($data) /*array(
                    'Seq' => '2',
                    'Name' => 'Something',
                    'StartYear' => '2010',
                    'EndYear' => '2012',
                    'Employer' => 'Medu',
                    'PositionHeld' => 'Dev'
                ) */
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }

    function applsubjects_delete() {
        // ensure that username is encoded before sending to this method
        $token = $this->delete('token');
        $appId = $this->delete('appId');
        $data = $this->delete('data');
        if($token && $appId) {
            $operation = 'DropApplicantSubject';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationid' => $appId,
                'Data' => json_decode($data)
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }

    function dropallsubjects_delete() {
        // ensure that username is encoded before sending to this method
        $token = $this->delete('token');
        $appId = $this->delete('appId');
        if($token && $appId) {
            $operation = 'DropSubjects';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationid' => $appId,
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }


    // work experience related

    function applworkexp_get() {
        // ensure that username is encoded before sending to this method
        $token = $this->get('token');
        $appId = $this->get('appId');
        if($token && $appId) {
            $operation = 'getApplicantWorkExperiences';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationid' => $appId,
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }

    function applworkexp_post() {
        // ensure that username is encoded before sending to this method
        $token = $this->post('token');
        $appId = $this->post('appId');
        $data = $this->post('data');
        if($token && $appId) {
            $operation = 'AddWorkExperience';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationid' => $appId,
                'Data' => json_decode($data) /*array(
                    'Seq' => '2',
                    'Name' => 'Something',
                    'StartYear' => '2010',
                    'EndYear' => '2012',
                    'Employer' => 'Medu',
                    'PositionHeld' => 'Dev'
                ) */
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }

    function applworkexp_delete() {
        // ensure that username is encoded before sending to this method
        $token = $this->delete('token');
        $appId = $this->delete('appId');
        $data = $this->delete('data');
        if($token && $appId) {
            $operation = 'DropWorkExperience';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationid' => $appId,
                'Data' => json_decode($data)
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }

    function dropallworkexp_delete() {
        // ensure that username is encoded before sending to this method
        $token = $this->delete('token');
        $appId = $this->delete('appId');
        if($token && $appId) {
            $operation = 'DropAllWorkExperiences';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationid' => $appId,
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }


    // school related

    function applschools_get() {
        // ensure that username is encoded before sending to this method
        $token = $this->get('token');
        $appId = $this->get('appId');
        if($token && $appId) {
            $operation = 'getApplicantSchools';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationid' => $appId,
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }

    function applschools_post() {
        // ensure that username is encoded before sending to this method
        $token = $this->post('token');
        $appId = $this->post('appId');
        $data = $this->post('data');
        if($token && $appId) {
            $operation = 'AddSchool';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationid' => $appId,
                'Data' => json_decode($data)
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }

    function applschools_delete() {
        // ensure that username is encoded before sending to this method
        $token = $this->delete('token');
        $appId = $this->delete('appId');
        $data = $this->delete('data');
        if($token && $appId) {
            $operation = 'DropSchool';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationid' => $appId,
                'Data' => json_decode($data)
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }

    function dropallschools_delete() {
        // ensure that username is encoded before sending to this method
        $token = $this->delete('token');
        $appId = $this->delete('appId');
        if($token && $appId) {
            $operation = 'DropAllSchools';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationid' => $appId
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }


    // programs related

    function applprograms_get() {
        // ensure that username is encoded before sending to this method
        $token = $this->get('token');
        $appId = $this->get('appId');
        if($token && $appId) {
            $operation = 'getApplicantPrograms';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationid' => $appId,
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }

    function applprograms_post() {
        // ensure that username is encoded before sending to this method
        $token = $this->post('token');
        $appId = $this->post('appId');
        $data = $this->post('data');
        if($token && $appId) {
            $operation = 'AddProgram';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationid' => $appId,
                'Data' => json_decode($data)
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }

    function applprograms_delete() {
        // ensure that username is encoded before sending to this method
        $token = $this->delete('token');
        $appId = $this->delete('appId');
        $data = $this->delete('data');
        if($token && $appId) {
            $operation = 'DropProgram';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationid' => $appId,
                'Data' => json_decode($data)
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }

    function dropallprograms_delete() {
        // ensure that username is encoded before sending to this method
        $token = $this->delete('token');
        $appId = $this->delete('appId');
        if($token && $appId) {
            $operation = 'DropAllPrograms';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationid' => $appId
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }


    // validation related methods

    function validatebasedata_post() {
        // ensure that username is encoded before sending to this method
        $token = $this->get('token');
        $appId = $this->get('appId');
        $data = $this->get('data');
        if($token && $appId) {
            $operation = 'validateBaseData';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationID' => $appId,
                'student' => json_decode($data)
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }

    function validateaddrdata_post() {
        // ensure that username is encoded before sending to this method
        $token = $this->get('token');
        $appId = $this->get('appId');
        $data = $this->get('data');
        if($token && $appId) {
            $operation = 'validateAddressData';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationID' => $appId,
                'student' => json_decode($data)
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }

    function validatekindata_post() {
        // ensure that username is encoded before sending to this method
        $token = $this->get('token');
        $appId = $this->get('appId');
        $data = $this->get('data');
        if($token && $appId) {
            $operation = 'validateKinData';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationID' => $appId,
                'student' => json_decode($data)
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }

    function validateappldata_post() {
        // ensure that username is encoded before sending to this method
        $token = $this->get('token');
        $appId = $this->get('appId');
        $data = $this->get('data');
        if($token && $appId) {
            $operation = 'validateApplicantDetailsData';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationID' => $appId,
                'student' => json_decode($data)
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }

    function validateappdata_post() {
        // ensure that username is encoded before sending to this method
        $token = $this->post('token');
        $appId = $this->post('appId');
        $data = $this->post('data');
        if($token && $appId) {
            $operation = 'validateAppData';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationID' => $appId,
                'student' => json_decode($data)
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }

    function validatedata_get() {
        // ensure that username is encoded before sending to this method
        $token = $this->get('token');
        $appId = $this->get('appId');
        if($token && $appId) {
            $operation = 'validateAllData';
            $namespace = 'IApplication';
            $params = array(
                'token' => $token,
                'applicationID' => $appId,
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'token/appId missing from request'), 400);
        }
    }

}