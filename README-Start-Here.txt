Okay so the other readme is a little verbose.
I've added most of the setup into the makefile.

"make apache" -> will install the apache module libapache2-mod-fastdcgi and then enable it.

"make populatedb" -> will create an empty database and then populate it with test data(read populatedatabse.py to see the data)

"cat makefile" -> Read what deploy does.

"make deploy" -> will create the directory /var/www/peopledev.com/public_html and then copy all the current directory contents into it.

"cp ./peopledev.com.conf /etc/apache2/sites-available" -> Use my default configuration with FastCGI enabled for the file ./LMS

"a2ensite peopledev.com.conf"

