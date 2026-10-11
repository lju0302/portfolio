# 포트폴리오 미리보기

PDF.js 6.4.299의 공식 PDFViewer로 `portfolio.pdf`를 표시합니다.
빌드와 API 키가 필요 없으며, 라이브러리 파일은 `vendor/pdfjs/`에 포함했습니다.
라이선스는 `vendor/pdfjs/LICENSE`에 있습니다.

## 실행

이 폴더에서 다음 명령을 실행한 뒤 http://127.0.0.1:8080 을 엽니다.

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

ES 모듈과 PDF worker를 사용하므로 HTML 더블클릭(file://) 대신 HTTP로 실행합니다.
정적 호스팅할 때 index.html, viewer.js, portfolio.pdf, vendor 폴더를 함께 올립니다.

## 확인 방법

- 문서 로딩 후 15페이지와 텍스트가 나타나는지 확인합니다.
- 확대/축소 후 너비 맞춤을 눌러 원래 너비로 돌아오는지 확인합니다.
- 390px 너비에서 화면 밖으로 가로 넘침이 없는지 확인합니다.
- PDF 다운로드와 원본 열기를 확인합니다.
- portfolio.pdf 요청을 브라우저 개발자 도구에서 차단하고 새로고침하면 실패 안내와 원본 링크가 나타나야 합니다.

텍스트 레이어와 링크 주석 레이어는 공식 PDFViewer가 처리합니다.
가로형 원본 PDF는 모바일 너비 맞춤에서 글씨가 작으므로 확대 또는 원본 열기를 사용합니다.

## 이번 검증

Chrome에서 렌더링, 93%→111% 확대 및 너비 맞춤 복원, 다운로드를 확인했습니다.
390×844 화면에서 body 너비 390px, 문서 영역 clientWidth와 scrollWidth 모두 375px였습니다.
텍스트 레이어 생성도 확인했습니다. 문서 링크 클릭과 로딩 실패 경로는 수동 확인이 남아 있습니다.

## GitHub Pages 배포

배포 주소: https://lju0302.github.io/portfolio/

`main` 브랜치에 push하면 `.github/workflows/pages.yml`이 문법을 확인하고
HTML, JavaScript, PDF, vendor 파일만 묶어 GitHub Pages에 배포합니다.
Actions 탭에서 수동 실행도 가능합니다. README와 저장소 설정 파일은 사이트에 포함하지 않습니다.
