@echo off

echo AOAME deployment script started.

set webapp_name=aoame-webapp-test
set webservice_name=aoame-webservice-test
set fuseki_name=aoame-fuseki-test
set region=eu

set base_dir=%cd%\aoame

mkdir aoame

rem check if commands exist

where git
if %ERRORLEVEL% neq 0 (
	echo git command could not be found
	goto exit
)

where heroku
if %ERRORLEVEL% neq 0 (
	echo heroku command could not be found
	goto exit
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


rem clone and deploy fuseki
set name=%fuseki_name%
set git_name=fuseki-heroku-test
set git_repository=https://github.com/BPaaSModelling/fuseki-heroku-test.git

call :clone_repository
call :deploy_repository

call heroku open --app %fuseki_name%

rem clone and deploy webservice
set name=%webservice_name%
set git_name=OntologyBasedModellingEnvironment-WebService
set git_repository=https://github.com/BPaaSModelling/OntologyBasedModellingEnvironment-WebService.git

call :clone_repository

call :deploy_repository

call heroku config:set TRIPLESTORE_ENDPOINT=https://%fuseki_name%.herokuapp.com/ModEnv --app %webservice_name%

call heroku open --app %webservice_name%

rem clone and deploy webapp
set name=%webapp_name%
set git_name=OntologyBasedModellingEnvironment-WebApp
set git_repository=https://github.com/BPaaSModelling/OntologyBasedModellingEnvironment-WebApp.git

call :clone_repository

call :deploy_repository

call heroku config:set WEBSERVICE_ENDPOINT=https://%webservice_name%.herokuapp.com/ModEnv --app %webapp_name%

call heroku open modeller --app %webapp_name%

pause
goto end

:clone_repository

cd %base_dir%

if not exist %git_name% (
	
	echo Cloning %git_name% repository from %git_repository%
	
	call git clone %git_repository%
	
	if not exist %git_name% (
		echo Failed to clone repository %git_name% from %git_repository%
		exit
	)
)
goto end


:deploy_repository

cd %base_dir%\%git_name%

call heroku create %name% --region %region%
if %ERRORLEVEL% neq 0 (
	echo Could not create app %name%
	exit
)
call git push heroku master
cd %base_dir%

:end
