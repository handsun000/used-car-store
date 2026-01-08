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
        if (!userRepository.existsByEmail("admin@mycar.com")) {
            User admin = User.builder()
                    .email("admin@mycar.com")
                    .password(passwordEncoder.encode("admin1234"))
                    .name("Administrator")
                    .role(Role.ROLE_ADMIN)
                    .build();
            userRepository.save(admin);
        }
    }
}
