@echo off

rem This script destroys the following apps from Heroku.

set webapp_name=aoame-webapp-test
set webservice_name=aoame-webservice-test
set fuseki_name=aoame-fuseki-test

rem -------------------------------

set /p prompt=Are you sure you want to destroy the apps "%webapp_name%", "%webservice_name%" and "%fuseki_name%?" (This can not be undone) [y/N]
if /i "%prompt%" neq "Y" goto end 

where git
if %ERRORLEVEL% neq 0 (
	echo Git is required for this script to work. You can download it from https://git-scm.com/downloads
	pause
	goto end
)

where heroku
if %ERRORLEVEL% neq 0 (
	echo The Heroku Command Line Interface is required for this script to work. You can downoad it from https://devcenter.heroku.com/articles/heroku-cli
	pause
	goto end
)

rem check if the user is logged into heroku

echo Checking heroku login

:check-login

call heroku whoami
if %ERRORLEVEL% neq 0 (
	echo Not logged into heroku
	call heroku login
	goto check-login
) else (
	echo Logged into heroku
)



echo Destroying fuseki
call heroku destroy %webapp_name% --confirm aoame-fuseki-test

echo Destroying webservice
call heroku destroy %webservice_name% --confirm aoame-webservice-test

echo Destroying webapp
heroku destroy %fuseki_name% --confirm aoame-webapp-test

:end