"""Validate generated routes, assets, bibliographic JSON, and release boundaries."""

import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.ids = set()
        self.references = []
        self.errors = []
        self.article_count = 0
        self.h1_count = 0
        self.lang = None
        self.schema = None
        self.has_title = False
        self.feed(path.read_text())

    def handle_starttag(self, tag, pairs):
        attrs = dict(pairs)
        if tag == "html":
            self.lang = attrs.get("lang")
        if tag == "title":
            self.has_title = True
        if tag == "h1":
            self.h1_count += 1
        if "id" in attrs:
            if attrs["id"] in self.ids:
                self.errors.append(f"Duplicate ID: {attrs['id']}")
            self.ids.add(attrs["id"])
        if "data-publication" in attrs:
            self.article_count += 1
        for key in ("href", "src"):
            if key in attrs:
                self.references.append(attrs[key])
        if tag == "img" and any(key not in attrs for key in ("alt", "width", "height")):
            if attrs.get("id") != "image-dialog-content":
                self.errors.append(f"Image missing alt or dimensions: {attrs.get('src')}")
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.schema = ""

    def handle_data(self, text):
        if self.schema is not None:
            self.schema += text
        if re.search(r"[\u3400-\u9fff]", text):
            self.errors.append("Non-English CJK content found")

    def handle_endtag(self, tag):
        if tag == "script" and self.schema is not None:
            try:
                json.loads(self.schema)
            except json.JSONDecodeError as error:
                self.errors.append(f"Invalid structured data: {error}")
            self.schema = None


def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else "_site").resolve()
    files = list(root.rglob("*.html"))
    if not files:
        raise SystemExit("No generated HTML found; build with Jekyll first.")
    pages = {path.resolve(): Page(path) for path in files}
    errors = []
    for path, page in pages.items():
        if page.lang != "en" or not page.has_title or page.h1_count != 1:
            page.errors.append("Expected English language, a title, and exactly one H1")
        for value in page.references:
            parsed = urlsplit(value)
            if parsed.scheme or parsed.netloc:
                continue
            target = root / unquote(parsed.path.lstrip("/")) if parsed.path.startswith("/") else path.parent / unquote(parsed.path)
            if not parsed.path:
                target = path
            elif target.is_dir():
                target /= "index.html"
            target = target.resolve()
            if not target.is_file():
                page.errors.append(f"Broken internal reference: {value}")
            elif parsed.fragment and target in pages and unquote(parsed.fragment) not in pages[target].ids:
                page.errors.append(f"Missing anchor: {value}")
        errors.extend(f"{path.relative_to(root)}: {message}" for message in page.errors)
    bibliography = root / "publications.bib"
    listing = pages.get(root / "publications/index.html")
    if not listing or not bibliography.exists() or bibliography.read_text().count("@article{") != listing.article_count:
        errors.append("Bibliography does not match the publication directory")
    if list(root.rglob("*.pdf")):
        errors.append("This release must not publish a PDF or CV")
    for forbidden in ("scripts", "node_modules", "Gemfile", "README.md", "ASSETS.md", "package-lock.json"):
        if (root / forbidden).exists():
            errors.append(f"Development file included in public build: {forbidden}")
    if errors:
        print("\n".join(errors))
        raise SystemExit(1)
    print(f"PASS: {len(pages)} English pages; internal routes, assets, anchors, structured data, bibliography, and no-PDF scope.")


if __name__ == "__main__":
    main()
