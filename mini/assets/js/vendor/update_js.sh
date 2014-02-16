# version manager :)
# should be using yeoman
# last updated 11/24/2012

rm *backbone*
rm *jquery*
rm *lodash*
rm *handlebars*
rm *pubnub*

wget -nd -r http://backbonejs.org/backbone.js
wget -nd -r http://backbonejs.org/backbone-min.js

wget -nd -r http://code.jquery.com/jquery-1.9.1.js -O jquery.js
wget -nd -r http://code.jquery.com/jquery-1.9.1.min.js -O jquery.min.js

wget -nd -r https://raw.github.com/bestiejs/lodash/v1.0.1/dist/lodash.underscore.js
wget -nd -r https://raw.github.com/bestiejs/lodash/v1.0.1/dist/lodash.underscore.min.js

#wget -nd -r http://code.jquery.com/mobile/1.2.0/jquery.mobile-1.2.0.min.js -O jquery.mobile.min.js
#wget -nd -r http://code.jquery.com/mobile/1.2.0/jquery.mobile-1.2.0.js -O jquery.mobile.js

wget -nd -r http://code.jquery.com/mobile/1.3.0-rc.1/jquery.mobile-1.3.0-rc.1.js -O jquery.mobile.js
wget -nd -r http://code.jquery.com/mobile/1.3.0-rc.1/jquery.mobile-1.3.0-rc.1.min.js -O jquery.mobile.min.js

wget -nd -r https://raw.github.com/wycats/handlebars.js/1.0.0-rc.3/dist/handlebars.js