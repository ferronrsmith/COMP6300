<?php
/**
 * Created by JetBrains PhpStorm.
 * User: ferron
 * Date: 2/20/13
 * Time: 12:58 PM
 * To change this template use File | Settings | File Templates.
 */

/***
 * @param $cache
 * @param $params
 * @param int $ttl
 * @return array|string
 */
function get_soap_cache($cache, $params, $ttl = 86400) {
    $result = True;
    $key = $params['operations'];
    if($cache->is_supported()) {
        if($result = $cache->get($key)) {
            $result = call_soap_function('nusoap_client',
                $params['namespace'],
                $key,
                $params['params'],
                isset($params['raw']) ? $params['raw'] : False
            );
            if(!isset($result["faultactor"]) && !isset($result["faultstring"])) {
                $cache->save($key, $result, $ttl);
            }
            // program as errors. do not cache response with faultfactor & faultstring
        }
    } else {
        $result = call_soap_function('nusoap_client',
            $params['namespace'],
            $key,
            $params['params'],
            isset($params['raw']) ? $params['raw'] : False
        );
    }
    return $result;
}