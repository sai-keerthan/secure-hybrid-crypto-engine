package com.shce.dto.response;

import com.shce.enums.Algorithm;
import com.shce.enums.CryptoMode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KeyGenResponse {

    private Algorithm algorithm;
    private CryptoMode mode;
    private String publicKeyPem;
    private String privateKeyPem;
    private String keyFormat;
    private int keySize;
    private Set<String> supportedOperations;
}
