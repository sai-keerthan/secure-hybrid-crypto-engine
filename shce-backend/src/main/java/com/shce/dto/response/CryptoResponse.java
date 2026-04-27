package com.shce.dto.response;

import com.shce.enums.Algorithm;
import com.shce.enums.CryptoOperation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CryptoResponse {

    private Algorithm algorithm;
    private CryptoOperation operation;
    private String outputData;
    private boolean success;
    private String message;
    private long processingTimeMs;
}
