Get-UDDashboard | Stop-UDDashboard
$Root = $PSScriptRoot
$Date = Get-Date -Format MM/dd/yyyy
Set-UDLicense -License '<License><Terms>PD94bWwgdmVyc2lvbj0iMS4wIj8+DQo8TGljZW5zZVRlcm1zIHhtbG5zOnhzaT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UiIHhtbG5zOnhzZD0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEiPg0KICA8U3RhcnREYXRlPjIwMTktMTAtMDhUMTM6NTU6MTQuMDMwNTQyMSswMDowMDwvU3RhcnREYXRlPg0KICA8VXNlck5hbWU+dHlsZXIubWlyYW5kYUBnbWFpbC5jb208L1VzZXJOYW1lPg0KICA8UHJvZHVjdE5hbWU+VW5pdmVyc2FsRGFzaGJvYXJkPC9Qcm9kdWN0TmFtZT4NCiAgPEVuZERhdGU+MjAyMC0xMC0wN1QxMzo1NToxNC4wMzA1NDIxKzAwOjAwPC9FbmREYXRlPg0KICA8U2VhdE51bWJlcj4xPC9TZWF0TnVtYmVyPg0KICA8SXNUcmlhbD5mYWxzZTwvSXNUcmlhbD4NCjwvTGljZW5zZVRlcm1zPg==</Terms><Signature>RxYDGbu8cIuLOkCxHBghyS+YZ/QNetqb04FqgTaOYD7Qn8BTY2lF2w==</Signature></License>'
$Theme = Get-UDTheme -Name Default
$Global:sites = "azpxxdc04", "azpxxdc01", "codvxdc02"
$Global:LicenseServer = "azpxsf03.freeway-insurance.com"
$Global:PVSservers = "azpxpvs01.freeway-insurance.com", "azpxpvs04.freeway-insurance.com", "codvpvs01.freeway-insurance.com"
Invoke-WebRequest -Uri "https://covidtracking.com/api/us/daily.csv" -OutFile "usdaily.csv"
Invoke-WebRequest -Uri "https://covidtracking.com/api/us.csv" -OutFile "current.csv"
$SessionsSchedule = New-UDEndpointSchedule -Every 1 -Minute
$SessionsEndpoint = New-UDEndpoint -Schedule $SessionsSchedule -Endpoint {
    asnp Citrix*
    $AllSessions = @()
    foreach ($site in $sites) {
        $Sessions = Get-BrokerSession -AdminAddress $site -MaxRecordCount 10000 -Filter { UserName -ne $null } | select Username, SessionState, BrokeringTime, DesktopGroupName, HostedMachineName, ClientAddress
        $AllSessions += $Sessions
    }
    $SessionsCount = $AllSessions.Count

    $Sessions_DB = $SessionsCount
    $Sessions_DB = [PSCustomObject]@{
        'datetime' = (Get-Date -Format "HH:mm")
        'value'    = $SessionsCount
    }
    $Sessions_DB | Export-Csv -NoTypeInformation -Path "Sessions.csv" -Append
    Invoke-WebRequest -Uri "https://covidtracking.com/api/us/daily.csv" -OutFile "usdaily.csv"
    Invoke-WebRequest -Uri "https://covidtracking.com/api/us.csv" -OutFile "current.csv" -
}

<# AUTH SECTION #>

$FormLogin = . (Join-Path $Root "FormLogin.ps1")
$LoginPage = New-UDLoginPage -AuthenticationMethod $FormLogin -LoginFormFontColor "#ffffff" -LoginFormBackgroundColor "#005b99" -PageBackgroundColor '#333333' -Logo (New-UDImage -Url "https://www.confie.com/wp-content/themes/confie/images/confie-seguros.png") -Title "Confie Citrix Health Dashboard Login" -WelcomeText "Login To Confie Citrix Health Dashboard" -LoadingText "Please wait..." -LoginButtonFontColor "#FFFFFF" -LoginButtonBackgroundColor "#FF6666"


