package ws.peoplefirst.utumana.utility;

public class SeriesInstance {
    
    private String name;    //x-coordinate
    private Object value;   //y-coordinate


    public SeriesInstance() {}

    public SeriesInstance(String name, Object value) {
        this();

        this.name = name;
        this.value = value;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public Object getValue() {
        return value;
    }
    public void setValue(Object value) {
        this.value = value;
    }
}
