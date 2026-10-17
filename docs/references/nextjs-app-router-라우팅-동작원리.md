# Next.js App Router 라우팅 동작원리

> 이 문서를 참조하는 ADR: 아직 없음

## 배경

영화 상세 페이지로 이동하는 기능을 구현하면서 두 방식 중 어느 쪽이 맞는지 고민했다.

- 서버가 URL을 보고 라우트마다 다른 React 트리를 `renderToString` 한다.
- 서버는 라우팅에 관여하지 않고, 라우팅은 전적으로 React(클라이언트)에서 처리한다.

이 판단에 참고하려고 Next.js App Router가 라우팅을 어떻게 처리하는지 정리한다.

## 요약

- 페이지를 이동할 때 서버에 다시 요청하는 건 맞다. 하지만 **HTML을 다시 SSR하는 건 아니다.**
- 서버가 돌려주는 건 **RSC Payload**다. 직렬화된 React 트리이고, 그중 **바뀐 세그먼트만** 담긴다.
- 서버가 HTML을 만드는 건 처음 들어오거나 새로고침할 때(hard navigation)뿐이다.
- 그 뒤의 이동(soft navigation)은 클라이언트 라우터가 맡는다. 정적 라우트가 이미 prefetch되어 있거나 캐시에 있으면 서버에 요청조차 하지 않는다.

---

## 1. 서버 응답의 두 가지 형태

| 형태 | 언제 | 내용 |
|---|---|---|
| **HTML** (+ 인라인 RSC Payload + JS) | 처음 들어올 때, 새로고침, `<a>` 태그 이동 | 완성된 HTML. 이후 hydration |
| **RSC Payload** (`text/x-component`) | `<Link>`, `router.push`, prefetch, `router.refresh()` | 서버 컴포넌트를 렌더한 결과 트리와 클라이언트 컴포넌트 참조(chunk id + props) |

RSC Payload와 HTML이 실제로 어떻게 생겼는지 작은 앱을 빌드해서 확인했다.

### 실험: 실제 빌드 결과

- 환경: Next.js 15.4.11, React 19.1.0, `next build` (production, webpack)
- 빌드 결과 페이지가 `○ (Static)`, 즉 빌드 때 미리 만들어졌다(SSG).

입력 코드:

```jsx
// app/page.jsx — 서버 컴포넌트
import RatingButton from './RatingButton';

export default function Page() {
  return (
    <div>
      <h1>인셉션</h1>
      <RatingButton movieId={123} />
    </div>
  );
}
```

```jsx
// app/RatingButton.jsx — 클라이언트 컴포넌트
'use client';
import { useState } from 'react';

export default function RatingButton({ movieId }) {
  const [r, setR] = useState(0);
  return <button onClick={() => setR(r + 1)}>평점 {r} (movie {movieId})</button>;
}
```

빌드 결과로 생긴 파일:

- `.next/server/app/index.rsc`: 서버 컴포넌트를 실행해서 만든 RSC Payload
- `.next/server/app/index.html`: 그 payload로 클라이언트 컴포넌트까지 렌더한 HTML
- `.next/static/chunks/app/page-9ee65644cd391cf9.js`: 브라우저로 가는 클라이언트 컴포넌트 코드

재현 방법:

```bash
# app/layout.jsx, app/page.jsx, app/RatingButton.jsx 를 만든 뒤
next build
cat .next/server/app/index.rsc
cat .next/server/app/index.html
next start -p 3999 &
curl -H 'RSC: 1' localhost:3999/   # soft navigation 요청 흉내
```

#### RSC Payload (`index.rsc`)

핵심 줄만 뽑으면 이렇다.

```
4:I[1653,["974","static/chunks/app/page-9ee65644cd391cf9.js"],"default"]
0:{... ["$","div",null,{"children":[["$","h1",null,{"children":"인셉션"}],["$","$L4",null,{"movieId":123}]]}] ...}
```

브라우저가 해석한 결과는 이렇다.

```jsx
<div>
  <h1>인셉션</h1>
  <RatingButton movieId={123} />
</div>
```

읽는 법:

