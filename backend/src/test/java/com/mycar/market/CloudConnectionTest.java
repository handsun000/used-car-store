package com.mycar.market;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("prod") // Force prod profile to test external connections
@org.springframework.test.context.TestPropertySource(properties = {
        "jwt.secret=testSecretKeyForIntegrationTesting1234567890",
        "jwt.expiration=3600000",
        "file.upload-dir=build/uploads"
})
public class CloudConnectionTest {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private Cloudinary cloudinary;

    @Test
    @DisplayName("MySQL Connect Test: Should connect to Aiven DB and run SELECT 1")
    void testDatabaseConnection() throws Exception {
        System.out.println(">>> Testing MySQL Connection...");
        try (Connection connection = dataSource.getConnection();
                Statement statement = connection.createStatement()) {

            ResultSet sections = statement.executeQuery("SELECT 1");
            assertThat(sections.next()).isTrue();
            int result = sections.getInt(1);
            assertThat(result).isEqualTo(1);

            System.out.println(">>> MySQL Connection Successful! Database is reachable.");
        } catch (Exception e) {
            System.err.println(">>> MySQL Connection Failed!");
            e.printStackTrace();
            throw e;
        }
    }

    @Test
    @DisplayName("Cloudinary Connect Test: Should upload a tiny image")
    void testCloudinaryConnection() throws Exception {
        System.out.println(">>> Testing Cloudinary Connection...");

        // 1x1 Transparent GIF pixel
        byte[] imageBytes = java.util.Base64.getDecoder()
                .decode("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");

        try {
            Map uploadResult = cloudinary.uploader().upload(imageBytes, ObjectUtils.asMap(
                    "public_id", "test_connection_pixel",
                    "resource_type", "image",
                    "overwrite", true));

            String url = (String) uploadResult.get("secure_url");
            System.out.println(">>> Cloudinary Upload Successful! URL: " + url);
            assertThat(url).isNotNull();
            assertThat(url).startsWith("https://");

        } catch (Exception e) {
            System.err.println(">>> Cloudinary Connection Failed!");
            e.printStackTrace();
            throw e;
        }
    }
}
