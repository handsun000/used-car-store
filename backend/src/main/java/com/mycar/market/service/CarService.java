package com.mycar.market.service;

import com.mycar.market.domain.Car;
import com.mycar.market.dto.CarRequest;
import com.mycar.market.dto.CarResponse;
import com.mycar.market.dto.CarSearchCondition;
import com.mycar.market.exception.CarNotFoundException;
import com.mycar.market.repository.CarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CarService {

    private final CarRepository carRepository;
    private final ImageUploadService imageUploadService;

    @Transactional
    public Long register(CarRequest request, List<MultipartFile> images) {
        Car car = request.toEntity();

        if (images != null && !images.isEmpty()) {
            boolean isFirstImage = true; // 첫 번째 이미지인지 체크하는 플래그

            for (MultipartFile file : images) {
                // Cloudinary에 업로드하고 URL 반환 (예: https://res.cloudinary.com/...)
                String storedUrl = imageUploadService.uploadImage(file);

                if (storedUrl != null) {
                    com.mycar.market.domain.CarImage carImage = com.mycar.market.domain.CarImage.builder()
                            .url(storedUrl) // 이제 전체 URL이 저장됨
                            .isMain(isFirstImage)
                            .build();
                    car.addImage(carImage);

                    isFirstImage = false;
                }
            }
        }

        Car savedCar = carRepository.save(car);
        return savedCar.getId();
    }

    @Transactional(readOnly = true)
    public List<CarResponse> searchCars(CarSearchCondition condition) {
        return carRepository.searchCars(condition);
    }

    public CarResponse getCarDetail(Long id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new CarNotFoundException(id));
        return CarResponse.from(car);
    }

    @Transactional
    public void update(Long id, CarRequest request, List<MultipartFile> newImages) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new CarNotFoundException(id));

        // 1. 기본 정보 수정
        car.update(
                request.brand(),
                request.modelName(),
                request.productionYear(),
                request.mileage(),
                request.price(),
                request.fuelType(),
                request.transmission(),
                request.accidentHistory(),
                request.description());

        // 2. 이미지 처리 (단순화: 기존 이미지 유지 + 새 이미지 추가)
        // 실제로는 기존 이미지를 삭제하거나 순서를 바꾸는 로직이 필요할 수 있음
        if (newImages != null && !newImages.isEmpty()) {
            for (MultipartFile file : newImages) {
                String storedUrl = imageUploadService.uploadImage(file);
                if (storedUrl != null) {
                    com.mycar.market.domain.CarImage carImage = com.mycar.market.domain.CarImage.builder()
                            .url(storedUrl)
                            .isMain(false) // 추가된 이미지는 메인이 아님 (기존 메인 유지)
                            .build();
                    car.addImage(carImage);
                }
            }
        }
    }

    @Transactional
    public void updateStatus(Long id, com.mycar.market.domain.CarStatus status) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new CarNotFoundException(id));
        car.updateStatus(status);
    }

    @Transactional
    public void delete(Long id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new CarNotFoundException(id));

        // 연관된 이미지 삭제 로직이 필요하다면 여기에 추가 (Cloudinary 삭제 등)

        carRepository.delete(car);
    }
}
