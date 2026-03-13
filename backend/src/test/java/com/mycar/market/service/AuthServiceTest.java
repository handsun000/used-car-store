package com.mycar.market.service;

import com.mycar.market.domain.Role;
import com.mycar.market.dto.AuthResponse;
import com.mycar.market.dto.LoginRequest;
import com.mycar.market.security.JwtTokenProvider;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @InjectMocks
    AuthService authService;

    @Mock
    AuthenticationManager authenticationManager;

    @Mock
    JwtTokenProvider tokenProvider;

    @Mock
    com.mycar.market.repository.RefreshTokenRepository refreshTokenRepository;

    @Test
    @DisplayName("로그인 성공")
    void login_Success() {
        // given
        LoginRequest request = new LoginRequest("test@test.com", "password");

        Authentication authentication = mock(Authentication.class);
        given(authenticationManager.authenticate(any())).willReturn(authentication);
        given(tokenProvider.createAccessToken(authentication)).willReturn("test-access-token");
        given(tokenProvider.createRefreshToken(authentication)).willReturn("test-refresh-token");
        
        com.mycar.market.domain.RefreshToken mockRt = com.mycar.market.domain.RefreshToken.builder()
                .username("test@test.com")
                .build();
        given(refreshTokenRepository.findByUsername(any())).willReturn(java.util.Optional.of(mockRt));

        // when
        java.util.Map<String, String> response = authService.login(request);

        // then
        assertThat(response).isNotNull();
        assertThat(response.get("accessToken")).isEqualTo("test-access-token");
        assertThat(response.get("refreshToken")).isEqualTo("test-refresh-token");
    }
}
