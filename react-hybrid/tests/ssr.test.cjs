const assert = require("node:assert/strict");
const http = require("node:http");
const { test } = require("node:test");
const vm = require("node:vm");
const axios = require("axios");

test("홈과 상세 페이지 SSR", async (t) => {
  const movie = { id: 1, title: "목록 영화", vote_average: 7.5, poster_path: null };
  const detail = {
    ...movie,
    title: "상세 영화",
    genres: [{ id: 1, name: "드라마" }],
    overview: "줄거리 </script><script>unexpected()</script>",
  };
  const requests = [];
  t.mock.method(axios, "create", () => ({
    get: async (url) => {
      requests.push(url);
      if (url === "/movie/popular") return { data: { results: [movie] } };
      if (url === "/movie/1") return { data: detail };
      if (url === "/movie/404") {
        throw Object.assign(new Error("Not found"), {
          isAxiosError: true,
          response: { status: 404 },
        });
      }
      throw new Error("Upstream failure");
    },
  }));

  let server;
  const listen = http.Server.prototype.listen;
  t.after(() => {
    server?.close();
    server?.closeAllConnections();
  });
  await new Promise((resolve, reject) => {
    t.mock.method(http.Server.prototype, "listen", function () {
      server = this;
      server.once("listening", resolve);
      server.once("error", reject);
      return listen.call(server, 0, "127.0.0.1");
    });
    require("../dist/server/server.js");
  });
  const origin = `http://127.0.0.1:${server.address().port}`;
  const readInitialData = (html) => {
    const context = { window: {} };
    vm.runInNewContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], context);
    return context.window.__INITIAL_DATA__;
  };

  await t.test("홈에는 목록이 있고 상세 모달은 없다", async () => {
    const response = await fetch(origin);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /<strong>목록 영화<\/strong>/);
    assert.doesNotMatch(html, /class="modal-background active"/);
    assert.equal(readInitialData(html).movieDetail, null);
    assert.deepEqual(requests, ["/movie/popular"]);
  });

  await t.test("상세 HTML에 모달과 안전하게 직렬화한 초기 데이터가 있다", async () => {
    const response = await fetch(`${origin}/detail/1`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /<strong>목록 영화<\/strong>/);
    assert.match(html, /class="modal-background active"/);
    assert.match(html, /class="modal-title">상세 영화<\/h1>/);
    assert.match(html, /줄거리 &lt;\/script&gt;/);
    assert.equal(readInitialData(html).movieDetail.overview, detail.overview);
    assert.deepEqual(requests.slice(1).sort(), ["/movie/1", "/movie/popular"]);
  });

  await t.test("잘못된 ID는 API 요청 없이 400으로 응답한다", async () => {
    const count = requests.length;
    for (const id of ["abc", "0", "-1", "1.5", "9007199254740992"]) {
      assert.equal((await fetch(`${origin}/detail/${id}`)).status, 400);
    }
    assert.equal(requests.length, count);
  });

  await t.test("없는 영화는 404, API 장애는 502로 응답한다", async () => {
    assert.equal((await fetch(`${origin}/detail/404`)).status, 404);
    assert.equal((await fetch(`${origin}/detail/500`)).status, 502);
  });
});
