<?php
class Shopware_Controllers_Backend_BestellstatusmanagerExecute extends Enlight_Controller_Action
{

	public function init(){
		Shopware()->Loader()->registerNamespace('Bestellstatusmanager_Components', dirname(dirname(dirname(__FILE__))) . '/Components/');
		//$this->View()->addTemplateDir(dirname(dirname(__FILE__)) . '/Views/');
	}
	
	public function indexAction(){
	$this->View()->setTemplate();
	
	$rules = new Bestellstatusmanager_Components_Rulesets();
	$rules->process();
	var_dump($rules->getMessages());
	}

		
}