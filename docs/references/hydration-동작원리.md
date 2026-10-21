# Hydration 동작원리

> 이 문서를 참조하는 ADR: 아직 없음

## 배경

[0001](../0001-첫-화면-데이터-서버-페칭.md)에서 첫 화면 데이터를 서버로 옮기면서 react-hybrid가 `hydrateRoot`로 hydrate하게 됐다. 코드 중 어디가 hydration이고, 그때 브라우저에서 정확히 무슨 일이 일어나는지 정리한다. react-hybrid를 직접 띄워 브라우저에서 확인한 결과와 React 소스를 함께 적는다.

## 요약

- hydration은 `src/client/main.tsx`의 `hydrateRoot(...)` 한 줄에서 일어난다. 서버 라우트의 `renderToString`은 SSR이고, `window.__INITIAL_DATA__`는 hydration에 쓸 데이터를 넘기는 준비 단계다.
- `main.tsx`는 빌드 때 `bundle.js`에 묶이고, `<body>` 맨 끝의 `<script>`로 실행된다. 이 스크립트에는 `defer`·`async`가 없지만 `#root`와 `__INITIAL_DATA__` 뒤에 있어서, 실행될 때 둘 다 준비돼 있다.
- 서버 HTML에는 이벤트 핸들러가 없다. 함수는 문자열로 바꿀 수 없기 때문이다. 그래서 JS가 실행되기 전 화면은 보이기만 하고 반응하지 않는다.
- `hydrateRoot`는 DOM을 새로 만들지 않는다. 브라우저에서 같은 트리를 한 번 더 렌더해 기존 DOM 노드와 짝짓고, 각 노드에 fiber와 props를 붙인다. 이벤트 리스너는 `#root`에 한 번만 단다(이벤트 위임).
- 클라이언트의 첫 렌더가 서버 HTML과 다르면 React는 서버 HTML을 버리고 클라이언트에서 다시 그린다. 서버가 렌더에 쓴 데이터를 HTML에 함께 실어 보내는 이유가 이것이다.

비유하면 서버는 마른 뼈대(HTML)를 보내고, hydration은 거기에 물(JS)을 부어 살려낸다. 이름이 hydration(물 주기)인 이유다.

---

## 1. 요청 하나의 흐름

```
[서버] src/server/routes/index.tsx
  ① moviesApi.getPopular()          영화 목록 받기                (35행)
  ② renderToString(<App />)         React 트리 → HTML 문자열       (43행)  ← SSR
  ③ window.__INITIAL_DATA__ 넣기    같은 목록을 <script>에 직렬화  (50~61행)
        │
        ▼ HTML 응답
[브라우저]
  ④ HTML 파싱 → 영화 목록이 바로 보임 (클릭해도 반응 없음)
  ⑤ /static/bundle.js 다운로드·실행
  ⑥ hydrateRoot(...)                src/client/main.tsx:9                   ← hydration
        → 이제 영화를 클릭하면 상세 모달이 뜸
```

| 단계 | 하는 일 | hydration인가 |
|---|---|---|
| `renderToString` (서버) | React 트리를 HTML 문자열로 만든다 | X (SSR) |
| `window.__INITIAL_DATA__` (서버 → 브라우저) | 서버가 렌더에 쓴 데이터를 같이 보낸다 | X (hydration 준비) |
| `hydrateRoot` (브라우저) | 기존 DOM에 React를 연결한다 | **O** |

서버(`routes/index.tsx:44`)와 클라이언트(`main.tsx:11`)가 똑같이 `<InitialDataContext.Provider>`로 `<App />`을 감싸는 것도 양쪽에서 같은 트리를 만들려는 것이다.

### 1-1. `main.tsx`가 브라우저에서 실행되기까지 (⑤)

`main.tsx`는 누가 함수처럼 호출하는 파일이 아니다. 빌드 때 `bundle.js`에 묶이고, 브라우저가 `bundle.js`를 실행하면 `main.tsx`의 최상위 코드가 위에서부터 그대로 실행된다.

