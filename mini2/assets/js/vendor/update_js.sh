# version manager :)
# should be using yeoman
# last updated 11/24/2012

rm *jquery*
rm *lodash*

wget -nd -r http://code.jquery.com/jquery-1.9.1.js -O jquery.js
wget -nd -r http://code.jquery.com/jquery-1.9.1.min.js -O jquery.min.js

wget -nd -r https://raw.github.com/bestiejs/lodash/v1.2.0/dist/lodash.js
wget -nd -r https://raw.github.com/bestiejs/lodash/v1.2.0/dist/lodash.min.js


wget -nd -r http://code.jquery.com/mobile/1.3.1/jquery.mobile-1.3.1.js -O jquery.mobile.js
wget -nd -r http://code.jquery.com/mobile/1.3.1/jquery.mobile-1.3.1.min.js -O jquery.mobile.min.js
