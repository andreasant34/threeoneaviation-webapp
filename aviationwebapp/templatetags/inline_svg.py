from functools import lru_cache
from pathlib import Path
import re
import xml.etree.ElementTree as ElementTree

from django import template
from django.conf import settings
from django.utils.safestring import mark_safe


register = template.Library()

SVG_NAMESPACE = "http://www.w3.org/2000/svg"
FORBIDDEN_ELEMENTS = {"embed", "foreignobject", "iframe", "image", "object", "script", "style"}
URL_PATTERN = re.compile(r"url\((.*?)\)", re.IGNORECASE)

ElementTree.register_namespace("", SVG_NAMESPACE)


def _local_name(name):
    return name.rsplit("}", 1)[-1].lower()


def _validate_svg(root):
    if _local_name(root.tag) != "svg":
        raise template.TemplateSyntaxError("The inline_svg file must have an <svg> root element.")

    for element in root.iter():
        if _local_name(element.tag) in FORBIDDEN_ELEMENTS:
            raise template.TemplateSyntaxError("The inline_svg file contains unsupported active content.")

        for attribute, value in list(element.attrib.items()):
            attribute_name = _local_name(attribute)
            normalized_value = value.strip().strip("'\"")

            if attribute_name.startswith("on"):
                raise template.TemplateSyntaxError("The inline_svg file contains an event handler.")

            if attribute_name in {"href", "src"} and normalized_value and not normalized_value.startswith("#"):
                raise template.TemplateSyntaxError("The inline_svg file contains an external resource.")

            for match in URL_PATTERN.findall(value):
                target = match.strip().strip("'\"")
                if target and not target.startswith("#"):
                    raise template.TemplateSyntaxError("The inline_svg file contains an external URL.")


@lru_cache(maxsize=16)
def _render_svg(svg_path, modified_time, css_class):
    del modified_time  # Included in the cache key so replacing the file refreshes its output.

    root = ElementTree.fromstring(svg_path.read_text(encoding="utf-8"))
    _validate_svg(root)

    existing_class = root.get("class", "").strip()
    root.set("class", " ".join(filter(None, (existing_class, css_class))))
    root.set("aria-hidden", "true")
    root.set("focusable", "false")
    root.attrib.pop("width", None)
    root.attrib.pop("height", None)

    return ElementTree.tostring(root, encoding="unicode", method="xml")


@register.simple_tag
def inline_svg(relative_path, css_class=""):
    static_directory = Path(settings.STATICFILES_DIRS[0]).resolve()
    svg_path = (static_directory / relative_path).resolve()

    try:
        svg_path.relative_to(static_directory)
    except ValueError as error:
        raise template.TemplateSyntaxError("inline_svg paths must stay inside the static directory.") from error

    if svg_path.suffix.lower() != ".svg":
        raise template.TemplateSyntaxError("inline_svg only accepts SVG files.")

    try:
        modified_time = svg_path.stat().st_mtime_ns
    except OSError as error:
        raise template.TemplateSyntaxError(f"Unable to read inline SVG: {relative_path}") from error

    try:
        rendered_svg = _render_svg(svg_path, modified_time, css_class)
    except (OSError, ElementTree.ParseError) as error:
        raise template.TemplateSyntaxError(f"Unable to parse inline SVG: {relative_path}") from error

    return mark_safe(rendered_svg)
