<#
	.NOTES
	===========================================================================
	 Created with: 	vscode
	 Initially Created on:   	03/22/2018 12:46 PM
	 Created by:   	Tyler Miranda	
	============================================================================
	.DESCRIPTION
    This script will look for an event logged in the event viewer and if found will add that server to an array and put it into maintenance mode.  After it checks all the machines in the delivery group, it will then go through that
    array and put each one into maintenance mode. The next time the script runs, it will only check machines that are not in maintenance mode already.
    .EXAMPLE
    WinEventFinder.ps1 -controller "xdc01.contoso.com" -deliverygroup "2016_PD" -LogPath "\\fs01\Logs\WinEventFinder.log" -LogName "System" -ID "7011"
#>
param (
    [Parameter(Mandatory = $true)][string]$controller,
    [Parameter(Mandatory = $true)][string]$deliverygroup,
    [Parameter(Mandatory = $true)][string]$LogPath,
    [Parameter(Mandatory = $false)][string]$SendEmail = "no",
    [Parameter(Mandatory = $false)][string]$SMTPserver,
    [Parameter(Mandatory = $false)][string]$EmailTo,
    [Parameter(Mandatory = $false)][string]$EmailFrom,
    [Parameter(Mandatory = $false)][string]$Subject,
    [Parameter(Mandatory = $true)][string]$LogName,
    [Parameter(Mandatory = $true)][string]$ID
)

Start-Transcript -Path $LogPath -Append
asnp Citrix*
$timelimit = (get-Date).AddHours(-10)
$machines = Get-BrokerMachine -AdminAddress $controller -MaxRecordCount 1000 -Filter {(DesktopGroupName -eq $deliverygroup) -and (InMaintenanceMode -eq $false)} 
$machinesCount = $machines.Count

$sessions = Get-BrokerSession -AdminAddress $controller -MaxRecordCount 2000 -Filter {DesktopGroupName -eq $deliverygroup} | select -ExpandProperty username
$sessionsCount = $sessions.Count
$sessionAverage = $sessionsCount / $machinesCount
$sessionAverageRound = [math]::Round($sessionAverage, 1)

$badMachines = @()
foreach ($machine in $machines) {
    $ErrorPresent = Get-WinEvent -ComputerName $machine.HostedMachineName -FilterHashtable @{LogName = $LogName; ID = $ID; StartTime = $timelimit } -MaxEvents 5 -ErrorAction SilentlyContinue
    if ($ErrorPresent.Length -gt 0) {
        $FriendlyMachineName = $machine.HostedMachineName
        Write-Output "Error present on server and placed in maintenance mode: $FriendlyMachineName"
        Set-BrokerMachineMaintenanceMode $machine.MachineName -MaintenanceMode $true
        $badMachines += $machine.HostedMachineName
    }
      
}

if ($badMachines.Count -gt 0) {
    Write-Output "The following machines have the error present and were placed in maintenance mode:"
    Write-Output $badMachines
    $badmachineCount = $badMachines.Count
    Write-Output "There are $badMachineCount bad machines"

}
else {
    Write-Output "`n"
    Write-Output "No bad servers found this time around.`n"
    Write-Output "To recap, the following servers are in maintenance mode:`n"
    $maintServers = Get-BrokerMachine -AdminAddress $controller -MaxRecordCount 1000 -Filter {(DesktopGroupName -eq $deliverygroup) -and (InMaintenanceMode -eq $true)} | select -ExpandProperty HostedMachineName
    $maintServersFormatted = $maintServers -join "`n"
    Write-Output "$maintServersFormatted"
    $maintServersCount = $maintServers.Count
    Write-Output "`n$maintServersCount server(s) are in maintenance mode."
    Write-Output "`nThere are $sessionsCount total user sessions on $machinesCount good servers. That's an average of $sessionAverageRound sessions per server.`n"
}
if ($badMachines.Count -gt 0) {
    if ($SendEmail -ne "no") {
        Send-MailMessage -SmtpServer $SMTPserver -To $EmailTo -From $EmailFrom -Subject $Subject -Body $maintServersFormatted
    }  
}
Stop-Transcript | Out-Null
