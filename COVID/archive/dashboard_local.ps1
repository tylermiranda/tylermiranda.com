Get-UDDashboard | Stop-UDDashboard
$Theme = Get-UDTheme -Name DarkDefault
Set-UDLicense -License '<License><Terms>PD94bWwgdmVyc2lvbj0iMS4wIj8+DQo8TGljZW5zZVRlcm1zIHhtbG5zOnhzaT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UiIHhtbG5zOnhzZD0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEiPg0KICA8U3RhcnREYXRlPjIwMTktMTAtMDhUMTM6NTU6MTQuMDMwNTQyMSswMDowMDwvU3RhcnREYXRlPg0KICA8VXNlck5hbWU+dHlsZXIubWlyYW5kYUBnbWFpbC5jb208L1VzZXJOYW1lPg0KICA8UHJvZHVjdE5hbWU+VW5pdmVyc2FsRGFzaGJvYXJkPC9Qcm9kdWN0TmFtZT4NCiAgPEVuZERhdGU+MjAyMC0xMC0wN1QxMzo1NToxNC4wMzA1NDIxKzAwOjAwPC9FbmREYXRlPg0KICA8U2VhdE51bWJlcj4xPC9TZWF0TnVtYmVyPg0KICA8SXNUcmlhbD5mYWxzZTwvSXNUcmlhbD4NCjwvTGljZW5zZVRlcm1zPg==</Terms><Signature>RxYDGbu8cIuLOkCxHBghyS+YZ/QNetqb04FqgTaOYD7Qn8BTY2lF2w==</Signature></License>'
$Dashboard = New-UDDashboard -Title "COVID-19 US Testing Data" -Theme $Theme -Content {
    Invoke-WebRequest -Uri "https://covidtracking.com/api/us/daily.csv" -OutFile "usdaily.csv"
    Invoke-WebRequest -Uri "https://covidtracking.com/api/us.csv" -OutFile "current.csv"
    Invoke-WebRequest -Uri "https://covidtracking.com/api/states.csv" -OutFile "statescurrent.csv"
    $SessionsSchedule = New-UDEndpointSchedule -Every 1 -Minute
    $SessionsEndpoint = New-UDEndpoint -Schedule $SessionsSchedule -Endpoint {
        Invoke-WebRequest -Uri "https://covidtracking.com/api/us/daily.csv" -OutFile "usdaily.csv"
        Invoke-WebRequest -Uri "https://covidtracking.com/api/us.csv" -OutFile "current.csv" -
    }
     New-UDRow {
        New-UDColumn -Size 6 {
            New-UDChart -Title "US Total Tests by Date" -Type Line -AutoRefresh -RefreshInterval 60 -Endpoint {
                $USDailyCounts = Import-Csv -Path "usdaily.csv"
                $USDailyCounts | Out-UDChartData  -LabelProperty "date" -Dataset @(
                    New-UDChartDataset -DataProperty 'total' -Label "Total Tests" 
                    New-UDChartDataset -DataProperty 'positive' -Label "Positive Tests" -BackgroundColor red
                )
            } 
        }
        New-UDRow {
            New-UDColumn -Size 6 {
                New-UDCounter -Title "US Total Tests To Date" -RefreshInterval 120 -AutoRefresh -Endpoint {
                    $AllTests = Import-Csv -Path "current.csv"
                    $Count = $AllTests.total
                        
                    $Count
                } -Icon users -TextSize Large
                New-UdCounter -Title "% Positive vs Tested To Date" -RefreshInterval 120 -Autorefresh -Endpoint {
                    $allstatespercent = Import-Csv -Path 'current.csv'
                    $percent = $allstatespercent.positive / $allstatespercent.total * 100
                    $percent
                } -Textsize Large -Format '0.00'
            }
        }

    }
    New-UDRow {
        New-UDColumn -size 12 {
            New-UDChart -Title "Tests by State" -Type Bar -AutoRefresh -Endpoint {
                $StateCounts = Import-Csv -Path "statescurrent.csv"
                $StateCounts | Out-UDChartData -LabelProperty "state" -Dataset @(
                    New-UDChartDataset -DataProperty 'positive' -Label "Positive Tests" -BackgroundColor red
                    New-UDChartDataset -DataProperty 'total' -Label "Total Tests"
                    
                )
            } -Labels @("states") -Options @{
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
    }

}

Start-UDDashboard -Dashboard $Dashboard -Endpoint $SessionsEndpoint
