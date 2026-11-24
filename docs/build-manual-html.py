# -*- coding: utf-8 -*-
"""把手册 Markdown 转成单文件、可打印的 HTML（无外部依赖）。

只用标准库，便于离线重建：
    python docs/build-manual-html.py             # zh-CN -> src/ui/manual.html（原路径不变）
    python docs/build-manual-html.py --locale en # en    -> src/ui/manual.en.html
    python docs/build-manual-html.py --locale he # he    -> src/ui/manual.he.html（dir="rtl"）

锚点契约（Phase 5，docs/zapkstart/design.md）：
  每个标题的 id 一律取 docs/manual/topics.json 里的 topic-id——通过「标题原文」
  匹配（zh 源用 zh 字段、en 源用 en 字段、he 源用 he 字段）。三种语言产出的
  id 完全一致，这是 src/core/manual.js 依赖的跨语言锚点契约。
  topics.json 缺条目时立刻报错并列出未匹配标题，绝不静默生成别的 slug。

  zh-CN 产物额外带一个向后兼容层：每个标题前插一个
  <span id="<旧中文slug>" aria-hidden="true"></span>（旧 slug 由原来的
  slug() 算法重算）。这样升级到 topic-id 锚点之前编译的 src/core/manual.js
  （以及外部 #旧slug 深链）在旧 manual.html 上继续工作；en/he 没有历史
  消费者，不插。

每次运行（任一语言）都会刷新 docs/manual/anchors.json：locale -> {标题原文: topic-id}。
test/manual-test.js 用它验证三个语言的锚点集合一致且覆盖全部标题。
"""
import argparse
import html
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
MANUAL_DIR = os.path.join(HERE, 'manual')
TOPICS_FILE = os.path.join(MANUAL_DIR, 'topics.json')
ANCHORS_FILE = os.path.join(MANUAL_DIR, 'anchors.json')

LOCALES = {
    'zh-CN': {
        'field': 'zh',
        'src': os.path.join(HERE, 'manual', 'zh.md'),
        'outputs': (
            os.path.join(HERE, 'zApkStart-Manual-ZH.html'),
            os.path.join(ROOT, 'src', 'ui', 'manual.html'),
        ),
        'lang': 'zh-CN',
        'dir': 'ltr',
        'legacy_spans': True,   # 旧 manual.js 的中文 slug 锚点兼容层（仅 zh 有历史消费者）
        'aside_title': '目录',
        'toc_placeholder': '筛选目录（Ctrl+F 全文搜索）',
        'print_label': '打印 / 存为 PDF',
        'search_hint': '全文搜索',
    },
    'en': {
        'field': 'en',
        'src': os.path.join(MANUAL_DIR, 'en.md'),
        'outputs': (
            os.path.join(MANUAL_DIR, 'zApkStart-Manual-EN.html'),
            os.path.join(ROOT, 'src', 'ui', 'manual.en.html'),
        ),
        'lang': 'en',
        'dir': 'ltr',
        'legacy_spans': False,
        'aside_title': 'Contents',
        'toc_placeholder': 'Filter contents (Ctrl+F searches the full text)',
        'print_label': 'Print / Save as PDF',
        'search_hint': 'full-text search',
    },
    'he': {
        'field': 'he',
        'src': os.path.join(MANUAL_DIR, 'he.md'),
        'outputs': (
            os.path.join(MANUAL_DIR, 'zApkStart-Manual-HE.html'),
            os.path.join(ROOT, 'src', 'ui', 'manual.he.html'),
        ),
        'lang': 'he',
        'dir': 'rtl',
        'legacy_spans': False,
        'aside_title': 'תוכן העניינים',
        'toc_placeholder': 'סינון תוכן העניינים (Ctrl+F לחיפוש בכל הטקסט)',
        'print_label': 'הדפסה / שמירה כ-PDF',
        'search_hint': 'חיפוש בכל הטקסט',
    },
}