```
① 빌드   webpack.client.config.js:7      entry: "./src/client/main.tsx"
          webpack.client.config.js:9-10   → dist/static/bundle.js
              │
② 서빙   src/server/main.ts:15           app.use("/static", express.static(".../dist/static"))
          → /static/bundle.js 주소로 그 파일을 내려준다
              │
③ HTML   src/server/routes/index.tsx:26  <script src="/static/bundle.js"></script>
              │
④ 실행   브라우저가 태그에 도착 → 다운로드 → 실행
          bundle.js 맨 끝에서 entry 모듈(main.tsx)을 불러온다
```

진입점은 서버와 클라이언트가 따로 있다. 서버는 `main.tsx`를 거치지 않고 `App`을 직접 import한다(`routes/index.tsx:4`). 그래서 `main.tsx`는 브라우저에서만 실행되고, `window`와 `hydrateRoot`를 마음 놓고 쓸 수 있다. 양쪽이 공유하는 건 `App` 이하의 컴포넌트다.

| | 진입 파일 | 빌드 결과 | 실행하는 곳 |
|---|---|---|---|
| 서버 | `src/server/main.ts` | `dist/server/server.js` | `node` |
| 클라이언트 | `src/client/main.tsx` | `dist/static/bundle.js` | 브라우저 |

#### 실험: 빌드된 `bundle.js` 들여다보기

`npm run build` 결과인 `dist/static/bundle.js`(development 빌드, 약 1.3MB)의 구조다. 파일 전체가 즉시 실행 함수 하나이고, 그 안에 세 부분이 있다.

```js
(() => {
  // 1) 모듈 표: "경로" → 함수. 모듈 78개 (src/client 18개 + node_modules 60개)
  var __webpack_modules__ = ({
    "./src/client/App.tsx": (...) => { eval("...") },
    "./src/client/main.tsx": (...) => { eval("...") },
    "./node_modules/react/index.js": (...) => { eval("...") },
    ...
  });

  // 2) require 함수: 모듈을 처음 부를 때 한 번만 실행하고, 결과(exports)를 캐시한다
  var __webpack_module_cache__ = {};
  function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) return cachedModule.exports;
    var module = __webpack_module_cache__[moduleId] = { id: moduleId, loaded: false, exports: {} };
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    module.loaded = true;
    return module.exports;
  }

  // 3) 시작: entry 모듈만 부른다
  var __webpack_exports__ = __webpack_require__("./src/client/main.tsx");
})();
```

`main.tsx` 모듈의 내용은 이렇게 바뀌어 있다(줄바꿈과 일부 이름을 정리했다).

```js
var react = __webpack_require__("./node_modules/react/index.js");
var react_dom_client = __webpack_require__("./node_modules/react-dom/client.js");
var _App = __webpack_require__("./src/client/App.tsx");
var _InitialDataContext = __webpack_require__("./src/client/contexts/InitialDataContext.ts");
var jsx_runtime = __webpack_require__("./node_modules/react/jsx-runtime.js");

var initialData = window.__INITIAL_DATA__;
console.log("initialData", initialData);
(0, react_dom_client.hydrateRoot)(document.getElementById("root"),
  (0, jsx_runtime.jsx)(_InitialDataContext.InitialDataContext.Provider, { value: initialData, children: ... }));
```

- `import` 문은 `__webpack_require__(...)` 호출로 바뀐다. `main.tsx`가 실행되면 먼저 React, react-dom, `App`을 차례로 불러오고, `App`은 다시 자기가 import한 페이지와 컴포넌트를 불러온다. 이렇게 필요한 모듈이 줄줄이 실행된다.
- import가 다 끝난 뒤에야 `window.__INITIAL_DATA__`를 읽고(`main.tsx:6`) `hydrateRoot`를 부른다(`main.tsx:9`).
- JSX는 `jsx(...)` 함수 호출로 바뀌어 있다(`@babel/preset-react`의 `runtime: "automatic"`).
- 모듈 본문이 `eval("...")`로 감싸져 있는 건 development 모드의 기본 devtool이 `eval`이라서다. production 빌드에서는 모양이 다르다.

