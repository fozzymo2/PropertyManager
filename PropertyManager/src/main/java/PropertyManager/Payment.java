package PropertyManager;

import javax.persistence.*;

@Entity
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long paymentId;
    private long apartmentId;
    private int paymentAmount;
    private int month;


    public Payment(){};

    public Payment(long apartmentId, int paymentAmount, int month){
        this.apartmentId = apartmentId;
        this.paymentAmount = paymentAmount;
        this.month = month;
    }

    @Override
    public String toString(){
        return String.format("Payment[paymentId = '%d', apartmentId = '%s', paymentAmount = '%d']",
                paymentId, apartmentId, paymentAmount);
    }

    public int getPaymentAmount() {
        return paymentAmount;
    }

    public void setPaymentAmount(int paymentAmount) {
        this.paymentAmount = paymentAmount;
    }

    public long getPaymentId() {
        return paymentId;
    }

    public long getApartmentId() {
        return apartmentId;
    }





}
