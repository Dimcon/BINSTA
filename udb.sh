

# Helper scipt to aid in upgrading/downgrading SQL Alchemy database.
#	Use
#		./udb [option]
#		option = migrate/upgrade/downgrade/create
#		Migrate creates upgrade scripts based on the existing models. The rest is self explanatory.
upgrade(){
	echo [i] Upgrading database.
	cp ./db_ops/db_upgrade.py ./
	./db_upgrade.py
	rm ./db_upgrade.py
}

downgrade(){
	echo [i] Downgrading database.
	cp ./db_ops/db_downgrade.py ./
	./db_downgrade.py
	rm ./db_downgrade.py
}
create(){
	echo [i] Creating database.
	cp ./db_ops/db_create.py ./
	./db_create.py
	rm ./db_create.py
}

migrate() {
	echo [i] Creating database migration.
	cp ./db_ops/db_migrate.py ./
	./db_migrate.py
	rm ./db_migrate.py
}

case "$1" in
	"upgrade" )
	upgrade;
	;;
	"downgrade" )
	downgrade;
	;;
	"create" )
	create;
	;;
	"migrate" )
	migrate;
	;;
esac
