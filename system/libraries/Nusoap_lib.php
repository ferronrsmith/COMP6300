<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
/**
 * Created by JetBrains PhpStorm.
 * User: ferron
 * Date: 1/24/13
 * Time: 3:56 PM
 * To change this template use File | Settings | File Templates.
 */

class Nusoap_lib
{
    function Nusoap_lib()
    {
        require_once(BASEPATH.'libraries/NuSOAP/0.9.5/lib/nusoap'.EXT);
    }
}