<?php
class Bestellstatusmanager_Components_ExecuteRule {

public $ruleID;

public $messages = array();

/*
* string
*/
public $updatedOrdernumbers = '';

public $logFile;
public $JSONmessage;

protected $_ruleSet;
protected $_orderMatches;


public function __construct($ruleID){
	
	if(!isset($ruleID)){
		return false;
	}
	
	$this->ruleID = $ruleID;
}

public function init(){
	
	$this->messages[] = "Rule ".$this->ruleID." proccessed.";
	
	if($this->getRuleSet() === false){
		return false;
	}
	
	$this->setLogFile();
	
	if($this->checkStartTimeConditions() === false){
		$this->messages[] = "Not now.";
		return false;
	}
	
	if($this->executeIndividualRule() === true){
		
	}
	return true;
}

	public function getRuleSet(){
		$sql = "SELECT *,UNIX_TIMESTAMP(last_started) as laststarted_unix FROM s_bestellstatus_manager_rulesets WHERE is_inactive = 0 AND id = ".$this->ruleID;
		$this->_ruleSet = Shopware()->Db()->fetchRow($sql);
		
		if(empty($this->_ruleSet['id'])){
			$this->logFile->info('Fehler: Falsche Rule ID');
			return false;
		}
		
	}

/*
*  Cronjob won´t be executed exactly at current time. We need a timespan instead.
*  @return boolean
*
*/

public function checkStartTimeConditions(){

	// Timespan of X minutes before and after current time In case crobjob gets executed only once a hour
	$timespan = (int)Shopware()->Plugins()->Backend()->BestellstatusManager()->Config()->timespanCronjob;
	
	// At what time should the rule get executed today? 
	$startScheduleToday = strtotime(date('Y-m-d').' '.$this->_ruleSet["rule_interval"]);
	$startMinus = $startScheduleToday - ($timespan * 60);
	$startPlus = $startScheduleToday + ($timespan * 60);
	
	// execute rule only one time within timespan. if executed already, stop
	if(!empty($this->_ruleSet["laststarted_unix"])){
		if($this->_ruleSet["laststarted_unix"] > $startMinus && $this->_ruleSet["laststarted_unix"] < $startPlus){
			return false;
		}
	}
	
	// if execution time lies within timespan, execute cron and write current timestamp to database
	if(time() > $startMinus && time() < $startPlus){
		$this->setTimestamp();	
		return true;
	} else {
		return false;
	}
}

public function executeIndividualRule(){

	$sql = $this->buildOrderSearchQuery();
		
	// Filter & Search Orders
	$this->_orderMatches = Shopware()->Db()->fetchAll($sql);
	//$this->logFile->info($this->_orderMatches);
	
	if(empty($this->_orderMatches[0])){
		$this->logFile->info('Keine passenden Bestellungen gefunden');
		return false;
	}
	
	$this->filterEditAge();
		
	// Execute Actions	
	$this->sendEmail();
	$this->changeOrderStatus();
	
	return true;	
}	

/*
* Datumsvergleich ist nicht möglich via SQL da falsche DB Kollation in o_attr1 Feld 
* Nur Bestellungen, die vor mehr als X Tagen durch das Plugin verändert wurden.
* @return bool
*/
public function filterEditAge(){

	if($this->_ruleSet['s_edit_age'] != 999){
	$editInterval = strtotime(date('Y-m-d H:i:s', time()-(60*60*24*(int)$this->_ruleSet['s_edit_age']))); 
	
		foreach($this->_orderMatches as $key => $value){
		$lastEdited = strtotime($value["last_updated"]);
			if($lastEdited > $editInterval){
				unset($this->_orderMatches[$key]);
			}
		}
		
		return true;
	} else {
	return false;
	}
}

/*
* Die in Rulesets gespeicherten Bedingungen zu SQL-Queries zusammensetzen, nach denen die Bestellungen durchsucht werden. 
* @return array
*/
	
public function buildOrderSearchQuery(){
		
		if($this->_ruleSet['s_order_status_before'] != 999){
			$where .= ' so.status = '.$this->_ruleSet['s_order_status_before'].' AND ';
		} else {
			$where .= '';
		}
		
		if($this->_ruleSet['s_order_payment_before'] != 999){
			$where .= ' so.cleared = '.$this->_ruleSet['s_order_payment_before'].' AND ';
		} else {
			$where .= '';
		}

		if($this->_ruleSet['s_order_paymentID'] != 999){
			$where .= ' so.paymentID = '.$this->_ruleSet['s_order_paymentID'].' AND ';
		} else {
			$where .= '';
		}		
		
		if($this->_ruleSet['s_order_age'] != 999){
			$where .= ' so.ordertime < SUBDATE(CURDATE(), INTERVAL '.((int)$this->_ruleSet["s_order_age"] -1).' DAY)
			AND so.ordertime > SUBDATE(CURDATE(), INTERVAL '.(int)$this->_ruleSet["s_order_age"].' DAY)
			';
		} else {
			$where .= '';
		}
		
		if(substr($where,-5) == ' AND '){
			$where = substr($where, 0, -5);
		}	
		
		if(!empty($where)){
			$where = 'WHERE'.$where;
		} else {
			$where = '';
		}
	
		$sql = 'SELECT so.*,slog.last_updated
		FROM s_order so 
		LEFT JOIN s_bestellstatus_manager_orderlog slog ON (slog.orderID = so.id)
		'.$where;

	return $sql;
}

