package com.mycar.market.repository;

import com.mycar.market.config.TestConfig;
import com.mycar.market.domain.Car;
import com.mycar.market.domain.CarStatus;
import com.mycar.market.domain.FuelType;
import com.mycar.market.domain.Transmission;
import com.mycar.market.dto.CarSearchCondition;
import java.util.List;
import com.mycar.market.dto.CarResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Import(TestConfig.class)
class CarRepositoryTest {

        @Autowired
        CarRepository carRepository;

        @Test
        @DisplayName("차량 검색 - 브랜드 조건")
        void searchByBrand() {
                // given
                Car car1 = createCar("BMW", "X5", 80000000);
                Car car2 = createCar("Audi", "A6", 70000000);
                carRepository.save(car1);
                carRepository.save(car2);

                CarSearchCondition condition = new CarSearchCondition(
                                "BMW", null, null, null, null, null, null, null, null, null);

                // when
                List<CarResponse> result = carRepository.searchCars(condition);

                // then
                assertThat(result).hasSize(1);
                assertThat(result.get(0).brand()).isEqualTo("BMW");
        }

        @Test
        @DisplayName("차량 검색 - 가격 범위")
        void searchByPriceRange() {
                // given
                Car car1 = createCar("Hyundai", "Sonata", 30000000);
                Car car2 = createCar("Kia", "K5", 25000000);
                carRepository.save(car1);
                carRepository.save(car2);

                CarSearchCondition condition = new CarSearchCondition(
                                null, null, 28000000L, null, null, null, null, null, null, null);

                // when
                List<CarResponse> result = carRepository.searchCars(condition);

                // then
                assertThat(result).hasSize(1);
                assertThat(result.get(0).modelName()).isEqualTo("Sonata");
        }

        private Car createCar(String brand, String model, int price) {
                return Car.builder()
                                .brand(brand)
                                .modelName(model)
                                .price((long) price)
                                .productionYear(2023)
                                .mileage(10000)
                                .fuelType(FuelType.GASOLINE)
                                .transmission(Transmission.AUTOMATIC)
                                .accidentHistory(false)
                                .description("Test Car")
                                .build();
        }
}
