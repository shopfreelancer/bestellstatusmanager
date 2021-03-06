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
//{block name=backend/Bestellstatusmanager/view/main}
Ext.define('Shopware.apps.Bestellstatusmanager.view.main.Window', {
    extend: 'Enlight.app.Window',
    layout: 'border',
    alias: 'widget.bestellstatusmanager-main-window',
    width: 1000,
    height: '90%',
	autoShow: true,
    maximizable: true,
    //stateful: true,
    //stateId: 'Bestellstatusmanager',
    border: 0,
    title: 'Bestellstatusmanager',

    initComponent: function() {
        var me = this;
        me.items = [
            { xtype: 'bestellstatusmanager-view-main-grid', listStore: me.listStore }
        ];

        me.callParent(arguments);
    }
	
});
//{/block}