- 한 줄이 조각(chunk) 하나다. `ID:내용` 형태이고 ID는 16진수다(`a`, `b`, `c`...). 내용 앞에 글자가 붙으면 조각의 종류다(`I` = Import).
- `["$", type, key, props]`: React 엘리먼트 하나. `"$"`는 엘리먼트라는 표시(`$$typeof` 역할).
- `4:I[1653, ["974", "static/chunks/app/page-….js"], "default"]`: 4번 조각은 클라이언트 컴포넌트 참조. "모듈 `1653`을 chunk `974`(이 파일)에서 받아 `default` export를 꺼내 써라". 코드는 없고 위치만 있다. chunk 목록은 `[chunk ID, 파일 경로]` 짝으로 이어진다.
- `"$L4"`: "4번 조각을 이 자리의 타입으로 써라"라는 lazy 참조. 트리(0번)와 클라이언트 컴포넌트 참조(4번)는 이걸로 이어진다.
- `["$","h1",null,{"children":"인셉션"}]`: 서버 컴포넌트의 실행 결과. `Page` 함수 이름은 없다.
- 그 밖의 `2:I`, `3:I`, `5:I` 등은 Next.js 내부 부품(레이아웃 라우터, 메타데이터 경계 등)이고, `1:"$Sreact.fragment"`, `c:"$Sreact.suspense"`는 React 내장 심볼이다. 0번 줄에는 라우터 상태와 기본 404 화면도 들어 있다.
- 줄끼리 ID로 참조하므로 순서대로 올 필요가 없다. 준비된 조각부터 스트리밍할 수 있다. 실제 결과에서도 `I` 줄들이 0번 줄보다 먼저 나왔다.

<details>
<summary>index.rsc 전체</summary>

```
1:"$Sreact.fragment"
2:I[8536,[],""]
3:I[3630,[],""]
4:I[1653,["974","static/chunks/app/page-9ee65644cd391cf9.js"],"default"]
5:I[9752,[],"OutletBoundary"]
7:I[6560,[],"AsyncMetadataOutlet"]
9:I[9752,[],"ViewportBoundary"]
b:I[9752,[],"MetadataBoundary"]
c:"$Sreact.suspense"
e:I[3700,[],""]
0:{"P":null,"b":"TqzQS75GifLJSc4eOfte2","p":"","c":["",""],"i":false,"f":[[["",{"children":["__PAGE__",{}]},"$undefined","$undefined",true],["",["$","$1","c",{"children":[null,["$","html",null,{"children":["$","body",null,{"children":["$","$L2",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L3",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],[]],"forbidden":"$undefined","unauthorized":"$undefined"}]}]}]]}],{"children":["__PAGE__",["$","$1","c",{"children":[["$","div",null,{"children":[["$","h1",null,{"children":"인셉션"}],["$","$L4",null,{"movieId":123}]]}],null,["$","$L5",null,{"children":["$L6",["$","$L7",null,{"promise":"$@8"}]]}]]}],{},null,false]},null,false],["$","$1","h",{"children":[null,[["$","$L9",null,{"children":"$La"}],null],["$","$Lb",null,{"children":["$","div",null,{"hidden":true,"children":["$","$c",null,{"fallback":null,"children":"$Ld"}]}]}]]}],false]],"m":"$undefined","G":["$e",[]],"s":false,"S":true}
a:[["$","meta","0",{"charSet":"utf-8"}],["$","meta","1",{"name":"viewport","content":"width=device-width, initial-scale=1"}]]
6:null
8:{"metadata":[],"error":null,"digest":"$undefined"}
d:"$8:metadata"
```

</details>

#### HTML (`index.html`)

태그마다 줄을 바꾸고 일부를 줄였다.

