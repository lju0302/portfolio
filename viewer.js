const status = document.querySelector('#status');
const controls = [...document.querySelectorAll('button')];
function showError() {
  status.hidden = false;
  status.replaceChildren('미리보기를 불러오지 못했습니다. ');
  const link = document.createElement('a');
  link.href = 'portfolio.pdf';
  link.textContent = 'PDF 원본 열기';
  status.append(link);
  document.querySelector('#pageCount').textContent = '원본으로 확인해주세요';
  controls.forEach(button => { button.disabled = true; });
}
try {
  const pdfjs = await import('./vendor/pdfjs/build/pdf.mjs');
  const { EventBus, PDFLinkService, PDFViewer } = await import('./vendor/pdfjs/web/pdf_viewer.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('./vendor/pdfjs/build/pdf.worker.mjs', import.meta.url).href;
  const eventBus = new EventBus();
  const linkService = new PDFLinkService({ eventBus, externalLinkTarget: 2 });
  const container = document.querySelector('#viewerContainer');
  const viewer = new PDFViewer({ container, eventBus, linkService });
  linkService.setViewer(viewer);
  const zoomOut = document.querySelector('#zoomOut');
  const zoomIn = document.querySelector('#zoomIn');
  const fit = document.querySelector('#fit');
  let fitted = true;
  const MIN_SCALE = .25, MAX_SCALE = 3;
  function updateScale() {
    document.querySelector('#scale').textContent = `${Math.round(viewer.currentScale * 100)}%`;
    zoomOut.disabled = viewer.currentScale <= MIN_SCALE;
    zoomIn.disabled = viewer.currentScale >= MAX_SCALE;
  }
  eventBus.on('pagesinit', () => {
    viewer.currentScaleValue = 'page-width';
    fit.disabled = false;
    updateScale();
  });
  eventBus.on('scalechanging', updateScale);
  eventBus.on('pagechanging', ({ pageNumber }) => {
    document.querySelector('#pageCount').textContent = `${pageNumber} / ${viewer.pagesCount} 페이지`;
  });
  eventBus.on('pagerendered', ({ error }) => {
    if (error) showError();
    else status.hidden = true;
  });
  function zoom(factor) {
    fitted = false;
    viewer.currentScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, viewer.currentScale * factor));
  }
  zoomOut.addEventListener('click', () => zoom(1 / 1.2));
  zoomIn.addEventListener('click', () => zoom(1.2));
  fit.addEventListener('click', () => {
    fitted = true;
    viewer.currentScaleValue = 'page-width';
  });
  new ResizeObserver(() => {
    if (fitted && viewer.pagesCount) viewer.currentScaleValue = 'page-width';
  }).observe(container);
  const pdfDocument = await pdfjs.getDocument({
    url: 'portfolio.pdf', cMapUrl: 'vendor/pdfjs/cmaps/', cMapPacked: true,
    standardFontDataUrl: 'vendor/pdfjs/standard_fonts/', wasmUrl: 'vendor/pdfjs/wasm/',
    isEvalSupported: false,
  }).promise;
  linkService.setDocument(pdfDocument);
  viewer.setDocument(pdfDocument);
  document.querySelector('#pageCount').textContent = `1 / ${pdfDocument.numPages} 페이지`;
} catch (error) {
  console.error('PDF preview failed:', error);
  showError();
}