### 1-2. 스크립트 실행 순서

`routes/index.tsx`의 템플릿에서 `<body>` 부분의 순서다.

```html
<div id="root">...서버가 그린 HTML...</div>         ← 1
<script>window.__INITIAL_DATA__ = {...}</script>   ← 2 인라인 스크립트
<script src="/static/bundle.js"></script>          ← 3 defer·async 없음
```

- 3에는 `defer`도 `async`도 없다. `curl`로 받은 실제 HTML에서도 그대로였다. 이런 스크립트는 태그에 도착하면 HTML 파싱을 멈추고, 다운로드와 실행이 끝난 뒤에 이어서 파싱한다.
- 브라우저는 위에서부터 순서대로 처리하므로, 3이 실행될 때는 1의 `#root`와 2의 `window.__INITIAL_DATA__`가 이미 있다. `main.tsx`가 둘을 바로 읽어도 되는 이유다.
- 3을 속성 없이 `<head>`로 옮기면 실행 시점에 `#root`가 아직 없다. `document.getElementById("root")`가 `null`이 되고, `hydrateRoot` 첫 줄의 검사에서 `Target container is not a DOM element.` 에러가 난다.

`defer`, `async`를 붙이면 이렇게 달라진다.

| | 다운로드 | 실행 시점 | 이 프로젝트에서 |
|---|---|---|---|
| 없음 (지금) | 태그를 만났을 때 | 다운로드 직후. 그동안 파싱이 멈춤 | body 끝이라 문제없음 |
| `defer` | HTML 파싱과 동시에 | HTML 파싱이 다 끝난 뒤, 태그 순서대로 | `<head>`로 옮겨도 안전함 |
| `async` | HTML 파싱과 동시에 | 다운로드가 끝나는 즉시 | `<head>`에 두면 `#root`가 파싱되기 전에 실행될 수 있음 → 에러 위험 |

지금은 태그가 `</body>` 바로 앞이라 파싱이 멈춰도 뒤에 남은 게 거의 없다. `<head>`로 옮기고 `defer`를 붙이면 이론상 다운로드를 더 일찍 시작한다. 하지만 서버가 HTML 전체(약 24KB)를 한 번에 보내고, 브라우저의 preload scanner가 body 끝의 `<script src>`도 미리 찾아 받기 시작한다. 그래서 실제 차이는 작을 것으로 본다(측정하지 않음).

---

## 2. 서버 HTML에는 무엇이 들어 있나

`curl localhost:8080/`로 받은 HTML의 `#root` 부분이다. 태그마다 줄을 바꾸고 줄였다.

```html
<div id="root">
  <link rel="preload" as="image" href="/images/logo.png"/>
  <link rel="preload" as="image" href="/images/star_empty.png"/>
  <link rel="preload" as="image" href="/images/woowacourse_logo.png"/>
  <div id="wrap">
    <header>
      ...
      <button class="logo"><img src="/images/logo.png" .../></button>   <!-- onclick 없음 -->
      ...
    </header>
    <main>
      <section class="container">
        <h2 class="text-2xl font-bold mb-64">지금 인기 있는 영화</h2>
        <ul class="thumbnail-list">
          <li class="movie-item" data-index="969681">   <!-- onclick 없음 -->
            <div class="item">
              <img class="thumbnail" src="https://image.tmdb.org/t/p/w500/....jpg" alt="..." loading="lazy"/>
              ...
            </div>
          </li>
          ...
```

```html
<script>
  window.__INITIAL_DATA__ = {
    movies: [{"adult":false,"backdrop_path":"...","id":969681,"title":"...", ...}, ...]
  }
</script>
<script src="/static/bundle.js"></script>
```

