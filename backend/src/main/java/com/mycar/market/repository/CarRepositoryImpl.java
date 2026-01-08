package com.mycar.market.repository;

import com.mycar.market.domain.CarStatus;
import com.mycar.market.domain.FuelType;
import com.mycar.market.domain.Transmission;
import com.mycar.market.dto.CarResponse;
import com.mycar.market.dto.CarSearchCondition;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;

import java.util.List;

import static com.mycar.market.domain.QCar.car;

@RequiredArgsConstructor
public class CarRepositoryImpl implements CarRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<CarResponse> searchCars(CarSearchCondition condition) {
        List<com.mycar.market.domain.Car> cars = queryFactory
                .selectFrom(car)
                .leftJoin(car.images).fetchJoin()
                .where(
                        brandEq(condition.brand()),
                        modelNameContains(condition.modelName()),
                        priceBetween(condition.minPrice(), condition.maxPrice()),
                        yearBetween(condition.minYear(), condition.maxYear()),
                        mileageBetween(condition.minMileage(), condition.maxMileage()),
                        fuelTypeEq(condition.fuelType()),
                        transmissionEq(condition.transmission()),
                        car.status.eq(CarStatus.FOR_SALE))
                .orderBy(car.createdAt.desc())
                .fetch();

        return cars.stream()
                .map(CarResponse::from)
                .toList();
    }

    private BooleanExpression brandEq(String brand) {
        return StringUtils.hasText(brand) ? car.brand.eq(brand) : null;
    }

    private BooleanExpression modelNameContains(String modelName) {
        return StringUtils.hasText(modelName) ? car.modelName.contains(modelName) : null;
    }

    private BooleanExpression priceBetween(Long minPrice, Long maxPrice) {
        if (minPrice == null && maxPrice == null)
            return null;
        if (minPrice == null)
            return car.price.loe(maxPrice);
        if (maxPrice == null)
            return car.price.goe(minPrice);
        return car.price.between(minPrice, maxPrice);
    }

    private BooleanExpression yearBetween(Integer minYear, Integer maxYear) {
        if (minYear == null && maxYear == null)
            return null;
        if (minYear == null)
            return car.productionYear.loe(maxYear);
        if (maxYear == null)
            return car.productionYear.goe(minYear);
        return car.productionYear.between(minYear, maxYear);
    }

    private BooleanExpression mileageBetween(Integer minMileage, Integer maxMileage) {
        if (minMileage == null && maxMileage == null)
            return null;
        if (minMileage == null)
            return car.mileage.loe(maxMileage);
        if (maxMileage == null)
            return car.mileage.goe(minMileage);
        return car.mileage.between(minMileage, maxMileage);
    }

    private BooleanExpression fuelTypeEq(FuelType fuelType) {
        return fuelType != null ? car.fuelType.eq(fuelType) : null;
    }

    private BooleanExpression transmissionEq(Transmission transmission) {
        return transmission != null ? car.transmission.eq(transmission) : null;
    }
}
