# 이 쿠키값은 아까 크롬 개발자 도구에서 복사한 __Secure-1PSID 값이야
$env:NOTEBOOKLM_COOKIE = "g.a0007whgD6-mWwwOPImFzSKe0dG9VwG01aW4O_w9mTB15KBrmQ0BTBx5RBCS0YOhaBK_InyynAACgYKAeoSARMSFQHGX2MizHNDVCqdVCaTIjChaYkO9xoVAUF8yKoL5CI_PS481cmgGYDJd3hP0076"

# uv가 설치된 경로를 통해 MCP 서버 실행 (에러는 로그파일로 분리)
# 만약 uv 설치 경로를 모르면 터미널에 'where.exe uv' 쳐서 나온 경로로 수정해줘
& "C:\Users\sonjinyeong\.local\bin\uv.exe" x notebooklm-mcp-cli start 2> mcp_error.log