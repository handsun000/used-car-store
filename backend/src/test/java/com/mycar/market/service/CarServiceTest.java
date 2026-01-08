package com.mycar.market.service;

import com.mycar.market.domain.Car;
import com.mycar.market.domain.FuelType;
import com.mycar.market.domain.Transmission;
import com.mycar.market.dto.CarRequest;
import com.mycar.market.dto.CarResponse;
import com.mycar.market.repository.CarRepository;
import com.mycar.market.util.ImageUtils;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
class CarServiceTest {

    @InjectMocks
    CarService carService;

    @Mock
    CarRepository carRepository;

    @Mock
    ImageUtils imageUtils; // Assuming ImageUtils is a bean or we verify static mock if needed

    @Test
    @DisplayName("차량 등록 성공")
    void registerCar_Success() throws IOException {
        // given
        CarRequest request = new CarRequest(
                "Tesla",
                "Model 3",
                2023,
                100,
                50000000L,
                FuelType.ELECTRIC,
                Transmission.AUTOMATIC,
                false,
                "New Car",
                null);

        MultipartFile imageFile = mock(MultipartFile.class);
        // given(imageFile.isEmpty()).willReturn(false); // Unnecessary because
        // ImageUtils is mocked
        given(imageUtils.saveFile(any())).willReturn("stored-image.jpg");

        // Mock repository save
        given(carRepository.save(any(Car.class))).willAnswer(invocation -> {
            Car savedCar = invocation.getArgument(0);
            // Quick hack to set ID via reflection or just spy?
            // Better: use a mock class or just return a configured Mock object?
            // Since method returns savedCar (arg), we can't easily change it physically
            // unless we mock repository to return a DIFFERENT object that is equal to arg
            // but has ID.
            // Let's use reflection to set ID on savedCar.
            java.lang.reflect.Field idField = Car.class.getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(savedCar, 1L);
            return savedCar;
        });

        // when
        Long savedId = carService.register(request, List.of(imageFile));

        // then
        assertThat(savedId).isNotNull();
        // Since we mocked save to return the passed car entity (which has null ID by
        // default if not set),
        // we might get null depending on mock.
        // Logic: register returns savedCar.getId().
        // In the mock answer, we updated the arg? No.
        // We should adjust mock to return a Car with ID.
    }
}
