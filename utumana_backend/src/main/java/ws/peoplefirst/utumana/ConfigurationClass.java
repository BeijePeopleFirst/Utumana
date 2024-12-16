package ws.peoplefirst.utumana;


import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.http.HttpMethod;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.AnnotationTransactionAttributeSource;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.interceptor.TransactionAttributeSource;
import org.springframework.web.filter.GenericFilterBean;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;

import io.micrometer.common.lang.NonNull;
import ws.peoplefirst.utumana.security.JwtAuthenticationEntryPoint;
import ws.peoplefirst.utumana.security.JwtConfigurer;
import ws.peoplefirst.utumana.security.JwtTokenFilter;
import ws.peoplefirst.utumana.security.JwtTokenProvider;
import ws.peoplefirst.utumana.service.UserService;

import org.springframework.security.config.http.SessionCreationPolicy;




@Configuration

@EnableAsync
@EnableTransactionManagement
@EnableJpaRepositories(value = "ws.peoplefirst.utumana.repository")

@EnableWebSecurity
//@EnableGlobalMethodSecurity(prePostEnabled = true)
@PropertySource("classpath:*.properties")
public class ConfigurationClass {

//	private JwtTokenFilter jwtTokenFilter;
//	
//	@Autowired
//	private JwtTokenProvider jwtTokenProvider;
//
//	@Autowired
//	private UserService userService;
//
//	
////    @Primary
////    @Bean(name="transactionManager")
////    public PlatformTransactionManager dbTransactionManager() {
////        JpaTransactionManager transactionManager = new JpaTransactionManager();
////        transactionManager.setEntityManagerFactory(JpaEntityManager.getInstance());
////        return transactionManager;
////    }
//    
    @Bean
    public MultipartResolver multipartResolver() {
    	return new StandardServletMultipartResolver();
    }
//      
////    //SECURITY
////    protected void configure(HttpSecurity http) throws Exception {
////        http
////        	.cors().and()
////            .httpBasic().disable()
////            .csrf().disable()
////            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
////            .and()
////                .authorizeRequests()
////                .antMatchers("/test").permitAll()
////            .and()
////            .apply(new JwtConfigurer(jwtTokenProvider))
////            .and()
////            .logout((logout) -> logout.logoutSuccessUrl("/"));
////    }
//	
////    @Bean
////    public AuthenticationManager authenticationManagerBean() throws Exception {
////        return super.authenticationManagerBean();
////    }
//    
//    @SuppressWarnings("removal")
//    @Bean
//	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//		/*http
//		.csrf(csrf -> csrf.disable())
//		.authorizeHttpRequests(authz -> authz
//				.requestMatchers("/check").permitAll()
//				.anyRequest().authenticated()
//				
//				).authenticationProvider()
//		.httpBasic(withDefaults -> {});
//		return http.build();*/
//    	
//		    	http
//				// disabling csrf since we won't use form login
//				.cors().and()
//				.httpBasic().disable()
//				.csrf().disable()
//				// giving permission to every request for /login endpoint
//				.authorizeRequests().requestMatchers("/signin").permitAll()
//		//    // for everything else, the user has to be authenticated
//		//    .anyRequest().authenticated()
//				// setting stateless session, because we choose to implement Rest API
//				.and().sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//				.and()
//		        .apply(new JwtConfigurer(jwtTokenProvider));
//		// adding the custom filter before UsernamePasswordAuthenticationFilter in the
//		// filter chain
//		http.addFilterBefore(jwtTokenFilter, GenericFilterBean.class);
//		return http.build();
//	}
//
//    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
//		auth.userDetailsService(userService).passwordEncoder(getPasswordEncoder());
//	}
//    
////    @Bean
////	public AuthenticationManager authenticationManager(HttpSecurity http, PasswordEncoder bCryptPasswordEncoder) 
////	  throws Exception {
////	    return http.getSharedObject(AuthenticationManagerBuilder.class)
////	      .userDetailsService(userService)
////	      .passwordEncoder(bCryptPasswordEncoder)
////	      .and()
////	      .build();
////	}
//
//    @Bean
//	public PasswordEncoder getPasswordEncoder() {
//		return new PasswordEncoder() {
//			
//			@Override
//			public boolean matches(CharSequence rawPassword, String encodedPassword) {
//				return encode(rawPassword).equals(encodedPassword);
//			}
//			
//			@Override
//			public String encode(CharSequence rawPassword) {
//				return rawPassword.toString();
//			}
//		};
//	}
//
//	
////    @Bean
////    TransactionAttributeSource transactionAttributeSource() {
////    	return new AnnotationTransactionAttributeSource(true);
////    }
//	
//	@Bean
//	public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
//	    return http.getSharedObject(AuthenticationManagerBuilder.class)
//	            .build();
//	}
	
//	@Autowired
//	private JwtTokenFilter jwtAuthenticationFilter;
//	
//	@Autowired
//    private UserService userService;
//	
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http.csrf(AbstractHttpConfigurer::disable)
//                .authorizeHttpRequests(request -> request.requestMatchers("/check")
//                        .permitAll().anyRequest().authenticated())
//                .sessionManagement(manager -> manager.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                .authenticationProvider(authenticationProvider()).addFilterBefore(
//                        jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
//        return http.build();
//    }
//
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//
//    @Bean
//    public AuthenticationProvider authenticationProvider() {
//        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
//        authProvider.setUserDetailsService(userService);
//        authProvider.setPasswordEncoder(passwordEncoder());
//        return authProvider;
//    }
//
//    @Bean
//    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
//            throws Exception {
//        return config.getAuthenticationManager();
//    }
	
	@Autowired
	private UserService userDetailsService;

	@Autowired
    private JwtAuthenticationEntryPoint authenticationEntryPoint;

	@Autowired
    private JwtTokenFilter authenticationFilter;

    @Bean
    public static PasswordEncoder passwordEncoder(){
        //return new BCryptPasswordEncoder(); {
    	return new PasswordEncoder() {
//			
			@Override
			public boolean matches(CharSequence rawPassword, String encodedPassword) {
				System.out.println("Raw -> " + rawPassword);
				System.out.println("Encoded -> " + encodedPassword);
				
				return encode(rawPassword).equals(encodedPassword);
			}
			
			@Override
			public String encode(CharSequence rawPassword) {
				return rawPassword.toString();
			}
		};
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests((authorize) -> {
                    authorize.requestMatchers("/api/signin").permitAll();
                    authorize.requestMatchers("/check").permitAll();
                    authorize.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll();
                    authorize.anyRequest().authenticated();
                }).httpBasic(Customizer.withDefaults());

        http.exceptionHandling( exception -> exception
                .authenticationEntryPoint(authenticationEntryPoint));

        http.addFilterBefore(authenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

//    @Bean
//    public UserDetailsService userDetailsService(){
//
//        UserDetails ramesh = User.builder()
//                .username("ramesh")
//                .password(passwordEncoder().encode("password"))
//                .roles("USER")
//                .build();
//
//        UserDetails admin = User.builder()
//                .username("admin")
//                .password(passwordEncoder().encode("admin"))
//                .roles("ADMIN")
//                .build();
//
//        return new InMemoryUserDetailsManager(ramesh, admin);
//    }

}
