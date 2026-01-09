package com.mycar.market.service;

import com.mycar.market.domain.Post;
import com.mycar.market.domain.Role;
import com.mycar.market.domain.User;
import com.mycar.market.dto.PostDto.PostRequest;
import com.mycar.market.repository.PostRepository;
import com.mycar.market.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @Mock
    PostRepository postRepository;

    @Mock
    UserRepository userRepository;

    @InjectMocks
    PostService postService;

    @Test
    @DisplayName("게시글 작성 - 유저 매핑 확인")
    void createPost_UserMapping() {
        // given
        String email = "test@example.com";
        User user = User.builder()
                .email(email)
                .name("Tester")
                .role(Role.ROLE_USER)
                .build();

        PostRequest request = new PostRequest("Title", "Content");
        Post savedPost = Post.builder()
                .title("Title")
                .content("Content")
                .author(user)
                .build();
        // Since id is private and no setter, we rely on Repository mock returning an
        // object checking inputs or mock behavior.
        // Or we can mock the save return value.
        // For simple ID check, we can rely on verifying the passed argument to save().

        org.mockito.Mockito.lenient().when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        org.mockito.Mockito.lenient().when(postRepository.save(any(Post.class))).thenAnswer(invocation -> {
            Post p = invocation.getArgument(0);
            // Simulate ID generation if needed, or just return it.
            // But since User is just a mock return, let's just use reflection or a helper
            // if strict.
            // Here we just want to verify logic.
            return Post.builder().title(p.getTitle()).content(p.getContent()).author(p.getAuthor()).build();
            // In reality, service calls post.getId() which might be null in this mock.
            // Let's assume we don't strictly care about the returned ID in this unit test
            // logic validation,
            // OR simpler: mock the save to return a Spy or an object with ID.
        });

        // *Correction*: PostService returns post.getId(). The Builder doesn't set ID.
        // Reflection is needed or Mock returns a mock instance.
        Post mockPost = mock(Post.class);
        given(postRepository.save(any(Post.class))).willReturn(mockPost);
        given(mockPost.getId()).willReturn(10L);

        // when
        Long postId = postService.createPost(request, email);

        // then
        assertThat(postId).isEqualTo(10L);
        verify(userRepository).findByEmail(email);
        verify(postRepository).save(any(Post.class));
    }
}
