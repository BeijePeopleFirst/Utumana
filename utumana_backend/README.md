
# Accommodation Booking System API

## Summary

This API documentation outlines the main functionalities of the accommodation booking system, including:
- Accommodation management
- Availability & booking process
- Price calculations
- Unavailability management
- Privacy and review policies
- Security management
- Exceptions management

Each API endpoint is structured to ensure efficiency and maintain historical data while keeping the platform user-friendly and secure.

## Screenshots

![Database structure](https://via.placeholder.com/468x300?text=App+Screenshot+Here)

## Key Features & API Endpoints

### 1. Accommodation Management

- **Approval Process:**
  - After an accommodation is created, an admin must approve or reject it before it becomes visible to other users.
- **Soft Deletion:**
  - Accommodations are never permanently deleted. Instead, a `hiding_timestamp` is set to maintain historical records.

#### API Endpoint:
```java
// AccommodationController.java
@PreAuthorize("hasAuthority('USER')")
@PatchMapping("/delete_accommodation/{id}")
public Accommodation deleteAccommodationAPI(@PathVariable Long id, Authentication auth)
```

---

### 2. Availability Management

- **Setting Availability:**
  - Owners can define availability periods for their accommodations.
  - Each availability period must have a price per night; otherwise, it defaults to 0.

---

### 3. Booking Management

- **Booking Approval:**
  - Once a customer books an accommodation, the request must be approved by the owner.
- **Booking Stages:**
  - A booking can have five different statuses: `PENDING`, `REJECTED`, `ACCEPTED`, `DOING`, `DONE`.
  - A timestamp is recorded when a booking is accepted or rejected.
- **Check-in & Check-out:**
  - Hardcoded times: Check-in at 2:00 PM, Check-out at 10:00 AM.
- **Example Booking:**
  - A booking from `1/1` to `5/1` will have a timestamp from `1/1T14:00:00` to `5/1T10:00:00`.

#### API Endpoint:
```java
// BookingController.java
@PreAuthorize("hasAuthority('USER')")
@PostMapping("/book/{accommodation_id}")
public BookingDTO bookAccommodation(Authentication auth,
        @PathVariable(name="accommodation_id") Long accommodationId,
        @RequestParam(name = "checkIn") String checkInString,
        @RequestParam(name = "checkOut") String checkOutString)
```

---

### 4. Unavailability Management

- **Blocking Dates:**
  - Hosts can block specific dates by booking their own accommodation with an `is_unavailability` flag.
  - These bookings require no approval and have a cost of `0`.
- **Example:**
  - If an accommodation is available from `31/1` to `28/2` but the owner is unavailable from `5/2` to `8/2`, they can set unavailability to prevent bookings during that period.
- **Pending Booking Rejection:**
  - If an unavailability is added, all `PENDING` bookings for that period are automatically rejected.

#### API Endpoints:
```java
// BookingController.java
@PreAuthorize("hasAuthority('USER')")
@PostMapping("/add_unavailability")
public Booking addUnavailability(Authentication auth,
        @RequestBody Availability unavailability)
```
```java
// BookingController.java
@PreAuthorize("hasAuthority('USER')")
@DeleteMapping("/delete_unavailability/{booking_id}")
public Booking deleteUnavailability(Authentication auth,
        @PathVariable(name="booking_id") Long bookingId)
```

---

### 5. Price Management

#### **Accommodation Price Range**

- **Purpose:** Retrieves the minimum and maximum prices for a given period or for all available dates.
- **Optimization:**
  - This API was separated to improve performance when fetching `AccommodationDTO` data.

#### API Endpoint:
```java
// AccommodationController.java
@PreAuthorize("hasAuthority('USER')")
@GetMapping("/accommodation/prices")
public List<PriceDTO> configurePriceRanges(@RequestParam(value="ids") List<Long> ids,
        @RequestParam(value="check_in", required=false) String checkIn,
        @RequestParam(value="check_out", required=false) String checkOut)
```

#### **Booking Total Price Calculation**

- **Purpose:** Displays the total cost of a booking before confirmation.
- **Reusability:** The same service method is used for calculating the price before and after booking.

#### API Endpoints:
```java
@PreAuthorize("hasAuthority('USER')")
@GetMapping("/calculate_price/{accommodation_id}")
public double CalculatePrice(@PathVariable(name="accommodation_id") Long accommodationId,
        @RequestParam(name = "checkIn") String checkInString,
        @RequestParam(name = "checkOut") String checkOutString)
```
```java
@PreAuthorize("hasAuthority('USER')")
@PostMapping("/book/{accommodation_id}")
public BookingDTO bookAccommodation(Authentication auth,
        @PathVariable(name="accommodation_id") Long accommodationId,
        @RequestParam(name = "checkIn") String checkInString,
        @RequestParam(name = "checkOut") String checkOutString)
```

---

### 6. Privacy Management

- **User Permissions:**
  - Users can modify their profile picture, bio, and password.
  - Name, surname, and email cannot be changed.

---

### 7. Review Management

- **Approval Process:**
  - Reviews must be approved or rejected by the host before being published, in line with company policy.

#### API Endpoints:
```java
// ReviewController.java
@PreAuthorize("hasAuthority('USER')")
@PatchMapping("/review/{id}")
public Review acceptReview(@PathVariable Long id, Authentication auth)
```
```java
// ReviewController.java
@PreAuthorize("hasAuthority('USER')")
@DeleteMapping("/review/{id}")
public Boolean rejectReview(@PathVariable Long id, Authentication auth)
```

---

### 8. Security Management  

#### **Authentication & Authorization**  
To ensure a secure and controlled access to the platform, the API utilizes JWT (JSON Web Token) for authentication and authorization. Each user is assigned a specific role, which determines the permitted operations based on assigned privileges.  

- **JWT Token**: Stored in Local Storage, it is used for authenticating and authorizing API requests.  
- **Refresh Token**: Stored both in cookies and the database, allowing users to obtain a new JWT without requiring reauthentication.  

#### **Roles & Permissions**  
API access is regulated through the `@PreAuthorize` annotation, which enforces role-based access restrictions:  

- **USER**:  
  - Assigned to all registered users.  
  - Access to booking operations, profile management, and reviews.  
- **ADMIN**:  
  - Has all `USER` privileges.  
  - Can approve or reject accommodations and reviews.  

#### **Technical Notes**  
- Security functionalities are implemented within the `security` package.  
- The API relies on Spring Security to handle authentication and authorization.  
- Each protected endpoint requires the user to be authenticated and possess at least the `USER` role.  

---


### 9. Exception Management

- `slf4j.Logger` has been used to trace the application's behaviour at runtime.

#### **Custom Exceptions**
To handle errors effectively, the API defines a set of custom exceptions located in the `exception` package. These exceptions ensure that errors are properly categorized and communicated to clients.

**Defined Exceptions and HTTP Status Codes:**
- `InvalidJSONException` → 400 Bad Request
- `DBException` → 503 Service Unavailable
- `UsernameNotFoundException` → 401 Unauthorized
- `InvalidJwtAuthenticationException` → 401 Unauthorized
- `BadCredentialsException` → 401 Unauthorized
- `ForbiddenException` → 403 Forbidden

#### **Error Response Format**
All exceptions return a structured JSON response containing essential error details:

**Java Class Representation:**
```java
private String time;
private String status;
private String message;
```

**JSON Response Example:**
```json
{
    "time": "2025-02-14T10:15:30Z",
    "status": "403 Forbidden",
    "message": "Access is denied."
}
```

#### **Global Exception Handler**
All thrown exceptions are managed centrally using `CustomExceptionHandler`. This ensures consistency in error handling and response formatting.

**Example Implementation:**
```java
@ExceptionHandler(value = {IdNotFoundException.class})
	public ResponseEntity<ErrorMessage> ControllerExceptionHandler(IdNotFoundException ex, WebRequest request) {
		int errorCode = 404;
		ErrorMessage re = new ErrorMessage();
		re.setMessage(ex.getLocalizedMessage());
		re.setStatus(errorCode);
		re.setTime(LocalDateTime.now());
		log.error(re.getMessage());
		return ResponseEntity.status(errorCode).body(re);
	}
```

This structure improves API stability and provides clear error messages for clients.
