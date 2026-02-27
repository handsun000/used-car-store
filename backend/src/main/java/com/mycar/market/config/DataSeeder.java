package com.mycar.market.config;

import com.mycar.market.domain.Role;
import com.mycar.market.domain.User;
import com.mycar.market.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        seedAdmin("kak18362", "abab1836ab", "Admin 1");
        seedAdmin("systemadmin", "wlsdud12!@*", "System Admin");
    }

    private void seedAdmin(String username, String password, String name) {
        if (!userRepository.existsByUsername(username)) {
            User admin = User.builder()
                    .username(username)
                    .password(passwordEncoder.encode(password))
                    .email(username + "@admin.com") // Temp email or null
                    .name(name)
                    .role(Role.ROLE_ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println("Seeded admin account: " + username);
        }
    }
}