$Page1 = New-UDPage -Name "Citrix Overview" -Content {   

    New-UDRow {
        New-UDColumn -Size 12 {
            New-UDGrid -Title "Citrix Sites Overview" -NoFilter -AutoRefresh -RefreshInterval 120 -Endpoint {
                asnp Citrix*
                $AllSites = @()
                $SiteSessions = $null
                $SiteSessionsActive = $null
                foreach ($site in $sites) {        
                    $XAsite = Get-BrokerSite -AdminAddress $site | ForEach-Object {
                        $SiteSessions = Get-BrokerSession -AdminAddress $site -MaxRecordCount 10000 -Filter { UserName -ne $null }
                        $SiteSessionsActive = Get-BrokerSession -AdminAddress $site -MaxRecordCount 10000 -Filter { ((SessionState -eq "Active") -and (UserName -ne $null)) }
                        if ($_.TotalUniqueLicenseUsers -eq $null) {
                            [PSCustomObject]@{
                                "Site"                         = $_.Name + " (Legacy 7.5)"
                                "Total Sessions"               = $SiteSessions.Count
                                "Total Active Sessions"        = $SiteSessionsActive.Count
                                "Licenses In Use"              = "Not Supported in version"
                                "Local Host Cache Enabled"     = "Not Supported in version"
                                "License Grace Period Active?" = [string]$_.LicensingGracePeriodActive
                                "Functional Level"             = "Not Supported in version"
                                "Last Configuration Change"    = "Not Supported in version"
                            }
                        }
                        else {
                            [PSCustomObject]@{
                                "Site"                         = $_.Name
                                "Total Sessions"               = $SiteSessions.count
                                "Total Active Sessions"        = $SiteSessionsActive.Count
                                "Licenses In Use"              = $_.TotalUniqueLicenseUsers
                                "Local Host Cache Enabled"     = [string]$_.LocalHostCacheEnabled
                                "License Grace Period Active?" = [string]$_.LicensingGracePeriodActive
                                "Functional Level"             = [string]$_.DefaultMinimumFunctionalLevel
                                "Last Configuration Change"    = [string]$_.ConfigLastChangeTime
                            }
                        }

                    }
                    $AllSites += $XAsite
                }
                $AllSites | Out-UDGridData
            }
        }
        New-UDColumn -Size 5 {
            New-UDCounter -Title "Total Sessions" -RefreshInterval 120 -AutoRefresh -Endpoint {
                asnp Citrix*
                $AllSessions = @()
                foreach ($site in $sites) {
                    $Sessions = Get-BrokerSession -AdminAddress $site -MaxRecordCount 10000 -Filter { UserName -ne $null } | select Username, SessionState, BrokeringTime, DesktopGroupName, HostedMachineName, ClientAddress
                    $AllSessions += $Sessions
                }
                $Count = $AllSessions.Count
                    
                $Count
            } -Icon users -TextSize Large
            
        
            
            New-UDChart -Title "Sessions Over Time" -Type Line -AutoRefresh -RefreshInterval 60 -Endpoint {
                $SessionsCount = Import-Csv -Path "Sessions.csv"
                $SessionsCount | Out-UDChartData  -LabelProperty "datetime" -Dataset @(
                    New-UDChartDataset -DataProperty 'value' -Label "User Count"
                    #New-UDChartDataset -DataProperty 'datetime' -Label "Time"
                )
            } 

        }
        New-UDColumn -Size 7 {
            New-UDGrid -Title "Unregistered Production Machines" -PageSize 5 -AutoRefresh -RefreshInterval 60 -Endpoint {
                    
                asnp citrix*
                $AllurMachines = @()
                foreach ($site in $sites) {
                    $urmachines = Get-BrokerMachine -AdminAddress $site -Filter { ((RegistrationState -eq "Unregistered") -and (DesktopGroupName -notlike "*DEV*") -and (HostedMachineName -ne "AZPXTSLCCTX009") -and (HostedMachineName -ne $null)) } | ForEach-Object {
                        [PSCustomObject]@{
                            "Machine Name"       = $_.HostedMachineName
                            "Power State"        = [string]$_.PowerState
                            "Delivery Group"     = $_.DesktopGroupName
                            #$stringPowerState = [string]$_.PowerState
                            "Registration State" = [string]$_.RegistrationState
                            "Last De-Reg Time"   = $_.LastDeregistrationTime
                            "Last De-Reg Reason" = [string]$_.LastDeregistrationReason
                            #"Action"             = New-UDButton -Text "Power On"
                        }
                    }
                    $AllurMachines += $urmachines  
                } $AllurMachines | Out-UDGridData
            }
        }
        New-UDColumn -Size 7 {
            New-UDGrid -Title "Hosting Connections State" -NoFilter -PageSize 5 -AutoRefresh -RefreshInterval 120 -Endpoint {
                    
                asnp citrix*
                $AllHypConn = @()
                foreach ($site in $sites) {
                    $hypconn = Get-BrokerHypervisorConnection -AdminAddress $site | ForEach-Object {
                        [PSCustomObject]@{
                            "DDC"              = $_.PreferredController
                            "Name"             = $_.Name
                            #$stringPowerState = [string]$_.PowerState
                            "Connection State" = [string]$_.State
                        }
                    }
                    $AllHypConn += $hypconn  
                } $AllHypConn | Out-UDGridData
            }

            New-UDGrid -Title "Average User Counts" -FilterText "Filter by Delivery Group" -PageSize 5 -AutoRefresh -RefreshInterval 120 -DefaultSortColumn "Avg Users/VDA" -DefaultSortDescending -Endpoint {
                    
                asnp citrix*
                $AllDGs = @()
                foreach ($site in $sites) {
                    $DGs = Get-BrokerDesktopGroup -AdminAddress $site -Filter { (Name -notlike "*DEV*") } | where { $_.Sessions -gt 0 } | select Name, Sessions, DesktopsInUse | ForEach-Object {
                        [PSCustomObject]@{
                            "Name"          = $_.Name
                            "Sessions"      = $_.Sessions
                            "VDAs"          = $_.DesktopsInUse
                            "Avg Users/VDA" = [math]::Round(($_.Sessions / $_.DesktopsInUse), 1)
                        }
                    }
                    $AllDGs += $DGs
                } $AllDGs | Out-UDGridData
            }
        }
    }        
    
    New-UDRow {
            
        <# Not using right now
            New-UDColumn -Size 12 {
                New-UDHtml -Markup "<div class='card' style='background: rgba(37, 37, 37, 1); color: rgba(255, 255, 255, 1)'><div class='card-content'><span class='card-title'>About Universal Dashboard</span><p>Universal Dashboard is a cross-platform PowerShell module used to design beautiful dashboards from any available dataset. Visit GitHub to see some example dashboards.</p></div><div class='card-action'><a href='https://www.github.com/adamdriscoll/poshprotools'>GitHub</a></div></div>"
            }
            #>
    
            

    }
    New-UDRow {
        New-UDColumn -Size 6 {
            New-UDGrid -Title "Reboot Schedule Failures" -Headers @("Delivery Group Name", "Start Time", "Finish Time", "Machines Failed", "Machines Completed") -Properties @("DesktopGroupName", "StartTime", "EndTime", "MachinesFailed" , "MachinesCompleted") -Endpoint {
                    
                asnp citrix*
                foreach ($site in $sites) {
                    $results = Get-BrokerRebootCycle -AdminAddress $site -Filter { (DesktopGroupName -notlike "*dev*") -and (State -ne "Completed") }
                    $AllResults += $results
                } $AllResults | sort EndTime -Descending | Out-UDGridData
            }
        }
            
        New-UDColumn -Size 6 {
            New-UDGrid -Title "Current User Sessions"  -Headers @("Username", "Server", "Image Name", "Logon Time") -Properties @("UntrustedUserName", "HostedMachineName", "DesktopGroupName", "BrokeringTime") -AutoRefresh -RefreshInterval 20 -Endpoint {
                    
                asnp citrix*
                $AllSessions = @()
                foreach ($site in $sites) {
                    $sessions = Get-BrokerSession -AdminAddress $site -Filter { (BrokeringTime -ne $null) -and (username -ne $null) }  #| select Username,HostedMachineName
                    $AllSessions += $sessions
                } $AllSessions | sort BrokeringTime | Out-UDGridData
            }
        }
    }
}
$Page2 = New-UDPage -Name "VDA Status" -Content {
    New-UDRow {
        New-UDColumn -Size 4 {      
            New-UDCounter -Title "Total VDA Servers" -Endpoint {
                asnp Citrix*
                foreach ($site in $sites) {
                    $machines = Get-BrokerMachine -AdminAddress $site 
                    $AllMachines += $machines
                }
                $Count = $AllMachines.Count

                $Count 

            } -Icon server -TextSize Large 
                
        }
        New-UDColumn -Size 4 {
            New-UDGrid -Title "Production Machines in Maintenance" -Headers @("Machine Name") -Properties @("HostedMachineName") -AutoRefresh -RefreshInterval 120 -Endpoint {
                    
                asnp citrix*
                $AllMachines = @()
                foreach ($site in $sites) {
                    $machines = Get-BrokerMachine -AdminAddress $site -Filter { ((PowerState -eq "On") -and (DesktopGroupName -notlike "*dev*") -and (InMaintenanceMode -eq $true)) }
                    $AllMachines += $machines                  
                } $AllMachines | Out-UDGridData
            }
        }
    }
    New-UDRow {
        New-UDColumn -Size 12 {
            New-UDGrid -Title "All VDA Status"  -AutoRefresh -RefreshInterval 120 -Endpoint {                   
                asnp citrix*
                $AllMachines = @()
                foreach ($site in $sites) {
                    $machines = Get-BrokerMachine -AdminAddress $site -MaxRecordCount 10000 -Filter { HostedMachineName -ne $null } | sort -Descending SessionCount | ForEach-Object {
                        [PSCustomObject]@{
                            "VDA Name"           = $_.HostedMachineName
                            "Delivery Group"     = $_.DesktopGroupName
                            "VM Host"            = $_.HostingServerName
                            "Power State"        = [string]$_.PowerState
                            "Session Count"      = $_.SessionCount
                            "Registration State" = [string]$_.RegistrationState
                        }
                    }
                    $AllMachines += $machines                  
                } $AllMachines | Out-UDGridData
            }
        }
        <# WIP
        New-UDColumn -Size 5 {
            New-UDGrid -Title "vDisk Information" -Endpoint {    
                Import-Module "C:\Program Files\Citrix\Provisioning Services Console\Citrix.PVS.SnapIn.dll"
                $AllServers = New-Object System.Collections.Generic.List[string]             
                foreach ($server in $PVSservers) {
                    Set-PvsConnection -Server $server
                    $devices = Get-PvsDeviceInfo | ForEach-Object {
                        [PSCustomObject]@{
                            'VDA'         = $_.DeviceName
                            'Disk'        = $_.DiskFileName
                            'Version'     = $_.DiskVersion
                            'IP Address'  = $_.Ip
                            'MAC Address' = $_.DeviceId
                        }
                    }
                    $AllServers.Add($devices)
                } $AllServers | Out-UDGridData
            }
        }
        #>
    }
}
$Page3 = New-UDPage -Name "User Session Details" -Content {
    New-UDGrid -Title "Current User Sessions"  -AutoRefresh -RefreshInterval 20 -Endpoint {
                    
        asnp citrix*
        $AllSessions = @()
        foreach ($site in $sites) {
            $sessions = Get-BrokerSession -AdminAddress $site -Filter { username -ne $null }  #| select Username,HostedMachineName
            $AllSessions += $sessions
        } $AllSessions | sort StartTime | ForEach-Object {
            [PSCustomObject]@{
                "Username"       = $_.UserName
                "VDA"            = $_.MachineName
                "Delivery Group" = $_.DesktopGroupName
                "Start Time"     = $_.StartTime
                "State"          = [string]$_.SessionState
                "Client IP"      = $_.ClientAddress
                "HDX Protocol"   = $_.Protocol
                "Datacenter DDC" = $_.ControllerDNSName

            }
        } | Out-UDGridData
    }
}
$Page4 = New-UDPage -Name "Hypervisor" -Content {
    New-UDRow {
        New-UDColumn -Size 12 {
            New-UDGrid -Title "Hypervisor Alerts" -PageSize 5 -AutoRefresh -RefreshInterval 120 -DefaultSortColumn "Time" -DefaultSortDescending -Endpoint {
                    
                asnp citrix*
                $AllHypAlerts = @()
                foreach ($site in $sites) {
                    $hypAlerts = Get-BrokerHypervisorAlert -AdminAddress $site | ForEach-Object {
                        [PSCustomObject]@{
                            "Host Name" = $_.HostingServerName
                            "Metric"    = [string]$_.Metric
                            "Severity"  = [string]$_.Severity
                            "Time"      = $_.Time
                        }
                    }
                    $AllHypAlerts += $hypAlerts  
                } $AllHypAlerts | Out-UDGridData
            }
        }
    }
}

