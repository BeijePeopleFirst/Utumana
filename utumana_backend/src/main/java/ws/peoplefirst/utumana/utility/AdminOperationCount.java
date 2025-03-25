package ws.peoplefirst.utumana.utility;

public class AdminOperationCount {

    private PopularOperationTitle title;
    private Integer counter;


    public AdminOperationCount() {
        super();
    }

    public AdminOperationCount(PopularOperationTitle title, Integer counter) {
        this.counter = counter;
        this.title = title;
    }


    public PopularOperationTitle getTitle() {
        return title;
    }
    public void setTitle(PopularOperationTitle title) {
        this.title = title;
    }
    public Integer getCounter() {
        return counter;
    }
    public void setCounter(Integer counter) {
        this.counter = counter;
    }
    
}
