package com.mycar.market.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImageUploadService {

    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) {
        try {
            // Security: Strictly check MIME type to prevent malicious uploads
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new RuntimeException("Invalid file type. Only images are allowed.");
            }

            // Generate a unique filename
            String fileName = UUID.randomUUID().toString();

            // Upload to Cloudinary
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "public_id", "mycar/" + fileName,
                    "resource_type", "auto"));

            // Return the secure URL (https)
            return (String) uploadResult.get("secure_url");

        } catch (IOException e) {
            log.error("Image upload failed", e);
            throw new RuntimeException("이미지 업로드에 실패했습니다.", e);
        }
    }
}