- `<li class="movie-item">`는 20개, `onclick`은 0개다. `MovieItem.tsx:24`의 `onClick={handleClick}`, `Header.tsx:28`의 로고 클릭은 함수라 HTML 문자열에 들어갈 수 없다.
- `useMovieDetailModal`의 상태와 overlay-kit도 서버에서는 한 번 실행되고 끝난다. 상태가 바뀌어도 다시 렌더할 주체가 없다.
- `#root` 맨 앞의 `<link rel="preload" as="image">` 3개는 우리가 쓴 코드가 아니라 React 19가 넣은 것이다. 서버 렌더러는 `loading="lazy"`가 없는 `<img>`를 만나면 미리 받도록 preload를 만든다(`react-dom-server-legacy.node.development.js`의 `case "img":`). 썸네일은 `loading="lazy"`라서 빠졌다.

---

## 3. `hydrateRoot`가 하는 일

`createRoot().render()`였다면 React는 `#root` 안을 비우고 DOM을 처음부터 만든다. `hydrateRoot`는 이미 있는 DOM을 그대로 쓴다. 아래 코드는 모두 `react-dom/cjs/react-dom-client.development.js`(React 19.1.1)에서 뽑았다.

### 3-1. `#root`에 이벤트 리스너를 한 번 단다

```js
exports.hydrateRoot = function (container, initialChildren, options) {
  ...
  ensureRootIsScheduled(initialChildren);                  // 렌더(=hydration) 예약
  container[internalContainerInstanceKey] = initialChildren.current;
  listenToAllSupportedEvents(container);                   // #root에 리스너 등록
  return new ReactDOMHydrationRoot(initialChildren);
};
```

`listenToAllSupportedEvents`는 click, input 같은 이벤트 전부를 `#root` **한 곳에** 등록한다. `<li>` 20개에 리스너를 하나씩 다는 게 아니다.

### 3-2. 트리를 다시 렌더하며 기존 DOM과 짝짓는다

브라우저에서 `<App />`을 렌더하면서, 호스트 컴포넌트(`<div>`, `<li>` 같은 DOM 태그)를 만날 때마다 "지금 차례의 DOM 노드"와 태그 이름을 비교한다.

```js
function canHydrateInstance(instance, type, props, inRootOrSingleton) {
  for (; 1 === instance.nodeType; ) {
    if (instance.nodeName.toLowerCase() !== type.toLowerCase()) {
      if (!inRootOrSingleton && ...) break;          // 태그가 다르면: 루트 바로 아래가 아니면 실패
    } else if (!inRootOrSingleton) ... return instance;   // 태그가 같으면: 이 노드를 쓴다
    else if (...) switch (type) { ... default: return instance; }  // 루트 바로 아래도 대부분 바로 쓴다
    instance = getNextHydratable(instance.nextSibling);   // 못 찾았으면 다음 형제로
    if (null === instance) break;
  }
  return null;
}
```

- 이름이 맞으면 그 DOM 노드를 이 fiber의 `stateNode`로 쓴다. 새로 만들지 않는다.
- `#root` 바로 아래(`inRootOrSingleton`)에서는 안 맞는 노드를 건너뛰고 다음 형제를 본다. 그래서 2장의 preload `<link>` 3개는 건너뛰고 `<div id="wrap">`과 짝지어진다. 실제로 hydration 뒤에도 `#root`의 자식은 `LINK, LINK, LINK, DIV#wrap` 그대로였고 에러도 없었다.

### 3-3. 짝지은 노드에 fiber와 props를 붙인다

```js
function prepareToHydrateHostInstance(fiber) {
  var didHydrate = fiber.stateNode;           // 짝지은 기존 DOM 노드
  ...
  didHydrate[internalInstanceKey] = fiber;    // "__reactFiber$" + randomKey
  didHydrate[internalPropsKey] = props;       // "__reactProps$" + randomKey
  ...
}
```

