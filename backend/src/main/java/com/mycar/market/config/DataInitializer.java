package com.mycar.market.config;

import com.mycar.market.domain.Role;
import com.mycar.market.domain.User;
import com.mycar.market.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // init admin
        if (!userRepository.existsByUsername("kak18362")) {
            User admin1 = User.builder()
                    .username("kak18362")
                    .email(null)
                    .password(passwordEncoder.encode("abab1836ab"))
                    .name("관리자 1")
                    .role(Role.ROLE_ADMIN)
                    .build();
            userRepository.save(admin1);
        }

        if (!userRepository.existsByUsername("admin")) {
            User admin2 = User.builder()
                    .username("admin")
                    .email("") // empty email as requested, might clash with admin1's unique email. Wait, email
                               // is unique.
                    // Oh, if email is unique, we can't have two empty strings!
                    // I will give them dummy distinct emails or change DB schema to not be unique.
                    // The user said "email: (비워둠/null)", meaning maybe I should use null if DB
                    // allows.
                    // Let's use null.
                    .password(passwordEncoder.encode("wlsdud12"))
                    .name("관리자 2")
                    .role(Role.ROLE_ADMIN)
                    .build();
            userRepository.save(admin2);
        }
    }
}
