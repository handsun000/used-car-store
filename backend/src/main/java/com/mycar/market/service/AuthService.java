package com.mycar.market.service;

import com.mycar.market.dto.AuthResponse;
import com.mycar.market.dto.LoginRequest;
import com.mycar.market.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mycar.market.domain.RefreshToken;
import com.mycar.market.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.List;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final com.mycar.market.repository.UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    private final org.springframework.mail.javamail.JavaMailSender mailSender;

    @Value("${app.auth.admin-users}")
    private List<String> adminUsers;

    @Value("${app.auth.test-code:}")
    private String testCode;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpirationMs;

    private final java.util.Map<String, String> emailCodeMap = new java.util.concurrent.ConcurrentHashMap<>();

    @Transactional
    public Map<String, String> login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String accessToken = tokenProvider.createAccessToken(authentication);
        String refreshTokenStr = tokenProvider.createRefreshToken(authentication);

        RefreshToken refreshToken = refreshTokenRepository.findByUsername(request.username())
                .orElse(RefreshToken.builder()
                        .username(request.username())
                        .build());
        
        refreshToken.updateToken(refreshTokenStr, LocalDateTime.now().plusNanos(refreshExpirationMs * 1_000_000));
        refreshTokenRepository.save(refreshToken);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshTokenStr);

        return tokens;
    }

    @Transactional
    public Map<String, String> refresh(String refreshTokenStr) {
        if (!tokenProvider.validateToken(refreshTokenStr)) {
            throw new RuntimeException("Invalid refresh token");
        }

        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenStr)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        if (refreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new RuntimeException("Refresh token was expired. Please make a new signin request");
        }

        String username = refreshToken.getUsername();
        com.mycar.market.domain.User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // 권한 정보 로드
        org.springframework.security.core.userdetails.UserDetails userDetails = 
                org.springframework.security.core.userdetails.User.builder()
                        .username(user.getUsername())
                        .password(user.getPassword())
                        .authorities(user.getRole().name())
                        .build();

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());

        String newAccessToken = tokenProvider.createAccessToken(authentication);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", newAccessToken);
        return tokens;
    }

    @Transactional
    public void logout(String username) {
        refreshTokenRepository.deleteByUsername(username);
    }

    public void sendVerificationCode(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }
        String code = String.format("%06d", new java.util.Random().nextInt(999999));
        emailCodeMap.put(email, code);

        try {
            jakarta.mail.internet.MimeMessage message = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(
                    message, false, java.nio.charset.StandardCharsets.UTF_8.name());

            helper.setTo(email);
            helper.setSubject("[GenCar] 회원가입을 위한 인증번호가 도착했습니다 🚗");

            org.springframework.core.io.ClassPathResource resource = new org.springframework.core.io.ClassPathResource(
                    "templates/email-auth.html");
            String htmlTemplate = resource.getContentAsString(java.nio.charset.StandardCharsets.UTF_8);
            String htmlContent = htmlTemplate.replace("${code}", code);

            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("인증 이메일 발송에 실패했습니다.", e);
        }
    }

    public boolean checkUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean verifyCode(String email, String code) {
        if (testCode != null && !testCode.isEmpty() && testCode.equals(code))
            return true;
        String savedCode = emailCodeMap.get(email);
        return savedCode != null && savedCode.equals(code);
    }

    @Transactional
    public void signup(com.mycar.market.dto.SignupRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email already exists");
        }
        if (!verifyCode(request.email(), request.code())) {
            throw new RuntimeException("Invalid verification code");
        }

        boolean isAdminBypass = adminUsers != null && adminUsers.contains(request.username());
        if (!isAdminBypass) {
            String passwordRegex = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$";
            if (!request.password().matches(passwordRegex)) {
                throw new RuntimeException(
                        "Password must be at least 8 characters long and contain at least one letter, one number, and one special character.");
            }
        }

        com.mycar.market.domain.User user = com.mycar.market.domain.User.builder()
                .username(request.username())
                .password(passwordEncoder.encode(request.password()))
                .email(request.email())
                .name(request.name())
                .role(com.mycar.market.domain.Role.ROLE_USER) // Assuming ROLE_USER exists
                .build();
        userRepository.save(user);

        emailCodeMap.remove(request.email());
    }
}
