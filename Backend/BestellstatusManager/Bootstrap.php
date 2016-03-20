<?php
class Shopware_Plugins_Backend_BestellstatusManager_Bootstrap extends Shopware_Components_Plugin_Bootstrap
{	
	public function install()
	{	

        $this->createMenuItem(array(
            'label' => 'Bestellstatus Manager',
            'controller' => 'Bestellstatusmanager',
            'class' => 'sprite-application-block',
            'action' => 'Index',
            'active' => 1,
            'parent' => $this->Menu()->findOneBy('label', 'Inhalte')
        ));		
 		
		$this->sqlInstall();
		$this->registerEvents();
		$this->registerCronJobs();
		
		$form = $this->Form();
		$form->setElement('text', 'timespanCronjob', array('label'=>'Nachjustieren der Zeitspanne Cronjob in Minuten', 'value'=>'15'));		
		
		$form->save();
		
		return true;
	}

private function registerCronJobs()
{
    $this->createCronJob(
        'BestellstatusmanagerExecute',
        'BestellstatusmanagerExecute',
        4,
        true
    );
 
    $this->subscribeEvent(
        'Shopware_CronJob_onRunBestellCron',
        'onRunBestellCron'
    );
}	
	
private function registerEvents()
{
 		$this->subscribeEvent(
			'Enlight_Controller_Dispatcher_ControllerPath_Backend_Bestellstatusmanager',
			'onGetControllerPathBackend'
		);
		
		$this->subscribeEvent(
			'Enlight_Controller_Dispatcher_ControllerPath_Backend_BestellstatusmanagerExecute',
			'onGetControllerPathBackendExecute'
		);
		
}	

      /**
         * Creates database table(s)
         * @return
         */
	public function sqlInstall(){
	
	Shopware()->Db()->query("
		CREATE TABLE IF NOT EXISTS s_bestellstatus_manager_rulesets
		(
		id INT NOT NULL auto_increment,
		name varchar(80) NOT NULL,
		is_inactive INT NOT NULL,
		last_started DATETIME,
		rule_interval TIME,
	 	s_order_status_before INT(5),
		s_order_status_after INT(5),
		s_order_payment_before INT(5),
		s_order_payment_after INT(5),
		s_order_paymentID INT(5),
		s_order_age INT(5),
		email_template INT(5),
		s_edit_age INT(5),
		PRIMARY KEY (id)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;
		");	
		
		
		Shopware()->Db()->query("
		INSERT INTO s_bestellstatus_manager_rulesets VALUES 
		('', 'Regelset 1 Test','0', 0, '08:30', '1', 2, '999', '999', '999','999',3,'999' ),
		('', 'Das zweite Set Sofortüberweisung','0', 0, '20:45', 3, 3, '999','999', '999', '999','4','999'),
		('', 'Moneybookers','0', 0, '20:30', '999', 3, '999','999', '999', '10','4','999'),
		('', 'Die inaktive Regel','1', NOW(), '15:15', '999', 3, '999','999', '999', '999','4','999');
		");
		
		
	Shopware()->Db()->query("CREATE TABLE IF NOT EXISTS s_bestellstatus_manager_orderlog
		(
		id INT NOT NULL auto_increment,
		orderID int(11) DEFAULT NULL,
		last_updated DATETIME,
		PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;
		");		
		
        return true;
	}

        /**
         * Deletes database table(s)
         * @return
         */
	public function sqlUninstall(){
		Shopware()->Db()->query("DROP TABLE IF EXISTS s_bestellstatus_manager_rulesets;");
		Shopware()->Db()->query("DROP TABLE IF EXISTS s_bestellstatus_manager_orderlog;");
		return true;
	}		

       /**
         * Uninstall Plugin
         * @return bool
         */
	public function uninstall(){		
		$this->sqlUninstall();
		return true;
	} 
	
 	public function onGetControllerPathBackend(Enlight_Event_EventArgs $args)
    {
	      $this->Application()->Template()->addTemplateDir(
            $this->Path() . 'Views/', 'bestellstatusmanager'
        );
		return $this->Path(). 'Controllers/Backend/Bestellstatusmanager.php';
    }
	
	 	public function onGetControllerPathBackendExecute(Enlight_Event_EventArgs $args)
    {
		return dirname(__FILE__).'/Controllers/Backend/BestellstatusmanagerExecute.php';
    }
 
 	public function onRunBestellCron(Shopware_Components_Cron_CronJob $job)
	{	
	
	Shopware()->Loader()->registerNamespace('Bestellstatusmanager_Components', dirname(__FILE__) . '/Components/');
	Shopware()->Plugins()->Backend()->BestellstatusManager()->execute();

	}
 
	/**
	 * getInfo()
	 *
	 * Gibt alle Meta-Daten des Plugins zurueck
	 * 
	 * @return mixed
	 */
	public function getInfo()
    {
    	return include(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'Meta.php');
    }
	
	
	public function execute()
	{
		$rules = new Bestellstatusmanager_Components_Rulesets();
		$rules->process();
		return;
	}
}