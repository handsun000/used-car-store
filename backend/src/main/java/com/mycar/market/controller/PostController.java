package com.mycar.market.controller;

import com.mycar.market.dto.PostDto.PostDetailResponse;
import com.mycar.market.dto.PostDto.PostRequest;
import com.mycar.market.dto.PostDto.PostResponse;
import com.mycar.market.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDetailResponse> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPost(id));
    }

    @PostMapping
    public ResponseEntity<Void> createPost(@RequestBody @Valid PostRequest request, Authentication authentication) {
        String email = authentication.getName(); // JwtTokenProvider sets username(email) as Principal/Name
        Long id = postService.createPost(request, email);
        return ResponseEntity.created(URI.create("/api/v1/posts/" + id)).build();
    }
}
