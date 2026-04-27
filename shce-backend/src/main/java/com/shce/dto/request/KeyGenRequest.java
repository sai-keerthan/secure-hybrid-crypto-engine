package com.shce.dto.request;

import com.shce.enums.Algorithm;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KeyGenRequest {

    @NotNull(message = "Algorithm must not be null")
    private Algorithm algorithm;
}
