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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import ws.peoplefirst.utumana.criteria.SearchAccomodationCriteria;
import ws.peoplefirst.utumana.dto.AccommodationDTO;
import ws.peoplefirst.utumana.exception.TheJBeansException;
import ws.peoplefirst.utumana.model.Accommodation;

import java.time.LocalDate;
import java.util.List;

@Repository
public class QAccommodationRepositoryImpl implements QAccommodationRepository {

    @PersistenceContext
    private EntityManager entityManager;


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

        // Costruzione della query principale
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

        // Esecuzione di una query separata per ottenere il conteggio totale
        long total = new JPAQuery<>(entityManager)
                .select(accommodation.id)
                .from(accommodation)
                .where(accomodationBuilder)
                .fetchCount();

        // Restituisci il risultato come Page
        return new PageImpl<>(results, pageable, total);
    }


}