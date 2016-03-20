<?php
class Bestellstatusmanager_Components_Rulesets {

	public $ruleSets;
	public $messages = array();
	
	public function __construct(){ 
		$this->fetchRulesets();
	}
	
	protected function fetchRulesets(){
		$sql = "SELECT * FROM s_bestellstatus_manager_rulesets WHERE is_inactive = 0 ORDER BY id ASC";
		$this->ruleSets = Shopware()->Db()->fetchAll($sql);
		if($this->ruleSets === null){
			$this->messages = "Keine aktiven Regeln gefunden";
		}
		return;
	}
	
	public function process(){
		if($this->ruleSets === null){
			return;
		}
		
		foreach($this->ruleSets as $ruleSet){
			$individualRule = new Bestellstatusmanager_Components_ExecuteRule($ruleSet['id']);
			$individualRule->init();
			$this->messages[] = $individualRule->getMessages();

		}
		return;
	}
	
	
	public function getRulesets(){
		return $this->ruleSets;
	}
	
	public function getMessages(){
		return $this->messages;
	}	
		
}