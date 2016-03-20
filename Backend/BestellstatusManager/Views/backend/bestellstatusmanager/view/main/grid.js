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
 * Shopware UI - Bestellstatusmanager View Main Panel
 *
 * View component which features the main panel
 * of the module. It displays the Bestellstatusmanagers.
 */
//{block name=backend/Bestellstatusmanager/view/main/panel}

Ext.define('Shopware.apps.Bestellstatusmanager.view.main.Grid', {
   // extend: 'Ext.container.Container',
	extend:'Ext.grid.Panel',
    alias : 'widget.bestellstatusmanager-view-main-grid',
	store:'Ruleset',
    region:'center',
    autoScroll:true,
    ui:'shopware-ui',
  
    //selType:'cellmodel',

    initComponent:function () {
        var me = this;

        me.registerEvents();

       
       // me.selModel = me.getGridSelModel();


        me.columns = me.getColumns();
        me.toolbar = me.getToolbar();
        //me.pagingbar = me.getPagingBar();
	
        me.store = me.listStore;
        me.dockedItems = [ me.toolbar];
        me.callParent(arguments);
    },	
    /**
     * Returns the toolbar used to add or delete a Bestellstatusmanager
     * 
     * @return Ext.toolbar.Toolbar
     */
    getToolbar : function() {
        return Ext.create('Ext.toolbar.Toolbar', {
            region: 'north',
            ui: 'shopware-ui',
            items: [
                /*{if {acl_is_allowed privilege=create}}*/ 
                {
                    iconCls : 'sprite-plus-circle',
                    text : '{s name=view/main_add}Add{/s}',
                    action : 'addRuleset',
                    disabled : false,
					
                },
                /* {/if} */
                /*{if {acl_is_allowed privilege=delete}}*/ 
                {
                    iconCls : 'sprite-minus-circle',
                    text : '{s name=view/main_delete}Delete{/s}',
                    disabled : true,
                    action : 'deleteBestellstatusmanager'
                },
                /* {/if} */
                /*{if {acl_is_allowed privilege=update}}*/ 
             
				{
                    iconCls : 'sprite-pencil',
                    text : '{s name=view/main_edit}Edit{/s}',
                    disabled : true,
                    action : 'editBestellstatusmanager'
                }
			
                /*{/if}*/
            ]
        });
    },
    /**
     * Defines additional events which will be
     * fired from the component
     *
     * @return void
     */
    registerEvents:function () {
        this.addEvents(

                'deleteColumn',
				'editColumn'

        );

        return true;
    },	
	
    /**
     * Creates the grid columns
     *
     * @return [array] grid columns
     */
    getColumns:function () {
        var me = this;

        var columnsData = [
            {
                header:'id',
                dataIndex:'id',
                width:40,
            },						   
						   
            {
                header:'Name',
                dataIndex:'name',
                flex:1,
                renderer:this.nameRenderer
            },
            {
                header:'Zeit',
                dataIndex:'rule_interval',
                flex:1,
            
            },
            {
                header:'Letzte Ausführung',
                dataIndex:'last_started',
                flex:1,
            
            },
            {
                xtype:'actioncolumn',
                width:90,
                items:me.getActionColumnItems()
            }
        ];
        return columnsData;
    },
	
    /**
     * Name Renderer Method
     * @param value
     */
    nameRenderer:function (value) {
        return Ext.String.format('{literal}<strong style="font-weight: 700">{0}</strong>{/literal}', value);
    },	
    /**
     * Creates the items of the action column
     *
     * @return [array] action column itesm
     */
    getActionColumnItems: function () {
        var me = this,
            actionColumnData = [];

            /*{if {acl_is_allowed privilege=update}}*/
            actionColumnData.push({
                iconCls:'sprite-pencil',
                cls:'editBtn',
                tooltip:'{s name=list/action_column/edit}Edit{/s}',
                handler:function (view, rowIndex, colIndex, item) {
					
                    me.fireEvent('editColumn', view, rowIndex, colIndex, item);
                }
            });
            /*{/if}*/

            /*{if {acl_is_allowed privilege=delete}}*/
            actionColumnData.push({
               iconCls:'sprite-minus-circle-frame',
               action:'delete',
               cls:'delete',
               tooltip:'{s name=list/action_column/delete}Delete{/s}',
               handler:function (view, rowIndex, colIndex, item) {
				   
                   me.fireEvent('deleteColumn', view, rowIndex, colIndex, item);
               }
            });
            /*{/if}*/

       
        return actionColumnData;
    },	
	
    /**
     * Creates the grid selection model for checkboxes
     *
     * @return [Ext.selection.CheckboxModel] grid selection model
     */
    getGridSelModel:function () {
        var selModel = Ext.create('Ext.selection.CheckboxModel', {
            listeners:{
                // Unlocks the save button if the user has checked at least one checkbox
               
			   selectionchange:function (sm, selections) {
                    //var owner = this.view.ownerCt,
                    //btn = owner.down('button[action=deleteRuleset]');
                    //btn.setDisabled(selections.length == 0);
                }
				
            }
        });
        return selModel;
    },	


});
//{/block}