DOM 노드에 "너는 이 fiber이고 props는 이것"이라는 연결을 프로퍼티로 붙인다. props 안에 `onClick` 함수가 들어 있다. 여기까지 하면 훅과 상태도 브라우저에서 동작한다.

### 3-4. 클릭이 들어오면

`<li>`를 클릭하면 이벤트가 버블링되어 `#root`의 리스너에 도착한다. React는 클릭된 DOM 노드에서 3-3에서 붙인 정보를 꺼내 실행할 핸들러를 찾는다.

```js
function getClosestInstanceFromNode(targetNode) {
  var targetInst = targetNode[internalInstanceKey];   // 클릭된 DOM → fiber
  ...
}

function getListener(inst, registrationName) {        // registrationName = "onClick"
  var stateNode = inst.stateNode;
  var props = stateNode[internalPropsKey] || null;    // DOM → props
  ...
  stateNode = props[registrationName];                // props.onClick
```

```
클릭 → 이벤트 버블링 → #root 리스너
        → 클릭된 DOM의 __reactFiber$ 로 fiber 찾기
        → fiber를 부모 쪽으로 따라가며 각 노드의 __reactProps$.onClick 모으기
        → 모은 핸들러 실행 (MovieItem의 handleClick)
```

hydration 전에는 `#root`에 리스너도 없고 DOM 노드에 `__reactProps$`도 없다. 그래서 클릭해도 아무 일도 일어나지 않는다.

### 실험: hydration 전과 후

react-hybrid를 빌드해 띄우고, 브라우저에서 같은 HTML을 세 가지로 로드해 비교했다(방법은 6장).

| | hydration 전 | hydration 후 | JS 없이 로드 |
|---|---|---|---|
| 첫 `<li>`에 붙은 키 | 없음 | `__reactFiber$c3aaq4fgdpc`, `__reactProps$c3aaq4fgdpc` | 없음 |
| `#root`에 붙은 키 | 없음 | `__reactContainer$c3aaq4fgdpc`, `_reactListeningwulir8meehs` | 없음 |
| 첫 `<li>`가 hydration 전과 같은 노드인가 | - | 같음 | 같음 |
| `<li>`의 `__reactProps$` | - | `ref, className, onClick(function), data-index, children` | - |
| 첫 영화 클릭 | - | 모달 "스파이더맨: 브랜드 뉴 데이"가 뜸 | 아무 일 없음 |

- hydration 전에 잡아둔 `<li>`와 hydration 뒤의 `<li>`가 `===`로 같았다. DOM을 다시 만들지 않고 그대로 썼다.
- `__reactProps$` 안의 키는 `MovieItem.tsx`의 `<li ref className onClick data-index>`와 자식이 그대로 들어 있다.
- 키 뒤의 문자열은 React가 로드될 때마다 새로 만드는 랜덤 값이다. 같은 페이지에 React가 둘 있어도 섞이지 않게 하려는 것이다.

---

## 4. 서버와 클라이언트 렌더가 다르면 (hydration mismatch)

3-2의 짝짓기는 **클라이언트의 첫 렌더가 서버 HTML과 같다**는 전제로 동작한다. 짝이 안 맞으면 React는 에러를 큐에 넣고 서버 HTML을 버린다.

```js
function throwOnHydrationMismatch(fiber) {
  ...
  queueHydrationError(createCapturedValueAtFiber(Error(
    "Hydration failed because the server rendered HTML didn't match the client. " +
    "As a result this tree will be regenerated on the client. ..."
  ), fiber));
  throw HydrationMismatchException;
}
```

가장 가까운 `<Suspense>` 경계부터 클라이언트에서 다시 그린다. react-hybrid에는 `<Suspense>`가 없으니 **루트 전체**를 다시 그린다.

### 실험: `__INITIAL_DATA__`를 빈 배열로 바꾸기

