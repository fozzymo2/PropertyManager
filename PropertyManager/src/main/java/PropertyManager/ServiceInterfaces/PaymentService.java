package PropertyManager.ServiceInterfaces;

import PropertyManager.Models.Apartment;
import PropertyManager.Models.Payment;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface PaymentService {

    Iterable<Payment> getAll();

    void addNew(long buildingId, long apartmentId, int paymentAmount, int month);

    void delete(long paymentId);

    List<Payment> getAllPaymentsByApartment (Long apartmentId);

}
