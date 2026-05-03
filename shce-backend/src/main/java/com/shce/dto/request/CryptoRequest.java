package com.shce.dto.request;

import com.shce.enums.Algorithm;
import com.shce.enums.CryptoOperation;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CryptoRequest {

    @NotNull(message = "Algorithm must not be null")
    private Algorithm algorithm;

    /**
     * Operation type. Set automatically by specific endpoints (/encrypt, /decrypt, etc.).
     * Only required when using the generic /execute endpoint.
     */
    private CryptoOperation operation;

    @NotBlank(message = "Input data must not be blank")
    @Size(max = 1_048_576, message = "Input data must not exceed 1MB")
    private String inputData;

    /**
     * PEM-encoded key. For encrypt/verify → public key.
     * For decrypt/sign → private key.
     */
    @NotBlank(message = "Key must not be blank")
    @Size(max = 32_768, message = "Key PEM must not exceed 32KB")
    private String keyPem;

    /**
     * Only required for verification — the signature to verify against.
     */
    private String signatureBase64;
}