서버 HTML은 그대로 두고 `window.__INITIAL_DATA__`의 `movies`만 `[]`로 바꿔 로드했다. 클라이언트가 데이터 없이 hydrate하는 상황이다.

```
서버 HTML:      <div id="wrap"><header>...</header><main>...영화 20개...</main>...</div>
클라이언트 렌더: <div>영화 정보를 불러오는데 실패했습니다.</div>   (MovieHomePage.tsx:9~11)
```

결과:

- 에러가 하나 발생했다: `Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. ...`
- `#root`의 내용이 `<div>영화 정보를 불러오는데 실패했습니다.</div>` 하나로 바뀌었다. 서버가 보낸 영화 목록도, preload `<link>` 3개도 사라졌다.

서버가 그린 화면이 JS가 실행되는 순간 실패 문구로 바뀌는 셈이다. 사용자가 받는 HTML은 맞았지만 SSR을 한 의미가 없어진다. 그래서 0001에서 서버가 렌더에 쓴 데이터를 `window.__INITIAL_DATA__`로 함께 보내고, 클라이언트는 그 값으로 첫 렌더를 하게 했다.

0001 이전처럼 클라이언트가 `useEffect`로 데이터를 받는 방식은 이 문제가 없다. `useEffect`는 hydration이 끝난 뒤에 실행되므로 첫 렌더는 서버와 같다(둘 다 데이터가 없는 상태). 대신 서버 HTML에 데이터가 없고, 같은 데이터를 브라우저에서 다시 받아야 한다.

mismatch가 생기는 흔한 원인 (React 에러 메시지에 적힌 목록):

- `typeof window !== 'undefined'`로 서버와 클라이언트를 나누는 분기
- `Date.now()`, `Math.random()`처럼 호출할 때마다 바뀌는 값
- 사용자 로케일에 따라 달라지는 날짜 포맷
- 바뀌는 외부 데이터를 HTML과 함께 보내지 않은 경우 ← 이번 실험
- 잘못된 HTML 태그 중첩(`<p>` 안에 `<div>` 등)
- HTML을 고치는 브라우저 확장 프로그램

### 이 에러는 `console.error`가 아니다

React 19의 기본 `onRecoverableError`는 `reportError`(브라우저 전역 함수)를 부른다. 그래서 `console.error`를 가로채서는 잡히지 않았고, `window`의 `error` 이벤트로 잡혔다. `reportError`로 보낸 에러는 잡히지 않은 에러와 같은 방식으로 콘솔에 찍힌다.

```js
function defaultOnRecoverableError(error) {
  reportGlobalError(error);
}
reportGlobalError = "function" === typeof reportError ? reportError : function (error) { /* window에 ErrorEvent 발생 */ };
```

직접 처리하려면 `hydrateRoot(container, <App />, { onRecoverableError })`로 넘기면 된다.

---

## 5. 직접 확인하는 방법

- **JS 끄고 보기**: DevTools → ⌘⇧P → "Disable JavaScript" → 새로고침. 목록은 보이지만 클릭은 안 된다. 1장의 ④ 상태다.
- **노드에 붙은 키 보기**: Elements 탭에서 `<li class="movie-item">`을 선택하고 Console에서 `Object.keys($0)`. `__reactFiber$…`, `__reactProps$…`가 보인다. `$0[Object.keys($0)[1]].onClick`으로 핸들러 함수도 볼 수 있다.
- **mismatch 내보기**: `main.tsx:11`의 `value={initialData}`를 `value={{ movies: [] }}`로 바꾸고 새로고침하면 콘솔에 4장의 에러가 뜬다.

---

## 6. 실험 방법

- 환경: react-hybrid(`step3` 브랜치, `b074f5c`), React 19.1.1, webpack `mode: "development"`, Aside 브라우저(`aside repl`)
- `npm run build` 후 `node dist/server/server.js`로 띄우고 `localhost:8080`에서 확인했다.

