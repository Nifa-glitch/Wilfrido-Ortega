#!/usr/bin/env python3
"""Build synchronized bibliography from immutable research records and editor overlays.

Default behavior validates and reports; --write updates website files on the
working branch. Source records are NEVER written by this script.
"""
import argparse
import copy
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
SOURCE = ROOT / "cms" / "bibliography"
EDITABLE = ROOT / "cms-editable"
JS = ROOT / "bibliography-data.js"
CATALOG = ROOT / "catalogus.html"
PREFIX = "window.BIBLIOGRAPHY_RECORDS = "
EDIT_KEYS = {"title","variant","series","volume","year","genre","image","research_note"}
# These optional editorial fields are kept separate until catalog UI supports them:
OPTIONAL = {"author","publisher","collection","description"}

def load_records(folder):
    files = sorted(folder.glob("*.json"))
    result = {}
    for file in files:
        item = json.loads(file.read_text(encoding="utf-8"))
        identifier = item.get("id")
        if not isinstance(identifier, str) or identifier != file.stem or identifier in result:
            raise ValueError(f"Invalid / duplicate record ID: {file}")
        result[identifier] = item
    return result

def merge(original, editable):
    if set(original) != set(editable):
        raise ValueError("CMS IDs do not match protected source IDs")
    merged = []
    for id_, row in original.items():
        entry = copy.deepcopy(row)
        edit = editable[id_]
        for key in EDIT_KEYS:
            # Pages CMS may drop blank fields: missing keys do NOT erase data.
            if key in edit and edit[key] not in (None, ""):
                if not isinstance(edit[key], str):
                    raise ValueError(f"Invalid {key} for {id_}")
                entry[key] = edit[key]
        # Never overlay holdings, inventory, historical records or source metadata.
        merged.append(entry)
    return merged

def replace_assignment(text, records):
    pos = text.find(PREFIX)
    if pos < 0:
        raise ValueError("Embedded bibliography assignment not found")
    start = pos + len(PREFIX)
    decoder = json.JSONDecoder()
    old, end_offset = decoder.raw_decode(text[start:])
    if not isinstance(old, list) or len(old) != 212:
        raise ValueError("Expected a 212-record bibliography at assignment")
    replacement = json.dumps(records, ensure_ascii=False, separators=(",", ":"))
    return text[:start] + replacement + text[start + end_offset:]

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--write", action="store_true", help="Write generated files")
    args = parser.parse_args()
    original = load_records(SOURCE)
    editable = load_records(EDITABLE)
    if len(original) != 212:
        raise ValueError(f"Expected 212 source records, got {len(original)}")
    records = merge(original, editable)
    old_js = JS.read_text(encoding="utf-8")
    old_html = CATALOG.read_text(encoding="utf-8")
    new_js = replace_assignment(old_js, records)
    new_html = replace_assignment(old_html, records)
    changes = [name for name, old, new in (("bibliography-data.js", old_js, new_js), ("catalogus.html", old_html, new_html)) if old != new]
    print(json.dumps({"records":len(records),"source_records_unchanged":True,"files_requiring_update":changes},ensure_ascii=False))
    if args.write:
        JS.write_text(new_js, encoding="utf-8")
        CATALOG.write_text(new_html, encoding="utf-8")
        print("Generated website files updated. Check diff before merging.")
if __name__ == "__main__":
    try:
        main()
    except (ValueError, KeyError, json.JSONDecodeError) as e:
        print(f"CMS build validation failed: {e}", file=sys.stderr)
        sys.exit(1)
