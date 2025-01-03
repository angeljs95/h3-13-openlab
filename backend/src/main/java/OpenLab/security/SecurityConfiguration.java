package OpenLab.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    private final AuthDomainConfig domainConfig;
    private final AuthAudienceConfig audienceConfig;

    public SecurityConfiguration(AuthDomainConfig domainConfig, AuthAudienceConfig audienceConfig) {
        this.domainConfig = domainConfig;
        this.audienceConfig = audienceConfig;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        //Autenticacion Controller
                        .requestMatchers(HttpMethod.POST, "/api/**","/api/login", "/api/login/signup").permitAll()
                        //Cliente Controller
                        .requestMatchers(HttpMethod.GET, "/api/cliente/getAll", "/api/cliente/{id}", "/api/cliente/add").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/cliente/update").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/cliente/{id}").authenticated()
                        //Iniciativa Controller
                        .requestMatchers(HttpMethod.GET, "/api/iniciativa/{id}").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/iniciativa/add").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/iniciativa/getAllIniciativas").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/iniciativa/getUserIniciativas/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/iniciativa/search").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/iniciativa/like").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/iniciativa/share").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/iniciativa/join").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/iniciativa/getAllIniciativasAndSocials").permitAll()
                        //Admin Controller
                        .requestMatchers(HttpMethod.GET, "/api/admin/getAll", "/api/cliente/{id}").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/admin/update").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/admin/{id}").authenticated()
                        // Socials Controller
                        .requestMatchers(HttpMethod.POST, "/api/social/socials").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/social/getUserLikes/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/social/getUserJoins/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/social/getUserShares/{id}").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/social/like").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/social/share").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/social/join").permitAll()
                        // BuyOrder Controller - SellOrder Controller
                        .requestMatchers(HttpMethod.GET, "api/orders/getAllBuyOrders").permitAll()
                        .requestMatchers(HttpMethod.GET, "api/orders/getAllSellOrders").permitAll()
                        .requestMatchers(HttpMethod.POST, "api/orders/addBuyOrder").permitAll()
                        .requestMatchers(HttpMethod.POST, "api/orders/addSellOrder").permitAll()
                        .requestMatchers(HttpMethod.PUT, "api/orders/updateBuyOrder").permitAll()
                        .requestMatchers(HttpMethod.PUT, "api/orders/updateSellOrder").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "api/orders/deleteBuyOrder/{id}").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "api/orders/deleteSellOrder/{id}").permitAll()
                        // Estadisticas Controller
                        .requestMatchers(HttpMethod.GET, "api/stadistics/{id}").permitAll()
                        //Swagger
                        .requestMatchers(HttpMethod.GET,"/swagger-ui.html", "/v3/api-docs/**", "/swagger-ui/**").permitAll()
                        .anyRequest().authenticated())
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.decoder(jwtDecoder())));
        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        NimbusJwtDecoder jwtDecoder = JwtDecoders.fromIssuerLocation(domainConfig.getAUTH_DOMAIN());

        // Validación personalizada del token JWT
        OAuth2TokenValidator<Jwt> audienceValidator = new AudienceValidator(audienceConfig.getAUTH_AUDIENCE());
        OAuth2TokenValidator<Jwt> defaultValidator = JwtValidators.createDefaultWithIssuer(domainConfig.getAUTH_DOMAIN());
        OAuth2TokenValidator<Jwt> combinedValidator = new DelegatingOAuth2TokenValidator<>(defaultValidator, audienceValidator);

        jwtDecoder.setJwtValidator(combinedValidator);
        return jwtDecoder;
    }

}