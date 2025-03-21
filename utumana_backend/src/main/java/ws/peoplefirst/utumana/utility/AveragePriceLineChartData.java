package ws.peoplefirst.utumana.utility;

import java.util.List;

public class AveragePriceLineChartData {
    
    private String name;    //Name of the data to represent in the chart
    private List<SeriesInstance> series;


    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public List<SeriesInstance> getSeries() {
        return series;
    }
    public void setSeries(List<SeriesInstance> series) {
        this.series = series;
    }
}
