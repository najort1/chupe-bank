package com.nuhcorre.chupebankbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ChupeBankBackendApplication {

    public static void main(String[] args) {

        Dotenv dotenv = Dotenv.load();
        System.setProperty("spring.datasource.url", dotenv.get("SPRING_DATASOURCE_URL"));
        System.setProperty("spring.datasource.username", dotenv.get("SPRING_DATASOURCE_USERNAME"));
        System.setProperty("spring.datasource.password", dotenv.get("SPRING_DATASOURCE_PASSWORD"));
        System.setProperty("security.jwt.secret-key", dotenv.get("JWT_SECRET"));
        System.setProperty("security.jwt.expiration-time", dotenv.get("JWT_EXPIRY"));
        System.setProperty("google.client.client-id", dotenv.get("GOOGLE_AUTH_KEY"));
        System.setProperty("aes.secret-key", dotenv.get("AES_SECRET_KEY"));
        System.setProperty("aes.init-vector", dotenv.get("AES_INIT_VECTOR"));

        SpringApplication.run(ChupeBankBackendApplication.class, args);
    }

}
