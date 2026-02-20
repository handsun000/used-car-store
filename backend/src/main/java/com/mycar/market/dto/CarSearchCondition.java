package com.mycar.market.dto;

import com.mycar.market.domain.FuelType;
import com.mycar.market.domain.Transmission;

public record CarSearchCondition(
        String brand,
        String modelName,
        Long minPrice,
        Long maxPrice,
        Integer minYear,
        Integer maxYear,
        Integer minMileage,
        Integer maxMileage,
        FuelType fuelType,
        Transmission transmission,
        java.util.List<com.mycar.market.domain.CarStatus> statuses) {
}
