package ws.peoplefirst.utumana.security;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import ws.peoplefirst.utumana.exception.InvalidJwtAuthenticationException;

@Component
public class JwtTokenFilter extends OncePerRequestFilter {
	
	private JwtTokenProvider jwtTokenProvider;    
	
	public JwtTokenFilter(JwtTokenProvider jwtTokenProvider) {
		this.jwtTokenProvider = jwtTokenProvider;
	}    
	
	@Override
	public void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain filterChain) throws IOException, ServletException {

		try {
			String token = jwtTokenProvider.resolveToken(req);
			//System.out.println("doFilter token: " + token);
			
		    if (token != null && jwtTokenProvider.validateToken(token)) {
		        Authentication auth = token != null ? jwtTokenProvider.getAuthentication(token) : null;
		        SecurityContextHolder.getContext().setAuthentication(auth);
		    }

		    filterChain.doFilter(req, res);
		} catch (InvalidJwtAuthenticationException ijaEx) {
			HttpServletResponse response = (HttpServletResponse) res;
            response.setStatus(ijaEx.getCode());
            response.getWriter().append(ijaEx.getMessage()).flush();
		}	    
	}
}
