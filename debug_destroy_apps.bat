@echo off

echo Destroying fuseki
call heroku destroy aoame-fuseki-test --confirm aoame-fuseki-test

echo Destroying webservice
call heroku destroy aoame-webservice-test --confirm aoame-webservice-test

echo Destroying webapp
heroku destroy aoame-webapp-test --confirm aoame-webapp-test