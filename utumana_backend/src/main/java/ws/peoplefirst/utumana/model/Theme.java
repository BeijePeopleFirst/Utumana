package ws.peoplefirst.utumana.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Model to represent the colors theme for the application.")
public class Theme {
    @JsonProperty("primary_default")
    @Schema(description = "Default shade of primary color", example = "#0e7490")
    String primaryDefault;

    @JsonProperty("primary_dark")
    @Schema(description = "Darker shade of primary color", example = "#164e63")
    String primaryDark;

    @JsonProperty("primary_light")
    @Schema(description = "Lighter shade of primary color", example = "#0891b2")
    String primaryLight;

    @JsonProperty("secondary_default")
    @Schema(description = "Default shade of secondary color", example = "#fb923c")
    String secondaryDefault;

    @JsonProperty("secondary_dark")
    @Schema(description = "Darker shade of secondary color", example = "#ea580c")
    String secondaryDark;

    @JsonProperty("secondary_light")
    @Schema(description = "Lighter shade of secondary color", example = "#f59e0b")
    String secondaryLight;

    @Schema(description = "First neutral color", example = "#fcfcfc")
    String neutral1;

    @Schema(description = "Second neutral color", example = "#fff7ed")
    String neutral2;


    public String getPrimaryDefault() {
        return primaryDefault;
    }
    public void setPrimaryDefault(String primaryDefault) {
        this.primaryDefault = primaryDefault;
    }
    public String getPrimaryDark() {
        return primaryDark;
    }
    public void setPrimaryDark(String primaryDark) {
        this.primaryDark = primaryDark;
    }
    public String getPrimaryLight() {
        return primaryLight;
    }
    public void setPrimaryLight(String primaryLight) {
        this.primaryLight = primaryLight;
    }
    public String getSecondaryDefault() {
        return secondaryDefault;
    }
    public void setSecondaryDefault(String secondaryDefault) {
        this.secondaryDefault = secondaryDefault;
    }
    public String getSecondaryDark() {
        return secondaryDark;
    }
    public void setSecondaryDark(String secondaryDark) {
        this.secondaryDark = secondaryDark;
    }
    public String getSecondaryLight() {
        return secondaryLight;
    }
    public void setSecondaryLight(String secondaryLight) {
        this.secondaryLight = secondaryLight;
    }
    public String getNeutral1() {
        return neutral1;
    }
    public void setNeutral1(String neutral1) {
        this.neutral1 = neutral1;
    }
    public String getNeutral2() {
        return neutral2;
    }
    public void setNeutral2(String neutral2) {
        this.neutral2 = neutral2;
    }

    static public Theme getDefaultTheme() {
        Theme theme = new Theme();
        theme.setPrimaryDefault("#0e7490");
        theme.setPrimaryDark("#164e63");
        theme.setPrimaryLight("#0891b2");
        theme.setSecondaryDefault("#fb923c");
        theme.setSecondaryDark("#ea580c");
        theme.setSecondaryLight("#f59e0b");
        theme.setNeutral1("#fcfcfc");
        theme.setNeutral2("#fff7ed");
        return theme;
    }
}