$Page5 = New-UDPage -Name "Links" -Content {
    New-UDRow {
        New-UDColumn -Size 12 {
            New-UDHtml -Markup "<h3>Other Useful Links</h>"
            New-UDHtml -Markup '<a href="http://azpxctxmgmt01:8080" target="_blank">Jenkins Automation</a>'
            New-UDGrid -Endpoint {
                $Jenkins = New-Object System.Object
                $Jenkins | Add-Member -Type NoteProperty -Name "Description" -Value "Central Location for running powershell scripts againt the environment"
                $Jenkins | Add-Member -Type NoteProperty -Name "Link" -Value "http://azpxctxmgmt01:8080"

                $Director = New-Object System.Object
                $Director | Add-Member -Type NoteProperty -Name "Description" -Value "Citrix Director Tool"
                $Director | Add-Member -Type NoteProperty -Name "Link" -Value "https://citrixdirector.confie.com"

                $Links = @()
                $Links += $Jenkins, $Director
                
                $Links | ForEach-Object {
                    [PSCustomObject]@{
                        "Description" = $_.Description
                        "Link"        = $_.Link
                    }
                }

                $Links | Out-UDGridData
            }
        }
    }

}

$Page6 = New-UDPage -Name 'Licensing' -Content {
    New-UDRow {
        New-UDHtml -Markup "<h5 style='padding-left:10px'>Citrix License Details</h5>"
        New-UDHtml -Markup "<i style='padding-left:10px'>*Note: This count includes overdraft licenses</i>"
    }
    New-UDRow {
        New-UDColumn -Size 6 {
            New-UDChart -Type Bar -Endpoint {
                $licensePool = Get-WmiObject -ComputerName $LicenseServer -class "Citrix_GT_License_Pool" -Namespace "ROOT\CitrixLicensing"
                $licenses = $licensePool | where-object { $_.PLD -like "XDT_ENT_UD" }
                [PSCustomObject]@{
                    'Total Licenses'     = $licenses | Measure-Object -Property Count -Sum | Select-Object -ExpandProperty sum
                    'LicensesInUse'      = $licenses | Measure-Object -Property InUseCount -Sum | Select-Object -ExpandProperty sum
                    'Available Licenses' = $licenses | Measure-Object -Property PooledAvailable -Sum | Select-Object -ExpandProperty sum
                } | Out-UDChartData -LabelProperty 'Total Licenses' -DatasetLabel "Total Installed Licenses" -BackgroundColor "#06bd0f" -Dataset @(
                    New-UDChartDataset -DataProperty "LicensesInUse" -Label 'In Use' -BackgroundColor "#163d87" -HoverBackgroundColor "#80962F23"
                    New-UDChartDataset -DataProperty 'Available Licenses' -Label 'Available' -BackgroundColor "#62b504" -HoverBackgroundColor "#8014558C"
                )
            } -Labels @("Total Licenses") -Options @{
                scales = @{
                    xAxes = @(
                        @{
                            stacked = $true
                        }
                    )
                    yAxes = @(
                        @{
                            stacked = $true
                        }
                    )
                }
            }
        }
        New-UDColumn -Size 6 {
            New-UDGrid -Title "Licensing Detail" -NoFilter -Endpoint {
                $LicenseArray = @()
                $licensePool = Get-WmiObject -ComputerName $LicenseServer -class "Citrix_GT_License_Pool" -Namespace "ROOT\CitrixLicensing"
                $licenses = $licensePool | where-object { $_.PLD -like "XDT_ENT_UD" } | Sort-Object SubscriptionDate | ForEach-Object {
                    [PSCustomObject]@{
                        'License Pack'        = $_.PLDFullName
                        'SA Date'             = $_.SubscriptionDate.SubString(0, 8)
                        'Total'               = $_.Count
                        'In Use'              = $_.InUseCount
                        'Available'           = $_.PooledAvailable
                        'Overdraft'           = $_.Overdraft
                        'License Server Host' = $_.PSComputerName
                    }
                    
                }
                $LicenseArray += $licenses 
                $LicenseArray | Out-UDGridData
            }
        }
    }
}

