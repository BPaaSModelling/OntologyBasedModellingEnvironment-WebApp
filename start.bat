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

echo Starting webapp
call heroku ps:scale web=1 --app %webapp_name%
call heroku open modeller --app %webapp_name%

echo Starting webservice
call heroku ps:scale web=1 --app %webservice_name%

echo Starting fuseki
call heroku ps:scale web=1 --app %fuseki_name%
call heroku open --app %fuseki_name%

echo Startup complete

:exit
pause