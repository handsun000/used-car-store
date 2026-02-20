package com.mycar.market.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
// @EntityListeners 삭제 (BaseTimeEntity에 있음)
public class Car extends BaseTimeEntity { // 상속 추가

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String brand;
    private String modelName;
    private Integer productionYear;
    private Integer mileage;
    private Long price;

    @Enumerated(EnumType.STRING)
    private FuelType fuelType;

    @Enumerated(EnumType.STRING)
    private Transmission transmission;

    private Boolean accidentHistory;

    @Enumerated(EnumType.STRING)
    private CarStatus status;

    @Lob
    private String description;

    // 변경 포인트: mappedBy 사용 (CarImage 쪽에서 'car' 필드로 매핑한다고 가정)
    // 이렇게 해야 불필요한 업데이트 쿼리가 안 나가서 성능이 좋아.
    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CarImage> images = new ArrayList<>();

    @Builder
    public Car(String brand, String modelName, Integer productionYear, Integer mileage, Long price,
            FuelType fuelType, Transmission transmission, Boolean accidentHistory, String description) {
        this.brand = brand;
        this.modelName = modelName;
        this.productionYear = productionYear;
        this.mileage = mileage;
        this.price = price;
        this.fuelType = fuelType;
        this.transmission = transmission;
        this.accidentHistory = accidentHistory;
        this.description = description;
        this.status = CarStatus.FOR_SALE;
    }

    // 비즈니스 로직: 매물 정보 수정
    public void update(String brand, String modelName, Integer productionYear, Integer mileage, Long price,
            FuelType fuelType, Transmission transmission, Boolean accidentHistory, String description) {
        this.brand = brand;
        this.modelName = modelName;
        this.productionYear = productionYear;
        this.mileage = mileage;
        this.price = price;
        this.fuelType = fuelType;
        this.transmission = transmission;
        this.accidentHistory = accidentHistory;
        this.description = description;
    }

    // 비즈니스 로직: 상태 변경
    public void updateStatus(CarStatus status) {
        this.status = status;
    }

    // 연관관계 편의 메서드 (양방향 세팅)
    public void addImage(CarImage image) {
        this.images.add(image);
        image.setCar(this); // CarImage에도 setCar 메서드가 필요해!
    }
}