```html
<head>
  <link rel="preload" as="script" fetchPriority="low" href="/_next/static/chunks/webpack-078f6dfb37dff419.js"/>
  <script src="/_next/static/chunks/a1d5d966-a9d036801954706d.js" async=""></script>
  <script src="/_next/static/chunks/530-feb539628af6dc22.js" async=""></script>
  <script src="/_next/static/chunks/main-app-fff5996b2462c900.js" async=""></script>
  <script src="/_next/static/chunks/app/page-9ee65644cd391cf9.js" async=""></script>  <!-- RatingButton -->
  ...
</head>
<body>
  <div>
    <h1>인셉션</h1>
    <button>평점 <!-- -->0<!-- --> (movie <!-- -->123<!-- -->)</button>   <!-- onclick 없음 -->
  </div>

  <script src="/_next/static/chunks/webpack-078f6dfb37dff419.js" id="_R_" async=""></script>
  <script>(self.__next_f=self.__next_f||[]).push([0])</script>
  <script>self.__next_f.push([1,"1:\"$Sreact.fragment\"\n2:I[8536,[],\"\"]\n...4:I[1653,...]..."])</script>
  <script>self.__next_f.push([1,"0:{...\"인셉션\"...\"$L4\",null,{\"movieId\":123}...}\n"])</script>
  ...
</body>
```

- `<head>`: payload 4번 줄이 가리키는 파일(`page-9ee65644….js`)이 script 태그로 들어 있다.
- `<body>` 위: 이미 완성된 HTML. 버튼에 onclick이 없다. `<!-- -->`는 hydration 때 텍스트 경계를 맞추려고 React가 넣는 표시다.
- `<body>` 아래: `index.rsc`와 같은 내용이 `push` 여러 번에 나뉘어 들어 있다. 이게 인라인 payload다. payload가 스트림이라 조각이 준비될 때마다 `<script>`가 하나씩 붙는다.
- 서버 코드에서도 확인했다. `next/dist/server/app-render/app-render.js`에서 payload 스트림을 `tee()`로 복제해 하나는 SSR(HTML 생성)에, 하나는 `createInlinedDataReadableStream`(인라인용)에 넘긴다.

HTML이 이미 있는데 payload를 또 넣는 이유: HTML만 보고는 React가 트리를 복원할 수 없다. `<button>평점 0</button>`만으로는 이게 `RatingButton`인지, props가 `movieId={123}`이었는지 알 수 없다. hydration하려면 이 정보가 필요하다.

#### 브라우저로 가는 JS chunk (`page-9ee65644cd391cf9.js`)

```js
(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[974],{1653:(e,s,t)=>{"use strict";t.d(s,{default:()=>i});var n=t(8308),u=t(1448);function i(e){let{movieId:s}=e,[t,i]=(0,u.useState)(0);return(0,n.jsxs)("button",{onClick:()=>i(t+1),children:["평점 ",t," (movie ",s,")"]})}},3410:(e,s,t)=>{Promise.resolve().then(t.bind(t,1653))}},e=>{e.O(0,[9,530,358],()=>e(e.s=3410)),_N_E=e.O()}]);
```

- chunk `974` 안의 모듈 `1653`이 `RatingButton` 함수 그대로다(`useState`, `onClick` 포함). payload의 `4:I[1653,["974",...]]`와 번호가 맞는다.
- `.next/static/` 전체에서 `인셉션`을 찾으면 나오지 않는다. 서버 컴포넌트 코드는 브라우저로 가지 않는다.

#### soft navigation 요청

`RSC: 1` 헤더를 붙여 요청하면(`<Link>` 이동 때 브라우저가 보내는 요청) 이렇게 온다.

```
Content-Type: text/x-component
x-nextjs-cache: HIT
x-nextjs-prerender: 1
```

응답 본문은 `index.rsc`와 완전히 같았다. SSG라서 빌드 때 만든 파일을 그대로 돌려준다.

#### 정리

```
page.jsx (서버 컴포넌트) ──① 빌드 때 실행──▶ index.rsc (payload)
                                             ├─ ② SSR: 클라이언트 컴포넌트까지 실행 → index.html 본문
                                             ├─ index.html 맨 아래 self.__next_f.push(...)로 복사 (인라인 payload)
                                             └─ soft navigation 요청에 그대로 응답

RatingButton.jsx (클라이언트) ──번들──▶ page-9ee65644….js
                                             └─ index.html <head>의 script 태그로 다운로드
```

