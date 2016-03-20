<?php
class Shopware_Controllers_Backend_Bestellstatusmanager extends Shopware_Controllers_Backend_ExtJs
{

	public function init(){
	 
		//Shopware()->Loader()->registerNamespace('Bestellstatusmanager_Components', dirname(dirname(dirname(__FILE__))) . '/Components/');
		//$this->View()->addTemplateDir( dirname(dirname(dirname(__FILE__))) . '/Views/');
		 parent::init();
	}
	
	public function getListAction()
    {

		$data = array(
			array('id'=>"1",'name'=>"regel1","rule_interval"=>"08:30")
		);
		$count = 1;
	
     $this->View()->assign(array(
            'success' => true, 'data' => $data, 'total' => $count
        ));	

	}

	public function getAllRuleSetsAction(){
		//$this->View()->setTemplate();
		
		$sql = "SELECT * FROM s_bestellstatus_manager_rulesets";
		$result = Shopware()->Db()->fetchAll($sql);
		foreach($result as $key => $value){
			$result[$key]['name'] = htmlentities($value['name']);
		
			if($value['last_started'] == '0000-00-00 00:00:00' || $value['last_started'] === null ){
				$result[$key]['last_started'] = '-';
			} else {
				$result[$key]['last_started'] = date('d.m.Y H:i', strtotime($value['last_started']));
			}
			
			$result[$key]['rule_interval'] = substr($value['rule_interval'],0,5);
		}
		
     	$this->View()->assign(array(
            'success' => true, 'data' => $result, 'total' => count($result)
        ));			
	}
	
	public function getRuleSetAction(){
		//$this->View()->setTemplate();
		

		$id = (int)$this->Request()->id;

		if($id > 0){
			
			$sql = 'SELECT * FROM s_bestellstatus_manager_rulesets WHERE id = '.$id;
	
			if(Shopware()->Db()->query($sql)){	
				$result = Shopware()->Db()->fetchRow($sql);
				$result['name'] = utf8_encode($result['name']);
				$result['rule_interval'] = substr($result['rule_interval'],0,5);

				$this->View()->assign(array(
					'success' => true, 'data' => $result, 'total' => 1
				));						
							
			} else {
				$this->View()->assign(array(
					'success' => false, 'data' => 'DB_SELECT_FAILED'
				));	
			}
		} else {
				$this->View()->assign(array(
					'success' => false, 'data' => 'MISSING_PARAM_NUMBER'
				));		
		}
	}		

