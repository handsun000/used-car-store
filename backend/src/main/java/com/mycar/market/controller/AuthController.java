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

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        System.out.println(request.username());
        System.out.println(request.password());
        return ResponseEntity.ok(authService.login(request));
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