- 서버 컴포넌트는 **이미 렌더된 결과**로 들어온다. 함수 이름과 코드는 브라우저로 가지 않는다.
- 클라이언트 컴포넌트는 "이 JS chunk를 불러와서 이 props로 렌더해라"라는 **참조**로만 들어온다. props는 JSON으로 함께 오므로 직렬화할 수 있어야 한다(함수 X).
- 실제 payload는 개발자 도구에서 볼 수 있다. soft navigation은 Network 탭의 `?_rsc=` 요청, 첫 로드는 HTML 소스의 `self.__next_f.push(...)`.
- 형식은 Next.js 버전마다 다를 수 있다. 위 결과는 15.4.11 기준이다.

### 클라이언트 컴포넌트 chunk는 언제 받아오나

chunk 파일은 `next build` 때 이미 만들어져 서버에 정적 파일로 있다. `I` 줄은 그 주소일 뿐이다. React는 **`I` 줄을 읽는 순간** 다운로드를 시작하고, 이미 받았거나 받는 중인 chunk는 다시 요청하지 않는다.

```js
// next/dist/compiled/react-server-dom-webpack/cjs/react-server-dom-webpack-client.browser.development.js
function resolveModule(response, id, model) {      // I 줄을 읽으면 호출
  ...
  if ((model = preloadModule(clientReference))) {  // 바로 다운로드 시작 (chunkCache에 없는 것만 loadChunk)
```

실험 결과에서 `I` 줄이 트리 줄(0번)보다 먼저 나온 것도 다운로드를 일찍 시작하게 하려는 것으로 보인다(서버 쪽 코드로는 미확인).

**첫 로드**에서는 `I` 줄보다 다운로드가 항상 먼저 시작된다. 위 실험의 HTML을 보면 이유가 보인다. `<head>`에 `page-9ee65644….js`가 script 태그로 들어 있고, 인라인 payload의 `<script>`는 문자열을 배열에 넣어두기만 하고 해석하지 않는다. 해석은 React 런타임이 로드·실행된 뒤에 한다.

```
HTML 읽기          : <head> 읽음 ──── 본문 그림 ──── 인라인 payload를 배열에 넣어둠
                       │
main-app-….js 등   :   ├─ 다운로드 ━━━━━━ 완료 → 실행 → 넣어둔 payload 해석 → I 줄 처리
page-9ee65644….js  :   └─ 다운로드 ━━━━━━━━ 완료                               ↑
                                                                여기서 page-9ee65644….js가 필요해짐
```

1. `<head>`의 `<script async>`를 보는 순간 React 런타임과 `page-9ee65644….js`를 **동시에** 받기 시작한다.
2. `I` 줄을 처리하는 주체는 React 런타임이다. 그러니 `I` 줄 처리는 런타임 다운로드·실행이 끝난 **뒤에야** 시작된다.
3. 그때 `page-9ee65644….js`는 이미 다 받았거나(바로 사용) 받는 중이다(진행 중인 다운로드를 기다림, 새 요청 없음).

**soft navigation**에서는 HTML이 없으니 `<script>` 태그도 없다. 브라우저는 이 chunk가 필요하다는 걸 `I` 줄에서 처음 알게 되고, 그때 다운로드를 시작한다. 도착 전까지는 `$L4` 자리의 렌더링이 멈춘다(suspend). 이전 페이지에서 받은 chunk면 다운로드 없이 바로 쓴다.

| | chunk 다운로드 시작 시점 |
|---|---|
| 첫 로드 | `<head>`의 `<script>` 태그를 읽을 때 (`I` 줄보다 먼저) |
| soft navigation | `I` 줄을 읽을 때 |
| prefetch | 받은 payload도 같은 방식으로 해석되므로 이때 시작될 수 있다 (미확인) |

확인한 것과 안 한 것:

- 실제 빌드로 확인(Next.js 15.4.11): payload·HTML 구조, `<head>`의 script 태그, `I` 줄이 0번 줄보다 먼저 나오는 것, 서버 컴포넌트 코드가 브라우저 chunk에 없는 것, soft navigation 응답이 `.rsc` 파일과 같은 것.
- 코드로 확인: React 클라이언트의 `resolveModule` → `preloadModule`, Next.js `app-render.js`의 `tee()` 복제.
- 확인하지 않음: prefetch 동작, 진행 중인 다운로드에 합류하는 webpack 런타임 동작, SSR(동적) 페이지의 결과, `I` 줄을 먼저 내보내는 서버 쪽 이유.

---

