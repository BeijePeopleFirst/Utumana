package ws.peoplefirst.utumana.repository.dsl;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.SubQueryExpression;
import com.querydsl.core.types.dsl.ComparableExpressionBase;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQuery;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import ws.peoplefirst.utumana.criteria.SearchAccomodationCriteria;
import ws.peoplefirst.utumana.dto.AccommodationDTO;
import ws.peoplefirst.utumana.model.*;

import java.time.LocalDate;
import java.util.List;

@Repository
public class QAccommodationRepositoryImpl implements QAccommodationRepository {

    @PersistenceContext
    private EntityManager entityManager;

//    @Override
//    public Accommodation test() {
//        return null;
//    }


    @Override
    public List<AccommodationDTO> searchAccomodation(SearchAccomodationCriteria searchAccomodationCriteria) {

        //Define query classes
        QAccommodation accommodation = QAccommodation.accommodation;
        QAccommodationRating accommodationRating = QAccommodationRating.accommodationRating;
        QAvailability availability = QAvailability.availability;
        QService service = QService.service;

        BooleanBuilder accomodationBuilder = new BooleanBuilder();

        // Filter for Country/City
        String destination = searchAccomodationCriteria.getDestination();
        if (destination != null && !destination.isEmpty()) {
            accomodationBuilder.and(
                    accommodation.country.contains(destination)
                            .or(accommodation.city.contains(destination))
            );
        }

        // Filter for NumOfBeds
        Integer numberOfGuests = searchAccomodationCriteria.getNumberOfGuests();
        if (numberOfGuests != null) {
            accomodationBuilder.and(accommodation.beds.goe(numberOfGuests));
        }

        // Filter for Approval and Visibility
        accomodationBuilder.and(accommodation.approvalTimestamp.isNotNull())
                .and(accommodation.hidingTimestamp.isNull());

        // Subquery for availability:
        BooleanBuilder availabilityBuilder = new BooleanBuilder();
        LocalDate checkInDate = searchAccomodationCriteria.getCheckInDate();
        LocalDate checkOutDate = searchAccomodationCriteria.getCheckOutDate();
        if (checkInDate != null && checkOutDate != null) {
            availabilityBuilder.and(availability.startDate.loe(checkInDate))
                    .and(availability.endDate.goe(checkOutDate));
        }

        // Filter for FreeOnly
        if (searchAccomodationCriteria.getFreeOnly()) {
            availabilityBuilder.and(availability.pricePerNight.loe(0.00));
        }

        // Apply Subquery to main query
        accomodationBuilder.and(accommodation.id.in(
                JPAExpressions.select(availability.accommodation.id)
                        .from(availability)
                        .where(availabilityBuilder)
        ));

        // Subquery for services
        List<Long> serviceIds = searchAccomodationCriteria.getServiceIds();
        if (serviceIds != null && !serviceIds.isEmpty()) {
            SubQueryExpression<Long> serviceCount = JPAExpressions
                    .select(service.id.countDistinct())
                    .from(service)
                    .where(service.in(accommodation.services)
                            .and(service.id.in(serviceIds)));

            NumberExpression<Long> serviceCountExpr = Expressions.numberTemplate(Long.class, "{0}", serviceCount);
            // Apply Subquery to main query
            accomodationBuilder.and(serviceCountExpr.eq((long) serviceIds.size()));
        }

        if (searchAccomodationCriteria.getMinRating() != null) {
            accomodationBuilder.and(accommodationRating.rating.goe(searchAccomodationCriteria.getMinRating()));
        }

        if (searchAccomodationCriteria.getMaxRating() != null) {
            accomodationBuilder.and(accommodationRating.rating.loe(searchAccomodationCriteria.getMaxRating()));
        }

        if (searchAccomodationCriteria.getMinPrice() != null) {
            accomodationBuilder.and(JPAExpressions
                .select(availability)
                .from(availability)
                .where(availabilityBuilder)
                .where(availability.accommodation.eq(accommodation))
                .where(availability.pricePerNight.goe(searchAccomodationCriteria.getMinPrice()))
                .exists());
        }

        if (searchAccomodationCriteria.getMaxPrice() != null) {
            accomodationBuilder.and(JPAExpressions
                .select(availability)
                .from(availability)
                .where(availabilityBuilder)
                .where(availability.accommodation.eq(accommodation))
                .where(availability.pricePerNight.loe(searchAccomodationCriteria.getMaxPrice()))
                .exists());
        }

        // Building main query
        JPAQuery<AccommodationDTO> query = new JPAQuery<>(entityManager)
                .select(Projections.constructor(AccommodationDTO.class,
                        accommodation.id,
                        accommodation.title,
                        accommodation.city,
                        accommodation.province,
                        accommodation.country,
                        accommodation.mainPhotoUrl,
                        accommodationRating.rating))
                .from(accommodation)
                .join(accommodation.rating, accommodationRating)
                .where(accomodationBuilder);

        // Sort specifications
        String orderBy = searchAccomodationCriteria.getOrderBy();
        String orderDirection = searchAccomodationCriteria.getOrderDirection();
        if (orderBy != null && !orderBy.isEmpty()) {
            Order order = (orderDirection != null && orderDirection.equalsIgnoreCase("desc")) ? Order.DESC : Order.ASC;

            OrderSpecifier<?> orderSpecifier;
            switch (orderBy.toLowerCase()) {
                case "rating":
                    orderSpecifier = new OrderSpecifier<>(order, accommodationRating.rating);
                    break;
                case "title":
                    orderSpecifier = new OrderSpecifier<>(order, accommodation.title);
                    break;
                default:
                    PathBuilder<Accommodation> pathBuilder = new PathBuilder<>(Accommodation.class, "accommodation");
                    ComparableExpressionBase<?> fieldPath = pathBuilder.getComparable(orderBy, Comparable.class);
                    orderSpecifier = new OrderSpecifier<>(order, fieldPath);
                    break;
            }

            query.orderBy(orderSpecifier);
        }

        // Make the query
        return query.fetch();
    }
}
