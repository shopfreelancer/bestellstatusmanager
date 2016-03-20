<?php
return array(
	'version' => 1.0,
			'autor' => 'Shop Freelancer',
			'copyright' => 'Copyright © 2011, Shop Freelancer',
			'label' => $this->getName(),
			'source' => $this->getSource(),
			'description' => '<div style="font-size:12px;">Mit dem Bestellmanager lassen sich eigene Regelsets für Shopware definieren. Der Shopbetreiber kann damit automatisiert Emails nach einer gewissen Anzahl von Tagen versenden lassen.<br/>
<br/>
Es muss das Cron-Plugin aktiviert sein und ein Cronjob eingerichtet werden z.B. 15 Minuten Takt, siehe <a href="http://wiki.shopware.de/Shopware-Cronjobs_detail_461.html#Crontab_Einrichten">http://wiki.shopware.de/Shopware-Cronjobs_detail_461.html#Crontab_Einrichten</a> Das Plugin überprüft, ob die Bedingungen zutreffen. Im Config-Parameter kann die Genauigkeit bzw. Toleranz justiert werden, welche Bestellungen der Cronjob berücksichtigt. Der Initialwert geht davon aus, dass der Cronjob alle 15 Minuten ausgeführt wird. </div>',
			'license' => '',
			'support' => 'http://www.shop-freelancer.de/',
			'link' => 'http://www.shop-freelancer.de/'
);