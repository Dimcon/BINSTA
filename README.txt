####################################################
########     Using the makefile:

make \

populatedb -> Runs the python script to fill the database with dummy data
(NB: Delete the database file lmsapp.db before running this)

emptydb -> Deletes the database and runs the script that recreates an empty database with the structure according to SQLAlchemy in the ./app/models.py directory

(NB: After any changes to the ./app/models.py table structure setup, you must run "./udb migrate" followed by "./udb upgrade" fo the changes to take effect. This uses SQLAlchemy's migration feature and thus records remain unchanged after an upgrade.)

test -> Runs the pip from the python virtual environment to install all the dependancies required for the site.
(This uses the file requirements.txt to find what to install)

deploy -> This will create the directory /var/www/peopledev.com/public_html and copy this directories contents into it, set the owner of every file in the folder to www-data (as per apache) and then sets all permissions to read and write (and execute for root)
The aoache2 service is then reset to allow the installation to take effect.

debug -> Does the same as deploy except it assumes the files are already there.



##############################################################
######	 Setting up the site
Apache FastCGI requires the following package to be installed and enabled:
'libapache2-mod-fastcgi'
There is a make target to install it (run "make apache")

./poepledev.com.conf is the configuration that I used in /etc/apache2/sites-available.
It requires the following certificates
		SSLCertificateFile	/etc/apache2/ssl/apache.crt
		SSLCertificateKeyFile /etc/apache2/ssl/apache.key

The configuration needs to point to the file ./LMS which is the script that FastCGI runs.

###################################################
######	Configuration
./config.py contains a once-off configuration for the site.

ROOTDIR needs to be set with the root at the "public_html" or equivalent within the peopledev.com site. It needs LMS as this script is the Fast-cgi script that launches the LMS website.
