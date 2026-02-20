package com.mycar.market.service;

import com.mycar.market.domain.Car;
import com.mycar.market.domain.FuelType;
import com.mycar.market.domain.Transmission;
import com.mycar.market.dto.CarRequest;
import com.mycar.market.repository.CarRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class CarServiceTest {

    @Mock
    CarRepository carRepository;

    @Mock
    ImageUploadService imageUploadService;

    @InjectMocks
    CarService carService;

    @Test
    @DisplayName("차량 등록 - 첫 번째 이미지가 대표 이미지로 설정됨")
    void registerCar_FirstImageIsMain() {
        // given
        CarRequest request = new CarRequest(
                "BMW", "X5", 2023, 10000, 80000000L,
                FuelType.GASOLINE, Transmission.AUTOMATIC, false, "Good", Collections.emptyList());
        MultipartFile image1 = mock(MultipartFile.class);
        MultipartFile image2 = mock(MultipartFile.class);
        List<MultipartFile> images = List.of(image1, image2);

        given(imageUploadService.uploadImage(any())).willReturn("stored_image.jpg");

        Car savedCar = Car.builder().build();
        ReflectionTestUtils.setField(savedCar, "id", 1L);
        given(carRepository.save(any(Car.class))).willReturn(savedCar);

        // when
        Long carId = carService.register(request, images);

        // then
        assertThat(carId).isEqualTo(1L);
        verify(carRepository).save(argThat(car -> {
            assertThat(car.getImages()).hasSize(2);
            assertThat(car.getImages().get(0).getIsMain()).isTrue();
            assertThat(car.getImages().get(1).getIsMain()).isFalse();
            return true;
        }));
    }

    @Test
    @DisplayName("차량 정보 수정 - 이미지 포함")
    void updateCar_Success() {
        // given
        Long carId = 1L;
        // status is initialized to FOR_SALE in the constructor annotated with @Builder
        Car car = Car.builder()
                .brand("Old Brand")
                .build();
        ReflectionTestUtils.setField(car, "id", carId);

        CarRequest request = new CarRequest(
                "New Brand", "New Model", 2024, 100, 90000000L,
                FuelType.ELECTRIC, Transmission.AUTOMATIC, false, "New Desc", Collections.emptyList());

        MultipartFile newImage = mock(MultipartFile.class);
        List<MultipartFile> newImages = List.of(newImage);

        given(carRepository.findById(carId)).willReturn(java.util.Optional.of(car));
        given(imageUploadService.uploadImage(any())).willReturn("new_image.jpg");

        // when
        carService.update(carId, request, newImages);

        // then
        assertThat(car.getBrand()).isEqualTo("New Brand");
        assertThat(car.getImages()).hasSize(1);
    }

    @Test
    @DisplayName("차량 상태 변경")
    void updateCarStatus_Success() {
        // given
        Long carId = 1L;
        // status is initialized to FOR_SALE in the constructor annotated with @Builder
        Car car = Car.builder().build();
        given(carRepository.findById(carId)).willReturn(java.util.Optional.of(car));

        // when
        carService.updateStatus(carId, com.mycar.market.domain.CarStatus.SOLD);

        // then
        assertThat(car.getStatus()).isEqualTo(com.mycar.market.domain.CarStatus.SOLD);
    }

    @Test
    @DisplayName("차량 삭제")
    void deleteCar_Success() {
        // given
        Long carId = 1L;
        Car car = Car.builder().build();
        given(carRepository.findById(carId)).willReturn(java.util.Optional.of(car));

        // when
        carService.delete(carId);

        // then
        verify(carRepository).delete(car);
    }
}