# he 产物才追加的 RTL 覆盖：物理方向属性翻转 + 代码块/表格保持 LTR。
RTL_CSS = '''html[dir="rtl"] aside{border-right:0;border-inline-end:1px solid var(--line)}
html[dir="rtl"] blockquote{border-left:0;border-right:4px solid var(--warn);border-radius:8px 0 0 8px}
html[dir="rtl"] th,html[dir="rtl"] td{text-align:start}
html[dir="rtl"] ul,html[dir="rtl"] ol{padding-left:0;padding-right:26px}
html[dir="rtl"] code{direction:ltr;unicode-bidi:isolate}
html[dir="rtl"] pre{direction:ltr;text-align:left}
'''


def safe_print(*parts):
    """Windows 控制台（cp1252/cp936）打不出中文/希伯来文时降级，不让构建假失败。"""
    try:
        print(*parts)
    except UnicodeEncodeError:
        print(*[p.encode('ascii', 'backslashreplace').decode('ascii') for p in parts])


def load_topics():
    with open(TOPICS_FILE, encoding='utf-8') as f:
        raw = json.load(f)
    return {k: v for k, v in raw.items() if not k.startswith('_')}


def read_lines(path):
    with open(path, encoding='utf-8') as f:
        return f.read().split('\n')


def md_headings(lines):
    """取文档全部标题原文（跳过代码围栏内），返回 [(level, text), ...]。"""
    out = []
    fence = False
    for line in lines:
        if line.startswith('```'):
            fence = not fence
            continue
        if fence:
            continue
        m = re.match(r'^(#{1,4})\s+(.*)$', line)
        if m:
            out.append((len(m.group(1)), m.group(2).strip()))
    return out


def github_slug(text):
    """GitHub 风格的标题锚点（md 源里 # 链接的推导规则，zh 源在用）。"""
    s = re.sub(r'[^\w\s-]', '', text.lower())
    return re.sub(r'\s', '-', s)


def slug(text, used):
    """0.6.x 的旧 slug 算法，原样保留 —— 只用于 zh 的向后兼容锚点层。"""
    base = re.sub(r'[^\w\u4e00-\u9fa5]+', '-', text).strip('-').lower() or 'sec'
    s = base
    i = 2
    while s in used:
        s = base + '-' + str(i)
        i += 1
    used.add(s)
    return s


def build_heading_map(locale, topics, fail_on_missing=True):
    """locale 的「标题原文 -> topic-id」。topics.json 缺条目时大声失败。"""
    cfg = LOCALES[locale]
    lines = read_lines(cfg['src'])
    headings = md_headings(lines)
    by_text = {}
    for tid, locs in topics.items():
        text = locs.get(cfg['field'])
        if text:
            if text in by_text:
                sys.exit('topics.json 错误: 标题原文在 %s 里重复映射 (%s / %s): %r'
                         % (locale, by_text[text], tid, text))
            by_text[text] = tid
    mapping = {}
    missing = []
    for _, text in headings:
        if text in by_text:
            mapping[text] = by_text[text]
        else:
            missing.append(text)
    if missing and fail_on_missing:
        safe_print('错误: topics.json 缺少 %s 的以下标题（在 %s 里补上再构建）:'
                   % (locale, TOPICS_FILE))
        for text in missing:
            safe_print('  - ' + text)
        sys.exit(1)
    return mapping


def build_anchors(topics):
    """三个语言各自「标题原文 -> topic-id」，按文档顺序；供 test/manual-test.js 校验。"""
    anchors = {}
    for locale in LOCALES:
        cfg = LOCALES[locale]
        if not os.path.exists(cfg['src']):
            return None  # 三个源齐了才写 anchors.json；缺源不挡 zh 兼容构建
        mapping = build_heading_map(locale, topics)
        lines = read_lines(cfg['src'])
        order = [text for _, text in md_headings(lines)]
        anchors[locale] = {text: mapping[text] for text in order}
    return anchors


