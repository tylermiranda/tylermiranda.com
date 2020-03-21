Import-Module "$PSScriptRoot\UniversalDashboard.Community.psd1" 
$Dashboard = . "$PSScriptRoot\poshud\dashboard.ps1"
Start-UDDashboard -Wait -Dashboard (
    New-UDDashboard -Title "Hello, Azure" -Content {
        New-UDCard -Title "Hello, Azure"
    }
)