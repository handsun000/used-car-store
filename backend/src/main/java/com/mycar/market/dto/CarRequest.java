package com.mycar.market.dto;

import com.mycar.market.domain.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CarRequest(
        @NotBlank(message = "Brand is required") String brand,

        @NotBlank(message = "Model name is required") String modelName,

        @NotNull(message = "Production year is required") @Min(1900) Integer productionYear,

        @NotNull(message = "Mileage is required") @Min(0) Integer mileage,

        @NotNull(message = "Price is required") @Min(0) Long price,

        @NotNull(message = "Fuel type is required") FuelType fuelType,

        @NotNull(message = "Transmission is required") Transmission transmission,

        @NotNull(message = "Accident history status is required") Boolean accidentHistory,

        String description,

        List<String> imageUrls) {
    public Car toEntity() {
        Car car = Car.builder()
                .brand(brand)
                .modelName(modelName)
                .productionYear(productionYear)
                .mileage(mileage)
                .price(price)
                .fuelType(fuelType)
                .transmission(transmission)
                .accidentHistory(accidentHistory)
                .description(description)
                .build();

        if (imageUrls != null && !imageUrls.isEmpty()) {
            // Representative image logic can be handled here or in service.
            // For now, simple add. First one could be main if logic dictates.
            boolean isFirst = true;
            for (String url : imageUrls) {
                car.addImage(new CarImage(url, isFirst));
                isFirst = false;
            }
        }

        return car;
    }
}
