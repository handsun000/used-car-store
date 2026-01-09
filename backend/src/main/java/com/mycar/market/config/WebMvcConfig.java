package com.mycar.market.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Map /images/** URL path to d:/devAI/uploads/ directory
        // Note: The 'file:///' prefix is required for local file system paths
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:///d:/devAI/uploads/");
    }
}
