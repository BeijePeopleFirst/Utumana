package ws.peoplefirst.utumana;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

	private String allowedOrigins[] = new String[] {"http://localhost"};

	private String allowedMethods[] = new String[] {"HEAD", "GET", "PUT", "POST", "DELETE", "PATCH"}; //{"*"}; 
	
	
    @Override
    public void addCorsMappings(CorsRegistry registry) {
//    	System.out.println("addCorsMappings");
        registry.addMapping("/**")
                .allowedMethods(allowedMethods);
    }


	@Bean
	CorsConfigurationSource corsConfigurationSource() {	
		final CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(Arrays.asList(allowedOrigins));
		configuration.setAllowedMethods(Arrays.asList(allowedMethods));
		configuration.addAllowedHeader("*");
		configuration.applyPermitDefaultValues();
		configuration.setAllowCredentials(true);
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

	
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
//		registry.addResourceHandler("/static/**")
//				.addResourceLocations("classpath:/static/");
		registry.addResourceHandler("/**")
		.addResourceLocations("classpath:/");
	}
	
	
	 @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("home.html");
    }
	
}