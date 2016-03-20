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
 * @package    Farbauswahl
 * @subpackage Farbauswahl
 * @copyright  Copyright (c) 2012, shopware AG (http://www.shopware.de)
 * @version    $Id$
 * @author shopware AG
 */

/**
 * Shopware Model - Farbauswahl
 *
 * Backend - Management for Farbauswahl. Create | Modify | Delete.
 * Standard Farbauswahl model
 */
//{block name="backend/Bestellstatusmanager/model/rulesets"}
Ext.define('Shopware.apps.Bestellstatusmanager.model.EmailTemplate', {
    /**
     * Extends the default extjs 4 model
     * @string
     */
    extend : 'Ext.data.Model',
	
	

    /**
     * Defined items used by that model
     * 
     * We have to have a splitted date time object here.
     * One part is used as date and the other part is used as time - this is because
     * the form has two separate fields - one for the date and one for the time.
     * 
     * @array
     */
    fields : [
        { name : 'id', type: 'int' },
        { name : 'description', type: 'string' },
		{ name : 'group', type : 'string' }
    ]
});
//{/block}
