export const getBaseHTMLTemplate = () => /*html*/ `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="/static/styles/index.css" />
  <!--{OG_TAGS}-->
</head>
<body>
  <div id="root"><!--{BODY_AREA}--></div>
  <!--{INIT_DATA_AREA}-->
  <script src="/static/bundle.js"></script>
</body>
</html>
`;
