<?php defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require(APPPATH . 'libraries/REST_Controller.php');

class Utils extends REST_Controller
{
    function __construct()
    {
        parent::__construct();

        $this->load->driver('cache');
        $this->load->helper('wsdl_helper');
    }

    function countries_get()
    {
        $token = $this->get('token');
        if ($token) {
            $operation = 'getCountries';
            $namespace = 'IConfiguration';
            $params = array(
                'token' => $token,
            );
            $result = soap_cache_call($operation, $params, $namespace, $this->cache->apc);
            $this->response($result);
        } else {
            $this->response(array('success' => false, 'error' => 'user token missing from request'), 400);
        }
    }

    function parishes_get()
    {
        $token = $this->get('token');
        if ($token) {
            $operation = 'getParishes';
            $namespace = 'IConfiguration';
            $params = array(
                'token' => $token,
            );
            $result = soap_cache_call($operation, $params, $namespace, $this->cache->apc);
            $this->response($result);
        } else {
            $this->response(array('success' => false, 'error' => 'user token missing from request'), 400);
        }
    }

    function immigrationcodes_get()
    {
        $token = $this->get('token');
        if ($token) {
            $operation = 'getImmigrationCodes';
            $namespace = 'IConfiguration';
            $params = array(
                'token' => $token,
            );
            $result = soap_cache_call($operation, $params, $namespace, $this->cache->apc);
            $this->response($result);
        } else {
            $this->response(array('success' => false, 'error' => 'user token missing from request'), 400);
        }
    }

    function schools_get()
    {
        $token = $this->get('token');
        if ($token) {
            $operation = 'getSchools';
            $namespace = 'IConfiguration';
            $params = array(
                'token' => $token,
            );
            $result = soap_cache_call($operation, $params, $namespace, $this->cache->apc);
            $this->response($result);
        } else {
            $this->response(array('success' => false, 'error' => 'user token missing from request'), 400);
        }
    }

    function exambodies_get()
    {
        $token = $this->get('token');
        if ($token) {
            $operation = 'getExamBodies';
            $namespace = 'IConfiguration';
            $params = array(
                'token' => $token,
            );
            $result = soap_cache_call($operation, $params, $namespace, $this->cache->apc);
            $this->response($result);
        } else {
            $this->response(array('success' => false, 'error' => 'user token missing from request'), 400);
        }
    }

    function subjects_get()
    {
        $token = $this->get('token');
        if ($token) {
            $operation = 'getSubjects';
            $namespace = 'IConfiguration';
            $params = array(
                'token' => $token,
            );
            $result = soap_cache_call($operation, $params, $namespace, $this->cache->apc);
            $this->response($result);
        } else {
            $this->response(array('success' => false, 'error' => 'user token missing from request'), 400);
        }
    }

    function programs_get()
    {
        $token = $this->get('token');
        $institution = $this->get('institution');
        if ($token && $institution) {
            $operation = 'getPrograms';
            $namespace = 'IConfiguration';
            $params = array(
                'token' => $token,
                'institution' => $institution
            );
            $result = soap_cache_call($operation, $params, $namespace, $this->cache->apc);
            $this->response($result);
        } else {
            $this->response(array('success' => false, 'error' => 'token/institution missing from request'), 400);
        }
    }

    function programtypes_get()
    {
        $token = $this->get('token');
        $institution = $this->get('institution');
        if ($token && $institution) {
            $operation = 'getProgramTypes';
            $namespace = 'IConfiguration';
            $params = array(
                'token' => $token,
                'institution' => $institution
            );
            $result = soap_cache_call($operation, $params, $namespace, $this->cache->apc);
            $this->response($result);
        } else {
            $this->response(array('success' => false, 'error' => 'token/institution missing from request'), 400);
        }
    }

    function levels_get()
    {
        $token = $this->get('token');
        if ($token) {
            $operation = 'getLevels';
            $namespace = 'IConfiguration';
            $params = array(
                'token' => $token
            );
            $result = soap_cache_call($operation, $params, $namespace, $this->cache->apc);
            $this->response($result);
        } else {
            $this->response(array('success' => false, 'error' => 'user token missing from request'), 400);
        }
    }

    function locations_get()
    {
        $token = $this->get('token');
        $institution = $this->get('institution');
        if ($token && $institution) {
            $operation = 'getLocations';
            $namespace = 'IConfiguration';
            $params = array(
                'token' => $token,
                'institution' => $institution
            );
            $result = soap_cache_call($operation, $params, $namespace, $this->cache->apc);
            $this->response($result);
        } else {
            $this->response(array('success' => false, 'error' => 'token/institution missing from request'), 400);
        }
    }

    function studyopts_get()
    {
        $token = $this->get('token');
        $institution = $this->get('institution');
        if ($token && $institution) {
            $operation = 'getStudyOptions';
            $namespace = 'IConfiguration';
            $params = array(
                'token' => $token,
                'institution' => $institution
            );
            $result = soap_cache_call($operation, $params, $namespace, $this->cache->apc);
            $this->response($result);
        } else {
            $this->response(array('success' => false, 'error' => 'token/institution missing from request'), 400);
        }
    }


    function healthopts_get()
    {
        $token = $this->get('token');
        if ($token) {
            $operation = 'getHealthOptions';
            $namespace = 'IConfiguration';
            $params = array(
                'token' => $token
            );
            $result = soap_cache_call($operation, $params, $namespace, $this->cache->apc);
            $this->response($result);
        } else {
            $this->response(array('success' => false, 'error' => 'user token missing from request'), 400);
        }
    }

    function exambodygrades_get()
    {
        $token = $this->get('token');
        if ($token) {
            $operation = 'getExamBodyGrades';
            $namespace = 'IConfiguration';
            $params = array(
                'token' => $token
            );
            $result = soap_cache_call($operation, $params, $namespace, $this->cache->apc);
            $this->response($result);
        } else {
            $this->response(array('success' => false, 'error' => 'user token missing from request'), 400);
        }
    }

}