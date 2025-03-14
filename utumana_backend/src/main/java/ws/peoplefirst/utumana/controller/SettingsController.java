package ws.peoplefirst.utumana.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import ws.peoplefirst.utumana.model.Theme;
import ws.peoplefirst.utumana.service.SettingsService;

@RestController
@RequestMapping("/api/settings")
@Tag(name = "Settings", description = "Settings management APIs")
public class SettingsController {
    Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private SettingsService settingsService;

    @Operation(summary = "Get theme", 
			description = "Get the theme of the application.", tags = { "Settings" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Theme returned successfully.",
                    content = @Content(schema = @Schema(implementation = Theme.class)))
    })
	@PreAuthorize("permitAll()")
    @GetMapping("/theme")
    public Theme getTheme() {
        return settingsService.getTheme();
    }

    @Operation(summary = "Update theme", 
			description = "Update the theme of the application.", tags = { "Settings" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Theme updated successfully.",
                    content = @Content(schema = @Schema(implementation = Theme.class))),
            @ApiResponse(responseCode = "400", description = "Error updating theme.")
    })
	@PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/theme")
    public Theme updateTheme(@RequestBody Theme theme) {
        return settingsService.updateTheme(theme);
    }
}
