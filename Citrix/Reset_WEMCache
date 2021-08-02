<#
.SYNOPSIS
  For use with ControlUp Script based actions. 
  Refreshes WEM cache on remote machine.

  Update the database locations below to match your cache locations.
.INPUTS
  None
.OUTPUTS
  None
.NOTES
  Version:        1.0
  Author:         Tyler Miranda
  Creation Date:  9/24/2020
  #>

$server = $args[0]
$Services = "Netlogon","WemAgentSvc"

#Change these to match the location of your WEM cache
$DatabaseDir = 'D:\Cache\WEM'
$Databases = Get-ChildItem "D:\Cache\WEM\*.db"

Write-Host "Attempting to refresh the WEM cache on $server" -ForegroundColor Yellow
sleep 2
try {
    #Stop the services
    foreach ($service in $Services) {
        Stop-Service $service -Force
        Write-Host "$service has stopped"
    }
    #Delete the WEM Agent Cache
    cd $DatabaseDir
    Remove-Item $Databases
    Write-Host "Databases have been deleted"
    #Start Services
    #Start Netlogon Service which will start Norskale
    foreach ($service in $Services)
    {
        Start-Service $service
        Write-Host "$service is running."
    }
    Write-Host "Successfully refreshed WEM cache on $server" -ForegroundColor Green
}
catch {
    Write-Host "Failed to refresh WEM cache on $server. Error message: $($_.Exception.Message)" -ForegroundColor Red
}
