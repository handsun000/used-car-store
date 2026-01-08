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
    private final com.mycar.market.util.ImageUtils imageUtils;

    @Transactional
    public Long register(CarRequest request, List<MultipartFile> images) {
        Car car = request.toEntity();

        if (images != null && !images.isEmpty()) {
            boolean isFirstImage = true; // 첫 번째 이미지인지 체크하는 플래그

            for (MultipartFile file : images) {
                String storedFileName = imageUtils.saveFile(file);
                if (storedFileName != null) {
                    com.mycar.market.domain.CarImage carImage = com.mycar.market.domain.CarImage.builder()
                            .url(storedFileName)
                            .isMain(isFirstImage) // 첫 번째 사진이면 true, 아니면 false
                            .build();
                    car.addImage(carImage);

                    isFirstImage = false; // 다음 사진부터는 false
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
}
