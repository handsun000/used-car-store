package com.mycar.market.service;

import com.mycar.market.domain.Post;
import com.mycar.market.domain.User;
import com.mycar.market.dto.PostDto.PostDetailResponse;
import com.mycar.market.dto.PostDto.PostRequest;
import com.mycar.market.dto.PostDto.PostResponse;
import com.mycar.market.repository.PostRepository;
import com.mycar.market.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public List<PostResponse> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(PostResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public PostDetailResponse getPost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. id=" + id));
        post.addViewCount();
        return new PostDetailResponse(post);
    }

    @Transactional
    public Long createPost(PostRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 없습니다. email=" + email));

        Post post = Post.builder()
                .title(request.title())
                .content(request.content())
                .author(user)
                .build();

        return postRepository.save(post).getId();
    }
}