	/**
	 *
	 * 	Select Email-Template, cycle through OrderIDs and send Shopware Status Mail to customers
	 *
	 * @return
	 */		
	public function sendEmail(){
		
		if($this->_ruleSet['email_template'] == 999){
		 	return false;
		} 
		
		foreach($this->_orderMatches as $order){
			$orderIDs[] = $order['id'];
		}
		
		if(empty($orderIDs[0])){
		 	return false;
		} else {
			foreach($orderIDs as $orderId){
				$order = Shopware()->Modules()->Order();
				$mail = $order->createStatusMail((int)$orderId, (int)$this->_ruleSet['email_template']);
				if($mail) {
					$order->sendStatusMail($mail);
				}
			}
		
		return true;
		}
	}
	
	
	public function changeOrderStatus(){
	
		$sql = $this->buildOrderUpdateQuery();
		
		if($sql === false){
			return 'Rule without update';
		}

		foreach($this->_orderMatches as $order){
			Shopware()->Db()->query($sql, array($order['id']));
			$this->updateModifiedOrderTime($order['id']);
			
			$this->updatedOrdernumbers .= $order['ordernumber'].', ';
		}

		$this->logFile->info('Updated Ordernumbers: '.$this->updatedOrdernumbers);
		
		return true;
	}
	
	/**
	* Log datetime when order was modified by plugin
	* @param int - orderID
	*/
	public function updateModifiedOrderTime($id){
		Shopware()->Db()->query('DELETE FROM s_bestellstatus_manager_orderlog WHERE orderID = '.$id);
		
		$sql2 = "INSERT INTO s_bestellstatus_manager_orderlog (orderID, last_updated) VALUES (?, NOW() )";
		Shopware()->Db()->query($sql2, array($id));
	return;
	}
	
	/*
	* SQL Statement der Aktionen der Regel zusammenbauen. Die Order ID wird in Zend_DB Format später hinzugefügt.
	*
	*/
	
	public function buildOrderUpdateQuery(){
	
	$set = 'SET';
	
	if($this->_ruleSet['s_order_status_after'] != 999){
		$set .= ' status = '.(int)$this->_ruleSet['s_order_status_after'].', ';
	} else {
		$status_after = false;
	}
	
	if($this->_ruleSet['s_order_payment_after'] != 999){
		$set .= ' cleared = '.(int)$this->_ruleSet['s_order_payment_after'].', ';
	} else {
		$payment_after = false;
	}
	
	if($status_after === false AND $payment_after === false){
	 	return false;
	}

	if(substr($set,-2) == ', '){
		$set = substr($set, 0, -2);
	}
		
	$set .= " WHERE id = ?";
	
	$sql = 'UPDATE s_order '.$set;
	
	return $sql;
	}
	
	public function setTimestamp(){
		$sql = 'UPDATE s_bestellstatus_manager_rulesets SET last_started = NOW() WHERE id = ?';
		Shopware()->Db()->query($sql, array($this->_ruleSet['id']));
		
	return;
	}
	
	
	/**
	 *
	 * 	init Zend log
	 *
	 * @return
	 */		
	public function setLogFile(){

		$logfile = Shopware()->OldPath().'files/log/bestellstatusmangerlog.txt';
			
		// If Logfile gets bigger than 5MB, delete it
		$filesize = filesize($logfile);
		
		if(round(($filesize / 1048576), 2) > 5){
				unlink($logfile);
		}	
		$writer1 = new Zend_Log_Writer_Stream($logfile);
		$logger = new Zend_Log();
		$logger->addWriter($writer1);
		//$logger->info('Informative Nachricht');	
		$this->logFile = $logger;
		
		$this->logFile->info('id:'.$this->_ruleSet['id'].' '.$this->_ruleSet['name'].' Zeit: '.date('d.m.Y H:i:s '));
		
		return;	
	}
	
	
	public function getMessages(){
		return $this->messages;
	}	
			
}