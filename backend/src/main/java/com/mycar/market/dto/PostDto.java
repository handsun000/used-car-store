package com.mycar.market.dto;

import com.mycar.market.domain.Post;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

import java.time.LocalDateTime;

public class PostDto {

    public record PostRequest(
            @NotBlank(message = "제목은 필수입니다.") String title,

            @NotBlank(message = "내용은 필수입니다.") String content) {
    }

    @Getter
    public static class PostResponse {
        private final Long id;
        private final String title;
        private final String authorName;
        private final int views;
        private final LocalDateTime createdAt;

        public PostResponse(Post post) {
            this.id = post.getId();
            this.title = post.getTitle();
            this.authorName = post.getAuthor().getName();
            this.views = post.getViews();
            this.createdAt = post.getCreatedAt();
        }
    }

    @Getter
    public static class PostDetailResponse {
        private final Long id;
        private final String title;
        private final String content;
        private final String authorName;
        private final int views;
        private final LocalDateTime createdAt;

        public PostDetailResponse(Post post) {
            this.id = post.getId();
            this.title = post.getTitle();
            this.content = post.getContent();
            this.authorName = post.getAuthor().getName();
            this.views = post.getViews();
            this.createdAt = post.getCreatedAt();
        }
    }
}
