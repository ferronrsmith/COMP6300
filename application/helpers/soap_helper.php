<?php
/**
 *  User: ferron
 * Date: 2/19/13
 * Time: 11:06 PM
 */

/**
 * Following helper function abstracts soap related requests to a simple function
 * @param $client - nusoap client object
 * @param $namespace - method namespace
 * @param string $operation - name of soap method
 * @param array $params - input parameter for soap request
 * @param bool $raw - (optional) param to determine whether to return the raw soap output or an array object
 * @param string $endpoint- (optional) endpoint url - location of the SOAP web service
 * @return array|string
 */
function call_soap_function($client, $namespace, $operation, $params = array(), $raw = False, $endpoint='') {
    $success = True;
    $row = ''; //result set
    $text = ''; // error logs
    $default = 'http://64.28.139.185/AkiAppsServices/soap';

    $endpoint = ($endpoint == '') ? $default : $endpoint;

    $client = new $client($endpoint);
    $client->soap_defencoding = "UTF-8";

    if($client->fault) {
        $text = 'Error: '. $client->fault;
        $success = False;
    }
    else {
        if ($client->getError()) {
            $text = 'Error: '.$client->getError();
            $success = False;
        } else {
            // make soap request and store result
            $result = $client->call(
                $operation,
                $params,
                $namespace,
                $namespace . '#' . $operation
            );
        }
    }

    if ($raw) {
        return $result;
    } else {
        if($success) {
            return array('success'=> $success, 'result' => $result);
        } else {
            return array('success'=> $success, 'result' => $text);
        }
    }
}