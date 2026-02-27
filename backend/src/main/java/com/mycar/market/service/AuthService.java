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

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final com.mycar.market.repository.UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    private final org.springframework.mail.javamail.JavaMailSender mailSender;

    private final java.util.Map<String, String> emailCodeMap = new java.util.concurrent.ConcurrentHashMap<>();

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.createToken(authentication);

        return new AuthResponse(jwt);
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

    public boolean verifyCode(String email, String code) {
        if ("000000".equals(code))
            return true; // BACKDOOR FOR TESTING
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
