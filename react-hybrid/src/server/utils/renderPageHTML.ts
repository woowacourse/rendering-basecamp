import { generateHTML } from './generateHTML';
import { buildOgTags } from './seoMeta';

interface RenderPageHTMLOptions {
  renderedApp: string;
  initialData: object;
  pageTitle: string;
  ogTags: {
    url: string;
    title: string;
    description: string;
    image: string;
    type?: string;
  };
}

/**
 * HTML 템플릿에 SSR 결과, 초기 데이터, SEO 메타 태그를 삽입하여 최종 HTML을 생성
 */
export function renderPageHTML(options: RenderPageHTMLOptions): string {
  const { renderedApp, initialData, pageTitle, ogTags } = options;

  const template = generateHTML();
  const ogTagsHTML = buildOgTags(ogTags);

  const htmlWithInitialData = template.replace(
    '<!--{INIT_DATA_AREA}-->',
    /*html*/ `
      <script>
        window.__INITIAL_DATA__ = ${serializeJSON(initialData)}
      </script>
    `
  );

  const htmlWithOg = htmlWithInitialData.replace('<!--{OG_TAGS}-->', ogTagsHTML);

  const htmlWithTitle = htmlWithOg.replace('<!--{TITLE}-->', pageTitle);

  const finalHTML = htmlWithTitle.replace('<!--{BODY_AREA}-->', renderedApp);

  return finalHTML;
}

/**
 * XSS 공격을 방지하기 위해 JSON을 안전하게 직렬화
 * </script> 태그가 JSON 문자열에 포함되어도 스크립트가 중단되지 않도록 처리
 */
function serializeJSON(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/\//g, '\\u002f');
}
