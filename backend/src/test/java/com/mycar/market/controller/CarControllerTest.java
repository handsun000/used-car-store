package com.mycar.market.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycar.market.config.SecurityConfig;
import com.mycar.market.dto.CarRequest;
import com.mycar.market.dto.CarResponse;
import com.mycar.market.dto.CarSearchCondition;
import com.mycar.market.security.JwtAuthenticationFilter;
import com.mycar.market.security.JwtTokenProvider;
import com.mycar.market.service.CarService;
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
import org.springframework.http.HttpMethod;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doAnswer;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CarController.class)
@Import(SecurityConfig.class)
@MockBean(JpaMetamodelMappingContext.class)
class CarControllerTest {

        @Autowired
        MockMvc mockMvc;

        @MockBean
        CarService carService;

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
        @DisplayName("차량 등록 - ADMIN 권한 성공 (201)")
        @WithMockUser(username = "admin", authorities = { "ROLE_ADMIN" })
        void registerCar_Admin_Success() throws Exception {
                // given
                CarRequest request = new CarRequest(
                                "BMW", "X5", 2023, 10000, 80000000L,
                                com.mycar.market.domain.FuelType.GASOLINE,
                                com.mycar.market.domain.Transmission.AUTOMATIC,
                                false, "Desc", null);
                String requestJson = objectMapper.writeValueAsString(request);
                MockMultipartFile carPart = new MockMultipartFile("carRequest", "", "application/json",
                                requestJson.getBytes());
                MockMultipartFile imagePart = new MockMultipartFile("images", "img.jpg", "image/jpeg",
                                "data".getBytes());

                given(carService.register(any(), any())).willReturn(1L);

                // when & then
                mockMvc.perform(multipart(HttpMethod.POST, "/api/v1/cars")
                                .file(carPart)
                                .file(imagePart)
                                .with(csrf()))
                                .andExpect(status().isCreated());
        }

        @Test
        @DisplayName("차량 등록 - USER 권한 실패 (403)")
        @WithMockUser(username = "user", authorities = { "ROLE_USER" })
        void registerCar_User_Fail() throws Exception {
                // given
                CarRequest request = new CarRequest(
                                "BMW", "X5", 2023, 10000, 80000000L,
                                com.mycar.market.domain.FuelType.GASOLINE,
                                com.mycar.market.domain.Transmission.AUTOMATIC,
                                false, "Desc", null);
                String requestJson = objectMapper.writeValueAsString(request);
                MockMultipartFile carPart = new MockMultipartFile("carRequest", "", "application/json",
                                requestJson.getBytes());

                // when & then
                mockMvc.perform(multipart(HttpMethod.POST, "/api/v1/cars")
                                .file(carPart)
                                .with(csrf()))
                                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("차량 검색 - 정상 조회 (200)")
        @WithMockUser
        void searchCars_Success() throws Exception {
                // given
                CarResponse response = new CarResponse(
                                1L, "BMW", "X5", 2023, 10000, 80000000L, null, null, false, null, null,
                                Collections.emptyList(), null, null);
                given(carService.searchCars(any(CarSearchCondition.class))).willReturn(List.of(response));

                // when & then
                mockMvc.perform(get("/api/v1/cars/search")
                                .param("brand", "BMW")
                                .param("minPrice", "1000"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$[0].brand").value("BMW"));
        }

        @Test
        @DisplayName("차량 수정 - ADMIN 성공 (200)")
        @WithMockUser(username = "admin", authorities = { "ROLE_ADMIN" })
        void updateCar_Admin_Success() throws Exception {
                // given
                CarRequest request = new CarRequest(
                                "BMW", "X5 Updated", 2023, 10000, 80000000L,
                                com.mycar.market.domain.FuelType.GASOLINE,
                                com.mycar.market.domain.Transmission.AUTOMATIC,
                                false, "Desc", null);
                String requestJson = objectMapper.writeValueAsString(request);
                MockMultipartFile carPart = new MockMultipartFile("carRequest", "", "application/json",
                                requestJson.getBytes());

                // when & then
                mockMvc.perform(multipart(HttpMethod.PUT, "/api/v1/cars/1")
                                .file(carPart)
                                .with(csrf()))
                                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("차량 수정 - USER 실패 (403)")
        @WithMockUser(username = "user", authorities = { "ROLE_USER" })
        void updateCar_User_Fail() throws Exception {
                // given
                CarRequest request = new CarRequest(
                                "BMW", "X5 Updated", 2023, 10000, 80000000L,
                                com.mycar.market.domain.FuelType.GASOLINE,
                                com.mycar.market.domain.Transmission.AUTOMATIC,
                                false, "Desc", null);
                String requestJson = objectMapper.writeValueAsString(request);
                MockMultipartFile carPart = new MockMultipartFile("carRequest", "", "application/json",
                                requestJson.getBytes());

                // when & then
                mockMvc.perform(multipart(HttpMethod.PUT, "/api/v1/cars/1")
                                .file(carPart)
                                .with(csrf()))
                                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("차량 상태 변경 - ADMIN 성공 (200)")
        @WithMockUser(username = "admin", authorities = { "ROLE_ADMIN" })
        void updateCarStatus_Admin_Success() throws Exception {
                // when & then
                mockMvc.perform(
                                org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                                                .patch("/api/v1/cars/1/status")
                                                .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                                                .content("\"SOLD\"")
                                                .with(csrf()))
                                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("차량 삭제 - ADMIN 성공 (204)")
        @WithMockUser(username = "admin", authorities = { "ROLE_ADMIN" })
        void deleteCar_Admin_Success() throws Exception {
                // when & then
                mockMvc.perform(
                                org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                                                .delete("/api/v1/cars/1")
                                                .with(csrf()))
                                .andExpect(status().isNoContent());
        }
}
