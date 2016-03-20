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

/*{namespace name=backend/Bestellstatusmanager/view/main}*/

/**
 * Shopware UI - Bestellstatusmanager View Main Add
 *
 * View component which features a form panel to add
 * a new Bestellstatusmanager.
 */
//{block name="backend/Bestellstatusmanager/view/main/Bestellstatusmanager_formadd"}
Ext.define('Shopware.apps.Bestellstatusmanager.view.main.Rulesetformadd', {
    extend      : 'Enlight.app.Window',
    alias       : 'widget.BestellstatusmanagerFormAdd',
    cls         : 'addWindow',
    autoShow    : true,
    border      : 0,
    width       : 900,
    height      : 550,
    title: 'Neues Regelset anlegen',

    /**
     * Initializes the component by setting the form panel and the buttons
     *
     * @return void
     */
    initComponent: function() {
        var me      = this;
        me.items    = me.createFormPanel();

        me.dockedItems = [{
            xtype: 'toolbar',
            ui: 'shopware-ui',
            dock: 'bottom',
            cls: 'shopware-toolbar',
            items: me.createActionButtons()
        }];
        me.callParent(arguments);
      
    },

    /**
     * Creates the main form panel for this component.
     *
     * @return [object] generated Ext.form.Panel
     */
    createFormPanel: function() {
        var me = this;


	me.name = Ext.create('Ext.form.field.Text', {
			fieldLabel: 'Name',
			width:320,
			id: 'name', 
			name: 'name', 
			allowBlank: false
			});


	me.rs_time = Ext.create('Ext.form.field.Time', {
                fieldLabel: 'Ausführungszeit',
                name: 'rule_interval',
				id: 'rule_interval',
				width:320,
				editable:false,
				value:'08:00',
				allowBlank: false
            });
	
	me.rs_inactive = {
			fieldLabel: 'Regel inaktiv setzen?', 
			name: 'is_inactive', 
			id: 'is_inactive',
			xtype:'checkbox', 
			allowBlank: true
            };
	

	   me.orderAgeCombo = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: 'Nur Bestellungen, vor genau X Tagen',
            name: 's_order_age',
			labelWidth: 200,
			hiddenName: 's_order_age',
            store: me.orderAgeStore,
            displayField: 'description',
            valueField: 'id',
            emptyText: 'Select..'
        });
	   
		me.editAgeCombo = Ext.create('Ext.form.field.ComboBox', {
			hiddenName: 's_edit_age',
			store: me.editAgeStore,
			valueField:'id',
			fieldLabel: 'Nur Bestellungen, deren letzte Statusänderungen mindestens X Tage zurückliegt',
			displayField:'description',
			labelWidth: 200,
		  typeAhead: true,
		  mode: 'local',
		  triggerAction: 'all',
		  emptyText:'Select...',
		  selectOnFocus:true
		 });	   
		 
		me.beforeOrderStateCombo = Ext.create('Ext.form.field.ComboBox', {
			hiddenName: 's_order_status_before',
			store: me.beforeOrderStore,
			labelWidth: 200,
			valueField:'id',
			fieldLabel: 'Suche nach Bestellungen mit Bestellstatus',
			displayField:'description',
		  typeAhead: true,
		  queryMode: 'local',
		  triggerAction: 'all',
		  emptyText:'Select...',
		  selectOnFocus:true
		});
		
		me.afterOrderStateCombo = Ext.create('Ext.form.field.ComboBox', {
			hiddenName: 's_order_status_after',
			store: me.afterOrderStore,
			valueField:'id',
			fieldLabel: 'Setze Bestellungen auf Bestellstatus',
			displayField:'description',
		  typeAhead: true,
		  queryMode: 'local',
		  triggerAction: 'all',
		  emptyText:'Select...',
		  selectOnFocus:true
		});
	

me.beforeOrderPaymentCombo = Ext.create('Ext.form.field.ComboBox', {
	hiddenName: 's_order_payment_before',
  	store: me.beforeOrderPaymentStore,
    valueField:'id',
	fieldLabel: 'Suche nach Bestellungen mit Zahlstatus',
	labelWidth: 200,
    displayField:'description',
  	typeAhead: true,
	  mode: 'local',
	  triggerAction: 'all',
	  emptyText:'Select a state...',
	  selectOnFocus:true
});

me.afterOrderPaymentCombo = Ext.create('Ext.form.field.ComboBox', {
	hiddenName: 's_order_payment_before',
  	store: me.afterOrderPaymentStore,
	hiddenName: 's_order_payment_after',
    valueField:'id',
	fieldLabel: 'Setze Bestellungen auf Zahlstatus',
    displayField:'description',
  	typeAhead: true,
	  mode: 'local',
	  triggerAction: 'all',
	  emptyText:'Select a state...',
	  selectOnFocus:true
});


me.paymentmeansCombo = Ext.create('Ext.form.field.ComboBox', {
	hiddenName: 's_order_paymentID',	
  	store: me.paymentmeansStore,
    valueField:'id',
	fieldLabel: 'Suche nach Bestellungen mit Zahlart',
    displayField:'description',
	labelWidth: 200,
  typeAhead: true,
  mode: 'local',
  triggerAction: 'all',
  emptyText:'Select...',
  selectOnFocus:true
});


me.EmailTemplateCombo = Ext.create('Ext.form.field.ComboBox', {
  	store: me.emailTemplateStore,
	hiddenName: 'email_template',
	tpl: me.createEmailTemplate(),						
	listConfig: {
		itemCls: 'sf-email-item'
	},
    valueField:'id',
	fieldLabel: 'Email Template',
    displayField:'description',
  typeAhead: true,
  mode: 'local',
  triggerAction: 'all',
  emptyText:'Select...',
  selectOnFocus:true
});


   me.orderAgeStore.load({
	   callback: function() {
		  me.orderAgeCombo.setValue(me.record.data.s_order_age);
	   }
   });

   me.editAgeStore.load({
	   callback: function() {
		  me.editAgeCombo.setValue(me.record.data.s_edit_age);
	   }
   });
   
   me.beforeOrderStore.load({
	   callback: function() {
		  me.beforeOrderStateCombo.setValue(me.record.data.s_order_status_before);
	   }
   });
   
   me.afterOrderStore.load({
	   callback: function() {
		  me.afterOrderStateCombo.setValue(me.record.data.s_order_status_after);
	   }
   });
   
   me.beforeOrderPaymentStore.load({
	   callback: function() {
		  me.beforeOrderPaymentCombo.setValue(me.record.data.s_order_payment_before);
	   }
   });     

    me.afterOrderPaymentStore.load({
	   callback: function() {
		  me.afterOrderPaymentCombo.setValue(me.record.data.s_order_payment_after);
	   }
   });     

   me.paymentmeansStore.load({
	   callback: function() {
		  me.paymentmeansCombo.setValue(me.record.data.s_order_paymentID);
	   }
   });   

   me.emailTemplateStore.load({
	   callback: function() {
		  me.EmailTemplateCombo.setValue(me.record.data.email_template);
	   }
   }); 
		

	
		me.formItems  = Ext.create('Ext.form.FieldSet', {	
			title: 'Filteroptionen',
			collapsible: true,
        	collapsed: false,
			columnWidth: 1,								
			items:[me.name,me.rs_time,me.rs_inactive]
		});
	
		me.formItems2 = Ext.create('Ext.form.FieldSet', {

			title: 'Filter',
			collapsible: true,
        	collapsed: false,
			columnWidth: 0.5,	
			
			items:[me.orderAgeCombo,me.beforeOrderStateCombo,me.editAgeCombo,me.paymentmeansCombo,me.beforeOrderPaymentCombo]
		});
		
		me.formItems3 = Ext.create('Ext.form.FieldSet', {
		
			title: 'Aktionen',
			collapsible: true,
        	collapsed: false,
			columnWidth: 0.5,								
			items:[me.afterOrderStateCombo,me.afterOrderPaymentCombo,me.EmailTemplateCombo]
		});		

        // Actual form panel
        me.formPanel = Ext.create('Ext.form.Panel', {
            border      : false,
            layout      : 'column',
			model : 'Detail',
			
            defaults    : {
                    //labelStyle: 'font-weight: 700; text-align: right;'
            },
            items       : [me.formItems,me.formItems2,me.formItems3]
        });
        me.formPanel.add(me.createHiddenFields());

        return me.formPanel;
    },
	
	
    createEmailTemplate: function() {
        var me = this;
		
		{literal}
			var resultTpl = new Ext.XTemplate(
				'<tpl for="."><div class="sf-email-item">',
					'<span class="EmailTemplateID">{id}</span> {description}<br/>',
					'{group}',
				'</div></tpl>'
			);
		{/literal}
		return resultTpl;

    },	
 
    /**
     * Creates the neccessary hidden fields which transports
     * all needed informations
     *
     * @return [array] generated hidden form elements
     */
    createHiddenFields: function() {
        var me = this;
	
        return [{
            xtype   : 'hidden',
            name    : 'rs_id',
			value : 0,
        }];
    },

  

    /**
     * Creates the action buttons for the component.
     *
     * @return [array] - Array of Ext.button.Button's
     */
    createActionButtons: function() {
        var me = this;

        return ['->', {
            text    : '{s name=form_add/cancel}Cancel{/s}',
            cls: 'secondary',
                scope:me,
                handler:function () {
                    this.destroy();
                }

        }, {
            text    : '{s name=form_add/save}Save{/s}',
            action  : 'editBestellstatusmanagerSave',
            cls: 'primary'
        }];
    },
	
	/**
	 * Due to comboboxes the model to form mapping with me.formPanel.loadRecord(this.record); doesnt work. 
	 * This is a nasty thing since ExtJS 3.x and I searched for hours on this one.
	 * 
	 */
	setDefaultValues : function(){
		var me = this;
		/*
		me.name.setValue(me.record.data.name);
		me.rs_time.setValue(me.record.data.rs_time);
	
	*/


		
		//me.rs_name.setValue('harrs');
		return;
	}
});
//{/block}
