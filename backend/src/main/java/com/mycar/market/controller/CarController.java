package com.mycar.market.controller;

import com.mycar.market.dto.CarRequest;
import com.mycar.market.dto.CarResponse;
import com.mycar.market.dto.CarSearchCondition;
import com.mycar.market.service.CarService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/cars")
@RequiredArgsConstructor

public class CarController {

    private final CarService carService;

    @PostMapping
    public ResponseEntity<Void> register(
            @RequestPart("carRequest") @Valid CarRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        Long id = carService.register(request, images);
        return ResponseEntity.created(URI.create("/api/v1/cars/" + id)).build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<CarResponse>> searchCars(CarSearchCondition condition) {
        return ResponseEntity.ok(carService.searchCars(condition));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarResponse> getCarDetail(@PathVariable Long id) {
        return ResponseEntity.ok(carService.getCarDetail(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(
            @PathVariable Long id,
            @RequestPart("carRequest") @Valid CarRequest request,
            @RequestPart(value = "newImages", required = false) List<MultipartFile> newImages) {
        carService.update(id, request, newImages);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(
            @PathVariable Long id,
            @RequestBody com.mycar.market.domain.CarStatus status) {
        carService.updateStatus(id, status);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        carService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
