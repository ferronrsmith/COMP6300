<?php
/**
 * User: ferron
 * Date: 2/25/13
 * Time: 11:09 PM
 */


/**
 * @param $operation - soap function name
 * @param $arguments - input parameter for soap request
 * @param $namespace - method namespace
 * @param $cache - caching mechanism
 * @param string $endpoint - location of namespace
 * @param int $ttl - Time To Live i.e Time to cache object in memory for default 30 days
 * @return Exception|SoapFault
 */
function soap_cache_call ($operation, $arguments, $namespace, $cache, $endpoint='', $ttl=2592000/*$ttl=86400*/) {
    $default = 'http://64.28.139.185/AkiAppsServices/wsdl/';
    $endpoint = ($endpoint == '') ? $default : $endpoint;
    $sclient = new SoapClient($endpoint . $namespace);
    if($cache->is_supported()) {
        if(!$result = $cache->get($operation)) {
            try {
                $result = $sclient->__soapCall($operation, $arguments);
                $cache->save($operation, $result, $ttl);
            } catch (SoapFault $fault) {
                $result = $fault;
            }
        }
    } else {
        try {
            $result = $sclient->__soapCall($operation, $arguments);
        } catch (SoapFault $fault) {
            $result = $fault;
        }
    }
    return $result;
}

/**
 * @param $operation - soap function name
 * @param $arguments - input parameter for soap request
 * @param $namespace - method namespace
 * @param string $endpoint - location of namespace
 * @param bool $raw - boolean to determine whether to wrap in success array
 * @return array|Exception|SoapFault
 */
function soap_call ($operation, $arguments, $namespace, $endpoint='', $raw = False) {
    $default = 'http://64.28.139.185/AkiAppsServices/wsdl/';
    $success = True;
    $endpoint = ($endpoint == '') ? $default : $endpoint;
    $sclient = new SoapClient($endpoint . $namespace);
    try {
        $result = $sclient->__soapCall($operation, $arguments);
    } catch (SoapFault $fault) {
        $result = $fault;
        $success = False;
    }
    if(!$raw) {
       return array('success'=> $success, 'result' => $result);
    } else {
        return $result;
    }
}