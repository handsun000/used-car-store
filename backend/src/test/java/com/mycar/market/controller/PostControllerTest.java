package com.mycar.market.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycar.market.config.SecurityConfig;
import com.mycar.market.dto.PostDto.PostRequest;
import com.mycar.market.security.JwtAuthenticationFilter;
import com.mycar.market.security.JwtTokenProvider;
import com.mycar.market.service.PostService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.io.IOException;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doAnswer;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PostController.class)
@Import(SecurityConfig.class)
@MockBean(JpaMetamodelMappingContext.class)
class PostControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    PostService postService;

    @MockBean
    JwtTokenProvider jwtTokenProvider;

    @MockBean
    JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    ObjectMapper objectMapper;

    @BeforeEach
    void setup() throws ServletException, IOException {
        doAnswer(invocation -> {
            ServletRequest request = invocation.getArgument(0);
            ServletResponse response = invocation.getArgument(1);
            FilterChain chain = invocation.getArgument(2);
            chain.doFilter(request, response);
            return null;
        }).when(jwtAuthenticationFilter).doFilter(any(), any(), any());
    }

    @Test
    @DisplayName("게시글 작성 - USER 권한 성공 (201)")
    @WithMockUser(username = "user@example.com", authorities = { "ROLE_USER" })
    void createPost_User_Success() throws Exception {
        // given
        PostRequest request = new PostRequest("Title", "Content");
        given(postService.createPost(any(PostRequest.class), eq("user@example.com"))).willReturn(1L);

        // when & then
        mockMvc.perform(post("/api/v1/posts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("게시글 작성 - 비로그인 실패 (403 or 401)")
    void createPost_NoAuth_Fail() throws Exception {
        // given
        PostRequest request = new PostRequest("Title", "Content");

        // when & then
        mockMvc.perform(post("/api/v1/posts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                // Expect 403 Forbidden or 401 Unauthorized depending on config
                // Since entry point might not be mocked, it usually defaults to 403 for missing
                // auth in tests
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("게시글 목록 - 비로그인 조회 성공 (200)")
    void getAllPosts_Public_Success() throws Exception {
        // given
        given(postService.getAllPosts()).willReturn(Collections.emptyList());

        // when & then
        mockMvc.perform(get("/api/v1/posts"))
                .andExpect(status().isOk());
    }
}
