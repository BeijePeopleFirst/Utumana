package ws.peoplefirst.utumana.service;

import java.io.File;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import ws.peoplefirst.utumana.exception.TheJBeansException;
import ws.peoplefirst.utumana.model.Theme;
import ws.peoplefirst.utumana.utility.Constants;

@Service
public class SettingsService {
    private Logger logger = LoggerFactory.getLogger(this.getClass());

    /**
     * Returns the current theme of the application, which is saved in file theme.json.
     * If the theme file does not exist, returns the default theme.
     * @return the current theme
     */
    public Theme getTheme() {
        logger.debug("GET /settings/theme");
        try{
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(new File(Constants.THEME_FILE_PATH));
            return objectMapper.convertValue(jsonNode, Theme.class);
        } catch (Exception e) {
            logger.error("Error reading theme.json", e.getMessage());
            return Theme.getDefaultTheme();
        }
    }

    /**
     * Updates the theme of the application, which is saved in file theme.json.
     * @param theme the new theme to be saved
     * @return the updated theme
     * @throws TheJBeansException if an error occurs while updating the theme
     */
    public Theme updateTheme(Theme theme) {
        logger.debug("PUT /settings/theme");
        try{
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.convertValue(theme, JsonNode.class);
            objectMapper.writeValue(new File(Constants.THEME_FILE_PATH), jsonNode);
            return theme;
        } catch (Exception e) {
            logger.error("Error writing theme.json", e.getMessage());
            throw new TheJBeansException("Error updating theme");
        }
    }
}
