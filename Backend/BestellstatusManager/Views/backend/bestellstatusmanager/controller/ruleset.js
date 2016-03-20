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
 * @subpackage Main
 * @copyright  Copyright (c) 2012, shopware AG (http://www.shopware.de)
 * @version    $Id$
 * @author shopware AG
 */

/*{namespace name=backend/Bestellstatusmanager/controller/main}*/

/**
 * Shopware UI - Bestellstatusmanager Controller Main
 *
 * Features the business logic for the Bestellstatusmanager module.
 */
//{block name=backend/Bestellstatusmanager/controller/ruleset}
Ext.define('Shopware.apps.Bestellstatusmanager.controller.Ruleset', {
    extend : 'Ext.app.Controller',
    /**
     * Holder property for the main panel
     * 
     * @private
     * @null
     */
    panel: null,
    refs: [
        { ref:'mainGrid', selector:'bestellstatusmanager-view-main-grid' },
		{ ref:'formAdd', selector:'BestellstatusmanagerFormAdd' }
		
    ],	
	
	
 /**
     * Contains all snippets for the controller
     */
    snippets: {
        copyFromSelectedVoucherTitle: '{s name=message/copyFromSelectedVoucherTitle}Copy of{/s}',
        confirmDeleteSingleVoucherTitle: '{s name=message/confirmDeleteSingleVoucherTitle}Delete this voucher{/s}',
        confirmDeleteSingleVoucher: '{s name=message/confirmDeleteSingleVoucher}Are you sure you want to delete the chosen voucher ([0])?{/s}',
        confirmDeleteMultipleVoucher: '{s name=message/confirmDeleteMultipleVoucher}[0] vouchers selected. Are you sure you want to delete the selected vouchers?{/s}',
        deleteSingleVoucherSuccess: '{s name=message/deleteSingleVoucherSuccess}The voucher has been successfully deleted{/s}',
        deleteSingleVoucherError: '{s name=message/deleteSingleVoucherError}An error has occurred while deleting the selected Voucher: {/s}',
        deleteMultipleVoucherSuccess: '{s name=message/deleteMultipleVoucherSuccess}The vouchers have been successfully deleted.{/s}',
        deleteMultipleVoucherError: '{s name=message/deleteMultipleVoucherError}An error has occured while deleting the selected vouchers: {/s}',
        onSaveVoucherSuccess: '{s name=message/onSaveVoucherSuccess}Changes saved successfully{/s}',
        onSaveVoucherError: '{s name=message/onSaveVoucherError}An error has occured while saving your changes.{/s}',
		growlMessage: '{s name=growlMessage}Voucher{/s}'
    },
	

    /**
     * Creates the necessary event listener for this
     * specific controller and opens a new Ext.window.Window
     * to display the sub-application.
     */
    init: function () {
        var me = this;

        me.control({
            'bestellstatusmanager-view-main-grid button[action=addRuleset]':{
                click: me.onAddRuleset
            },
            'bestellstatusmanager-view-main-grid button[action=deleteVoucher]':{
                click:me.onDeleteMultipleVouchers
            },
            'bestellstatusmanager-view-main-grid': {
                deleteColumn: me.onDeleteSingleRuleset,
                editColumn: me.onEditRuleset
            },
            //The save-button from the add-window
            'window button[action=editBestellstatusmanagerSave]': {
                click: me.onEditBestellstatusmanagerSave
            }			
		});
		
		


        // create and save the new view so we can access that view easily later

        //me.subApplication.bannerStore = me.subApplication.getStore('Banner');
        //me.subApplication.categoryStore = me.subApplication.getStore('Category');

/*
  		Ext.suspendLayouts();
        me.panel = this.subApplication.getView('main.Grid').create({
			rulesetStore: me.subApplication.listStore
		});

        // Create an show the applications main view.
        me.main = this.subApplication.getView('Main').create({
            items: [ me.panel ]
        }).show();
        Ext.resumeLayouts(true);
		*/
    },
	
    /**
     * Event listener method which will be fired when the user
     * clicks the "add"-button in the "main"-window.
     *
     * Shows the add-new Banner window
     *
     * @event click
     * @param [object] btn - pressed Ext.button.Button
     * @return void
     */
    onEditRuleset: function (view, rowIndex) {

 
        var me = this,
		beforeOrderStore = me.subApplication.beforeOrderStore,
		afterOrderStore = me.subApplication.afterOrderStore,
		editAgeStore = me.subApplication.editAgeStore,
		orderAgeStore = me.subApplication.orderAgeStore,
		paymentmeansStore = me.subApplication.paymentmeansStore,
		beforeOrderPaymentStore = me.subApplication.beforeOrderPaymentStore,
		afterOrderPaymentStore = me.subApplication.afterOrderPaymentStore,
		emailTemplateStore = me.subApplication.emailTemplateStore,
		//rulesetStore = me.subApplication.rulesetStore,
		//record = me.subApplication.listStore.getAt(rowIndex);
           rulesetStore = me.getStore('Detail'),
            record = me.subApplication.listStore.getAt(rowIndex);		
		//theGrid = me.getMainGrid(),
		//record  = theGrid.getSelectionModel().getLastSelected();
	
   rulesetStore.load({
					 id :record.get("id"),
           
            callback: function(records, operation) {
                if (operation.success !== true || !records.length) {
                    return;
                }
                me.detailRecord = records[0];
				console.log(record.get("id"));
				console.log(records);
			
         me.getView('main.Rulesetformadd').create({							 
			
			beforeOrderStore : beforeOrderStore,
			afterOrderStore : afterOrderStore,
			editAgeStore : editAgeStore,
			orderAgeStore : orderAgeStore,
			paymentmeansStore : paymentmeansStore,
			beforeOrderPaymentStore  : beforeOrderPaymentStore,
			afterOrderPaymentStore : afterOrderPaymentStore,
			emailTemplateStore : emailTemplateStore,
			rulesetStore : rulesetStore,
			record  :  me.detailRecord 
			
		});
		 
		
               me.getFormAdd().formPanel.loadRecord(me.detailRecord);
            }
        });
			

	
		
	
    },
	
    onAddRuleset: function() {
        var me              = this,
		beforeOrderStore = me.subApplication.beforeOrderStore,
		afterOrderStore = me.subApplication.getStore('AfterOrder'),
		editAgeStore = me.subApplication.getStore('EditAge'),
		orderAgeStore = me.subApplication.getStore('OrderAge'),
		paymentmeansStore = me.subApplication.getStore('Paymentmeans'),
		beforeOrderPaymentStore = me.subApplication.getStore('BeforeOrderPayment'),
		afterOrderPaymentStore = me.subApplication.getStore('AfterOrderPayment'),
		emailTemplateStore = me.subApplication.getStore('EmailTemplate'),
		rulesetStore = me.subApplication.getStore('Ruleset');

		var rulesetmodel = me.getModel('Ruleset');
		
		var	record = rulesetmodel.create(
            {
                name: "Neue Regel",
				is_inactive: 0,
				s_order_status_before : 999,
				email_template : 999,
				s_order_age : 999,
				s_order_status_before : 999,
				s_order_status_after : 999,
				s_order_payment_before : 999,
				s_order_payment_after : 999,
				s_order_paymentID : 999	
			}
		);
	


        me.getView('main.RulesetFormAdd').create({
		scope       : me,										 
		beforeOrderStore : beforeOrderStore,
		afterOrderStore : afterOrderStore,
		editAgeStore : editAgeStore,
		orderAgeStore : orderAgeStore,
		paymentmeansStore : paymentmeansStore,
		beforeOrderPaymentStore  : beforeOrderPaymentStore,
		afterOrderPaymentStore : afterOrderPaymentStore,
		emailTemplateStore : emailTemplateStore,
		rulesetStore : rulesetStore,
		record  : record
		});
		
	
    },	
	
	
   /**
     * Event listener which deletes a single voucher based on the passed
     * grid (e.g. the grid store) and the row index
     *
     * @param [object] grid - The grid on which the event has been fired
     * @param [integer] rowIndex - Position of the event
     * @return void
     */
    onDeleteSingleRuleset:function (grid, rowIndex) {
        var me = this,
                store = grid.getStore(),
	
                //voucherGrid = me.getGrid(),
                record = store.getAt(rowIndex);
				
							console.log(record);
			
				
        // we do not just delete - we are polite and ask the user if he is sure.
        Ext.MessageBox.confirm(
            me.snippets.confirmDeleteSingleVoucherTitle,
            Ext.String.format(me.snippets.confirmDeleteSingleVoucher, record.get('description')), function (response) {
            if (response !== 'yes') {
                return false;
            }

            voucherGrid.setLoading(true);
            store.remove(record);
            try {
                store.save({
                    callback: function (batch) {
                        var rawData = batch.proxy.getReader().rawData;
                        if (rawData.success === true) {
                            Shopware.Notification.createGrowlMessage('',me.snippets.deleteSingleVoucherSuccess, me.snippets.growlMessage);
                        }
                        voucherGrid.setLoading(false);
                        store.load();

                    }
                });
            } catch (e) {
                Shopware.Notification.createGrowlMessage('',me.snippets.deleteSingleVoucherError + e.message, me.snippets.growlMessage);
            }

        });

    },

    /**
     * Event listener method which deletes multiple vouchers
     *
     * @return void
     */
    onDeleteMultipleVouchers:function () {
        var me = this,
                grid = me.getGrid(),
                sm = grid.getSelectionModel(),
                selection = sm.getSelection(),
                store = grid.getStore(),
                noOfElements = selection.length;

        // Get the user to confirm the delete process
        Ext.MessageBox.confirm(
                me.snippets.confirmDeleteSingleVoucherTitle,
                Ext.String.format(me.snippets.confirmDeleteMultipleVoucher, noOfElements), function (response) {
            if (response !== 'yes') {
                return false;
            }
            if (selection.length > 0)
                grid.setLoading(true);{
                store.remove(selection);
                store.save({
                    callback: function(batch) {
                        var rawData = batch.proxy.getReader().rawData;
                        if (rawData.success === true) {
                            Shopware.Notification.createGrowlMessage('',me.snippets.deleteMultipleVoucherSuccess, me.snippets.growlMessage);
                        } else {
                            Shopware.Notification.createGrowlMessage('',me.snippets.deleteMultipleVoucherError + rawData.errorMsg, me.snippets.growlMessage);
                        }
                        grid.setLoading(false);
                        store.load();
                    }
                });
            }
        })
    },	
	
    onEditBestellstatusmanagerSave : function(btn) {
        var win     = btn.up('window'),
            form    = win.down('form'),
            formBasis = form.getForm(),
            me      = this,
            store   = me.subApplication.listStore,
            record  = form.getRecord();

        form.getForm().updateRecord(record);

        if (formBasis.isValid()) {
			console.log("is valid");
            record.save({
                callback: function() {
                    Shopware.Msg.createGrowlMessage('', '{s name=saved_success}Ruleset has been saved.{/s}', '{s name=main_title}{/s}');
                    win.close();
                }
            });
        }
        //todo@all Should we display a warning here?
    },	
	
	
});
//{/block}
