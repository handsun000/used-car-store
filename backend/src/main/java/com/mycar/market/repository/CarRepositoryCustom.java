package com.mycar.market.repository;

import com.mycar.market.dto.CarResponse;
import com.mycar.market.dto.CarSearchCondition;

import java.util.List;

public interface CarRepositoryCustom {
    List<CarResponse> searchCars(CarSearchCondition condition);
}
