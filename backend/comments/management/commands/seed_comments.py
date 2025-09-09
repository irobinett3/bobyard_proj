import json
from pathlib import Path
from datetime import datetime
from django.core.management.base import BaseCommand, CommandError
from django.utils.timezone import make_aware
from comments.models import Comment

COMMON_ARRAY_KEYS = ["comments", "data", "items", "results"]

def parse_json_any(path: Path):
    # parse JSON or NDJSON
    try:
        with open(path, "r", encoding="utf-8") as f:
            obj = json.load(f)
        if isinstance(obj, list):  # straight list
            return obj
        if isinstance(obj, dict):
            # look for common array keys
            for k in COMMON_ARRAY_KEYS:
                if isinstance(obj.get(k), list):
                    return obj[k]
            # wrap single obj
            if {"text", "author"} & set(obj.keys()):
                return [obj]
        raise CommandError("JSON isn't an array; no valid keys found")
    except json.JSONDecodeError:
        # fallback: NDJSON
        rows = []
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                rows.append(json.loads(line))
        if not rows:
            raise CommandError("File not valid JSON/NDJSON")
        return rows

class Command(BaseCommand):
    help = "Seed db with comments from JSON (default seed/comments.json)"

    def add_arguments(self, parser):
        parser.add_argument("--file", default="seed/comments.json",
                            help="path relative to backend/")
        parser.add_argument("--truncate", action="store_true",
                            help="wipe existing comments")

    def handle(self, *args, **opts):
        path = Path(opts["file"])
        if not path.exists():
            path = Path.cwd() / opts["file"]
        if not path.exists():
            raise CommandError(f"JSON file not found: {opts['file']} (resolved: {path})")

        rows = parse_json_any(path)

        if opts["truncate"]:
            deleted, _ = Comment.objects.all().delete()
            self.stdout.write(self.style.WARNING(f"Truncated table ({deleted} rows)"))

        created = 0
        for raw in rows:
            if not isinstance(raw, dict):
                continue

            author = raw.get("author") or raw.get("user") or raw.get("username") or "Anonymous"
            text = (raw.get("text") or raw.get("body") or raw.get("content") or "").strip()
            if not text:
                continue
            likes = int(raw.get("likes", 0) or 0)

            # normalize images
            images = raw.get("images")
            if images is None and "image" in raw:
                images = [raw["image"]] if raw["image"] else []
            if isinstance(images, str):
                images = [images]
            if images is None:
                images = []

            # parse timestamp
            ts = raw.get("created_at") or raw.get("date") or raw.get("timestamp")
            created_at = None
            if ts:
                try:
                    dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
                    created_at = dt if dt.tzinfo else make_aware(dt)
                except Exception:
                    created_at = None

            obj = Comment(author=author, text=text, likes=likes, images=images)
            if created_at:
                obj.created_at = created_at
            obj.save()
            created += 1

        self.stdout.write(self.style.SUCCESS(f"Seeded {created} comments from {path}"))