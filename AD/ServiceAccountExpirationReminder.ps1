<#
    .SYNOPSIS
        This script will check Active Directory for specified account passwords that are due to expire in the next 14 days.
        Helpful for service accounts
    .EXAMPLE
        ServiceAccountExpirationReminder.ps1 -EmailTo "it@contoso.com" -EmailFrom "it@contoso.com" -SMTP "mail.contoso.com" -SMTPPort 25 -Accounts "svc_citrixpvs","svc_citrixwem" -PasswordExpiryDays 90
#>
param (
    [Parameter(Mandatory = $true)][string]$EmailTo =$(throw "Specify a destination email address"),
    [Parameter(Mandatory = $true)][string]$EmailFrom = $(throw "Specify a source email address"),
    [Parameter(Mandatory = $true)][string]$SMTP = $(throw "Specify an STMP relay"),
    [Parameter(Mandatory = $false)][int]$SMTPPort = 25,
    [Parameter(Mandatory = $true)][string[]]$Accounts = $(throw "Specify an account or accounts"),
    [Parameter(Mandatory = $false)][string]$EmailSubject = 'WARNING: Service Account Expiration Reminder',
    [Parameter(Mandatory = $false)][int]$PasswordExpiryDays = 90
)
#Requires -Modules ActiveDirectory, Emailimo

Import-Module Emailimo
Import-Module activedirectory -ErrorAction SilentlyContinue 

$ExpiringAccts = @()
foreach ($account in $Accounts) {
    $Expiry = Get-Aduser -Identity $account -Properties * | Select-Object -ExpandProperty PasswordLastSet

    $CurrentDate = Get-Date

    $Expired = New-Timespan -Start $CurrentDate -End $Expiry | Select-Object -ExpandProperty Days

    $CalculateDays = $PasswordExpiryDays + $Expired

    if ($CalculateDays -lt 15) {
        $ExpiringAccts += $account
        Write-output "$account will expire in $CalculateDays days.  Please change."

        Email {
            EmailHeader {
                EmailFrom -Address $EmailFrom
                EmailTo -Addresses $EmailTo
                EmailServer -Server $SMTP -Port $SMTPPort
                EmailOptions -Priority High -DeliveryNotifications Never
                EmailSubject -Subject "WARNING:$EmailSubject"
            }
            EmailBody -FontFamily 'Calibri' -Size 15 {
                EmailTextBox {
                    "$account will expire in $CalculateDays days."
                }
            }

    }
             
    }
    else {
        Write-Output "No Accounts are nearing expiration"
    }
}
if ($ExpiringAccts.Count -eq 0) {
    Write-Output "No Accounts are nearing expiration. Sending reminder email."
    Email {
        EmailHeader {
            EmailFrom -Address $EmailFrom
            EmailTo -Addresses $EmailTo
            EmailServer -Server $SMTP -Port $SMTPPort
            EmailOptions -Priority High -DeliveryNotifications Never
            EmailSubject -Subject "INFO:$EmailSubject"
        }
        EmailBody -FontFamily 'Calibri' -Size 15 {
            EmailTextBox {
                "There are no service accounts nearing expiration.  This is just a reminder that this check is still running."
            }
        }

    }
}