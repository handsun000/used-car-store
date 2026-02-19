$boundary = [System.Guid]::NewGuid().ToString()
$LF = "`r`n"

$carRequest = @{
    brand = "TestBrand"
    modelName = "TestModel"
    productionYear = 2023
    mileage = 1000
    price = 2500
    fuelType = "GASOLINE"
    transmission = "AUTOMATIC"
    accidentHistory = $false
    description = "Test Description"
}
$jsonPayload = $carRequest | ConvertTo-Json -Compress

$bodyLines = (
    "--$boundary",
    "Content-Disposition: form-data; name=`"carRequest`"; filename=`"blob`"",
    "Content-Type: application/json",
    "",
    "$jsonPayload",
    "--$boundary",
    "Content-Disposition: form-data; name=`"images`"; filename=`"test.jpg`"",
    "Content-Type: image/jpeg",
    "",
    "FAKEIMAGEBYTES",
    "--$boundary--"
)

$body = $bodyLines -join $LF

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/cars" -Method Post -ContentType "multipart/form-data; boundary=$boundary" -Body $body
    Write-Host "Success: $($response)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Response Body: $($reader.ReadToEnd())"
    }
}
