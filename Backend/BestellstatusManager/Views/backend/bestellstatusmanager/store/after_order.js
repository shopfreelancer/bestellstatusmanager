/**
 * Shopware 4.0
 * Copyright © 2012 shopware AG
 *
 * According to our dual licensing model, this program can be used either
 * under the terms of the GNU Affero General Public License, version 3,
 * or under a proprietary license.
 *
 * The texts of the GNU Affero General Public License with an additional
 * permission and of our proprietary license can be found at and
 * in the LICENSE file you have received along with this program.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * "Shopware" is a registered trademark of shopware AG.
 * The licensing of the program under the AGPLv3 does not imply a
 * trademark license. Therefore any rights, title and interest in
 * our trademarks remain entirely with us.
 *
 * @category   Shopware
 * @package    Bestellstatusmanager
 * @subpackage Bestellstatusmanager
 * @copyright  Copyright (c) 2012, shopware AG (http://www.shopware.de)
 * @version    $Id$
 * @author shopware AG
 */

/**
 * Shopware Store - Bestellstatusmanager
 *
 * Backend - Defines the Bestellstatusmanager store
 * 
 * This store will be loaded automatically and will just request 30 items at once.
 * It will utilize the Bestellstatusmanager Model @see Bestellstatusmanager Model
 */
//{block name=backend/Bestellstatusmanager/store/Bestellstatusmanager}
Ext.define('Shopware.apps.Bestellstatusmanager.store.AfterOrder', {
    extend : 'Ext.data.Store',

    autoLoad : false,
	

    model : 'Shopware.apps.Bestellstatusmanager.model.AfterOrder',
    /**
     * Defines the proxies where the data will later be loaded
     * @obj
     */
	
    proxy : {
        type : 'ajax',
        api : {
            read    : '{url action=getOrderStates}',
        },
        // Data will be delivered as json and sits in the field data
        reader : {
            type : 'json',
            root : 'data',
			totalProperty: 'count'
        }
    }
	
});
//{/block}
