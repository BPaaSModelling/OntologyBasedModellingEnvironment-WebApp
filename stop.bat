@echo off

set webapp_name=aoame-webapp-test
set webservice_name=aoame-webservice-test
set fuseki_name=aoame-fuseki-test

where git
if %ERRORLEVEL% neq 0 (
	echo Please download and install git from https://git-scm.com/downloads
	goto exit
) 

where heroku
if %ERRORLEVEL% neq 0 (
	echo Please download and install heroku cli from https://devcenter.heroku.com/articles/heroku-cli
	goto exit
) 

echo Stopping webapp
call heroku ps:scale web=0 --app %webapp_name%

echo Stopping webservice
call heroku ps:scale web=0 --app %webservice_name%

echo Stopping fuseki
call heroku ps:scale web=0 --app %fuseki_name%

echo Closed all services

:exit
pause