## 2. 처음 들어올 때, 새로고침할 때 (Hard Navigation)

```
브라우저 GET /movies/123
  → 서버: 서버 컴포넌트 실행 + 클라이언트 컴포넌트까지 HTML로 SSR
  → 응답: HTML + RSC Payload(<script>로 인라인) + JS
  → 브라우저: HTML을 바로 그림 → JS 로드 → hydration
```

- 이때만 진짜 "SSR로 HTML을 생성"한다.
- 서버가 URL을 보고 어떤 라우트를 렌더할지 정한다. 그래서 상세 페이지 URL로 바로 들어와도 상세 페이지 HTML이 나온다.
- `loading.js`나 `<Suspense>`가 있으면 HTML을 **스트리밍**으로 나눠서 보낸다.

---

## 3. `<Link>` 클릭, `router.push` (Soft Navigation)

```
GET /movies/456?_rsc=xyz
Headers:
  RSC: 1
  Next-Router-State-Tree: <지금 화면의 세그먼트 트리>
```

- 서버는 `Next-Router-State-Tree` 헤더를 보고 **어떤 세그먼트가 바뀌었는지** 판단한다. 그리고 바뀐 세그먼트만 렌더해서 RSC Payload로 보낸다.
  - 예: `/dashboard/settings` → `/dashboard/analytics`로 이동하면 `dashboard/layout`은 다시 렌더하지 않고 `page`만 렌더한다. 이걸 **Partial Rendering**이라고 한다.
- 클라이언트 라우터는 받은 Payload를 기존 트리에 끼워 넣고, React가 reconcile한다.
  - 그래서 공유 layout에 있는 클라이언트 컴포넌트의 **state가 유지된다.** 입력값이나 스크롤 같은 것들이 그대로 남는다.
- 페이지 전체를 새로 받지 않는다. HTML도 만들지 않는다.

라우트 종류에 따라 서버가 실제로 하는 일이 달라진다.

| 라우트 종류 | 서버에서 일어나는 일 |
|---|---|
| **정적** (빌드 때 렌더됨) | 빌드할 때 만들어 둔 `.rsc` 결과를 그대로 돌려줌. 서버 컴포넌트를 **실행하지 않음** |
| **동적** (`cookies()`, `headers()`, `searchParams`, `no-store` fetch 등을 쓰는 경우) | 요청이 올 때마다 서버 컴포넌트를 **다시 실행**함. 결과물은 HTML이 아니라 Payload |

"이동할 때 SSR을 한 번 더 한다"에 가까운 건 동적 라우트뿐이다. 그마저도 HTML이 아니라 Payload를 만든다.

---

## 4. Prefetch: 클릭하기 전에 미리 받아두기

- `<Link>`가 **뷰포트에 들어오면** production 환경에서 자동으로 prefetch한다. 요청 헤더에 `Next-Router-Prefetch: 1`이 붙는다.
  - **정적 라우트**는 Payload 전체를 미리 받아둔다. 그래서 클릭하면 **네트워크 요청 없이** 즉시 전환된다.
  - **동적 라우트**는 가장 가까운 `loading.js` 경계까지만 미리 받아둔다. 그래서 클릭하면 로딩 UI가 즉시 뜨고, 나머지는 서버에서 스트리밍으로 채워진다.
- `router.push`만 쓰면 prefetch가 일어나지 않는다. 필요하면 `router.prefetch()`를 직접 호출해야 한다.

---

## 5. 그 외 상황

### 뒤로가기, 앞으로가기

- 클라이언트 **Router Cache**(메모리)에 있는 Payload를 재사용한다. 서버에 요청하지 않는다.
- 스크롤 위치도 복원된다.

### `searchParams`만 바뀔 때 (`?page=2`)

- soft navigation으로 처리되고, 서버에서 `page`를 다시 렌더한다.
- `layout`은 `searchParams`를 받지 않기 때문에 다시 렌더하지 않는다.
- 서버를 거칠 필요 없이 URL만 바꾸고 싶다면 `window.history.pushState`나 `replaceState`를 쓰면 된다. App Router가 이 변화를 감지해서 `useSearchParams`에 반영해 준다.

### `router.refresh()`

