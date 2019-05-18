cat requirements.txt | while read PACKAGE; do ./flask/bin/pip install "$PACKAGE"; done