	public function updateRuleSetAction(){
		//$this->View()->setTemplate();
		
		if($this->request()->id){
			$id = (int)$this->request()->id;
			
			$name = utf8_decode($this->request()->name);
			
			$rule_interval = $this->request()->rule_interval;
			
			if($this->request()->is_inactive == 'on'){
				$is_inactive = 1;
			} else {
				$is_inactive = 0;
			}
			
			$email_template = (int) $this->request()->email_template;			
			
			$s_order_age = (int) $this->request()->s_order_age;
			$s_edit_age = (int) $this->request()->s_edit_age;
			
			$s_order_status_before = (int) $this->request()->s_order_status_before;
			$s_order_status_after =  (int) $this->request()->s_order_status_after;
			$s_order_payment_before = (int) $this->request()->s_order_payment_before;
			$s_order_payment_after = (int) $this->request()->s_order_payment_after;
			$s_order_paymentID = (int) $this->request()->s_order_paymentID;	
	
	
			$sql = 'UPDATE s_bestellstatus_manager_rulesets 
			SET 
			name = ?,
			is_inactive = ?,
			last_started = ?,
			rule_interval = ?,
			s_order_status_before = ?,
			s_order_status_after = ?,
			s_order_payment_before = ?,
			s_order_payment_after = ?,
			s_order_paymentID = ?,
			s_order_age = ?,
			email_template  = ?,
			s_edit_age  = ?
			WHERE id = ?';
						
			Shopware()->Db()->query($sql, array($name,$is_inactive,$last_started,$rule_interval,$s_order_status_before,$s_order_status_after,$s_order_payment_before,$s_order_payment_after,$s_order_paymentID,$s_order_age,$email_template,$s_edit_age,$id));	
				echo '{"success":true}';
				die();
			
				
		}
		echo 'MISSING_PARAM_NUMBER';
		//die();
	}	
	
	
	public function createRuleSetAction(){
		$this->View()->setTemplate();
		
		if($this->request()->name){
		
			$name = utf8_decode($this->request()->name);
			
			$rule_interval = $this->request()->rule_interval;
			
			if($this->request()->is_inactive == 'on'){
				$is_inactive = 1;
			} else {
				$is_inactive = 0;
			}
			
			$email_template = (int) $this->request()->email_template;			
			$s_order_age = (int) $this->request()->s_order_age;
			$s_edit_age = (int) $this->request()->s_edit_age;
			$s_order_status_before = (int) $this->request()->s_order_status_before;
			$s_order_status_after =  (int) $this->request()->s_order_status_after;
			$s_order_payment_before = (int) $this->request()->s_order_payment_before;
			$s_order_payment_after = (int) $this->request()->s_order_payment_after;
			$s_order_paymentID = (int) $this->request()->s_order_paymentID;	
					
			$last_started = 0;	
			
		} else {
		$result = 'no ajax param';
		}    

		$sql = 'INSERT INTO s_bestellstatus_manager_rulesets (
		name,
		is_inactive,
		last_started,
		rule_interval,
		s_order_status_before,
		s_order_status_after,
		s_order_payment_before,
		s_order_payment_after,
		s_order_paymentID,
		s_order_age,
		email_template,
		s_edit_age
		)
		VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
		Shopware()->Db()->query($sql, array($name,$is_inactive,$last_started,$rule_interval,$s_order_status_before,$s_order_status_after,$s_order_payment_before,$s_order_payment_after,$s_order_paymentID,$s_order_age,$email_template,$s_edit_age));
		//Shopware()->Log()->log($result,Zend_Log::INFO);
		echo '{"success":true}';
		//echo Zend_Json::encode(array("data"=>$result,"count"=>count($result)));

	}
	
		
	
	public function deleteRuleSetAction(){
		$this->View()->setTemplate();
		
		if($this->request()->id){
			$id = (int)$this->request()->id;
			$sql = 'DELETE FROM s_bestellstatus_manager_rulesets WHERE id = '.$id;
			
			Shopware()->Db()->query($sql);	
				echo 'SUCCESS';
				die();
		}
		echo 'MISSING_PARAM_NUMBER';
		die();
	}	

	public function getOrderStatesAction(){

		$sql = "SELECT id, description FROM s_core_states WHERE `group`='state' AND id>=0 ORDER BY position ASC";
		$result = Shopware()->Db()->fetchAll($sql);
		
		foreach($result as $key => $value){
			$result[$key]['description'] = $value['description'];
		}
		
		$result[] = array('id'=>999,'description'=>'IGNORIEREN');
      
	   $this->View()->assign(array(
            'success' => true, 'data' => $result, 'total' => count($result)
        ));
	}


	public function getEmailTemplatesAction(){
		
		$sql = "SELECT sc.id, sc.description, sc.`group`, sm.name FROM s_core_states sc, s_core_config_mails sm 
		WHERE sc.id >= 0 
		AND sm.name = CONCAT('sORDERSTATEMAIL',sc.id)
		ORDER BY sc.`group` DESC, sc.id ASC";
		

		$result = Shopware()->Db()->fetchAll($sql);
		
		foreach($result as $key => $value){
			if($value['group'] == 'state'){
				$group = 'Bestellstatus';
			} else if ($value['group'] == 'payment'){
				$group = 'Zahlstatus';
			}
			$result[$key]['description'] = utf8_encode($value['description']);
			$result[$key]['group'] = utf8_encode($group);
		}
	
		$result[] = array('id'=>999,'description'=>'IGNORIEREN');
		//echo Zend_Json::encode(array("data"=>$result,"count"=>count($result)));
     	$this->View()->assign(array(
            'success' => true, 'data' => $result, 'total' => count($result)
        ));			
	}

	public function getOrderAgeAction(){
		
		$result = array(array('id' =>1,'description'=>'1 Tag'));
		
		for($i=2;$i<31;$i++){
			$result[] = array('id' =>$i,'description'=>$i.' Tage');
		}
		
		$result[] = array('id'=>999,'description'=>'IGNORIEREN');
     	$this->View()->assign(array(
            'success' => true, 'data' => $result, 'total' => count($result)
        ));			
		//echo Zend_Json::encode(array("data"=>$result,"count"=>count($result)));
	}

	public function getPaymentmeansAction(){

		$sql = "SELECT id, description FROM s_core_paymentmeans WHERE active>=0 ORDER BY id ASC";
		$result = Shopware()->Db()->fetchAll($sql);
		
		foreach($result as $key => $value){
			$result[$key]['description'] =  utf8_encode($value['description']);
		}
		
		$result[] = array('id'=>999,'description'=>'IGNORIEREN');
		
	
     	$this->View()->assign(array(
            'success' => true, 'data' => $result, 'total' => count($result)
        ));			
		
		//echo Zend_Json::encode(array("data"=>$result,"count"=>count($result)));
	}

	public function getPaymentStatesAction(){
	
		$sql = "SELECT id, description FROM s_core_states WHERE `group`='payment' AND id>=0 ORDER BY position ASC";
		$result = Shopware()->Db()->fetchAll($sql);
		
		foreach($result as $key => $value){
			$result[$key]['description'] = utf8_encode($value['description']);
		}
		
		$result[] = array('id'=>999,'description'=>'IGNORIEREN');
     	$this->View()->assign(array(
            'success' => true, 'data' => $result, 'total' => count($result)
        ));	
		//echo Zend_Json::encode(array("data"=>$result,"count"=>count($result)));
	}


}