def render(locale, topics):
    """渲染一个语言的完整 HTML 文档，返回 (doc, anchor_map, title)。"""
    cfg = LOCALES[locale]
    lines = read_lines(cfg['src'])
    heading_map = build_heading_map(locale, topics)

    # md 源内 #链接 的重定向表：GitHub slug / 旧 slug -> topic-id
    github_map, legacy_map = {}, {}
    for text, tid in heading_map.items():
        github_map.setdefault(github_slug(text), tid)
        legacy_map.setdefault(slug(text, set()), tid)
    topic_ids = set(heading_map.values())

    def remap_href(href):
        if not href.startswith('#'):
            return href
        frag = href[1:]
        if frag in topic_ids:
            return href
        if frag in github_map:
            return '#' + github_map[frag]
        if frag in legacy_map:
            return '#' + legacy_map[frag]
        return href

    def inline(s):
        s = html.escape(s, quote=False)
        s = re.sub(r'`([^`]+)`', r'<code>\1</code>', s)
        s = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', s)
        s = re.sub(r'\[([^\]]+)\]\(([^)]+)\)',
                   lambda m: '<a href="%s">%s</a>' % (html.escape(remap_href(m.group(2)), quote=True), m.group(1)),
                   s)
        return s

    out = []
    toc = []
    used_ids = set()
    legacy_used = set()
    anchor_map = {}
    title = None
    i = 0
    n = len(lines)
    in_code = False
    code_buf = []

    while i < n:
        line = lines[i]

        # 代码块
        if line.startswith('```'):
            if not in_code:
                in_code = True
                code_buf = []
            else:
                out.append('<pre><code>' + html.escape('\n'.join(code_buf)) + '</code></pre>')
                in_code = False
            i += 1
            continue
        if in_code:
            code_buf.append(line)
            i += 1
            continue

        # 水平线
        if re.match(r'^---+\s*$', line):
            out.append('<hr/>')
            i += 1
            continue

        # 标题：id 一律取 topics.json 的 topic-id（锚点契约）
        m = re.match(r'^(#{1,4})\s+(.*)$', line)
        if m:
            lvl = len(m.group(1))
            text = m.group(2).strip()
            if title is None:
                title = text
            tid = heading_map.get(text)
            if tid is None:
                # build_heading_map 已经大声失败，这里只是双保险
                sys.exit('topics.json 缺少 %s 标题: %r' % (locale, text))
            if tid in used_ids:
                sys.exit('topic-id 重复（同一文档两个标题映射到 %s）: %r' % (tid, text))
            used_ids.add(tid)
            anchor_map[text] = tid
            if cfg['legacy_spans']:
                out.append('<span id="%s" aria-hidden="true"></span>' % slug(text, legacy_used))
            if lvl in (2, 3):
                toc.append((lvl, tid, text))
            out.append('<h%d id="%s">%s</h%d>' % (lvl, tid, inline(text), lvl))
            i += 1
            continue

        # 表格
        if line.strip().startswith('|') and i + 1 < n and re.match(r'^\s*\|?[\s:\-|]+\|?\s*$', lines[i + 1]):
            def cells(row):
                return [c.strip() for c in row.strip().strip('|').split('|')]
            header = cells(line)
            i += 2
            rows = []
            while i < n and lines[i].strip().startswith('|'):
                rows.append(cells(lines[i]))
                i += 1
            t = ['<div class="tw"><table><thead><tr>']
            t += ['<th>' + inline(c) + '</th>' for c in header]
            t.append('</tr></thead><tbody>')
            for r in rows:
                t.append('<tr>')
                t += ['<td>' + inline(c) + '</td>' for c in r]
                t.append('</tr>')
            t.append('</tbody></table></div>')
            out.append(''.join(t))
            continue

        # 引用
        if line.startswith('> '):
            q = []
            while i < n and lines[i].startswith('>'):
                q.append(lines[i].lstrip('>').strip())
                i += 1
            out.append('<blockquote>' + inline(' '.join(q)) + '</blockquote>')
            continue

        # 有序列表
        if re.match(r'^\d+\.\s+', line):
            items = []
            while i < n and re.match(r'^\d+\.\s+', lines[i]):
                items.append(re.sub(r'^\d+\.\s+', '', lines[i]))
                i += 1
            out.append('<ol>' + ''.join('<li>' + inline(x) + '</li>' for x in items) + '</ol>')
            continue

        # 无序列表
        if re.match(r'^\s*[-*]\s+', line):
            items = []
            while i < n and re.match(r'^\s*[-*]\s+', lines[i]):
                items.append(re.sub(r'^\s*[-*]\s+', '', lines[i]))
                i += 1
            out.append('<ul>' + ''.join('<li>' + inline(x) + '</li>' for x in items) + '</ul>')
            continue

        # 空行
        if not line.strip():
            i += 1
            continue

        # 段落（合并连续普通行）
        para = [line.strip()]
        i += 1
        while i < n and lines[i].strip() and not re.match(r'^(#{1,4})\s|^\s*[-*]\s+|^\d+\.\s+|^>|^\s*\||^```|^---+\s*$', lines[i]):
            para.append(lines[i].strip())
            i += 1
        out.append('<p>' + inline(' '.join(para)) + '</p>')

    body = '\n'.join(out)

    toc_html = []
    for lvl, anchor, text in toc:
        cls = 'toc-l2' if lvl == 2 else 'toc-l3'
        toc_html.append('<a class="%s" href="#%s">%s</a>' % (cls, anchor, html.escape(text)))
    toc_html = '\n'.join(toc_html)

    lang_attr = 'lang="%s"' % cfg['lang']
    if cfg['dir'] == 'rtl':
        lang_attr += ' dir="rtl"'
    rtl_css = RTL_CSS if cfg['dir'] == 'rtl' else ''

    doc = '''<!DOCTYPE html>
<html __LANGATTR__>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>__TITLE__</title>
<style>
:root{--bg:#ffffff;--fg:#1f2328;--mut:#57606a;--line:#d0d7de;--code:#eff1f3;--accent:#0969da;--accent-soft:#ddf4ff;--warn:#9a6700;--warn-bg:#fff8c5;--head:#f6f8fa;--tbl:#f6f8fa}
*{box-sizing:border-box}
body{margin:0;font:16px/1.7 -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;color:var(--fg);background:var(--bg)}
.wrap{display:flex;max-width:1180px;margin:0 auto}
aside{position:sticky;top:0;height:100vh;overflow:auto;width:280px;flex:0 0 280px;border-right:1px solid var(--line);padding:24px 18px;background:var(--head)}
aside h2{font-size:15px;margin:0 0 14px;letter-spacing:.5px}
aside a{display:block;color:var(--mut);text-decoration:none;padding:3px 8px;border-radius:6px;font-size:13.5px;line-height:1.45}
aside a:hover{background:var(--accent-soft);color:var(--accent)}
#tocSearch{width:100%;margin-bottom:12px;padding:7px 9px;border:1px solid var(--line);border-radius:6px;font:13px/1.4 inherit;background:#fff;color:var(--fg)}
#tocSearch:focus{outline:2px solid var(--accent-soft);border-color:var(--accent)}
.toc-l3{padding-left:22px!important;font-size:12.5px!important;color:#8c959f!important}
main{flex:1;min-width:0;padding:40px 48px 80px}
h1{font-size:30px;margin:0 0 8px;padding-bottom:16px;border-bottom:2px solid var(--line)}
h2{font-size:23px;margin:42px 0 16px;padding-bottom:8px;border-bottom:1px solid var(--line);scroll-margin-top:16px}
h3{font-size:18px;margin:30px 0 12px;scroll-margin-top:16px}
h4{font-size:16px;margin:22px 0 8px}
p{margin:12px 0}
a{color:var(--accent)}
code{background:var(--code);padding:2px 6px;border-radius:6px;font:13.5px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace}
pre{background:var(--code);padding:16px 18px;border-radius:8px;overflow:auto;border:1px solid var(--line)}
pre code{background:none;padding:0}
blockquote{margin:16px 0;padding:10px 16px;border-left:4px solid var(--warn);background:var(--warn-bg);color:#633c01;border-radius:0 8px 8px 0}
blockquote p{margin:0}
ul,ol{margin:12px 0;padding-left:26px}
li{margin:5px 0}
hr{border:0;border-top:1px solid var(--line);margin:28px 0}
.tw{overflow:auto;margin:16px 0}
table{border-collapse:collapse;width:100%;font-size:14.5px}
th,td{border:1px solid var(--line);padding:9px 12px;text-align:left;vertical-align:top}
th{background:var(--tbl);font-weight:600;white-space:nowrap}
tbody tr:nth-child(even){background:#fbfcfd}
.btnbar{position:fixed;right:22px;bottom:22px;display:flex;gap:8px}
.btnbar button{border:1px solid var(--line);background:#fff;color:var(--fg);border-radius:8px;padding:9px 14px;font-size:13px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.08)}
.btnbar button:hover{border-color:var(--accent);color:var(--accent)}
@media (max-width:880px){aside{display:none}main{padding:24px 20px 60px}h1{font-size:25px}}
@media print{aside,.btnbar{display:none}main{padding:0;max-width:none}h2{page-break-after:avoid}table,pre,blockquote{page-break-inside:avoid}a{color:inherit;text-decoration:none}}
__RTL_CSS__
</style>
</head>
<body>
<div class="wrap">
<aside><h2>__ASIDE_TITLE__</h2>
<input id="tocSearch" type="search" placeholder="__TOC_PLACEHOLDER__" autocomplete="off" />
<div id="tocList">__TOC__</div>
</aside>
<main>
__BODY__
</main>
</div>
<div class="btnbar"><button onclick="window.print()">__PRINT_LABEL__</button></div>
<script>
(function () {
  var input = document.getElementById('tocSearch');
  var links = Array.prototype.slice.call(document.querySelectorAll('#tocList a'));
  if (!input) return;
  input.addEventListener('input', function () {
    var q = input.value.trim().toLowerCase();
    links.forEach(function (a) { a.hidden = !!q && a.textContent.toLowerCase().indexOf(q) < 0; });
  });
  // 自动教程按锚点打开时，把命中的目录项滚进视野
  if (location.hash) {
    var hit = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (hit) setTimeout(function () { hit.scrollIntoView({ block: 'start' }); }, 80);
  }
}());
</script>
</body>
</html>
'''

    doc = (doc
           .replace('__LANGATTR__', lang_attr)
           .replace('__TITLE__', html.escape(title or ''))
           # 连换行一起替换：ltr 语言（zh/en）不留空行，CSS 与旧产物逐字节一致
           .replace('__RTL_CSS__\n', rtl_css)
           .replace('__ASIDE_TITLE__', html.escape(cfg['aside_title']))
           .replace('__TOC_PLACEHOLDER__', html.escape(cfg['toc_placeholder']))
           .replace('__PRINT_LABEL__', html.escape(cfg['print_label']))
           .replace('__TOC__', toc_html)
           .replace('__BODY__', body))
    return doc, anchor_map, title


def main():
    parser = argparse.ArgumentParser(description='手册 Markdown -> 单文件 HTML（默认 zh-CN）')
    parser.add_argument('--locale', choices=sorted(LOCALES), default='zh-CN',
                        help='zh-CN 写 src/ui/manual.html（原路径）；en/he 写 manual.en.html / manual.he.html')
    args = parser.parse_args()

    topics = load_topics()

    # 任一语言构建都顺带刷新 anchors.json（三份源齐才写）——test/manual-test.js 依赖它
    anchors = build_anchors(topics)
    if anchors is not None:
        with open(ANCHORS_FILE, 'w', encoding='utf-8') as f:
            json.dump(anchors, f, ensure_ascii=False, indent=2)
            f.write('\n')
        safe_print('锚点映射: %s（%d 个语言）' % (ANCHORS_FILE, len(anchors)))

    doc, anchor_map, title = render(args.locale, topics)
    for target in LOCALES[args.locale]['outputs']:
        with open(target, 'w', encoding='utf-8') as f:
            f.write(doc)
        safe_print('生成:', target)
        safe_print('大小: %d KB · 标题锚点 %d 个' % (os.path.getsize(target) // 1024, len(anchor_map)))


if __name__ == '__main__':
    main()