- 현재 라우트의 RSC Payload를 서버에 **다시 요청**하고, 받은 결과를 merge한다.
- 서버 컴포넌트의 데이터만 새로 고쳐지고, 클라이언트 state는 유지된다. 브라우저 새로고침과는 다르다.

### Server Action 실행 후

```
POST /movies/123
Headers: Next-Action: <action id>
```

- 액션 안에서 `revalidatePath`나 `revalidateTag`를 호출하면, **같은 응답 안에 갱신된 RSC Payload가 함께** 온다.
- 그래서 왕복 한 번으로 데이터 변경과 화면 갱신이 끝난다.

### 강제로 전체 리로드가 일어나는 경우

- `<a href>`나 `window.location`으로 이동할 때
- **루트 레이아웃이 다른** 라우트 그룹으로 이동할 때 (`(shop)/layout` → `(admin)/layout`처럼)

이런 경우에는 2번처럼 HTML SSR부터 다시 시작한다.

---

## 6. Intercepting Route: 모달 패턴

목록에서 영화를 누르면 상세가 모달로 뜨고, 같은 URL로 바로 들어오면 상세 페이지가 뜨는 패턴이다.

```
app/
  @modal/
    (.)movies/[id]/page.tsx   ← soft nav일 때: 목록 위에 모달로 렌더
    default.tsx               ← 모달이 없을 때 슬롯을 비워두는 용도
  movies/[id]/page.tsx        ← hard nav일 때(새로고침, URL 공유): 전체 페이지로 렌더
  layout.tsx                  ← children과 modal 슬롯을 함께 렌더
```

- 같은 URL이라도 **soft인지 hard인지**에 따라 다른 컴포넌트가 렌더된다.

---

## 7. 한눈에 보기

| 상황 | 요청 | 응답 | 서버 컴포넌트 실행 |
|---|---|---|---|
| 처음 들어올 때, 새로고침 | 일반 GET | HTML | O |
| Link 클릭 (prefetch된 정적 라우트) | 없음 | 캐시 사용 | X |
| Link 클릭 (동적 라우트) | `RSC: 1` | RSC Payload (바뀐 세그먼트만) | O (바뀐 부분만) |
| 뒤로가기, 앞으로가기 | 없음 | 캐시 사용 | X |
| `router.refresh()` | `RSC: 1` | RSC Payload | O |
| Server Action + revalidate | POST | 결과 + Payload | O |
| `<a>` 이동, 루트 레이아웃 변경 | 일반 GET | HTML | O |

---

## 8. 다른 방식과 비교

| | 직접 구현하는 SSR + CSR 라우팅 | Next Pages Router | Next App Router |
|---|---|---|---|
| 처음 들어올 때 | 서버가 `renderToString`한 HTML | 서버가 SSR한 HTML | 서버가 SSR한 HTML |
| 이후 이동할 때 서버가 보내는 것 | API 응답 JSON | `getServerSideProps` 결과 JSON (`/_next/data/...json`) | RSC Payload (렌더된 React 트리) |
| 이동 후 렌더하는 곳 | 클라이언트 | 클라이언트 | 서버 컴포넌트는 서버, 클라이언트 컴포넌트는 클라이언트 |

Next는 두 방식을 섞어서 쓴다.

- **처음 들어올 때**는 서버가 URL을 보고 해당 라우트를 렌더한다. 즉 서버가 라우팅한다.
- **그 뒤의 이동**은 클라이언트 라우터가 URL을 바꾸고, 필요한 렌더 결과만 서버에서 받아온다.

---

## 9. 주의: 버전마다 캐시 기본값이 다르다

- Next 15부터는 동적 라우트의 Router Cache `staleTime` 기본값이 0이다. 그래서 동적 라우트는 이동할 때마다 다시 요청한다. 단, 뒤로가기와 앞으로가기는 예외다.
- Next 15부터는 `fetch`도 기본으로 캐싱하지 않는다.
- Next 16에서 Cache Components를 켜면 `use cache`나 PPR(Partial Prerendering) 때문에 정적/동적을 나누는 방식이 달라진다.
- 실제로 쓰는 버전의 공식 문서(nextjs.org/docs의 Linking and Navigating, Caching)로 한 번 확인할 것.
