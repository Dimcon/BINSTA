


debug: 
	# Deleting old installation
	sudo rm -rf /var/www/peopledev.com/public_html/* #(You probably don't want to do this)
	sudo mkdir -p /var/www/peopledev.com/public_html
	# Copying new installation
	sudo cp -R ../LMS/* /var/www/peopledev.com/public_html
	# Set permissions
	sudo chown www-data:www-data -R /var/www/peopledev.com/*
	sudo chmod a+wr -R /var/www/peopledev.com/*
	# Reloading Apache
	sudo service apache2 reload	


deploy: 
	# Deleting old installation
	# sudo rm -rf /var/www/peopledev.com/public_html/* #(You probably don't want to do this)
	date
	sudo mkdir -p /var/www/peopledev.com/public_html
	# Copying new installation
	sudo cp -R ../LMS/* /var/www/peopledev.com/public_html
	# Set permissions
	sudo chown www-data:www-data -R /var/www/peopledev.com/*
	sudo chmod 755 -R /var/www/peopledev.com/*
	# Reloading Apache
	#sudo service apache2 reload	

apache:
	sudo apt-get install libapache2-mod-fastcgi
	a2enmod fastcgi

test:
	./installLMS.sh

populatedb:
	./udb.sh create
	./populatedatabase.py

emptydb:
	rm ./lmsapp.db
	./udb.sh create