$Page7 = New-UDPage -Name 'COVID-19 Tracker' -Content {
    New-UdHtml -Markup "<iframe
                    src='https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6' 
                        style=
                            'background-color:white;
                            border:none;
                            width: 100%;
                            min-height: 900px;'>
                    </iframe>"
}
$Page8 = New-UDPage -Name 'Citrix Solarwinds' -Content {
    New-UdHtml -Markup "<iframe
                    src='https://orion.freewayinsurance.com/Orion/APM/Summary.aspx?netobject=&ViewID=407#' 
                        style=
                            'background-color:white;
                            border:none;
                            width: 100%;
                            min-height: 900px;'>
                    </iframe>"
}
$Page9 = New-UDPage -Name 'COVID-19 Testing' -Content {
    New-UDRow {
        New-UDColumn -Size 6 {
            New-UDChart -Title "US Total Tests by Date" -Type Line -AutoRefresh -RefreshInterval 60 -Endpoint {
                $USDailyCounts = Import-Csv -Path "usdaily.csv"
                $USDailyCounts | Out-UDChartData  -LabelProperty "date" -Dataset @(
                    New-UDChartDataset -DataProperty 'total' -Label "Total Tests" 
                    New-UDChartDataset -DataProperty 'positive' -Label "Positive Tests" 
                )
            } 
        }
        New-UDColumn -Size 6 {
            New-UDCounter -Title "US Total Tests To Date" -RefreshInterval 120 -AutoRefresh -Endpoint {
                $AllTests = Import-Csv -Path "current.csv"
                $Count = $AllTests.total
                    
                $Count
            } -Icon users -TextSize Large
        }
    }
}
$Navigation = New-UDSideNav -Width 250 -Content {
    New-UDSideNavItem -Text "Citrix Overview" -PageName "Citrix Overview" -Icon heartbeat
    New-UDSideNavItem -Divider
    New-UDSideNavItem -Text "Licensing Overview" -PageName "Licensing" -Icon certificate
    New-UDSideNavItem -Divider
    New-UDSideNavItem -Text "VDA Status" -PageName "VDA Status" -Icon server
    New-UDSideNavItem -Divider
    New-UDSideNavItem -Text "User Session Details" -PageName "User Session Details" -Icon users
    New-UDSideNavItem -Divider
    New-UDSideNavItem -Text "Hypervisor Alerts" -PageName "Hypervisor" -Icon server
    New-UDSideNavItem -Divider
    New-UDSideNavItem -Text "Citrix Solarwinds" -Icon dashboard -OnClick { Invoke-UDRedirect -Url 'https://orion.freewayinsurance.com/Orion/APM/Summary.aspx?netobject=&ViewID=407' -OpenInNewWindow } 
    New-UDSideNavItem -Divider
    New-UDSideNavItem -Text "Coronavirus Tracker" -PageName "COVID-19 Tracker" -Icon stethoscope
    New-UDSideNavItem -Divider
    New-UDSideNavItem -Text "Coronavirus Testing" -PageName "COVID-19 Testing" -Icon stethoscope
    <#
    New-UDSideNavItem -Divider
    New-UDSideNavItem -Text "Other Links" -PageName "Links" -Icon link
    #>

} -Fixed

$Dashboard = New-UDDashboard -Title "Citrix Real-Time Health Dashboard - All Sites AZ(legacy)-AZ-CO - $Date" -Pages @($Page1, $Page2, $Page3, $Page4, $Page5, $Page6, $Page7, $Page8, $Page9) -Navigation $Navigation -Theme $Theme -Footer (New-UDFooter -Endpoint { }) -LoginPage $LoginPage


Start-UDDashboard -Wait -Dashboard $Dashboard -Endpoint $SessionsEndpoint -AllowHttpForLogin