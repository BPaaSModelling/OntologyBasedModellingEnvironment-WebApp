@echo off

rem This script can be used to deploy AOAME on Heroku.
rem Prerequisites: git ( https://git-scm.com/downloads ), Heroku CLI ( https://devcenter.heroku.com/articles/heroku-cli )

rem ----------------------------------

rem !!!!The following three variables need to be changed because Heroku apps need to have unique names!!!!

rem These are the names that Heroku will use when deploying AOAME.
set webapp_name=aoame-webapp-test
set webservice_name=aoame-webservice-test
set fuseki_name=aoame-fuseki-test

rem Change these variable if you want to deploy a branch other than the master branch.
set webapp_branch=master
set webservice_branch=master
set fuseki_branch=master


rem This variable determines where heroku will deploy your software.
rem You can use the command "heroku regions" to list the regions that are available to you.
rem By default these are "eu" and "us" (Europe and United States).
rem For more information see https://devcenter.heroku.com/articles/regions
set heroku_region=eu

rem --------------It is not recommended to change things below this line.---------------------

echo AOAME deployment script started.

set base_dir=%cd%\aoame

mkdir aoame

rem check if commands exist

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


rem clone and deploy fuseki
set name=%fuseki_name%
set git_name=fuseki-heroku-test
set git_repository=https://github.com/BPaaSModelling/fuseki-heroku-test.git
set branch=%fuseki_branch%

call :clone_repository
call :deploy_repository
call heroku open --app %name%

rem clone and deploy webservice
set name=%webservice_name%
set git_name=OntologyBasedModellingEnvironment-WebService
set git_repository=https://github.com/BPaaSModelling/OntologyBasedModellingEnvironment-WebService.git
set branch=%webservice_branch%

call :clone_repository
call :deploy_repository

call heroku config:set TRIPLESTORE_ENDPOINT=https://%fuseki_name%.herokuapp.com/ModEnv --app %name%

call heroku open --app %name%

rem clone and deploy webapp
set name=%webapp_name%
set git_name=OntologyBasedModellingEnvironment-WebApp
set git_repository=https://github.com/BPaaSModelling/OntologyBasedModellingEnvironment-WebApp.git
set branch=%webapp_branch%

call :clone_repository
call :deploy_repository

call heroku config:set WEBSERVICE_ENDPOINT=https://%webservice_name%.herokuapp.com --app %name%

call heroku open modeller --app %name%

pause
goto end

rem Clone a repository if it does not exist already.
:clone_repository

cd %base_dir%

if not exist %git_name% (
	
	echo Cloning %git_name% repository from %git_repository%
	
	call git clone %git_repository%
	
	if not exist %git_name% (
		echo Failed to clone repository %git_name% from %git_repository%
		pause
		exit
	)
)
goto end

rem Create a heroku app and push the selected branch to deployment it.
:deploy_repository

cd %base_dir%\%git_name%

call heroku create %name% --region %heroku_region%

if %ERRORLEVEL%==0 goto app_created

set /P result=Continue? [y/N]
if /i "%result%" neq "Y" exit

:app_created

git checkout %branch%
call git push heroku %branch%:main
cd %base_dir%

:end
