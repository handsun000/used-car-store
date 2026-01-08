package com.mycar.market.dto;

import com.mycar.market.domain.Car;
import com.mycar.market.domain.CarStatus;
import com.mycar.market.domain.FuelType;
import com.mycar.market.domain.Transmission;

import java.time.LocalDateTime;
import java.util.List;

public record CarResponse(
        Long id,
        String brand,
        String modelName,
        Integer productionYear,
        Integer mileage,
        Long price,
        FuelType fuelType,
        Transmission transmission,
        Boolean accidentHistory,
        CarStatus status,
        String description,
        List<String> images,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
    public static CarResponse from(Car car) {
        return new CarResponse(
                car.getId(),
                car.getBrand(),
                car.getModelName(),
                car.getProductionYear(),
                car.getMileage(),
                car.getPrice(),
                car.getFuelType(),
                car.getTransmission(),
                car.getAccidentHistory(),
                car.getStatus(),
                car.getDescription(),
                car.getImages().stream().map(img -> img.getUrl()).toList(),
                car.getCreatedAt(),
                car.getUpdatedAt());
    }
}
