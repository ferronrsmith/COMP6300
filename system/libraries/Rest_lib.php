<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
/**
 * Created by JetBrains PhpStorm.
 * User: ferron
 * Date: 1/24/13
 * Time: 3:56 PM
 * To change this template use File | Settings | File Templates.
 */

class Rest_lib
{
    function Rest_lib()
    {
        require_once(BASEPATH.'libraries/SimpleRest/0.1/REST_Controller'.EXT);
    }
}