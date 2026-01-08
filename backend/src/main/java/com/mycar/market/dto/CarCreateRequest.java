package com.mycar.market.dto;

import com.mycar.market.domain.FuelType;
import com.mycar.market.domain.Transmission;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record CarCreateRequest(
        @NotBlank String brand,
        @NotBlank String modelName,
        @NotNull Integer productionYear,
        @NotNull Integer mileage,
        @NotNull Long price,
        @NotNull FuelType fuelType,
        @NotNull Transmission transmission,
        @NotNull Boolean accidentHistory,
        String description,
        List<String> imageUrls) {
}
