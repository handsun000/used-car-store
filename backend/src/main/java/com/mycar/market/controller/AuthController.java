package com.mycar.market.controller;

import com.mycar.market.dto.AuthResponse;
import com.mycar.market.dto.LoginRequest;
import com.mycar.market.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.http.ResponseCookie;
import org.springframework.http.HttpHeaders;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        Map<String, String> tokens = authService.login(request);
        
        ResponseCookie cookie = ResponseCookie.from("refreshToken", tokens.get("refreshToken"))
                .httpOnly(true)
                .secure(true) // require HTTPS in production
                .path("/")
                .maxAge(7 * 24 * 60 * 60) // 7 days matching refresh expiration
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new AuthResponse(tokens.get("accessToken")));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@CookieValue(name = "refreshToken", required = false) String refreshToken) {
        if (refreshToken == null || refreshToken.isEmpty()) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }
        
        try {
            Map<String, String> tokens = authService.refresh(refreshToken);
            return ResponseEntity.ok(new AuthResponse(tokens.get("accessToken")));
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody LoginRequest request) {
        // Here we ideally want to just identify the user from the token or request,
        // but since we need username for logout, we take it from request for simplicity or extract from auth config.
        authService.logout(request.username());
        
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }

    @org.springframework.web.bind.annotation.GetMapping("/check-username")
    public ResponseEntity<Boolean> checkUsername(
            @org.springframework.web.bind.annotation.RequestParam("username") String username) {
        boolean exists = authService.checkUsername(username);
        return ResponseEntity.ok(exists);
    }

    @PostMapping("/email/send")
    public ResponseEntity<String> sendVerificationEmail(
            @RequestBody com.mycar.market.dto.EmailVerificationRequest request) {
        authService.sendVerificationCode(request.email());
        return ResponseEntity.ok("Verification email sent");
    }

    @PostMapping("/email/verify")
    public ResponseEntity<Boolean> verifyEmailCode(@RequestBody com.mycar.market.dto.EmailVerificationRequest request) {
        boolean isValid = authService.verifyCode(request.email(), request.code());
        return ResponseEntity.ok(isValid);
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody com.mycar.market.dto.SignupRequest request) {
        authService.signup(request);
        return ResponseEntity.ok("User registered successfully");
    }
}
