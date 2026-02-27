package com.mycar.market.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ReadListener;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.HtmlUtils;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

@Component
public class XssSanitizationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        XssRequestWrapper wrappedRequest = new XssRequestWrapper(request);
        filterChain.doFilter(wrappedRequest, response);
    }

    private static class XssRequestWrapper extends HttpServletRequestWrapper {

        private byte[] body;

        public XssRequestWrapper(HttpServletRequest request) throws IOException {
            super(request);

            // Read the original body and sanitize it if it's JSON
            if (request.getContentType() != null && request.getContentType().contains("application/json")) {
                StringBuilder stringBuilder = new StringBuilder();
                BufferedReader bufferedReader = null;
                try {
                    ServletInputStream inputStream = request.getInputStream();
                    if (inputStream != null) {
                        bufferedReader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8));
                        char[] charBuffer = new char[128];
                        int bytesRead = -1;
                        while ((bytesRead = bufferedReader.read(charBuffer)) > 0) {
                            stringBuilder.append(charBuffer, 0, bytesRead);
                        }
                    } else {
                        stringBuilder.append("");
                    }
                } finally {
                    if (bufferedReader != null) {
                        bufferedReader.close();
                    }
                }

                String rawBody = stringBuilder.toString();
                String sanitizedBody = sanitizeHtml(rawBody); // Simple XSS escape
                body = sanitizedBody.getBytes(StandardCharsets.UTF_8);
            }
        }

        @Override
        public ServletInputStream getInputStream() throws IOException {
            if (body == null) {
                return super.getInputStream();
            }
            final ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(body);
            return new ServletInputStream() {
                @Override
                public boolean isFinished() {
                    return byteArrayInputStream.available() == 0;
                }

                @Override
                public boolean isReady() {
                    return true;
                }

                @Override
                public void setReadListener(ReadListener readListener) {
                }

                @Override
                public int read() throws IOException {
                    return byteArrayInputStream.read();
                }
            };
        }

        @Override
        public BufferedReader getReader() throws IOException {
            if (body == null) {
                return super.getReader();
            }
            return new BufferedReader(new InputStreamReader(this.getInputStream(), StandardCharsets.UTF_8));
        }

        @Override
        public String[] getParameterValues(String parameter) {
            String[] values = super.getParameterValues(parameter);
            if (values == null) {
                return null;
            }
            int count = values.length;
            String[] encodedValues = new String[count];
            for (int i = 0; i < count; i++) {
                encodedValues[i] = sanitizeHtml(values[i]);
            }
            return encodedValues;
        }

        @Override
        public String getParameter(String parameter) {
            String value = super.getParameter(parameter);
            return value == null ? null : sanitizeHtml(value);
        }

        @Override
        public String getHeader(String name) {
            String value = super.getHeader(name);
            return value == null ? null : sanitizeHtml(value);
        }

        private String sanitizeHtml(String value) {
            if (value == null) {
                return null;
            }
            // Basic sanitization
            // E.g. replacing <script> with &lt;script&gt;
            return value.replaceAll("<", "&lt;").replaceAll(">", "&gt;")
                    .replaceAll("\\(", "&#40;").replaceAll("\\)", "&#41;")
                    .replaceAll("'", "&#39;")
                    .replaceAll("eval\\((.*)\\)", "");
        }
    }
}
