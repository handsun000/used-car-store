package com.mycar.market.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QCar is a Querydsl query type for Car
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QCar extends EntityPathBase<Car> {

    private static final long serialVersionUID = -1989978807L;

    public static final QCar car = new QCar("car");

    public final QBaseTimeEntity _super = new QBaseTimeEntity(this);

    public final BooleanPath accidentHistory = createBoolean("accidentHistory");

    public final StringPath brand = createString("brand");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final StringPath description = createString("description");

    public final EnumPath<FuelType> fuelType = createEnum("fuelType", FuelType.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final ListPath<CarImage, QCarImage> images = this.<CarImage, QCarImage>createList("images", CarImage.class, QCarImage.class, PathInits.DIRECT2);

    public final NumberPath<Integer> mileage = createNumber("mileage", Integer.class);

    public final StringPath modelName = createString("modelName");

    public final NumberPath<Long> price = createNumber("price", Long.class);

    public final NumberPath<Integer> productionYear = createNumber("productionYear", Integer.class);

    public final EnumPath<CarStatus> status = createEnum("status", CarStatus.class);

    public final EnumPath<Transmission> transmission = createEnum("transmission", Transmission.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public QCar(String variable) {
        super(Car.class, forVariable(variable));
    }

    public QCar(Path<? extends Car> path) {
        super(path.getType(), path.getMetadata());
    }

    public QCar(PathMetadata metadata) {
        super(Car.class, metadata);
    }

}

