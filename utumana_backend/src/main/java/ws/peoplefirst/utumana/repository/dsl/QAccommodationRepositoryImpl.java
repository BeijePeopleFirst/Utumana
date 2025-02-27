package ws.peoplefirst.utumana.repository.dsl;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.SubQueryExpression;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.ComparableExpressionBase;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQuery;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import ws.peoplefirst.utumana.AddressConfiguration;
import ws.peoplefirst.utumana.criteria.SearchAccomodationCriteria;
import ws.peoplefirst.utumana.dto.AccommodationDTO;
import ws.peoplefirst.utumana.exception.TheJBeansException;
import ws.peoplefirst.utumana.model.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Repository
public class QAccommodationRepositoryImpl implements QAccommodationRepository {

    @PersistenceContext
    private EntityManager entityManager;
    
    @Autowired
    private AddressConfiguration addressConfiguration;

    @Override
    public Page<AccommodationDTO> searchAccomodation(SearchAccomodationCriteria criteria) {

        // Definizione delle query classes
        QAccommodation accommodation = QAccommodation.accommodation;
        QAccommodationRating accommodationRating = QAccommodationRating.accommodationRating;
        QAvailability availability = QAvailability.availability;
        QService service = QService.service;

        // Costruzione dei filtri principali
        BooleanBuilder accomodationBuilder = new BooleanBuilder();

        // Esempio di filtro per destinazione
        String destination = criteria.getDestination();
        if (destination != null && !destination.isEmpty()) {
            accomodationBuilder.and(
                    accommodation.country.contains(destination)
                            .or(accommodation.city.contains(destination))
            );
        }

        // Filtro per numero di guest
        Integer numberOfGuests = criteria.getNumberOfGuests();
        if (numberOfGuests != null) {
            accomodationBuilder.and(accommodation.beds.goe(numberOfGuests));
        }

        // Filtro per approvazione e visibilità
        accomodationBuilder.and(accommodation.approvalTimestamp.isNotNull())
                .and(accommodation.hidingTimestamp.isNull());

        // Subquery per disponibilità
        BooleanBuilder availabilityBuilder = new BooleanBuilder();
        LocalDate checkInDate = criteria.getCheckInDate();
        LocalDate checkOutDate = criteria.getCheckOutDate();
        if (checkInDate != null && checkOutDate != null) {
            availabilityBuilder.and(availability.startDate.loe(checkInDate))
                    .and(availability.endDate.goe(checkOutDate));
        }

        // Filtro per freeOnly
        if (criteria.getFreeOnly()) {
            availabilityBuilder.and(availability.pricePerNight.loe(0.00));
        }

        // Applica la subquery per la disponibilità
        accomodationBuilder.and(accommodation.id.in(
                JPAExpressions.select(availability.accommodation.id)
                        .from(availability)
                        .where(availabilityBuilder)
        ));

        // Subquery per i servizi
        List<Long> serviceIds = criteria.getServiceIds();
        if (serviceIds != null && !serviceIds.isEmpty()) {
            SubQueryExpression<Long> serviceCount = JPAExpressions
                    .select(service.id.countDistinct())
                    .from(service)
                    .where(service.in(accommodation.services)
                            .and(service.id.in(serviceIds)));

            NumberExpression<Long> serviceCountExpr = Expressions.numberTemplate(Long.class, "{0}", serviceCount);
            accomodationBuilder.and(serviceCountExpr.eq((long) serviceIds.size()));
        }

        if (criteria.getMinRating() != null) {
            accomodationBuilder.and(accommodationRating.rating.goe(criteria.getMinRating()));
        }

        if (criteria.getMaxRating() != null) {
            // criteria.getMaxRating() + 1 beacause in DB we have decimal so if i have 3 i can't get 3.1
            accomodationBuilder.and(accommodationRating.rating.lt(criteria.getMaxRating() + 1));
        }

        if (criteria.getMinPrice() != null) {
            accomodationBuilder.and(JPAExpressions
                    .select(availability)
                    .from(availability)
                    .where(availabilityBuilder)
                    .where(availability.accommodation.eq(accommodation))
                    .where(availability.pricePerNight.goe(criteria.getMinPrice()))
                    .exists());
        }

        if (criteria.getMaxPrice() != null) {
            accomodationBuilder.and(JPAExpressions
                    .select(availability)
                    .from(availability)
                    .where(availabilityBuilder)
                    .where(availability.accommodation.eq(accommodation))
                    .where(availability.pricePerNight.loe(criteria.getMaxPrice()))
                    .exists());
        }

        // Costruzione della query principale
        JPAQuery<AccommodationDTO> query = new JPAQuery<>(entityManager)
                .select(Projections.constructor(AccommodationDTO.class,
                        accommodation.id,
                        accommodation.title,
                        accommodation.city,
                        accommodation.province,
                        accommodation.country,
                        accommodation.mainPhotoUrl,
                        accommodationRating.rating,
                        accommodation.coordinates))
                .from(accommodation)
                .join(accommodation.rating, accommodationRating)
                .where(accomodationBuilder);

        // Ordinamento (se presente)
        String orderBy = criteria.getOrderBy();
        String orderDirection = criteria.getOrderDirection();
        if (orderBy != null && !orderBy.isEmpty()) {
            Order order = (orderDirection != null && orderDirection.equalsIgnoreCase("desc"))
                    ? Order.DESC : Order.ASC;

            OrderSpecifier<?> orderSpecifier;
            switch (orderBy.toLowerCase()) {
                case "rating":
                    orderSpecifier = new OrderSpecifier<>(order, accommodationRating.rating);
                    break;
                case "title":
                    orderSpecifier = new OrderSpecifier<>(order, accommodation.title);
                    break;
                case "minprice":
                    System.out.println("Sorting by minPrice");
                    JPQLQuery<Double> minPriceQuery = JPAExpressions
                            .select(availability.pricePerNight.min())
                            .from(availability)
                            .where(availability.accommodation.eq(accommodation))
                            .where(availability.startDate.loe(checkInDate))
                            .where(availability.endDate.goe(checkOutDate));
                            
                    NumberExpression<Double> minPriceSubquery = Expressions.numberTemplate(Double.class, "({0})", minPriceQuery);
                    NumberExpression<Double> minPriceExpr = minPriceSubquery.coalesce(Double.MAX_VALUE);
                    orderSpecifier = new OrderSpecifier<>(order, minPriceExpr);
                    break;
                case "distance":
                    System.out.println(criteria);
                    String addressName = criteria.getAddressName(); 
                    AddressConfiguration.DefaultAddress defaultAddress = null;
                    System.out.println("addressName: " + addressName);
                    if (addressName != null && !addressName.isEmpty()) {
                        Optional<AddressConfiguration.DefaultAddress> foundAddress = addressConfiguration.getDefaultAddresses()
                                .stream()
                                .filter(addr -> addressName.equals(addr.getAddress()))
                                .findFirst();
                        if (foundAddress.isPresent()) {
                            defaultAddress = foundAddress.get();
                        }
                    }
                    
                    // Se non è stato trovato un indirizzo specifico, usa il primo disponibile
                    if (defaultAddress == null && !addressConfiguration.getDefaultAddresses().isEmpty()) {
                        defaultAddress = addressConfiguration.getDefaultAddresses().get(0);
                    }
                    
                    double refLat = defaultAddress != null ? defaultAddress.getLat() : 45.43915047718785;
                    double refLon = defaultAddress != null ? defaultAddress.getLon() : 9.100000000000001;
                
                    NumberExpression<Double> latExpr = Expressions.numberTemplate(Double.class, 
                        "cast(substring({0}, 1, locate(',', {0})-1) as double)", 
                        accommodation.coordinates);

                    NumberExpression<Double> lonExpr = Expressions.numberTemplate(Double.class, 
                        "cast(substring({0}, locate(',', {0})+1) as double)", 
                        accommodation.coordinates);

                    NumberExpression<Double> distance = Expressions.numberTemplate(Double.class,
                        "6371 * acos(cos(radians({0})) * cos(radians({1})) * cos(radians({2}) - radians({3})) + " +
                        "sin(radians({0})) * sin(radians({1})))",
                        refLat, latExpr, refLon, lonExpr);

                    System.out.println("distance: " + distance);
                    orderSpecifier = new OrderSpecifier<>(order, distance);
                    break;
                
                default:
                    PathBuilder<Accommodation> pathBuilder = new PathBuilder<>(Accommodation.class, "accommodation");
                    ComparableExpressionBase<?> fieldPath = pathBuilder.getComparable(orderBy, Comparable.class);
                    orderSpecifier = new OrderSpecifier<>(order, fieldPath);
                    break;
            }
            query.orderBy(orderSpecifier);
        }

        // ---- Applicazione della paginazione ----
        Pageable pageable = criteria.getPageable();
        if (pageable == null) {
            throw new TheJBeansException("Pageable could not be null");
        }
        // Imposta offset e limite
        query.offset(pageable.getOffset());
        query.limit(pageable.getPageSize());

        // Esecuzione della query per ottenere i risultati paginati
        List<AccommodationDTO> results = query.fetch();

        Long total = Objects.requireNonNullElse(new JPAQuery<>(entityManager)
                        .select(accommodation.id.count())
                .from(accommodation)
                        .join(accommodation.rating, accommodationRating)
                .where(accomodationBuilder)
                        .fetchOne()
                , 0L);

        return new PageImpl<>(results, pageable, total);
    }
}