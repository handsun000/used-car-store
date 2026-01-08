package com.mycar.market.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CarImage extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String url;

    private Boolean isMain; // 대표 이미지 여부

    // 중요: N:1 관계에서는 지연 로딩(LAZY)이 필수야.
    // EAGER로 하면 차 하나 조회할 때마다 이미지 쿼리가 무조건 나가서 성능 망가짐.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_id")
    private Car car;

    @Builder
    public CarImage(String url, Boolean isMain) {
        this.url = url;
        this.isMain = isMain;
    }

    public void setCar(Car car) {
        this.car = car;
    }
}