:: Copyright Epic Games, Inc. All Rights Reserved.
@echo off
if not "%1"=="am_admin" (powershell start -verb runas '%0' am_admin & exit /b)

pushd "%~dp0"

title STUN
start stunserver.exe 0.0.0.0:19302

title Cirrus

pushd ..\..

::Install required deps
call powershell -command "%~dp0\Start_WithTURN_SignallingServer.ps1" --publicIp "1.2.3.4"

::Run node server
::If running with frontend web server and accessing outside of localhost pass in --publicIp=<ip_of_machine>
node cirrus %*

popd

popd

pause
