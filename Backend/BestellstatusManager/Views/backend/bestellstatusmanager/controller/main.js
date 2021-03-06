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
 * @package    Voucher
 * @subpackage Controller
 * @copyright  Copyright (c) 2012, shopware AG (http://www.shopware.de)
 * @version    $Id$
 * @author shopware AG
 */

/**
 * Shopware Controller - voucher main backend module
 *
 * The voucher module main controller handles the initialisation of the voucher backend list.
 */
//{block name="backend/bestellstatus/controller/main"}
Ext.define('Shopware.apps.Bestellstatusmanager.controller.Main', {

    /**
     * Extend from the standard ExtJS 4 controller
     * @string
     */
	extend: 'Ext.app.Controller',

    /**
     * Required sub-controller for this controller
     */
    requires: [
        'Shopware.apps.Bestellstatusmanager.controller.Ruleset',

    ],

    mainWindow: null,

    /**
     * Required stores for sub-application
     * @array
     */
    stores:[ 'Ruleset','Detail'],

	/**
	 * Creates the necessary event listener for this
	 * specific controller and opens a new Ext.window.Window
	 * to display the subapplication
     *
     * @return void
	 */
	init: function() {
        var me = this;
		
		me.subApplication.listStore = me.subApplication.getStore('Ruleset');
		me.subApplication.listStore.load();
		
		me.subApplication.rulesetStore = me.subApplication.getStore('Detail');
		me.subApplication.beforeOrderStore = me.subApplication.getStore('BeforeOrder');
		me.subApplication.afterOrderStore = me.subApplication.getStore('AfterOrder');
		me.subApplication.editAgeStore = me.subApplication.getStore('EditAge');
		me.subApplication.orderAgeStore = me.subApplication.getStore('OrderAge');
		me.subApplication.paymentmeansStore = me.subApplication.getStore('Paymentmeans');
		me.subApplication.beforeOrderPaymentStore = me.subApplication.getStore('BeforeOrderPayment');
		me.subApplication.afterOrderPaymentStore = me.subApplication.getStore('AfterOrderPayment');
		me.subApplication.emailTemplateStore = me.subApplication.getStore('EmailTemplate');		
		
        me.mainWindow = me.getView('main.Window').create({
            listStore: me.subApplication.listStore
        });
        
        me.callParent(arguments);
    }
});
//{/block}