hydration 전 상태를 잡으려면 bundle.js보다 먼저 코드가 실행돼야 한다. 그래서 페이지 안에서 HTML을 다시 받아 `document.write`로 새로 그렸다. `document.open()`을 해도 `window`의 전역 값은 남으므로, 미리 정의해 둔 setter가 동작한다.

```js
let html = await (await fetch('/')).text();
// 경우에 따라 HTML을 바꾼다
//  - JS 없이: html = html.replace('<script src="/static/bundle.js"></script>', '');
//  - mismatch: html = html.replace(/movies: \[[\s\S]*?\]\s*\}\s*<\/script>/, 'movies: [] }</script>');

// __INITIAL_DATA__ 인라인 스크립트는 #root 뒤, bundle.js 앞에서 실행된다.
// 그 순간 = HTML은 다 그려졌고 hydration은 아직인 시점이다.
let v;
Object.defineProperty(window, '__INITIAL_DATA__', {
  configurable: true,
  get() { return v; },
  set(x) {
    v = x;
    const li = document.querySelector('li.movie-item');
    window.__before = { li, liKeys: Object.keys(li), rootKeys: Object.keys(document.getElementById('root')) };
  },
});

document.open(); document.write(html); document.close();
// 2초 뒤: document.querySelector('li.movie-item') === window.__before.li, Object.keys(...) 비교
```

mismatch 에러는 `window.addEventListener('error', ...)`를 `document.open()` 전에 달았을 때 잡히지 않았다. 리스너를 HTML의 `<head>` 맨 앞에 `<script>`로 넣었더니 잡혔다. `document.open()`이 기존 리스너를 지우는 것으로 보인다(스펙으로는 미확인).

---

## 확인한 것과 안 한 것

- 빌드 결과로 확인: `bundle.js`의 구조(모듈 표, `__webpack_require__`, 맨 끝의 entry 호출), `main.tsx` 모듈이 import를 먼저 부른 뒤 `hydrateRoot`를 호출하는 것, 서버 HTML의 bundle.js 스크립트에 `defer`·`async`가 없는 것.
- 브라우저로 확인: 서버 HTML에 `onclick`이 없는 것, hydration 전후로 `<li>`가 같은 노드인 것, hydration 뒤 `__reactFiber$`/`__reactProps$`/`__reactContainer$`/`_reactListening` 키가 붙는 것, JS 없이는 클릭이 안 되고 hydration 뒤에는 모달이 뜨는 것, 데이터를 바꾸면 mismatch 에러가 나고 루트 전체가 다시 그려지는 것, preload `<link>`가 있어도 정상 hydration에서는 에러가 없는 것.
- 코드로 확인(React 19.1.1): `hydrateRoot` → `listenToAllSupportedEvents`, `canHydrateInstance`의 태그 비교와 루트에서 건너뛰기, `prepareToHydrateHostInstance`의 키 붙이기, `getClosestInstanceFromNode`/`getListener`의 핸들러 찾기, `throwOnHydrationMismatch`와 루트 전체 복구 메시지, `defaultOnRecoverableError` → `reportError`, 서버 렌더러의 `<img>` preload 조건.
- 확인하지 않음: 스크립트를 `<head>`로 옮겼을 때의 에러(소스로만 확인), `defer`로 바꿨을 때의 속도 차이, production 빌드의 `bundle.js` 모양, production 빌드의 에러 문구(축약된다), `<Suspense>` 경계가 있을 때 부분만 다시 그리는 동작, 텍스트는 같고 속성만 다를 때의 동작, 클릭 핸들러를 부모 쪽으로 모으는 함수(`accumulateSinglePhaseListeners`)의 세부, `document.open()`이 리스너를 지우는 스펙 근거.

## 레퍼런스

- [React — hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot)
- [React — Hydration mismatch](https://react.dev/link/hydration-mismatch)
- `react-hybrid/node_modules/react-dom/cjs/react-dom-client.development.js` (19.1.1)
