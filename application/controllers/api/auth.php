<?php defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require(APPPATH.'libraries/REST_Controller.php');

class Auth extends REST_Controller {
    function __construct() {
        parent::__construct();

        $this->load->driver('cache');
        $this->load->helper('wsdl_helper');
    }


    function accountexist_get() {
        // ensure that username is encoded before sending to this method
        $username = $this->get('username');
        if($username) {
            $operation = 'doesUserAccountExists';
            $namespace = 'IAuthentication';
            $params = array(
                'licence' => AKI_LICENSE,
                'username' => $username
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'username missing from request'), 400);
        }
    }

    function userexist_get() {
        // ensure that username is encoded before sending to this method
        $username = $this->get('username');
        $institution = $this->get('institution');
        if($username && $institution) {
            $operation = 'doesUserExists';
            $namespace = 'IAuthentication';
            $params = array(
                'licence' => AKI_LICENSE,
                'username' => $username,
                'institution' => $institution
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'username/institution missing from request'), 400);
        }
    }

    function user_post() {
        // ensure that username is encoded before sending to this method
        $username = $this->post('username');
        $password = $this->post('password');
        $institution = $this->post('institution');
        if($username && $password && $institution) {
            $operation = 'createUser';
            $namespace = 'IAuthentication';
            $params = array(
                'licence' => AKI_LICENSE,
                'username' => $username,
                'password' => $password,
                'email' => $username,
                'usertype' => AKI_USERTYPE,
                'institution' => $institution
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'username/institution missing from request'), 400);
        }
    }

    function token_get() {
        // ensure that username is encoded before sending to this method
        $username = $this->get('username');
        $password = $this->get('password');
        $institution = $this->get('institution');
        if($username && $password && $institution) {
            $operation = 'authenticateUser';
            $namespace = 'IAuthentication';
            $params = array(
                'licence' => AKI_LICENSE,
                'username' => $username,
                'password' => $password,
                'usertype' => AKI_USERTYPE,
                'institution' => $institution
            );
            $this->response(soap_call($operation, $params, $namespace));
        } else {
            $this->response(array('success' => false, 'error' => 'username/password/institution missing from request'), 400);
        }
    }
}