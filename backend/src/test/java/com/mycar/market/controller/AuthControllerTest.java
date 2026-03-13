package com.mycar.market.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycar.market.dto.AuthResponse;
import com.mycar.market.dto.LoginRequest;
import com.mycar.market.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false) // Disable security filters for basic controller test or manual config
class AuthControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    AuthService authService;

    @MockitoBean
    com.mycar.market.security.JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    ObjectMapper objectMapper;

    @Test
    @DisplayName("로그인 성공 테스트")
    @WithMockUser
    void login_Success() throws Exception {
        // given
        LoginRequest request = new LoginRequest("test@test.com", "password");

        java.util.Map<String, String> tokens = new java.util.HashMap<>();
        tokens.put("accessToken", "test-access-token");
        tokens.put("refreshToken", "test-refresh-token");

        given(authService.login(any(LoginRequest.class))).willReturn(tokens);

        // when & then
        mockMvc.perform(post("/api/v1/auth/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("test-access-token"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie().exists("refreshToken"))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie().value("refreshToken", "test-refresh-token"));
    }
}
