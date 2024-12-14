package com.nuhcorre.chupebankbackend.config;

import com.nuhcorre.chupebankbackend.util.AESUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;

import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

@Configuration
public class AESConfig {

    @Value("${aes.secret-key}")
    private String secretKey;

    @Value("${aes.init-vector}")
    private String initVector;

    @Bean
    public SecretKeySpec aesKey() {
        return AESUtil.generateKey(secretKey);
    }

    @Bean
    public IvParameterSpec aesIv() {
        return AESUtil.generateIv(initVector);
    }
}